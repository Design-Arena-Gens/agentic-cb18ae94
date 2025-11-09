'use client'

import { useEffect, useRef } from 'react'
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts'

interface TradingChartProps {
  data: any[]
  levels: any
  currentRSI: number
}

export default function TradingChart({ data, levels, currentRSI }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#1a1f3a' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#2a2e4a' },
        horzLines: { color: '#2a2e4a' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    })

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    })

    chartRef.current = chart
    candleSeriesRef.current = candleSeries

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [])

  useEffect(() => {
    if (!candleSeriesRef.current || !data.length) return

    const chartData = data.map(d => ({
      time: d.time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }))

    candleSeriesRef.current.setData(chartData)

    if (levels && chartRef.current) {
      // Draw resistance levels
      levels.resistance.forEach((level: any) => {
        candleSeriesRef.current!.createPriceLine({
          price: level.value,
          color: '#ef5350',
          lineWidth: 2,
          lineStyle: 2,
          axisLabelVisible: true,
          title: level.name,
        })
      })

      // Draw support levels
      levels.support.forEach((level: any) => {
        candleSeriesRef.current!.createPriceLine({
          price: level.value,
          color: '#26a69a',
          lineWidth: 2,
          lineStyle: 2,
          axisLabelVisible: true,
          title: level.name,
        })
      })
    }
  }, [data, levels])

  return (
    <div className="bg-[#1a1f3a] rounded-lg p-4 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Nifty 50 Chart</h2>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#ef5350] rounded"></div>
            <span className="text-gray-300">Resistance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#26a69a] rounded"></div>
            <span className="text-gray-300">Support</span>
          </div>
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full" />
      {data.length > 0 && (
        <div className="mt-4 grid grid-cols-5 gap-4 text-sm">
          <div>
            <div className="text-gray-400">Open</div>
            <div className="text-white font-semibold">{data[data.length - 1].open.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-gray-400">High</div>
            <div className="text-green-400 font-semibold">{data[data.length - 1].high.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-gray-400">Low</div>
            <div className="text-red-400 font-semibold">{data[data.length - 1].low.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-gray-400">Close</div>
            <div className="text-white font-semibold">{data[data.length - 1].close.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-gray-400">RSI</div>
            <div className={`font-semibold ${currentRSI > 70 ? 'text-red-400' : currentRSI < 30 ? 'text-green-400' : 'text-yellow-400'}`}>
              {currentRSI ? currentRSI.toFixed(2) : 'N/A'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
