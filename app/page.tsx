'use client'

import { useEffect, useState } from 'react'
import TradingChart from './components/TradingChart'
import RSIIndicator from './components/RSIIndicator'
import ControlPanel from './components/ControlPanel'
import SignalPanel from './components/SignalPanel'
import { generateMarketData, calculateRSI, calculateSupportResistance } from './utils/trading'

export default function Home() {
  const [marketData, setMarketData] = useState<any[]>([])
  const [rsiData, setRsiData] = useState<number[]>([])
  const [levels, setLevels] = useState<any>(null)
  const [signals, setSignals] = useState<any[]>([])
  const [rsiSettings, setRsiSettings] = useState({
    period: 14,
    overbought: 70,
    oversold: 30,
    smoothing: 1
  })
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    const updateData = () => {
      const data = generateMarketData()
      setMarketData(data)

      const rsi = calculateRSI(data, rsiSettings.period, rsiSettings.smoothing)
      setRsiData(rsi)

      if (data.length > 0) {
        const firstCandle = data[0]
        const srLevels = calculateSupportResistance(firstCandle.high, firstCandle.low)
        setLevels(srLevels)

        const latestPrice = data[data.length - 1].close
        const latestRSI = rsi[rsi.length - 1]
        const newSignals = analyzeSignals(latestPrice, latestRSI, srLevels, rsiSettings)
        setSignals(prev => [...newSignals, ...prev].slice(0, 10))
      }
    }

    updateData()

    if (autoRefresh) {
      const interval = setInterval(updateData, 5000)
      return () => clearInterval(interval)
    }
  }, [rsiSettings, autoRefresh])

  const analyzeSignals = (price: number, rsi: number, levels: any, settings: any) => {
    const signals: any[] = []
    const timestamp = new Date().toLocaleTimeString()

    // Check resistance levels
    levels.resistance.forEach((level: any, index: number) => {
      const diff = Math.abs(price - level.value)
      const threshold = level.value * 0.001

      if (diff < threshold) {
        if (rsi > settings.overbought) {
          signals.push({
            type: 'SELL',
            reason: `Price near ${level.name} (${level.value.toFixed(2)}) with RSI overbought (${rsi.toFixed(2)})`,
            timestamp,
            confidence: 'HIGH'
          })
        } else if (rsi < settings.oversold) {
          signals.push({
            type: 'BUY',
            reason: `Price near ${level.name} (${level.value.toFixed(2)}) with RSI oversold (${rsi.toFixed(2)}) - Potential breakout`,
            timestamp,
            confidence: 'MEDIUM'
          })
        }
      }
    })

    // Check support levels
    levels.support.forEach((level: any, index: number) => {
      const diff = Math.abs(price - level.value)
      const threshold = level.value * 0.001

      if (diff < threshold) {
        if (rsi < settings.oversold) {
          signals.push({
            type: 'BUY',
            reason: `Price near ${level.name} (${level.value.toFixed(2)}) with RSI oversold (${rsi.toFixed(2)})`,
            timestamp,
            confidence: 'HIGH'
          })
        } else if (rsi > settings.overbought) {
          signals.push({
            type: 'SELL',
            reason: `Price near ${level.name} (${level.value.toFixed(2)}) with RSI overbought (${rsi.toFixed(2)}) - Potential breakdown`,
            timestamp,
            confidence: 'MEDIUM'
          })
        }
      }
    })

    return signals
  }

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Nifty 50 AI Trading Agent
          </h1>
          <p className="text-gray-400 mt-2">Real-time support/resistance analysis with RSI confluence detection</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 space-y-4">
            <TradingChart
              data={marketData}
              levels={levels}
              currentRSI={rsiData[rsiData.length - 1]}
            />
            <RSIIndicator
              data={rsiData}
              settings={rsiSettings}
            />
          </div>

          <div className="space-y-4">
            <ControlPanel
              settings={rsiSettings}
              onSettingsChange={setRsiSettings}
              autoRefresh={autoRefresh}
              onAutoRefreshChange={setAutoRefresh}
            />
            <SignalPanel signals={signals} />
          </div>
        </div>
      </div>
    </main>
  )
}
