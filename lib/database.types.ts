export interface Prompt {
  id: string
  title: string
  content: string
  category: string
  created_at: string
  updated_at: string
  user_id?: string
}

export interface Database {
  public: {
    Tables: {
      prompts: {
        Row: Prompt
        Insert: Omit<Prompt, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Prompt, 'id'>>
      }
    }
  }
}
