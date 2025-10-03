'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

/**
 * Example component demonstrating Supabase connection
 * This component shows how to test the Supabase connection
 */
export default function SupabaseExample() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const testConnection = async () => {
      try {
        // Test the connection by trying to access the profiles table
        // This is a better test than auth.getUser() since we don't need authentication
        const { error } = await supabase
          .from('profiles')
          .select('count')
          .limit(1)
        
        if (error) {
          setConnectionStatus('error')
          setError(error.message)
        } else {
          setConnectionStatus('connected')
          setError(null)
        }
      } catch (err) {
        setConnectionStatus('error')
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    }

    testConnection()
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Supabase Connection Status</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="capitalize">checking</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Supabase Connection Status</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'checking' ? 'bg-yellow-500' :
            connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className="capitalize">{connectionStatus}</span>
        </div>
        {error && (
          <div className="text-red-600 text-sm">
            Error: {error}
          </div>
        )}
        {connectionStatus === 'connected' && (
          <div className="text-green-600 text-sm">
            ✅ Successfully connected to Supabase!
          </div>
        )}
      </div>
    </div>
  )
}
