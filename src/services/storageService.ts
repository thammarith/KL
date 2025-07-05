// Storage Service using IndexedDB for all data

import { Bill, Friend } from '../types'

interface StoredBill extends Bill {
  // All bill data including images stored directly
}

interface StoredFriend extends Friend {
  // All friend data
}

interface StoredSetting {
  id: string
  value: string
  updatedAt: string
}

class StorageService {
  private dbName = 'BillSplitterDB'
  private dbVersion = 2
  private billsStoreName = 'bills'
  private friendsStoreName = 'friends'
  private settingsStoreName = 'settings'
  private db: IDBDatabase | null = null

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create bills object store
        if (!db.objectStoreNames.contains(this.billsStoreName)) {
          const billStore = db.createObjectStore(this.billsStoreName, { keyPath: 'id' })
          billStore.createIndex('date', 'date', { unique: false })
          billStore.createIndex('createdAt', 'createdAt', { unique: false })
        }

        // Create friends object store
        if (!db.objectStoreNames.contains(this.friendsStoreName)) {
          const friendStore = db.createObjectStore(this.friendsStoreName, { keyPath: 'id' })
          friendStore.createIndex('name', 'name', { unique: false })
          friendStore.createIndex('createdAt', 'createdAt', { unique: false })
        }

        // Create settings object store
        if (!db.objectStoreNames.contains(this.settingsStoreName)) {
          const settingsStore = db.createObjectStore(this.settingsStoreName, { keyPath: 'id' })
          settingsStore.createIndex('updatedAt', 'updatedAt', { unique: false })
        }
      }
    })
  }

  // Settings Storage Methods
  async saveSetting(id: string, value: string): Promise<void> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.settingsStoreName], 'readwrite')
      const store = transaction.objectStore(this.settingsStoreName)

      const setting: StoredSetting = {
        id,
        value,
        updatedAt: new Date().toISOString()
      }

      const request = store.put(setting)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getSetting(id: string): Promise<string | null> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.settingsStoreName], 'readonly')
      const store = transaction.objectStore(this.settingsStoreName)

      const request = store.get(id)
      request.onsuccess = () => {
        const result = request.result
        resolve(result ? result.value : null)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // Bill Storage Methods
  async saveBill(bill: StoredBill): Promise<void> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.billsStoreName], 'readwrite')
      const store = transaction.objectStore(this.billsStoreName)

      const request = store.put(bill)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getBill(id: string): Promise<StoredBill | null> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.billsStoreName], 'readonly')
      const store = transaction.objectStore(this.billsStoreName)

      const request = store.get(id)
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  async getAllBills(): Promise<StoredBill[]> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.billsStoreName], 'readonly')
      const store = transaction.objectStore(this.billsStoreName)

      const request = store.getAll()
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  async deleteBill(id: string): Promise<void> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.billsStoreName], 'readwrite')
      const store = transaction.objectStore(this.billsStoreName)

      const request = store.delete(id)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // Friend Storage Methods
  async saveFriend(friend: StoredFriend): Promise<void> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.friendsStoreName], 'readwrite')
      const store = transaction.objectStore(this.friendsStoreName)

      const request = store.put(friend)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getFriend(id: string): Promise<StoredFriend | null> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.friendsStoreName], 'readonly')
      const store = transaction.objectStore(this.friendsStoreName)

      const request = store.get(id)
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  async getAllFriends(): Promise<StoredFriend[]> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.friendsStoreName], 'readonly')
      const store = transaction.objectStore(this.friendsStoreName)

      const request = store.getAll()
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  async deleteFriend(id: string): Promise<void> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.friendsStoreName], 'readwrite')
      const store = transaction.objectStore(this.friendsStoreName)

      const request = store.delete(id)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // Batch Operations
  async saveAllBills(bills: StoredBill[]): Promise<void> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.billsStoreName], 'readwrite')
      const store = transaction.objectStore(this.billsStoreName)

      let completed = 0
      const total = bills.length

      if (total === 0) {
        resolve()
        return
      }

      bills.forEach(bill => {
        const request = store.put(bill)
        request.onsuccess = () => {
          completed++
          if (completed === total) resolve()
        }
        request.onerror = () => reject(request.error)
      })
    })
  }

  async saveAllFriends(friends: StoredFriend[]): Promise<void> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.friendsStoreName], 'readwrite')
      const store = transaction.objectStore(this.friendsStoreName)

      let completed = 0
      const total = friends.length

      if (total === 0) {
        resolve()
        return
      }

      friends.forEach(friend => {
        const request = store.put(friend)
        request.onsuccess = () => {
          completed++
          if (completed === total) resolve()
        }
        request.onerror = () => reject(request.error)
      })
    })
  }

  // Migration from localStorage (for backward compatibility)
  async migrateFromLocalStorage(): Promise<void> {
    try {
      // Migrate bills
      const savedBills = localStorage.getItem('bills')
      if (savedBills) {
        const bills = JSON.parse(savedBills)
        await this.saveAllBills(bills)
        localStorage.removeItem('bills')
      }

      // Migrate friends
      const savedFriends = localStorage.getItem('friends')
      if (savedFriends) {
        const friends = JSON.parse(savedFriends)
        await this.saveAllFriends(friends)
        localStorage.removeItem('friends')
      }

      // Migrate API key
      const savedApiKey = localStorage.getItem('gemini_api_key')
      if (savedApiKey) {
        await this.saveSetting('gemini_api_key', savedApiKey)
        localStorage.removeItem('gemini_api_key')
      }
    } catch (error) {
      console.error('Error migrating from localStorage:', error)
    }
  }

  // Initialize and migrate
  async initializeAndMigrate(): Promise<void> {
    await this.initialize()
    await this.migrateFromLocalStorage()
  }

  // Clear all data
  async clearAll(): Promise<void> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.billsStoreName, this.friendsStoreName, this.settingsStoreName], 'readwrite')

      const billStore = transaction.objectStore(this.billsStoreName)
      const friendStore = transaction.objectStore(this.friendsStoreName)
      const settingsStore = transaction.objectStore(this.settingsStoreName)

      const clearBills = billStore.clear()
      const clearFriends = friendStore.clear()
      const clearSettings = settingsStore.clear()

      let completed = 0

      clearBills.onsuccess = () => {
        completed++
        if (completed === 3) resolve()
      }

      clearFriends.onsuccess = () => {
        completed++
        if (completed === 3) resolve()
      }

      clearSettings.onsuccess = () => {
        completed++
        if (completed === 3) resolve()
      }

      clearBills.onerror = () => reject(clearBills.error)
      clearFriends.onerror = () => reject(clearFriends.error)
      clearSettings.onerror = () => reject(clearSettings.error)
    })
  }
}

export const storageService = new StorageService()
