import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [apiResponse, setApiResponse] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState<string>('')
  const [uploadStatus, setUploadStatus] = useState<string>('')
  const [uploading, setUploading] = useState(false)

  const callAPI = async () => {
    setLoading(true)
    try {
      // Use environment variable if available, otherwise use the deployed Azure Function URL
      const apiUrl = import.meta.env.VITE_API_URL || 'https://azure-mcp-test-fn.azurewebsites.net'
      const response = await fetch(`${apiUrl}/api/hello`)
      const data = await response.json()
      setApiResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setApiResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://azure-mcp-test-fn.azurewebsites.net'
      const content = await file.text()

      const response = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          content: content
        })
      })

      const data = await response.json()
      setUploadStatus(JSON.stringify(data, null, 2))
      setFileName(file.name)
    } catch (error) {
      setUploadStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploading(false)
      event.target.value = ''
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

      <div className="card">
        <h2>Storage & File Upload</h2>
        <p>Upload files to Azure Blob Storage</p>
        <label htmlFor="fileInput" className="file-input-label">
          {uploading ? 'Uploading...' : 'Choose File'}
        </label>
        <input
          id="fileInput"
          type="file"
          onChange={uploadFile}
          disabled={uploading}
          style={{ display: 'none' }}
        />
        {fileName && <p className="file-name">📄 {fileName}</p>}
        {uploadStatus && (
          <pre className="response">
            {uploadStatus}
          </pre>
        )}
      </div>

      <div className="card info">
        <h3>📋 Project Status</h3>
        <ul>
          <li>✅ Frontend deployed</li>
          <li>✅ Backend API</li>
          <li>✅ Storage (Phase 3)</li>
        </ul>
      </div>
    </div>
  )
}

export default App
