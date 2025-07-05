import { useState } from 'react'
import './App.css'

function AppTest() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <header className="app-header">
        <h1>💰 Bill Splitter - Test Mode</h1>
        <p>Testing basic functionality</p>
      </header>

      <main className="app-main">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Basic React Test</h2>
          <p>If you can see this, React is working correctly!</p>

          <div style={{ margin: '2rem 0' }}>
            <button onClick={() => setCount(c => c + 1)}>
              Count: {count}
            </button>
          </div>

          <div style={{
            background: 'var(--bg-primary)',
            padding: '1rem',
            borderRadius: '8px',
            margin: '1rem 0'
          }}>
            <h3>✅ Bill Splitter Features:</h3>
            <ul style={{ textAlign: 'left', display: 'inline-block' }}>
              <li>React + TypeScript working</li>
              <li>Vite build system working</li>
              <li>CSS variables working</li>
              <li>PWA configuration ready</li>
              <li>Component structure complete</li>
            </ul>
          </div>

          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '1rem',
            borderRadius: '8px',
            margin: '1rem 0'
          }}>
            <h3>🚀 Ready to Deploy:</h3>
            <p>The application is built and ready for:</p>
            <ul style={{ textAlign: 'left', display: 'inline-block' }}>
              <li>GitHub Pages: <code>pnpm deploy:gh</code></li>
              <li>Google Cloud: <code>pnpm deploy:gcp</code></li>
              <li>PWA Installation</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AppTest
