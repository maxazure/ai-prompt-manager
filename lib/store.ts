import { create } from "zustand"
import type { Prompt } from "@/types"

interface PromptStore {
  prompts: Prompt[]
  setPrompts: (prompts: Prompt[]) => void
  addPrompt: (prompt: Prompt) => void
  updatePrompt: (id: string, updatedPrompt: Partial<Prompt>) => void
  deletePrompt: (id: string) => void
}

export const usePromptStore = create<PromptStore>((set) => ({
  prompts: [],
  setPrompts: (prompts) => set({ prompts }),
  addPrompt: (prompt) => set((state) => ({ prompts: [...state.prompts, prompt] })),
  updatePrompt: (id, updatedPrompt) =>
    set((state) => ({
      prompts: state.prompts.map((p) => (p.id === id ? { ...p, ...updatedPrompt } : p)),
    })),
  deletePrompt: (id) => set((state) => ({ prompts: state.prompts.filter((p) => p.id !== id) })),
}))

