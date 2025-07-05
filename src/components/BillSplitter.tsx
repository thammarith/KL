import { useState, useEffect } from 'react'
import { Edit, Trash2, Calculator, Share, Image as ImageIcon, X } from 'lucide-react'
import { Bill, Friend, BillItem } from '../types'
import { formatCurrency } from '../utils/currency'

interface BillSplitterProps {
  bills: Bill[]
  friends: Friend[]
  currentBill: Bill | null
  onBillUpdated: (bill: Bill) => Promise<void> | void
  onBillDeleted?: (billId: string) => Promise<void>
}

const BillSplitter: React.FC<BillSplitterProps> = ({
  bills,
  friends,
  currentBill,
  onBillUpdated,
  onBillDeleted
}) => {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(currentBill)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', price: 0, quantity: 1 })
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  useEffect(() => {
    if (currentBill) {
      setSelectedBill(currentBill)
    }
  }, [currentBill])

  const handleBillSelect = (bill: Bill) => {
    setSelectedBill(bill)
  }

  const handleItemEdit = (item: BillItem) => {
    setEditingItem(item.id)
    setEditForm({
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })
  }

  const handleItemSave = async () => {
    if (!selectedBill || !editingItem) return

    const updatedBill = {
      ...selectedBill,
      items: selectedBill.items.map(item =>
        item.id === editingItem
          ? { ...item, ...editForm }
          : item
      ),
      updatedAt: new Date().toISOString()
    }

    // Recalculate total
    updatedBill.total = updatedBill.items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    ) + (updatedBill.tax || 0) + (updatedBill.tip || 0)

    setSelectedBill(updatedBill)
    await onBillUpdated(updatedBill)
    setEditingItem(null)
  }

  const handleItemDelete = async (itemId: string) => {
    if (!selectedBill) return

    const updatedBill = {
      ...selectedBill,
      items: selectedBill.items.filter(item => item.id !== itemId),
      updatedAt: new Date().toISOString()
    }

    // Recalculate total
    updatedBill.total = updatedBill.items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    ) + (updatedBill.tax || 0) + (updatedBill.tip || 0)

    setSelectedBill(updatedBill)
    await onBillUpdated(updatedBill)
  }

  const handleAssignToFriend = async (itemId: string, friendId: string) => {
    if (!selectedBill) return

    const updatedBill = {
      ...selectedBill,
      items: selectedBill.items.map(item => {
        if (item.id === itemId) {
          const assignedTo = item.assignedTo.includes(friendId)
            ? item.assignedTo.filter(id => id !== friendId)
            : [...item.assignedTo, friendId]
          return { ...item, assignedTo }
        }
        return item
      }),
      updatedAt: new Date().toISOString()
    }

    if (!updatedBill.participants.includes(friendId)) {
      updatedBill.participants = [...updatedBill.participants, friendId]
    }

    setSelectedBill(updatedBill)
    await onBillUpdated(updatedBill)
  }

  const handleDeleteBill = async () => {
    if (!selectedBill || !onBillDeleted) return

    try {
      await onBillDeleted(selectedBill.id)
      setSelectedBill(null)
      setShowDeleteConfirmation(false)
    } catch (error) {
      console.error('Error deleting bill:', error)
      alert('Failed to delete bill. Please try again.')
    }
  }

  const calculateSplit = () => {
    if (!selectedBill) return {}

    const split: Record<string, { amount: number; items: BillItem[] }> = {}

    // Initialize split for all participants
    selectedBill.participants.forEach(friendId => {
      split[friendId] = { amount: 0, items: [] }
    })

    // Calculate split based on assigned items
    selectedBill.items.forEach(item => {
      if (item.assignedTo.length === 0) {
        // If no one is assigned, split equally among all participants
        const perPerson = (item.price * item.quantity) / selectedBill.participants.length
        selectedBill.participants.forEach(friendId => {
          split[friendId].amount += perPerson
          split[friendId].items.push(item)
        })
      } else {
        // Split among assigned people
        const perPerson = (item.price * item.quantity) / item.assignedTo.length
        item.assignedTo.forEach(friendId => {
          if (split[friendId]) {
            split[friendId].amount += perPerson
            split[friendId].items.push(item)
          }
        })
      }
    })

    // Add proportional tax and tip
    const subtotal = selectedBill.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const taxTipTotal = (selectedBill.tax || 0) + (selectedBill.tip || 0)

    Object.keys(split).forEach(friendId => {
      const proportion = split[friendId].amount / subtotal
      split[friendId].amount += taxTipTotal * proportion
    })

    return split
  }

  const generateShareText = () => {
    if (!selectedBill) return ''

    const split = calculateSplit()
    let text = `💰 ${selectedBill.name}\n`
    text += `📅 ${selectedBill.date}\n`
    text += `💵 Total: ${formatCurrency(selectedBill.total, selectedBill?.currency)}\n\n`

    text += '📝 Items:\n'
    selectedBill.items.forEach(item => {
      text += `• ${item.name}${item.translatedName && item.translatedName !== item.name ? ` / ${item.translatedName}` : ''} - ${formatCurrency(item.price, selectedBill?.currency)}`
      if (item.quantity > 1) text += ` (x${item.quantity})`
      if (item.assignedTo.length > 0) {
        const assignedNames = item.assignedTo.map(id =>
          friends.find(f => f.id === id)?.name || 'Unknown'
        ).join(', ')
        text += ` → ${assignedNames}`
      }
      text += '\n'
    })

    text += '\n💸 Split:\n'
    Object.entries(split).forEach(([friendId, data]) => {
      const friend = friends.find(f => f.id === friendId)
      text += `${friend?.name || 'Unknown'}: ${formatCurrency(data.amount, selectedBill?.currency)}\n`
    })

    return text
  }

  const handleShare = async () => {
    const shareText = generateShareText()

    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedBill?.name || 'Bill Split',
          text: shareText
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Bill details copied to clipboard!')
      })
    }
  }

  if (!selectedBill && bills.length === 0) {
    return (
      <div className="bill-splitter empty">
        <div className="empty-state">
          <Calculator size={48} />
          <h3>No Bills Yet</h3>
          <p>Scan your first bill to get started!</p>
        </div>
      </div>
    )
  }

  const split = calculateSplit()

  return (
    <div className="bill-splitter">
      {bills.length > 0 && (
        <div className="bill-selector">
          <h3>Select a Bill</h3>
          <div className="bill-list">
            {bills.map(bill => (
              <div
                key={bill.id}
                className={`bill-item ${selectedBill?.id === bill.id ? 'selected' : ''}`}
                onClick={() => handleBillSelect(bill)}
              >
                <div className="bill-item-content">
                  <span className="bill-name">{bill.name}</span>
                  <span className="bill-total">{formatCurrency(bill.total, bill?.currency)}</span>
                </div>
                {bill.imageUrl && (
                  <div className="bill-item-indicator">
                    <ImageIcon size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedBill && (
        <div className="bill-details">
          <div className="bill-header">
            <h2>{selectedBill.name}</h2>
            <div className="bill-actions">
              {selectedBill.imageUrl && (
                <button
                  onClick={() => setShowReceiptModal(true)}
                  className="receipt-btn"
                  title="View Receipt"
                >
                  <ImageIcon size={16} />
                  Receipt
                </button>
              )}
              <button onClick={handleShare} className="share-btn">
                <Share size={16} />
                Share
              </button>
              {onBillDeleted && (
                <button
                  onClick={() => setShowDeleteConfirmation(true)}
                  className="delete-bill-btn"
                  title="Delete Bill"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              )}
            </div>
          </div>

          {/* Receipt Image Display - Moved to top for prominence */}
          {selectedBill.imageUrl && (
            <div className="receipt-display-prominent">
              <div className="receipt-header">
                <h4>📸 Original Receipt</h4>
                <span className="receipt-hint">Click image to enlarge</span>
              </div>
              <div className="receipt-image-container-prominent">
                <img
                  src={selectedBill.imageUrl}
                  alt="Receipt"
                  className="receipt-image-prominent"
                  onClick={() => setShowReceiptModal(true)}
                />
              </div>
            </div>
          )}

          <div className="bill-info">
            <span>📅 {selectedBill.date}</span>
            <span>💵 Total: {formatCurrency(selectedBill.total, selectedBill?.currency)}</span>
            {selectedBill.tax && <span>🏷️ Tax: {formatCurrency(selectedBill.tax, selectedBill?.currency)}</span>}
            {selectedBill.tip && <span>💰 Tip: {formatCurrency(selectedBill.tip, selectedBill?.currency)}</span>}
          </div>

          <div className="bill-items">
            <h3>Items</h3>
            {selectedBill.items.map((item) => (
              <div key={item.id} className="bill-item-row">
                {editingItem === item.id ? (
                  <div className="item-edit-form">
                    <input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="Item name"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                      placeholder="Price"
                    />
                    <input
                      type="number"
                      value={editForm.quantity}
                      onChange={(e) => setEditForm({ ...editForm, quantity: parseInt(e.target.value) || 1 })}
                      placeholder="Qty"
                    />
                    <button onClick={handleItemSave}>
                      <Edit size={12} />
                    </button>
                    <button onClick={() => setEditingItem(null)}>
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="item-info">
                    <div className="receipt-item-line">
                      <div className="receipt-item-name">
                        {item.name}
                        {item.translatedName && item.translatedName !== item.name && (
                          <span className="item-translated-name">{item.translatedName}</span>
                        )}
                        {item.quantity > 1 && (
                          <span className="item-quantity">x{item.quantity}</span>
                        )}
                      </div>
                      <div className="receipt-item-price">
                        {formatCurrency(item.price * item.quantity, selectedBill?.currency)}
                      </div>
                    </div>
                    <div className="item-actions">
                      <button onClick={() => handleItemEdit(item)}>
                        <Edit size={10} />
                      </button>
                      <button onClick={() => handleItemDelete(item.id)}>
                        <Trash2 size={10} />
                      </button>
                    </div>
                  </div>
                )}

                <div className="item-assignments">
                  {friends.map((friend) => (
                    <label key={friend.id} className="friend-checkbox">
                      <input
                        type="checkbox"
                        checked={item.assignedTo.includes(friend.id)}
                        onChange={() => handleAssignToFriend(item.id, friend.id)}
                      />
                      {friend.name}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bill-split">
            <h3>Split Summary</h3>
            {Object.entries(split).map(([friendId, data]) => {
              const friend = friends.find(f => f.id === friendId)
              return (
                <div key={friendId} className="split-row">
                  <span className="friend-name">{friend?.name || 'Unknown'}</span>
                  <span className="split-amount">{formatCurrency(data.amount, selectedBill?.currency)}</span>
                </div>
              )
            })}
          </div>

          <div className="receipt-footer">
            <div>Bill Split Complete</div>
            <div>{new Date().toLocaleDateString()}</div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && selectedBill && (
        <div className="delete-modal" onClick={() => setShowDeleteConfirmation(false)}>
          <div className="delete-modal-content" onClick={e => e.stopPropagation()}>
            <div className="delete-modal-header">
              <h3>🗑️ Delete Bill</h3>
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="close-btn"
              >
                <X size={20} />
              </button>
            </div>
            <div className="delete-modal-body">
              <p>Are you sure you want to delete this bill?</p>
              <div className="delete-bill-info">
                <strong>{selectedBill.name}</strong>
                <span>{formatCurrency(selectedBill.total, selectedBill?.currency)} • {selectedBill.date}</span>
              </div>
              <p className="delete-warning">⚠️ This action cannot be undone. All bill data and receipt images will be permanently deleted.</p>
            </div>
            <div className="delete-modal-footer">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="cancel-delete-btn"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBill}
                className="confirm-delete-btn"
              >
                <Trash2 size={16} />
                Delete Bill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && selectedBill?.imageUrl && (
        <div className="receipt-modal" onClick={() => setShowReceiptModal(false)}>
          <div className="receipt-modal-content" onClick={e => e.stopPropagation()}>
            <div className="receipt-modal-header">
              <h3>Original Receipt</h3>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="close-btn"
              >
                <X size={20} />
              </button>
            </div>
            <div className="receipt-image-container">
              <img
                src={selectedBill.imageUrl}
                alt="Receipt"
                className="receipt-image"
              />
            </div>
            <div className="receipt-modal-footer">
              <p>Original receipt for verification</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BillSplitter
