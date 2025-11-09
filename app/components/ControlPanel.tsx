'use client'

interface ControlPanelProps {
  settings: {
    period: number
    overbought: number
    oversold: number
    smoothing: number
  }
  onSettingsChange: (settings: any) => void
  autoRefresh: boolean
  onAutoRefreshChange: (value: boolean) => void
}

export default function ControlPanel({
  settings,
  onSettingsChange,
  autoRefresh,
  onAutoRefreshChange,
}: ControlPanelProps) {
  const handleChange = (key: string, value: number) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  return (
    <div className="bg-[#1a1f3a] rounded-lg p-4 shadow-xl">
      <h2 className="text-xl font-semibold text-white mb-4">Control Panel</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">RSI Period</label>
          <input
            type="range"
            min="5"
            max="50"
            value={settings.period}
            onChange={(e) => handleChange('period', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-right text-sm text-white mt-1">{settings.period}</div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Overbought Threshold</label>
          <input
            type="range"
            min="60"
            max="90"
            value={settings.overbought}
            onChange={(e) => handleChange('overbought', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-right text-sm text-white mt-1">{settings.overbought}</div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Oversold Threshold</label>
          <input
            type="range"
            min="10"
            max="40"
            value={settings.oversold}
            onChange={(e) => handleChange('oversold', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-right text-sm text-white mt-1">{settings.oversold}</div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Smoothing Factor</label>
          <input
            type="range"
            min="1"
            max="10"
            value={settings.smoothing}
            onChange={(e) => handleChange('smoothing', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-right text-sm text-white mt-1">{settings.smoothing}</div>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => onAutoRefreshChange(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-400">Auto Refresh (5s)</span>
          </label>
        </div>

        <div className="pt-4 space-y-2 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>Status:</span>
            <span className={autoRefresh ? 'text-green-400' : 'text-red-400'}>
              {autoRefresh ? '● Live' : '○ Paused'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
