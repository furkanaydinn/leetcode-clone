// app/problem/[id]/problem-view.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Play } from "lucide-react";

// Tipleri ve sabitleri buraya taşıyoruz
const SUPPORTED_LANGUAGES = {
  javascript: { name: "JavaScript", value: "javascript" },
  python: { name: "Python", value: "python" },
  java: { name: "Java", value: "java" },
  csharp: { name: "C#", value: "csharp" },
  cpp: { name: "C++", value: "cpp" },
};
type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

// Gelen prop'ların tipini tanımlıyoruz
type ProblemViewProps = {
  problem: {
    starterCode: {
      [key in SupportedLanguage]: string;
    }
  }
}

export function ProblemView({ problem }: ProblemViewProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("javascript");
  const [code, setCode] = useState("");
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTab, setSelectedTab] = useState("code");

  const handleRunCode = async () => {
    setIsRunning(true);
    setTestResult(null);
    setSelectedTab("result");

    try {
      const currentCode = code || problem.starterCode[selectedLanguage];
      const response = await fetch('/api/piston', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: SUPPORTED_LANGUAGES[selectedLanguage].value,
          sourceCode: currentCode,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'An error occurred on the server.');
      }
      if (result.run.stderr) {
        setTestResult(`❌ Error:\n${result.run.stderr}`);
      } else {
        setTestResult(`✅ Output:\n${result.run.stdout || "Code executed successfully with no output."}`);
      }
    } catch (err: any) {
      setTestResult(`❌ Error running code: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="w-1/2 flex flex-col">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as SupportedLanguage)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SUPPORTED_LANGUAGES).map(([key, lang]) => (
                <SelectItem key={key} value={key}>{lang.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRunCode} disabled={isRunning}>
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? "Running..." : "Run"}
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
              value={code || problem.starterCode[selectedLanguage]}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full font-mono text-sm resize-none bg-background"
              placeholder="Write your solution here..."
            />
          </TabsContent>
          <TabsContent value="result" className="flex-1 p-4">
            {isRunning ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">Running tests...</div>
            ) : testResult ? (
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">Run your code to see results</div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}