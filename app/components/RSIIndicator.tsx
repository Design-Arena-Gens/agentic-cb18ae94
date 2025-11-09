'use client'

import { useEffect, useRef } from 'react'
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts'

interface RSIIndicatorProps {
  data: number[]
  settings: {
    period: number
    overbought: number
    oversold: number
    smoothing: number
  }
}

export default function RSIIndicator({ data, settings }: RSIIndicatorProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const rsiSeriesRef = useRef<ISeriesApi<'Line'> | null>(null)

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
      height: 200,
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    })

    const rsiSeries = chart.addLineSeries({
      color: '#2962FF',
      lineWidth: 2,
    })

    chartRef.current = chart
    rsiSeriesRef.current = rsiSeries

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
    if (!rsiSeriesRef.current || !data.length) return

    const now = Math.floor(Date.now() / 1000)
    const chartData = data.map((value, index) => ({
      time: (now - (data.length - index) * 300) as any,
      value: value,
    }))

    rsiSeriesRef.current.setData(chartData as any)

    if (chartRef.current) {
      // Overbought line
      rsiSeriesRef.current.createPriceLine({
        price: settings.overbought,
        color: '#ef5350',
        lineWidth: 1,
        lineStyle: 2,
        axisLabelVisible: true,
        title: 'OB',
      })

      // Oversold line
      rsiSeriesRef.current.createPriceLine({
        price: settings.oversold,
        color: '#26a69a',
        lineWidth: 1,
        lineStyle: 2,
        axisLabelVisible: true,
        title: 'OS',
      })

      // Middle line
      rsiSeriesRef.current.createPriceLine({
        price: 50,
        color: '#666',
        lineWidth: 1,
        lineStyle: 3,
        axisLabelVisible: false,
      })
    }
  }, [data, settings])

  return (
    <div className="bg-[#1a1f3a] rounded-lg p-4 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">RSI Indicator</h2>
        <div className="text-sm text-gray-400">
          Period: {settings.period} | OB: {settings.overbought} | OS: {settings.oversold}
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  )
}
