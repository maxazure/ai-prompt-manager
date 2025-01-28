export interface Prompt {
  id: string;  // 使用 string 类型来存储 UUID
  title: string
  content: string
  category: string
}

export interface Variable {
  name: string
  type: string
  value: string
}

