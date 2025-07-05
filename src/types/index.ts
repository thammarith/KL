export interface BillItem {
  id: string
  name: string
  price: number
  quantity: number
  assignedTo: string[]
  translatedName?: string
}

export interface Bill {
  id: string
  name: string
  date: string
  total: number
  tax?: number
  tip?: number
  items: BillItem[]
  imageUrl?: string
  splitMethod: 'equal' | 'custom' | 'percentage'
  participants: string[]
  createdAt: string
  updatedAt: string
  currency?: string
}

export interface Friend {
  id: string
  name: string
  email?: string
  phone?: string
  avatar?: string
  createdAt: string
}

export interface Split {
  friendId: string
  amount: number
  items: string[]
}

export interface GeminiResponse {
  items: {
    name: string
    price: number
    quantity?: number
  }[]
  total?: number
  tax?: number
  tip?: number
  restaurant?: string
  date?: string
}
