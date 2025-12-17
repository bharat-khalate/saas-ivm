import { type FormEvent, useEffect, useState } from 'react'
import { settingsService } from '../services/settingsService'
import type { Settings } from '../services/settingsService'
import { Card, Button, FormField, Alert, Loading, showToast } from '../components'

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    defaultLowStockThreshold: 5,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await settingsService.getSettings()
        setSettings(data)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message ?? 'Failed to load settings')
        } else {
          setError('Failed to load settings')
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      const data = await settingsService.updateSettings(settings)
      setSettings(data)
      setMessage('Settings saved')
      showToast('Settings saved successfully', 'success')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message ?? 'Failed to save settings')
        showToast(err.message ?? 'Failed to save settings', 'error')
      } else {
        setError('Failed to save settings')
        showToast('Failed to save settings', 'error')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full">
        <Loading message="Loading settings..." />
      </div>
    )
  }

  const inputClassName =
    'rounded-xl border border-slate-600/50 bg-slate-900/80 px-3 py-2.5 text-slate-200 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400/60'

  return (
    <div className="w-full">
      <h1 className="mb-6 text-2xl font-semibold">Settings</h1>
      <Card>
        {error && (
          <Alert type="error" className="mb-3">
            {error}
          </Alert>
        )}
        {message && (
          <Alert type="success" className="mb-3">
            {message}
          </Alert>
        )}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <FormField label="Default low stock threshold">
            <input
              type="number"
              value={settings.defaultLowStockThreshold ?? ''}
              onChange={(e) =>
                setSettings({
                  defaultLowStockThreshold:
                    e.target.value === ''
                      ? null
                      : Number(e.target.value),
                })
              }
              className={inputClassName}
            />
          </FormField>
          <Button disabled={saving}>
            {saving ? 'Saving...' : 'Save settings'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
