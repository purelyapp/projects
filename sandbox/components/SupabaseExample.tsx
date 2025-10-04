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

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test the connection by fetching the current user
        const { data, error } = await supabase.auth.getUser()
        
        if (error) {
          setConnectionStatus('error')
          setError(error.message)
        } else {
          setConnectionStatus('connected')
        }
      } catch (err) {
        setConnectionStatus('error')
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    }

    testConnection()
  }, [])

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
