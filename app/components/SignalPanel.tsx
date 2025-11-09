'use client'

interface Signal {
  type: string
  reason: string
  timestamp: string
  confidence: string
}

interface SignalPanelProps {
  signals: Signal[]
}

export default function SignalPanel({ signals }: SignalPanelProps) {
  return (
    <div className="bg-[#1a1f3a] rounded-lg p-4 shadow-xl">
      <h2 className="text-xl font-semibold text-white mb-4">AI Signals</h2>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {signals.length === 0 ? (
          <div className="text-gray-400 text-sm text-center py-8">
            No signals detected yet. The AI is monitoring...
          </div>
        ) : (
          signals.map((signal, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-l-4 ${
                signal.type === 'BUY'
                  ? 'bg-green-900/20 border-green-500'
                  : 'bg-red-900/20 border-red-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`font-bold text-lg ${
                    signal.type === 'BUY' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {signal.type}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    signal.confidence === 'HIGH'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}
                >
                  {signal.confidence}
                </span>
              </div>
              <div className="text-sm text-gray-300 mb-2">{signal.reason}</div>
              <div className="text-xs text-gray-500">{signal.timestamp}</div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <div className="text-xs text-blue-400 font-semibold mb-1">AI Analysis Active</div>
        <div className="text-xs text-gray-400">
          Monitoring confluence zones between S/R levels and RSI readings for optimal entry/exit points
        </div>
      </div>
    </div>
  )
}
