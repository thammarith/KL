import { useState, useRef, useEffect } from 'react'
import { Camera, Upload, Loader, Settings, AlertCircle, Edit3, Scan } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import {
  analyzeBillImage,
  isApiKeyConfigured,
  saveApiKeyToStorage,
  getApiKeyFromStorage,
  initializeGemini
} from '../services/geminiService'
import { Bill, Friend, BillItem } from '../types'
import ManualBillCreator from './ManualBillCreator'

interface BillScannerProps {
  onBillScanned: (bill: Bill) => void
  friends: Friend[]
}

const BillScanner: React.FC<BillScannerProps> = ({ onBillScanned, friends }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'scan' | 'manual'>('scan')
  const [isApiKeyReady, setIsApiKeyReady] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const initializeApiKey = async () => {
      try {
        const savedApiKey = await getApiKeyFromStorage()
        if (savedApiKey) {
          setApiKey(savedApiKey)
          initializeGemini(savedApiKey)
          setIsApiKeyReady(true)
        }
      } catch (error) {
        console.error('Error loading API key:', error)
      }
    }

    initializeApiKey()
  }, [])

  const handleApiKeySubmit = async () => {
    if (apiKey.trim()) {
      try {
        await saveApiKeyToStorage(apiKey.trim())
        setShowApiKeyInput(false)
        setError(null)
        setIsApiKeyReady(true)
      } catch (error) {
        setError('Failed to save API key. Please try again.')
      }
    }
  }

  const processImage = async (file: File) => {
    const apiKeyConfigured = await isApiKeyConfigured()
    if (!apiKeyConfigured) {
      setShowApiKeyInput(true)
      setError('Please configure your Gemini API key first.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Read image as Data URL and wait for it
      const imageDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      setPreviewImage(imageDataUrl)

      // Analyze with Gemini
      const response = await analyzeBillImage(file)

      // Convert to our Bill format
      const billItems: BillItem[] = response.items.map(item => ({
        id: uuidv4(),
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        assignedTo: [],
        translatedName: item.translatedName
      }))

      const totalFromItems = billItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const currency = response.currency && response.currency.trim() ? response.currency : undefined

      const bill: Bill = {
        id: uuidv4(),
        name: response.restaurant || `Bill from ${new Date().toLocaleDateString()}`,
        date: response.date || new Date().toISOString().split('T')[0],
        total: response.total || totalFromItems,
        tax: response.tax,
        tip: response.tip,
        items: billItems,
        imageUrl: imageDataUrl,
        splitMethod: 'custom',
        participants: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currency
      }

      onBillScanned(bill)
      setPreviewImage(null)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      processImage(file)
    } else {
      setError('Please select a valid image file')
    }
  }

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      processImage(file)
    }
  }

  if (showApiKeyInput) {
    return (
      <div className="bill-scanner">
        <div className="api-key-setup">
          <h3>🔑 Setup Gemini API Key</h3>
          <p>To analyze receipts, you need a Google Gemini API key.</p>
          <ol>
            <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
            <li>Create or select a project</li>
            <li>Generate an API key</li>
            <li>Paste it below</li>
          </ol>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key"
            className="api-key-input"
          />
          <div className="api-key-buttons">
            <button onClick={handleApiKeySubmit} disabled={!apiKey.trim()}>
              Save API Key
            </button>
            <button onClick={() => setShowApiKeyInput(false)} className="secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bill-scanner">
      <div className="scanner-header">
        <h2>💰 Create Your Bill</h2>
        <button
          className="settings-btn"
          onClick={() => setShowApiKeyInput(true)}
          title="API Settings"
        >
          <Settings size={20} />
        </button>
      </div>

      <div className="scanner-tabs">
        <button
          className={`tab-button ${activeTab === 'scan' ? 'active' : ''}`}
          onClick={() => setActiveTab('scan')}
        >
          <Scan size={18} />
          <span>Scan Receipt</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'manual' ? 'active' : ''}`}
          onClick={() => setActiveTab('manual')}
        >
          <Edit3 size={18} />
          <span>Manual Entry</span>
        </button>
      </div>

      {activeTab === 'scan' ? (
        <div className="scan-content">
          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="Bill preview" />
            </div>
          )}

          {isLoading ? (
            <div className="loading-state">
              <Loader className="spinner" size={48} />
              <p>Analyzing your bill with AI...</p>
            </div>
          ) : (
            <div className="scanner-actions">
              <button
                className="scan-button camera"
                onClick={() => cameraInputRef.current?.click()}
              >
                <Camera size={24} />
                <span>Take Photo</span>
              </button>

              <button
                className="scan-button upload"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={24} />
                <span>Upload Image</span>
              </button>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
                style={{ display: 'none' }}
              />

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>
          )}

          <div className="scanner-tips">
            <h4>📝 Tips for better results:</h4>
            <ul>
              <li>Ensure the bill is well-lit and not blurry</li>
              <li>Keep the entire bill visible in the photo</li>
              <li>Avoid shadows and reflections</li>
              <li>Take the photo straight-on (not at an angle)</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="manual-content">
          <ManualBillCreator
            friends={friends}
            onBillCreated={onBillScanned}
          />
        </div>
      )}
    </div>
  )
}

export default BillScanner
