"use client"

import { useState } from "react"
import type { Prompt, Variable } from "@/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import VariableForm from "./VariableForm"
import { usePromptStore } from "@/lib/store"
import { deletePrompt } from "@/lib/storage"
import PromptForm from "./PromptForm"

interface PromptCardProps {
  prompt: Prompt
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const [showForm, setShowForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const { deletePrompt: deletePromptFromStore } = usePromptStore()

  const variables: Variable[] = (prompt.content.match(/@{[^}]+}/g) || []).map((match) => {
    const [name, type] = match.slice(2, -1).split("(")
    return { name, type: type.slice(0, -1), value: "" }
  })

  const handleClick = () => {
    if (variables.length > 0) {
      setShowForm(true)
    } else {
      navigator.clipboard.writeText(prompt.content)
    }
  }

  const handleDelete = async () => {
    await deletePrompt(prompt.id)
    deletePromptFromStore(prompt.id)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{prompt.title}</CardTitle>
        <CardDescription>{prompt.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{prompt.content}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleClick}>Use Prompt</Button>
        <Button variant="outline" onClick={() => setShowEditForm(true)} className="ml-2">
          Edit
        </Button>
        <Button variant="destructive" onClick={handleDelete} className="ml-2">
          Delete
        </Button>
      </CardFooter>
      {showForm && <VariableForm variables={variables} content={prompt.content} onClose={() => setShowForm(false)} />}
      {showEditForm && <PromptForm prompt={prompt} onClose={() => setShowEditForm(false)} />}
    </Card>
  )
}

