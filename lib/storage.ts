import type { Prompt } from "@/types"
import { supabase } from './supabase'

export const getAllPrompts = async (): Promise<Prompt[]> => {
  try {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    return data || []
  } catch (error) {
    console.error('Error getting prompts:', error)
    return []
  }
}

export const addPrompt = async (prompt: Prompt): Promise<void> => {
  try {
    const { error } = await supabase
      .from('prompts')
      .insert([{
        ...prompt,
        created_at: new Date().toISOString()
      }])
    
    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
  } catch (error) {
    console.error('Error adding prompt:', error)
    throw error
  }
}

export const updatePrompt = async (prompt: Prompt): Promise<void> => {
  try {
    const { error } = await supabase
      .from('prompts')
      .update(prompt)
      .eq('id', prompt.id)
    
    if (error) throw error
  } catch (error) {
    console.error('Error updating prompt:', error)
    throw error
  }
}

export const deletePrompt = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  } catch (error) {
    console.error('Error deleting prompt:', error)
    throw error
  }
}

export const exportPrompts = async (): Promise<string> => {
  const prompts = await getAllPrompts()
  return JSON.stringify(prompts)
}

export const importPrompts = async (data: string): Promise<void> => {
  const prompts: Prompt[] = JSON.parse(data)
  await Promise.all(prompts.map(prompt => addPrompt(prompt)))
}

