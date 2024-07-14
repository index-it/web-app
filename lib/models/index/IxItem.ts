export type IxItem = {
  id: string
  list_id: string
  category_id?: string
  user_id: string
  name: string
  link?: string
  completed: boolean
  completed_at?: number
  created_at: number
  edited_at?: number
}