import { useState } from 'react'
import { UserPlus, Edit, Trash2, Users } from 'lucide-react'
import { Friend } from '../types'
import { v4 as uuidv4 } from 'uuid'

interface GroupManagerProps {
  friends: Friend[]
  onFriendsUpdated: (friends: Friend[]) => void
}

const GroupManager: React.FC<GroupManagerProps> = ({ friends, onFriendsUpdated }) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingFriend, setEditingFriend] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })

  const handleAddFriend = () => {
    if (!formData.name.trim()) return

    const newFriend: Friend = {
      id: uuidv4(),
      name: formData.name.trim(),
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      createdAt: new Date().toISOString()
    }

    onFriendsUpdated([...friends, newFriend])
    setFormData({ name: '', email: '', phone: '' })
    setShowAddForm(false)
  }

  const handleEditFriend = (friend: Friend) => {
    setEditingFriend(friend.id)
    setFormData({
      name: friend.name,
      email: friend.email || '',
      phone: friend.phone || ''
    })
  }

  const handleSaveEdit = () => {
    if (!editingFriend || !formData.name.trim()) return

    const updatedFriends = friends.map(friend =>
      friend.id === editingFriend
        ? {
            ...friend,
            name: formData.name.trim(),
            email: formData.email.trim() || undefined,
            phone: formData.phone.trim() || undefined
          }
        : friend
    )

    onFriendsUpdated(updatedFriends)
    setEditingFriend(null)
    setFormData({ name: '', email: '', phone: '' })
  }

  const handleDeleteFriend = (friendId: string) => {
    if (confirm('Are you sure you want to delete this friend?')) {
      onFriendsUpdated(friends.filter(friend => friend.id !== friendId))
    }
  }

  const handleCancelEdit = () => {
    setEditingFriend(null)
    setShowAddForm(false)
    setFormData({ name: '', email: '', phone: '' })
  }

  return (
    <div className="group-manager">
      <div className="manager-header">
        <h2>👥 Manage Friends</h2>
        <button
          className="add-friend-btn"
          onClick={() => setShowAddForm(true)}
        >
          <UserPlus size={16} />
          Add Friend
        </button>
      </div>

      {(showAddForm || editingFriend) && (
        <div className="friend-form">
          <h3>{editingFriend ? 'Edit Friend' : 'Add New Friend'}</h3>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter friend's name"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone number"
            />
          </div>
          <div className="form-actions">
            <button
              onClick={editingFriend ? handleSaveEdit : handleAddFriend}
              disabled={!formData.name.trim()}
            >
              {editingFriend ? 'Save Changes' : 'Add Friend'}
            </button>
            <button
              onClick={handleCancelEdit}
              className="secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="friends-list">
        {friends.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <h3>No Friends Added Yet</h3>
            <p>Add friends to start splitting bills together!</p>
          </div>
        ) : (
          <>
            <h3>Your Friends ({friends.length})</h3>
            <div className="friends-grid">
              {friends.map(friend => (
                <div key={friend.id} className="friend-card">
                  <div className="friend-avatar">
                    {friend.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="friend-info">
                    <h4>{friend.name}</h4>
                    {friend.email && (
                      <p className="friend-email">📧 {friend.email}</p>
                    )}
                    {friend.phone && (
                      <p className="friend-phone">📞 {friend.phone}</p>
                    )}
                  </div>
                  <div className="friend-actions">
                    <button
                      onClick={() => handleEditFriend(friend)}
                      title="Edit friend"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteFriend(friend.id)}
                      title="Delete friend"
                      className="delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="manager-tips">
        <h4>💡 Tips:</h4>
        <ul>
          <li>Add all your regular dining companions</li>
          <li>Email and phone are optional but helpful for sharing bills</li>
          <li>You can edit friend details anytime</li>
          <li>Friends will appear when splitting bills</li>
        </ul>
      </div>
    </div>
  )
}

export default GroupManager
