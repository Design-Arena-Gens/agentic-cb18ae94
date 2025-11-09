// Generate realistic market data for Nifty 50
export function generateMarketData() {
  const data: any[] = []
  const now = Math.floor(Date.now() / 1000)
  const basePrice = 22000 // Nifty 50 base price
  let currentPrice = basePrice + (Math.random() - 0.5) * 200

  // Generate 100 5-minute candles
  for (let i = 0; i < 100; i++) {
    const time = now - (100 - i) * 300 // 5 minutes = 300 seconds

    const volatility = 50
    const change = (Math.random() - 0.5) * volatility
    currentPrice += change

    const high = currentPrice + Math.random() * 30
    const low = currentPrice - Math.random() * 30
    const open: number = i === 0 ? currentPrice : data[i - 1].close
    const close = currentPrice

    data.push({
      time,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
    })
  }

  return data
}

// Calculate support and resistance levels based on first 5-minute candle
export function calculateSupportResistance(A: number, B: number) {
  // Resistance levels (Red)
  const A1 = A + A * 0.0009
  const A2 = A1 + A1 * 0.0018
  const A3 = A2 + A2 * 0.0036
  const A4 = A3 + A3 * 0.0072

  // Support levels (Green)
  const B1 = B - B * 0.0009
  const B2 = B1 - B1 * 0.0018
  const B3 = B2 - B2 * 0.0036
  const B4 = B3 - B3 * 0.0072

  return {
    base: { high: A, low: B },
    resistance: [
      { name: 'A', value: A },
      { name: 'A1', value: A1 },
      { name: 'A2', value: A2 },
      { name: 'A3', value: A3 },
      { name: 'A4', value: A4 },
    ],
    support: [
      { name: 'B', value: B },
      { name: 'B1', value: B1 },
      { name: 'B2', value: B2 },
      { name: 'B3', value: B3 },
      { name: 'B4', value: B4 },
    ],
  }
}

// Calculate RSI with smoothing
export function calculateRSI(data: any[], period: number = 14, smoothing: number = 1) {
  if (data.length < period + 1) return []

  const rsiValues: number[] = []
  const changes: number[] = []

  // Calculate price changes
  for (let i = 1; i < data.length; i++) {
    changes.push(data[i].close - data[i - 1].close)
  }

  // Calculate initial average gain and loss
  let avgGain = 0
  let avgLoss = 0

  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) {
      avgGain += changes[i]
    } else {
      avgLoss += Math.abs(changes[i])
    }
  }

  avgGain /= period
  avgLoss /= period

  // Calculate RSI for each point
  for (let i = period; i < changes.length; i++) {
    const change = changes[i]

    if (change > 0) {
      avgGain = (avgGain * (period - 1) + change) / period
      avgLoss = (avgLoss * (period - 1)) / period
    } else {
      avgGain = (avgGain * (period - 1)) / period
      avgLoss = (avgLoss * (period - 1) + Math.abs(change)) / period
    }

    const rs = avgGain / (avgLoss === 0 ? 1 : avgLoss)
    const rsi = 100 - 100 / (1 + rs)

    rsiValues.push(rsi)
  }

  // Apply smoothing if needed
  if (smoothing > 1) {
    return applySmoothing(rsiValues, smoothing)
  }

  return rsiValues
}

// Apply simple moving average smoothing
function applySmoothing(data: number[], period: number): number[] {
  const smoothed: number[] = []

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      smoothed.push(data[i])
    } else {
      let sum = 0
      for (let j = 0; j < period; j++) {
        sum += data[i - j]
      }
      smoothed.push(sum / period)
    }
  }

  return smoothed
}

// Detect confluence zones (areas where S/R levels align with RSI conditions)
export function detectConfluence(
  price: number,
  rsi: number,
  levels: any,
  rsiSettings: any
) {
  const confluenceZones = []

  // Check each resistance level
  for (const level of levels.resistance) {
    const distance = Math.abs(price - level.value)
    const threshold = level.value * 0.002 // 0.2% threshold

    if (distance < threshold) {
      if (rsi > rsiSettings.overbought) {
        confluenceZones.push({
          type: 'BEARISH',
          level: level.name,
          price: level.value,
          rsi,
          strength: 'STRONG',
        })
      } else if (rsi > 60) {
        confluenceZones.push({
          type: 'BEARISH',
          level: level.name,
          price: level.value,
          rsi,
          strength: 'MODERATE',
        })
      }
    }
  }

  // Check each support level
  for (const level of levels.support) {
    const distance = Math.abs(price - level.value)
    const threshold = level.value * 0.002

    if (distance < threshold) {
      if (rsi < rsiSettings.oversold) {
        confluenceZones.push({
          type: 'BULLISH',
          level: level.name,
          price: level.value,
          rsi,
          strength: 'STRONG',
        })
      } else if (rsi < 40) {
        confluenceZones.push({
          type: 'BULLISH',
          level: level.name,
          price: level.value,
          rsi,
          strength: 'MODERATE',
        })
      }
    }
  }

  return confluenceZones
}
