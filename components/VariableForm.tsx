'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Variable } from '@/types'
import { useToast } from "@/components/ui/use-toast"

interface VariableFormProps {
  variables: Variable[]
  content: string
  onClose: () => void
}

export default function VariableForm({ variables, content, onClose }: VariableFormProps) {
  const [values, setValues] = useState<Variable[]>(variables)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let finalContent = content

    values.forEach((v) => {
      const regex = new RegExp(`@{${v.name}\\([^)]*\\)}`, 'g')
      finalContent = finalContent.replace(regex, v.value)
    })

    navigator.clipboard.writeText(finalContent)
    toast({
      title: "Prompt Copied",
      description: "The prompt with filled variables has been copied to your clipboard.",
    })
    onClose()
  }

  const renderInput = (variable: Variable, index: number) => {
    switch (variable.type) {
      case 'text':
        return (
          <Textarea
            id={variable.name}
            value={variable.value}
            onChange={(e) => {
              const newValues = [...values]
              newValues[index].value = e.target.value
              setValues(newValues)
            }}
          />
        )
      case 'singleText':
      default:
        return (
          <Input
            id={variable.name}
            value={variable.value}
            onChange={(e) => {
              const newValues = [...values]
              newValues[index].value = e.target.value
              setValues(newValues)
            }}
          />
        )
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fill in the variables</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {values.map((v, index) => (
            <div key={v.name} className="mb-4">
              <Label htmlFor={v.name}>{v.name}</Label>
              {renderInput(v, index)}
            </div>
          ))}
          <DialogFooter>
            <Button type="submit">Generate and Copy</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

