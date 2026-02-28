export type UserRole = 'owner' | 'manager' | 'salesperson'

export interface User {
  id: string
  dealer_id: string
  email: string
  full_name: string
  role: UserRole
  phone: string | null
  is_active: boolean
  avatar_url: string | null
  created_at: string
  updated_at: string
}
