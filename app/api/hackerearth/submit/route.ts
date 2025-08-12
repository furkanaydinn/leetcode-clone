import { NextRequest, NextResponse } from "next/server"

const HACKEREARTH_API_URL = "https://api.hackerearth.com/v4/partner/code-evaluation/submissions/"

// Language mapping from common language names to HackerEarth language codes
const LANGUAGE_MAP: { [key: string]: string } = {
  "python": "PYTHON3",
  "python3": "PYTHON3",
  "javascript": "JAVASCRIPT_NODE",
  "js": "JAVASCRIPT_NODE",
  "java": "JAVA8",
  "cpp": "CPP17",
  "c++": "CPP17",
  "c": "C",
  "csharp": "CSHARP",
  "c#": "CSHARP",
  "go": "GO",
  "rust": "RUST",
  "ruby": "RUBY",
  "php": "PHP",
  "swift": "SWIFT",
  "kotlin": "KOTLIN",
  "scala": "SCALA",
  "typescript": "TYPESCRIPT",
  "ts": "TYPESCRIPT"
}

export async function POST(req: NextRequest) {
  try {
    const { code, language, input = "", memoryLimit = 262144, timeLimit = 5 } = await req.json()
    
    const clientSecret = process.env.HACKEREARTH_SECRET
    const clientId = process.env.HACKEREARTH_ID

    if (!clientSecret) {
      return NextResponse.json(
        { error: "HackerEarth API credentials not configured" },
        { status: 500 }
      )
    }

    // Map language to HackerEarth language code
    const hackerEarthLanguage = LANGUAGE_MAP[language.toLowerCase()] || "PYTHON3"

    const requestBody = {
      lang: hackerEarthLanguage,
      source: code,
      input: input,
      memory_limit: Math.min(memoryLimit, 262144), // Max 256MB
      time_limit: Math.min(timeLimit, 5), // Max 5 seconds
      context: JSON.stringify({ clientId, timestamp: Date.now() })
    }

    // Submit code for evaluation
    const submissionResponse = await fetch(HACKEREARTH_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "client-secret": clientSecret
      },
      body: JSON.stringify(requestBody)
    })

    if (!submissionResponse.ok) {
      const errorData = await submissionResponse.json()
      return NextResponse.json(
        { error: "Failed to submit code", details: errorData },
        { status: submissionResponse.status }
      )
    }

    const submissionData = await submissionResponse.json()
    const { he_id } = submissionData

    if (!he_id) {
      return NextResponse.json(
        { error: "No submission ID received from HackerEarth" },
        { status: 500 }
      )
    }

    // Poll for results (since HackerEarth v4 is async)
    let attempts = 0
    const maxAttempts = 30 // 30 seconds max wait time
    let result

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second

      const statusResponse = await fetch(`${HACKEREARTH_API_URL}${he_id}/`, {
        headers: {
          "client-secret": clientSecret
        }
      })

      if (!statusResponse.ok) {
        attempts++
        continue
      }

      result = await statusResponse.json()
      
      // Check if execution is complete
      if (result.request_status?.code === "REQUEST_COMPLETED") {
        break
      }

      attempts++
    }

    if (!result) {
      return NextResponse.json(
        { error: "Timeout waiting for code execution results" },
        { status: 408 }
      )
    }

    // Process the result
    const { result: executionResult } = result
    const { run_status, compile_status } = executionResult

    let status = "UNKNOWN"
    let output = ""
    let error = ""
    let runtime = 0
    let memory = 0

    if (compile_status === "OK") {
      if (run_status?.status === "AC") {
        status = "ACCEPTED"
        // Fetch output from S3 if available
        if (run_status.output) {
          try {
            const outputResponse = await fetch(run_status.output)
            if (outputResponse.ok) {
              output = await outputResponse.text()
            }
          } catch (err) {
            output = "Output available but could not be fetched"
          }
        }
      } else if (run_status?.status === "TLE") {
        status = "TIME_LIMIT_EXCEEDED"
        error = "Time limit exceeded"
      } else if (run_status?.status === "MLE") {
        status = "MEMORY_LIMIT_EXCEEDED"
        error = "Memory limit exceeded"
      } else if (run_status?.status === "RE") {
        status = "RUNTIME_ERROR"
        error = run_status.stderr || "Runtime error"
      } else if (run_status?.status === "WA") {
        status = "WRONG_ANSWER"
        error = "Wrong answer"
      } else {
        status = run_status?.status || "UNKNOWN"
        error = run_status?.stderr || "Unknown error"
      }

      runtime = parseFloat(run_status?.time_used || "0") * 1000 // Convert to milliseconds
      memory = parseInt(run_status?.memory_used || "0") // Already in KB
    } else {
      status = "COMPILATION_ERROR"
      error = "Compilation failed"
    }

    return NextResponse.json({
      status,
      output,
      error,
      runtime: Math.round(runtime),
      memory,
      submissionId: he_id,
      language: hackerEarthLanguage
    })

  } catch (error) {
    console.error("HackerEarth API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 