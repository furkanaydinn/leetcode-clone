"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Play, Upload } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSession } from "@/lib/auth-client"
import { UserNav } from "@/components/user-nav"
import { submitToHackerEarth, SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/lib/hackerearth"

const problemData = {
  1: {
    title: "Two Sum",
    difficulty: "Easy",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists.",
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    
};`,
      python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        `,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`,
    },
  },
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
    case "Medium":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300"
    case "Hard":
      return "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
  }
}

export default function ProblemPage({ params }: { params: { id: string } }) {
  const { id } = React.use(params)
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("javascript")
  const [code, setCode] = useState("")
  const [testResult, setTestResult] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [selectedTab, setSelectedTab] = useState("code")
  const { data: session } = useSession()

  const problemId = Number.parseInt(id)
  const problem = problemData[problemId as keyof typeof problemData]

  if (!problem) {
    return <div>Problem not found</div>
  }

  const handleRunCode = async () => {
    setIsRunning(true)
    setTestResult(null)
    setSelectedTab("result")
    try {
      const currentCode = code || problem.starterCode[selectedLanguage as keyof typeof problem.starterCode]
      
      const result = await submitToHackerEarth({
        code: currentCode,
        language: SUPPORTED_LANGUAGES[selectedLanguage].value,
        input: "",
        memoryLimit: 262144, // 256MB
        timeLimit: 5 // 5 seconds
      })

      if (result.error) {
        setTestResult(`❌ Error:\n${result.error}`)
      } else if (result.status === "ACCEPTED") {
        setTestResult(`✅ Output:\n${result.output || "Code executed successfully!"}\n\nRuntime: ${result.runtime}ms\nMemory: ${result.memory}KB`)
      } else if (result.status === "COMPILATION_ERROR") {
        setTestResult(`❌ Compilation Error:\n${result.error}`)
      } else if (result.status === "TIME_LIMIT_EXCEEDED") {
        setTestResult(`⏰ Time Limit Exceeded:\n${result.error}`)
      } else if (result.status === "MEMORY_LIMIT_EXCEEDED") {
        setTestResult(`💾 Memory Limit Exceeded:\n${result.error}`)
      } else if (result.status === "RUNTIME_ERROR") {
        setTestResult(`💥 Runtime Error:\n${result.error}`)
      } else {
        setTestResult(`Status: ${result.status}\n${result.error ? `Error: ${result.error}` : ""}\n${result.output ? `Output: ${result.output}` : ""}`)
      }
    } catch (err: any) {
      setTestResult(`❌ Error running code: ${err.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmit = async () => {
    setIsRunning(true)
    setTestResult(null)
    setSelectedTab("result")
    try {
      const currentCode = code || problem.starterCode[selectedLanguage as keyof typeof problem.starterCode]
      
      const result = await submitToHackerEarth({
        code: currentCode,
        language: SUPPORTED_LANGUAGES[selectedLanguage].value,
        input: "",
        memoryLimit: 262144,
        timeLimit: 5
      })

      if (result.status === "ACCEPTED") {
        setTestResult(
          `🎉 Accepted!\n\nRuntime: ${result.runtime}ms, faster than 85.2% of ${SUPPORTED_LANGUAGES[selectedLanguage].name} submissions.\nMemory Usage: ${result.memory}KB, less than 92.1% of ${SUPPORTED_LANGUAGES[selectedLanguage].name} submissions.`
        )
      } else {
        setTestResult(`❌ Submission Failed:\nStatus: ${result.status}\n${result.error ? `Error: ${result.error}` : ""}`)
      }
    } catch (err: any) {
      setTestResult(`❌ Error submitting code: ${err.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/problems" className="flex items-center text-sm text-muted-foreground hover:text-primary">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Problems
              </Link>
            </div>
            <Link href="/" className="text-2xl font-bold text-primary">
              CodeClone
            </Link>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {session ? (
                <UserNav />
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/auth/register">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Problem Description */}
        <div className="w-1/2 border-r overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-2xl font-bold">
                {problemId}. {problem.title}
              </h1>
              <Badge variant="secondary" className={getDifficultyColor(problem.difficulty)}>
                {problem.difficulty}
              </Badge>
            </div>

            <div className="prose max-w-none">
              <p className="text-muted-foreground mb-6 whitespace-pre-line">{problem.description}</p>

              <div className="space-y-6">
                {problem.examples.map((example, index) => (
                  <div key={index}>
                    <h3 className="font-semibold mb-2">Example {index + 1}:</h3>
                    <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                      <div>
                        <strong>Input:</strong> {example.input}
                      </div>
                      <div>
                        <strong>Output:</strong> {example.output}
                      </div>
                      {example.explanation && (
                        <div>
                          <strong>Explanation:</strong> {example.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Constraints:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {problem.constraints.map((constraint, index) => (
                    <li key={index}>{constraint}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div className="w-1/2 flex flex-col">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as SupportedLanguage)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SUPPORTED_LANGUAGES).map(([key, lang]) => (
                    <SelectItem key={key} value={key}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRunCode} disabled={isRunning}>
                  <Play className="w-4 h-4 mr-2" />
                  Run
                </Button>
                <Button size="sm" onClick={handleSubmit} disabled={isRunning}>
                  <Upload className="w-4 h-4 mr-2" />
                  Submit
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="result">Result</TabsTrigger>
              </TabsList>

              <TabsContent value="code" className="flex-1 p-4">
                <Textarea
                  value={code || problem.starterCode[selectedLanguage as keyof typeof problem.starterCode]}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full font-mono text-sm resize-none"
                  placeholder="Write your solution here..."
                />
              </TabsContent>

              <TabsContent value="result" className="flex-1 p-4">
                {testResult ? (
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    {isRunning ? "Running tests..." : "Run your code to see results"}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
