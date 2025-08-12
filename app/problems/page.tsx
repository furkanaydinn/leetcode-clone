"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, Circle, Search } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSession } from "@/lib/auth-client"
import { UserNav } from "@/components/user-nav"

const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    acceptance: "49.1%",
    solved: true,
    category: "Array",
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    acceptance: "38.4%",
    solved: false,
    category: "Linked List",
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    acceptance: "33.8%",
    solved: true,
    category: "String",
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    acceptance: "35.2%",
    solved: false,
    category: "Array",
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    acceptance: "32.1%",
    solved: false,
    category: "String",
  },
  {
    id: 6,
    title: "Zigzag Conversion",
    difficulty: "Medium",
    acceptance: "42.3%",
    solved: true,
    category: "String",
  },
]

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

export default function ProblemsPage() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              CodeClone
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/problems" className="text-sm font-medium hover:text-primary">
                Problems
              </Link>
              <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary">
                Contest
              </Link>
              <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary">
                Discuss
              </Link>
            </nav>
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

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Problems</h1>
          <p className="text-muted-foreground">Solve coding problems to improve your programming skills</p>
        </div>

        {/* Search and Filters Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search problems..." className="pl-10" />
          </div>

          <div className="flex gap-3">
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="solved">Solved</SelectItem>
                <SelectItem value="unsolved">Unsolved</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                <SelectItem value="array">Array</SelectItem>
                <SelectItem value="string">String</SelectItem>
                <SelectItem value="linked-list">Linked List</SelectItem>
                <SelectItem value="tree">Tree</SelectItem>
                <SelectItem value="graph">Graph</SelectItem>
                <SelectItem value="dp">Dynamic Programming</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Problems Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Status</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">Acceptance</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead className="hidden md:table-cell">Topic</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {problems.map((problem) => (
                <TableRow key={problem.id} className="hover:bg-muted/50">
                  <TableCell>
                    {problem.solved ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Link href={`/problem/${problem.id}`} className="font-medium hover:text-primary">
                      {problem.id}. {problem.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden sm:table-cell">{problem.acceptance}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getDifficultyColor(problem.difficulty)}>
                      {problem.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm hidden md:table-cell">
                    {problem.category}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  )
}
