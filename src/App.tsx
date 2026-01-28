import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [apiResponse, setApiResponse] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const callAPI = async () => {
    setLoading(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:7071'
      const response = await fetch(`${apiUrl}/api/hello`)
      const data = await response.json()
      setApiResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setApiResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>🚀 Azure MCP Test - Full Stack Demo</h1>

      <div className="card">
        <h2>Frontend Test</h2>
        <p>This is your React frontend running on Azure Static Web App</p>
        <button onClick={() => setCount(count + 1)}>
          Count: {count}
        </button>
      </div>

      <div className="card">
        <h2>Backend API Test</h2>
        <p>Call your Azure Function backend</p>
        <button onClick={callAPI} disabled={loading}>
          {loading ? 'Calling API...' : 'Call API'}
        </button>
        {apiResponse && (
          <pre className="response">
            {apiResponse}
          </pre>
        )}
      </div>

      <div className="card info">
        <h3>📋 Project Status</h3>
        <ul>
          <li>✅ Frontend deployed</li>
          <li>⏳ Backend API (Phase 2)</li>
          <li>⏳ Storage (Phase 3)</li>
        </ul>
      </div>
    </div>
  )
}

export default App
