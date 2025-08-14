// app/problem/[id]/page.tsx
// BU DOSYANIN BAŞINDA "use client" YOK - ARTIK BİR SUNUCU BİLEŞENİ

import { ProblemView } from "./problem-view"; // Birazdan bu dosyayı oluşturacağız
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";
import { getServerSession } from "next-auth"; // Sunucu tarafı session

// Bu veriler ve fonksiyonlar sunucu tarafında kalabilir
const problemData = {
  1: {
    title: "Two Sum",
    difficulty: "Easy",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.`,
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]." },
    ],
    constraints: [ "2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹", "-10⁹ ≤ target ≤ 10⁹", "Only one valid answer exists."],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};`,
      python: `from typing import List\n\nclass Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}`,
      cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};`,
      csharp: `public class Solution {\n    public int[] TwoSum(int[] nums, int target) {\n        \n    }\n}`,
    },
  },
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy": return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300";
    case "Medium": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300";
    case "Hard": return "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300";
    default: return "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300";
  }
};

// Sayfanın kendisi artık async olabilir ve sunucuda çalışır
export default async function ProblemPage({ params: { id } }: { params: { id: string } }) {
  // `params` burada basit bir obje. Hiçbir uyarı veya hata yok.
  
  const session = await getServerSession(); // Session'ı sunucuda alıyoruz
  const problemId = Number.parseInt(id); // 'id'yi doğrudan kullanıyoruz
  const problem = problemData[problemId as keyof typeof problemData];

  if (!problem) {
    return <div>Problem not found</div>;
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
        {/* Sol Taraf: Problem Açıklaması (Sunucuda render ediliyor) */}
        <div className="w-1/2 border-r overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-2xl font-bold">{problemId}. {problem.title}</h1>
              <Badge variant="secondary" className={getDifficultyColor(problem.difficulty)}>
                {problem.difficulty}
              </Badge>
            </div>
            <div className="prose max-w-none dark:prose-invert">
              <p className="text-muted-foreground mb-6 whitespace-pre-line">{problem.description}</p>
              {problem.examples.map((example, index) => (
                <div key={index}>
                  <h3 className="font-semibold mb-2">Example {index + 1}:</h3>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                    <div><strong>Input:</strong> {example.input}</div>
                    <div><strong>Output:</strong> {example.output}</div>
                    {example.explanation && <div><strong>Explanation:</strong> {example.explanation}</div>}
                  </div>
                </div>
              ))}
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

        {/* Sağ Taraf: İnteraktif Kod Editörü (İstemci Bileşeni) */}
        <ProblemView problem={problem} />
      </div>
    </div>
  );
}