import { useState } from 'react'
import { Office365UsersService } from './generated/services/Office365UsersService'
import './App.css'

function App() {
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  async function loadProfile() {
    setLoading(true)
    setOutput('')

    try {
      const result = await Office365UsersService.MyProfile_V2(
        'id,displayName,mail,userPrincipalName'
      )

      if (result.success && result.data?.id) {
      setOutput(
        `My profile:\n${JSON.stringify(result.data, null, 2)}`
      )

      const managerResult = await Office365UsersService.Manager_V2(
        result.data.id,
        'id,displayName,mail'
      )

      if (managerResult.success) {
        setOutput(previous =>
          `${previous}\n\nMy manager:\n${JSON.stringify(managerResult.data, null, 2)}`
        )
      } else {
        console.error('Manager lookup failed:', managerResult.error)

        const error = managerResult.error
        const message =
          error instanceof Error
            ? error.message
            : JSON.stringify(
                error,
                error ? Object.getOwnPropertyNames(error) : undefined,
                2
              ) ?? 'Unknown error'

        setOutput(previous =>
          `${previous}\n\nManager lookup failed: ${message}`
        )
      }
    } else {
      console.error('Profile lookup failed:', result.error)
      setOutput('Could not load your profile. Check the browser console.')
    }
    } catch (error) {
      setOutput(
        error instanceof Error ? error.message : String(error)
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <h1>My First Power Apps Code App</h1>

      <button onClick={loadProfile} disabled={loading}>
        {loading ? 'Loading...' : 'Load my profile'}
      </button>

      <pre style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>
        {output}
      </pre>
    </main>
  )
}

export default App
