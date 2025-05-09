'use client'

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface CodeTabsProps {
  javascript: string
  typescript: string
  curl?: string
  python?: string
  title?: string
}

export function CodeTabs({ javascript, typescript, curl, python, title }: CodeTabsProps) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("javascript")

  const copyToClipboard = () => {
    let codeToCopy = ""

    switch (activeTab) {
      case "javascript":
        codeToCopy = javascript
        break
      case "typescript":
        codeToCopy = typescript
        break
      case "curl":
        codeToCopy = curl || ""
        break
      case "python":
        codeToCopy = python || ""
        break
    }

    navigator.clipboard.writeText(codeToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg border-none bg-black text-white overflow-hidden shadow-lg">
      {title && (
        <div className="px-4 py-2 bg-[#0d0d0d] text-red-700 border-none">
          {/* <h3 className="text-sm font-semibold">{title}</h3> */}
        </div>
      )}

      <Tabs defaultValue="javascript" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between px-4 py-2 bg-[#0d0d0d] border-none">
          <TabsList className="bg-black border-none text-gold-300">
            <TabsTrigger value="javascript" className="text-xs px-2 py-1 hover:bg-gold-800/20 data-[state=active]:bg-gold-700 data-[state=active]:text-black rounded">
              JavaScript
            </TabsTrigger>
            <TabsTrigger value="typescript" className="text-xs px-2 py-1 hover:bg-gold-800/20 data-[state=active]:bg-gold-700 data-[state=active]:text-black rounded">
              TypeScript
            </TabsTrigger>
            {curl && (
              <TabsTrigger value="curl" className="text-xs px-2 py-1 hover:bg-gold-800/20 data-[state=active]:bg-gold-700 data-[state=active]:text-black rounded">
                cURL
              </TabsTrigger>
            )}
            {python && (
              <TabsTrigger value="python" className="text-xs px-2 py-1 hover:bg-gold-800/20 data-[state=active]:bg-gold-600 data-[state=active]:text-black rounded">
                Python
              </TabsTrigger>
            )}
          </TabsList>

          <button
            onClick={copyToClipboard}
            className={cn(
              "text-xs px-3 py-1 rounded transition-all",
              copied
                ? "bg-green-600 text-white"
                : "bg-gold-700 text-black hover:bg-gold-500"
            )}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <TabsContent value="javascript" className="mt-0">
          <pre className="p-4 overflow-x-auto text-sm bg-[#0d0d0d] text-green-400">
            <code className="language-javascript">{javascript}</code>
          </pre>
        </TabsContent>

        <TabsContent value="typescript" className="mt-0">
          <pre className="p-4 overflow-x-auto text-sm bg-[#0d0d0d] text-blue-400">
            <code className="language-typescript">{typescript}</code>
          </pre>
        </TabsContent>

        {curl && (
          <TabsContent value="curl" className="mt-0">
            <pre className="p-4 overflow-x-auto text-sm bg-[#0d0d0d] text-pink-400">
              <code className="language-bash">{curl}</code>
            </pre>
          </TabsContent>
        )}

        {python && (
          <TabsContent value="python" className="mt-0">
            <pre className="p-4 overflow-x-auto text-sm bg-[#0d0d0d] text-purple-400">
              <code className="language-python">{python}</code>
            </pre>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
