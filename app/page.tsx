"use client"

import { useEffect, useState, useRef } from "react"
import { usePromptStore } from "@/lib/store"
import { getAllPrompts, exportPrompts, importPrompts } from "@/lib/storage"
import PromptCard from "@/components/PromptCard"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PromptForm from "@/components/PromptForm"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function Home() {
  const { prompts, setPrompts } = usePromptStore()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getAllPrompts().then(setPrompts)
  }, [setPrompts])

  const filteredPrompts = prompts.filter(
    (prompt) =>
      prompt.title.toLowerCase().includes(search.toLowerCase()) && (category === "all" || prompt.category === category),
  )

  const categories = Array.from(new Set(prompts.map((p) => p.category)))

  const handleExport = async () => {
    try {
      const data = await exportPrompts()
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "prompts.json"
      a.click()
      toast({
        title: "Export Successful",
        description: "Your prompts have been exported successfully.",
      })
    } catch (error) {
      console.error("Export failed:", error)
      toast({
        title: "Export Failed",
        description: "There was an error exporting your prompts. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const content = e.target?.result
          if (typeof content === "string") {
            await importPrompts(content)
            const updatedPrompts = await getAllPrompts()
            setPrompts(updatedPrompts)
            toast({
              title: "Import Successful",
              description: `${updatedPrompts.length} prompts have been imported successfully.`,
            })
          }
        } catch (error) {
          console.error("Import failed:", error)
          toast({
            title: "Import Failed",
            description: "There was an error importing your prompts. Please check your file and try again.",
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AI Prompt Manager</h1>
        <div>
          <Button onClick={() => setShowAddForm(true)} className="mr-2">
            Add New Prompt
          </Button>
          <Button onClick={handleExport} variant="outline" className="mr-2">
            Export
          </Button>
          <Button onClick={handleImportClick} variant="outline">
            Import
          </Button>
          <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" style={{ display: "none" }} />
        </div>
      </div>
      <div className="flex gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search prompts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrompts.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>
      {showAddForm && <PromptForm onClose={() => setShowAddForm(false)} />}
    </main>
  )
}

