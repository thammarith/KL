import { useState } from 'react'
import { Settings } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Bill, Friend, BillItem } from '../types'

interface BillScannerProps {
  onBillScanned: (bill: Bill) => void
  friends: Friend[]
}

const BillScannerSimple: React.FC<BillScannerProps> = ({ onBillScanned }) => {
  const [showDemo, setShowDemo] = useState(false)

  const createDemoBill = () => {
    const demoItems: BillItem[] = [
      {
        id: uuidv4(),
        name: 'Burger Deluxe',
        price: 15.99,
        quantity: 1,
        assignedTo: []
      },
      {
        id: uuidv4(),
        name: 'Fries',
        price: 4.50,
        quantity: 2,
        assignedTo: []
      },
      {
        id: uuidv4(),
        name: 'Soft Drink',
        price: 2.99,
        quantity: 2,
        assignedTo: []
      }
    ]

    const bill: Bill = {
      id: uuidv4(),
      name: 'Demo Restaurant Bill',
      date: new Date().toISOString().split('T')[0],
      total: 28.47,
      tax: 2.28,
      tip: 5.70,
      items: demoItems,
      splitMethod: 'custom',
      participants: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    onBillScanned(bill)
  }

  return (
    <div className="bill-scanner">
      <div className="scanner-header">
        <h2>📸 Scan Your Bill</h2>
        <button
          className="settings-btn"
          onClick={() => setShowDemo(!showDemo)}
          title="Demo Mode"
        >
          <Settings size={20} />
        </button>
      </div>

      <div className="scanner-actions">
        <button
          className="scan-button camera"
          onClick={createDemoBill}
        >
          <span>📱</span>
          <span>Create Demo Bill</span>
        </button>

        <div className="scan-button upload" style={{ opacity: 0.5 }}>
          <span>📤</span>
          <span>File Upload (Coming Soon)</span>
        </div>
      </div>

      {showDemo && (
        <div className="scanner-tips">
          <h4>🔧 Demo Mode Active</h4>
          <p>This is a demo version. Click "Create Demo Bill" to generate a sample bill for testing the splitting functionality.</p>
        </div>
      )}

      <div className="scanner-tips">
        <h4>📝 Features:</h4>
        <ul>
          <li>✅ Bill splitting with friends</li>
          <li>✅ Friend management</li>
          <li>✅ PWA installation</li>
          <li>🔄 AI bill scanning (setup required)</li>
        </ul>
      </div>
    </div>
  )
}

export default BillScannerSimple
