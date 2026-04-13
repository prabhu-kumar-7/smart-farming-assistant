import { useState } from 'react'
import API from '../api/axios'
import { useLanguage } from '../context/LanguageContext'
import { WiThermometer, WiHumidity, WiStrongWind, WiRain } from 'react-icons/wi'
import { FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa'

function WeatherPage() {
  const { t } = useLanguage()
  const [farmId, setFarmId]   = useState('')
  const [weather, setWeather] = useState(null)
  const [alert, setAlert]     = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const fetchWeather = async () => {
    if (!farmId) return
    setLoading(true)
    setError(null)
    try {
      const [wRes, aRes] = await Promise.all([
        API.get(`/weather/${farmId}`),
        API.get(`/weather/${farmId}/alerts`),
      ])
      setWeather(wRes.data)
      setAlert(aRes.data)
    } catch {
      setError('Failed to fetch weather. Please check the Farm ID.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = `bg-[#0d1f17] border border-[#1a3a2a] text-white
    placeholder-gray-600 rounded-lg px-4 py-2.5 text-sm
    focus:outline-none focus:border-green-600`

  return (
    <div className="p-6 min-h-screen bg-[#0a1628]">

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          🌤️ {t.weatherTitle}
        </h1>
        <p className="text-gray-400 text-sm mt-1">{t.weatherSubtitle}</p>
      </div>

      <div className="flex gap-3 mb-6">
        <input type="number" value={farmId}
          onChange={e => setFarmId(e.target.value)}
          placeholder={t.enterFarmId}
          className={`${inputClass} w-48`} />
        <button onClick={fetchWeather} disabled={loading}
          className="bg-green-700 hover:bg-green-600 text-white px-6
            py-2.5 rounded-lg text-sm font-semibold transition-colors
            disabled:opacity-50">
          {loading ? t.fetching : t.getWeather}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700
          text-red-400 p-3 rounded-lg text-sm mb-4">{error}</div>
      )}

      {alert && (
        <div className={`p-4 rounded-xl mb-5 flex items-center gap-3 border
          ${alert.severity === 'high'
            ? 'bg-orange-900/30 border-orange-700 text-orange-400'
            : 'bg-green-900/30 border-green-700 text-green-400'}`}>
          {alert.severity === 'high'
            ? <FaExclamationTriangle className="shrink-0" />
            : <FaCheckCircle className="shrink-0" />}
          <p className="text-sm font-medium">{alert.alert}</p>
        </div>
      )}

      {weather && (
        <>
          <div className="bg-[#0d1f17] border border-[#1a3a2a]
            rounded-xl p-5 mb-5 text-center">
            <p className="text-4xl font-bold text-white mb-1">
              {weather.temperature}°C
            </p>
            <p className="text-gray-400 capitalize text-sm">
              {weather.weatherDesc}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <WiThermometer />, val: `${weather.temperature}°C`, label: t.temperature, color: 'text-red-400' },
              { icon: <WiHumidity />,    val: `${weather.humidity}%`,     label: t.humidity,    color: 'text-blue-400' },
              { icon: <WiRain />,        val: `${weather.rainfall}mm`,    label: t.rainfall,    color: 'text-cyan-400' },
              { icon: <WiStrongWind />,  val: `${weather.windSpeed}km/h`, label: t.windSpeed,   color: 'text-gray-400' },
            ].map((card, i) => (
              <div key={i} className="bg-[#0a1628] border border-[#1a3a2a]
                rounded-xl p-5 flex flex-col items-center text-center">
                <div className={`text-5xl mb-2 ${card.color}`}>{card.icon}</div>
                <p className="text-2xl font-bold text-white">{card.val}</p>
                <p className="text-gray-500 text-xs mt-1">{card.label}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {!weather && !loading && (
        <div className="text-center py-16">
          <p className="text-6xl mb-4">🌤️</p>
          <p className="text-gray-500 text-sm">{t.enterFarmIdMsg}</p>
        </div>
      )}
    </div>
  )
}

export default WeatherPage