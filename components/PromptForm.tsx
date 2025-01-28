"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Prompt } from "@/types"
import { usePromptStore } from "@/lib/store"
import { addPrompt, updatePrompt, getAllPrompts } from "@/lib/storage"
import { Combobox } from "@/components/ui/combobox"
import { v4 as uuidv4 } from 'uuid'

interface PromptFormProps {
  prompt?: Prompt
  onClose: () => void
}

export default function PromptForm({ prompt, onClose }: PromptFormProps) {
  const [title, setTitle] = useState(prompt?.title || "")
  const [content, setContent] = useState(prompt?.content || "")
  const [category, setCategory] = useState(prompt?.category || "")
  const [categories, setCategories] = useState<string[]>([])
  const { addPrompt: addPromptToStore, updatePrompt: updatePromptInStore } = usePromptStore()

  useEffect(() => {
    getAllPrompts().then((prompts) => {
      const uniqueCategories = Array.from(new Set(prompts.map((p) => p.category)))
      setCategories(uniqueCategories)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 添加表单验证
    if (!title.trim() || !content.trim() || !category.trim()) {
      alert("请填写所有必填字段");
      return;
    }

    const newPrompt: Prompt = {
      id: prompt?.id || uuidv4(), // 使用 UUID 替代 Date.now().toString()
      title,
      content,
      category,
    }

    try {
      if (prompt) {
        await updatePrompt(newPrompt)
        updatePromptInStore(prompt.id, newPrompt)
      } else {
        console.log("Saving new prompt:", newPrompt); // 添加日志
        await addPrompt(newPrompt)
        addPromptToStore(newPrompt)
      }
      onClose()
    } catch (error) {
      console.error("Error saving prompt:", error);
      alert("保存失败，请重试");
    }
  }

  const handleAddCategory = (newCategory: string) => {
    if (!categories.includes(newCategory)) {
      setCategories([...categories, newCategory])
    }
    setCategory(newCategory)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{prompt ? "Edit Prompt" : "Add New Prompt"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Combobox
                value={category}
                onChange={setCategory}
                onAddOption={handleAddCategory}
                options={categories}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">
                Content
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{prompt ? "Update" : "Add"} Prompt</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

