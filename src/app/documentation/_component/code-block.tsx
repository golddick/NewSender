"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface ApiCodeBlockProps {
  language: string
  code: string
  showLineNumbers?: boolean
  className?: string
}

export function ApiCodeBlock({ language, code, showLineNumbers = true, className }: ApiCodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getLanguageClass = () => {
    switch (language.toLowerCase()) {
      case "javascript":
      case "js":
        return "language-javascript"
      case "typescript":
      case "ts":
        return "language-typescript"
      case "python":
      case "py":
        return "language-python"
      case "ruby":
      case "rb":
        return "language-ruby"
      case "php":
        return "language-php"
      case "go":
        return "language-go"
      case "bash":
      case "sh":
        return "language-bash"
      case "json":
        return "language-json"
      default:
        return `language-${language}`
    }
  }

  const formatCode = () => {
    const lines = code.split("\n")
    return lines.map((line, i) => (
      <div key={i} className="table-row">
        {showLineNumbers && (
          <span className="table-cell pr-4 text-right text-muted-foreground opacity-50">{i + 1}</span>
        )}
        <span className="table-cell">{line}</span>
      </div>
    ))
  }

  return (
    <div className={cn("relative rounded-lg overflow-hidden", className)}>
      <div className="flex items-center justify-between bg-dark-700 px-4 py-2">
        <span className="text-sm font-medium text-muted-foreground">{language.toUpperCase()}</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <div className="bg-dark-800 p-4 overflow-x-auto">
        <pre className={cn("table min-w-full", getLanguageClass())}>
          <code className="table-row-group text-sm font-mono text-white">{formatCode()}</code>
        </pre>
      </div>
    </div>
  )
}
