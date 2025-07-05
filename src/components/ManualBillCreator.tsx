import { useState } from 'react'
import { Plus, Trash2, Save, X } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Bill, BillItem, Friend } from '../types'
import { formatCurrency, getCurrencySymbol } from '../utils/currency'

interface ManualBillCreatorProps {
  friends: Friend[]
  onBillCreated: (bill: Bill) => void
}

const ManualBillCreator: React.FC<ManualBillCreatorProps> = ({ friends, onBillCreated }) => {
  const [billName, setBillName] = useState('')
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0])
  const [tax, setTax] = useState<number>(0)
  const [tip, setTip] = useState<number>(0)
  const [items, setItems] = useState<BillItem[]>([])
  const [showAddItemForm, setShowAddItemForm] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', price: 0, quantity: 1 })

  const currencySymbol = getCurrencySymbol()

  const handleAddItem = () => {
    if (newItem.name && newItem.price > 0) {
      const item: BillItem = {
        id: uuidv4(),
        name: newItem.name,
        price: newItem.price,
        quantity: newItem.quantity,
        assignedTo: []
      }
      setItems([...items, item])
      setNewItem({ name: '', price: 0, quantity: 1 })
      setShowAddItemForm(false)
    }
  }

  const handleDeleteItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId))
  }

  const handleUpdateItem = (itemId: string, updates: Partial<BillItem>) => {
    setItems(items.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    ))
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + tax + tip
  }

  const handleCreateBill = () => {
    if (!billName.trim() || items.length === 0) {
      alert('Please enter a bill name and add at least one item')
      return
    }

    const bill: Bill = {
      id: uuidv4(),
      name: billName.trim(),
      date: billDate,
      total: calculateTotal(),
      tax: tax > 0 ? tax : undefined,
      tip: tip > 0 ? tip : undefined,
      items,
      splitMethod: 'custom',
      participants: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    onBillCreated(bill)

    // Reset form
    setBillName('')
    setBillDate(new Date().toISOString().split('T')[0])
    setTax(0)
    setTip(0)
    setItems([])
    setShowAddItemForm(false)
  }

  return (
    <div className="manual-bill-creator">
      <div className="creator-header">
        <h2>📝 Create Bill Manually</h2>
        <p>Add bill details and items manually</p>
      </div>

      <div className="bill-form">
        <div className="form-group">
          <label>Bill Name *</label>
          <input
            type="text"
            value={billName}
            onChange={(e) => setBillName(e.target.value)}
            placeholder="e.g., Dinner at Mario's"
            required
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={billDate}
            onChange={(e) => setBillDate(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Tax ({currencySymbol})</label>
            <input
              type="number"
              step="0.01"
              value={tax}
              onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label>Tip ({currencySymbol})</label>
            <input
              type="number"
              step="0.01"
              value={tip}
              onChange={(e) => setTip(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="items-section">
          <div className="items-header">
            <h3>Items</h3>
            <button
              className="add-item-btn"
              onClick={() => setShowAddItemForm(true)}
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>

          {showAddItemForm && (
            <div className="add-item-form">
              <div className="form-row">
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Item name"
                />
                <input
                  type="number"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                  placeholder="Price"
                />
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                  placeholder="Qty"
                  min="1"
                />
              </div>
              <div className="form-actions">
                <button onClick={handleAddItem} className="save-btn">
                  <Save size={16} />
                  Add
                </button>
                <button onClick={() => setShowAddItemForm(false)} className="cancel-btn">
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="items-list">
            {items.map(item => (
              <div key={item.id} className="item-row">
                <div className="item-info">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleUpdateItem(item.id, { name: e.target.value })}
                    className="item-name-input"
                  />
                  <div className="item-price-qty">
                    <input
                      type="number"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => handleUpdateItem(item.id, { price: parseFloat(e.target.value) || 0 })}
                      className="price-input"
                    />
                    <span>×</span>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
                      className="quantity-input"
                      min="1"
                    />
                  </div>
                </div>
                <div className="item-total">
                  {formatCurrency(item.price * item.quantity)}
                </div>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="delete-btn"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="empty-items">
              <p>No items added yet. Click "Add Item" to get started.</p>
            </div>
          )}
        </div>

        <div className="bill-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>{formatCurrency(calculateSubtotal())}</span>
          </div>
          {tax > 0 && (
            <div className="summary-row">
              <span>Tax:</span>
              <span>{formatCurrency(tax)}</span>
            </div>
          )}
          {tip > 0 && (
            <div className="summary-row">
              <span>Tip:</span>
              <span>{formatCurrency(tip)}</span>
            </div>
          )}
          <div className="summary-row total">
            <span>Total:</span>
            <span>{formatCurrency(calculateTotal())}</span>
          </div>
        </div>

        <div className="form-actions">
          <button
            onClick={handleCreateBill}
            className="create-bill-btn"
            disabled={!billName.trim() || items.length === 0}
          >
            <Save size={16} />
            Create Bill
          </button>
        </div>
      </div>
    </div>
  )
}

export default ManualBillCreator
