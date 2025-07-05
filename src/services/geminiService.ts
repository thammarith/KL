import { GoogleGenerativeAI } from '@google/generative-ai'
import { storageService } from './storageService'

export interface GeminiResponse {
  items: {
    name: string
    price: number
    quantity?: number
    translatedName?: string
  }[]
  total?: number
  tax?: number
  tip?: number
  restaurant?: string
  date?: string
  currency?: string
}

// Initialize the Gemini API
let genAI: GoogleGenerativeAI | null = null

export const initializeGemini = (apiKey: string) => {
  genAI = new GoogleGenerativeAI(apiKey)
}

export const analyzeBillImage = async (file: File): Promise<GeminiResponse> => {
  if (!genAI) {
    throw new Error('Gemini API not initialized. Please provide your API key.')
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const imageData = await fileToBase64(file)

    const result = await model.generateContent([
      `Analyze this receipt/bill image and extract the following information in JSON format:

      {
        "items": [
          {
            "name": "item name (original language)",
            "translatedName": "item name in English",
            "price": number,
            "quantity": number (default to 1 if not specified)
          }
        ],
        "total": number (if visible),
        "tax": number (if visible),
        "tip": number (if visible),
        "restaurant": "restaurant name" (if visible),
        "date": "YYYY-MM-DD" (if visible, otherwise today's date),
        "currency": "ISO 4217 currency code, e.g. USD, EUR, JPY, etc. If not visible, leave blank."
      }

      Rules:
      - Extract all food/drink items with their prices
      - For each item, provide both the original name and an English translation (use the translatedName field)
      - Ignore service charges, delivery fees unless they're actual items
      - If quantity is not specified, assume 1
      - Be precise with item names and prices
      - Try to detect the currency from the bill (symbols, text, etc). If not found, leave currency blank.
      - Return only valid JSON, no additional text
      - If you can't read the image clearly, return an empty items array
      `,
      {
        inlineData: {
          data: imageData,
          mimeType: file.type
        }
      }
    ])

    const response = await result.response
    const text = response.text()

    try {
      const cleanedText = text.replace(/```json\n?|\n?```/g, '')
      return JSON.parse(cleanedText)
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text)
      throw new Error('Failed to parse receipt data. Please try again.')
    }

  } catch (error) {
    console.error('Error analyzing bill image:', error)
    throw new Error('Failed to analyze the bill. Please check your image and try again.')
  }
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]
      resolve(base64)
    }
    reader.onerror = (error) => reject(error)
  })
}

export const getApiKeyFromStorage = async (): Promise<string | null> => {
  try {
    return await storageService.getSetting('gemini_api_key')
  } catch (error) {
    console.error('Error getting API key from storage:', error)
    return null
  }
}

export const saveApiKeyToStorage = async (apiKey: string): Promise<void> => {
  try {
    await storageService.saveSetting('gemini_api_key', apiKey)
    initializeGemini(apiKey)
  } catch (error) {
    console.error('Error saving API key to storage:', error)
    throw error
  }
}

export const isApiKeyConfigured = async (): Promise<boolean> => {
  const apiKey = await getApiKeyFromStorage()
  return !!apiKey
}
