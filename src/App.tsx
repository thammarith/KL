import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom'
import { Camera, Receipt, Users } from 'lucide-react'
import BillScanner from './components/BillScanner'
import BillSplitter from './components/BillSplitter'
import GroupManager from './components/GroupManager'
import { Bill, Friend } from './types'
import { storageService } from './services/storageService'
import './App.css'

const AppNav = () => {
  const location = useLocation()

  return (
    <nav className="app-nav">
      <Link to="/scan" className={`nav-item ${location.pathname === '/scan' ? 'active' : ''}`}>
        <Camera size={20} />
        <span>Scan</span>
      </Link>
      <Link to="/bills" className={`nav-item ${location.pathname === '/bills' ? 'active' : ''}`}>
        <Receipt size={20} />
        <span>Bills</span>
      </Link>
      <Link to="/friends" className={`nav-item ${location.pathname === '/friends' ? 'active' : ''}`}>
        <Users size={20} />
        <span>Friends</span>
      </Link>
    </nav>
  )
}

function AppContent() {
  const [bills, setBills] = useState<Bill[]>([])
  const [friends, setFriends] = useState<Friend[]>([])
  const [currentBill, setCurrentBill] = useState<Bill | null>(null)
  const [isStorageReady, setIsStorageReady] = useState(false)
  const navigate = useNavigate()

  // Initialize storage and load data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize storage service and migrate from localStorage if needed
        await storageService.initializeAndMigrate()

        // Load bills
        const savedBills = await storageService.getAllBills()
        setBills(savedBills)

        // Load friends
        const savedFriends = await storageService.getAllFriends()
        setFriends(savedFriends)

        setIsStorageReady(true)
      } catch (error) {
        console.error('Error initializing app:', error)
        setIsStorageReady(true)
      }
    }

    initializeApp()
  }, [])

  // Save bills to IndexedDB
  useEffect(() => {
    if (!isStorageReady) return

    const saveBills = async () => {
      try {
        await storageService.saveAllBills(bills)
      } catch (error) {
        console.error('Error saving bills:', error)
      }
    }

    saveBills()
  }, [bills, isStorageReady])

  // Save friends to IndexedDB
  useEffect(() => {
    if (!isStorageReady) return

    const saveFriends = async () => {
      try {
        await storageService.saveAllFriends(friends)
      } catch (error) {
        console.error('Error saving friends:', error)
      }
    }

    saveFriends()
  }, [friends, isStorageReady])

  const handleBillScanned = (bill: Bill) => {
    setBills(prev => [...prev, bill])
    setCurrentBill(bill)
    // Navigate to bills page after bill creation
    navigate('/bills')
  }

  const handleBillUpdated = async (updatedBill: Bill) => {
    setBills(prev => prev.map(b => b.id === updatedBill.id ? updatedBill : b))
    setCurrentBill(updatedBill)

    // Save the updated bill immediately
    try {
      await storageService.saveBill(updatedBill)
    } catch (error) {
      console.error('Error saving updated bill:', error)
    }
  }

  const handleBillDeleted = async (billId: string) => {
    try {
      await storageService.deleteBill(billId)
      setBills(prev => prev.filter(b => b.id !== billId))
      if (currentBill?.id === billId) {
        setCurrentBill(null)
      }
    } catch (error) {
      console.error('Error deleting bill:', error)
    }
  }

  const handleFriendsUpdated = (updatedFriends: Friend[]) => {
    setFriends(updatedFriends)
  }

  if (!isStorageReady) {
    return (
      <div className="app">
        <div className="app-loading">
          <div className="loading-spinner">💰</div>
          <p>Loading Bill Splitter...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>💰 Bill Splitter</h1>
        <p>Split bills with friends using AI</p>
      </header>

      <AppNav />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/scan" replace />} />
          <Route
            path="/scan"
            element={
              <BillScanner
                onBillScanned={handleBillScanned}
                friends={friends}
              />
            }
          />
          <Route
            path="/bills"
            element={
              <BillSplitter
                bills={bills}
                friends={friends}
                currentBill={currentBill}
                onBillUpdated={handleBillUpdated}
                onBillDeleted={handleBillDeleted}
              />
            }
          />
          <Route
            path="/friends"
            element={
              <GroupManager
                friends={friends}
                onFriendsUpdated={handleFriendsUpdated}
              />
            }
          />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
