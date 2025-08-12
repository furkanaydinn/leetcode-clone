export interface HackerEarthSubmission {
  code: string
  language: string
  input?: string
  memoryLimit?: number
  timeLimit?: number
}

export interface HackerEarthResult {
  status: string
  output: string
  error: string
  runtime: number
  memory: number
  submissionId: string
  language: string
}

export async function submitToHackerEarth(submission: HackerEarthSubmission): Promise<HackerEarthResult> {
  const response = await fetch('/api/hackerearth/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(submission),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to submit code to HackerEarth')
  }

  return response.json()
}

// Language mapping for UI display
export const SUPPORTED_LANGUAGES = {
  python: { name: 'Python 3', value: 'python3' },
  javascript: { name: 'JavaScript (Node.js)', value: 'javascript' },
  java: { name: 'Java 8', value: 'java' },
  cpp: { name: 'C++17', value: 'cpp' },
  c: { name: 'C', value: 'c' },
  csharp: { name: 'C#', value: 'csharp' },
  go: { name: 'Go', value: 'go' },
  rust: { name: 'Rust', value: 'rust' },
  ruby: { name: 'Ruby', value: 'ruby' },
  php: { name: 'PHP', value: 'php' },
  swift: { name: 'Swift', value: 'swift' },
  kotlin: { name: 'Kotlin', value: 'kotlin' },
  scala: { name: 'Scala', value: 'scala' },
  typescript: { name: 'TypeScript', value: 'typescript' }
} as const

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES 