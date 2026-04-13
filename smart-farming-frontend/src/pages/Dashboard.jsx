import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'
import { useLanguage } from '../context/LanguageContext'
import { FaThermometerHalf, FaTint, FaBell, FaExpandArrowsAlt, FaSeedling, FaLeaf } from 'react-icons/fa'
import { WiRain, WiStrongWind, WiDaySunny } from 'react-icons/wi'

function Dashboard() {
  const { t } = useLanguage()
  const [farms, setFarms]     = useState([])
  const [weather, setWeather] = useState(null)
  const [recs, setRecs]       = useState([])
  const [alerts, setAlerts]   = useState(null)
  const FARM_ID = 1

  useEffect(() => {
    API.get('/farms').then(r => setFarms(r.data)).catch(console.error)
    API.get(`/weather/${FARM_ID}`).then(r => setWeather(r.data)).catch(console.error)
    API.get(`/weather/${FARM_ID}/alerts`).then(r => setAlerts(r.data)).catch(console.error)
    API.get(`/recommend/${FARM_ID}`).then(r => setRecs(r.data.slice(0, 3))).catch(console.error)
  }, [])

  const currentFarm = farms.find(f => f.id === FARM_ID) || {}

  return (
    <div className="p-6 min-h-screen bg-[#0a1628]">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{t.dashboardTitle}</h1>
          <p className="text-gray-400 text-sm mt-0.5">{t.dashboardSubtitle}</p>
        </div>
        <div className="bg-[#0d1f17] border border-green-800
          px-4 py-2 rounded-full text-sm text-green-400">
          Farm ID: {FARM_ID} · {currentFarm.cropType || 'Tamil Nadu'}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">

        <div className="bg-[#0d1f17] border border-[#1a3a2a] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs">{t.temperature}</span>
            <FaThermometerHalf className="text-green-400 text-sm" />
          </div>
          <p className="text-2xl font-bold text-white">
            {weather ? `${weather.temperature}°` : '--°'}
          </p>
          <p className="text-green-400 text-xs mt-1">{t.fromYesterday}</p>
        </div>

        <div className="bg-[#0d1f17] border border-[#1a3a2a] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs">{t.humidity}</span>
            <FaTint className="text-blue-400 text-sm" />
          </div>
          <p className="text-2xl font-bold text-white">
            {weather ? `${weather.humidity}%` : '--%'}
          </p>
          <p className="text-blue-400 text-xs mt-1">{t.stable}</p>
        </div>

        <div className="bg-[#0d1f17] border border-[#1a3a2a] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs">{t.activeAlerts}</span>
            <FaBell className="text-orange-400 text-sm" />
          </div>
          <p className="text-2xl font-bold text-white">
            {alerts?.severity === 'high' ? '3' : '0'}
          </p>
          {alerts?.severity === 'high' ? (
            <Link to="/weather"
              className="text-orange-400 text-xs mt-1 flex items-center gap-1">
              {t.checkNow}
            </Link>
          ) : (
            <p className="text-green-400 text-xs mt-1">{t.allClear}</p>
          )}
        </div>

        <div className="bg-[#0d1f17] border border-[#1a3a2a] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs">{t.farmArea}</span>
            <FaExpandArrowsAlt className="text-purple-400 text-sm" />
          </div>
          <p className="text-2xl font-bold text-white">
            {currentFarm.areaAcres ? `${currentFarm.areaAcres}ac` : `${farms.length}`}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            {currentFarm.soilType || 'Loamy'} · {currentFarm.cropType || 'Rice'}
          </p>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-2 gap-6">

        {/* Live Weather */}
        <div className="bg-[#0d1f17] border border-[#1a3a2a] rounded-xl p-5">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-4">
            {t.liveWeather}
          </p>
          {weather ? (
            <>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-5xl font-bold text-white">
                  {Math.round(weather.temperature)}°C
                </span>
              </div>
              <p className="text-gray-400 text-sm capitalize mb-4">
                {weather.weatherDesc}
              </p>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <WiRain className="text-blue-400 text-xl" />
                  <div>
                    <p className="text-white text-sm font-medium">
                      {weather.rainfall}mm
                    </p>
                    <p className="text-gray-500 text-xs">{t.rainfall}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <WiStrongWind className="text-gray-400 text-xl" />
                  <div>
                    <p className="text-white text-sm font-medium">
                      {weather.windSpeed}km/h
                    </p>
                    <p className="text-gray-500 text-xs">{t.windSpeed}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <WiDaySunny className="text-yellow-400 text-xl" />
                  <div>
                    <p className="text-white text-sm font-medium">Moderate</p>
                    <p className="text-gray-500 text-xs">UV</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-sm">Loading...</p>
          )}
        </div>

        {/* AI Recommendations */}
        <div className="bg-[#0d1f17] border border-[#1a3a2a] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-xs uppercase tracking-wider">
              {t.aiRecommendations}
            </p>
            <Link to="/recommend"
              className="text-green-400 text-xs hover:underline">
              {t.viewAll}
            </Link>
          </div>
          {recs.length > 0 ? (
            <div className="space-y-3">
              {recs.map((rec, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={`mt-1 w-2 h-2 rounded-full shrink-0
                    ${rec.recType === 'crop' ? 'bg-green-400'
                      : rec.recType === 'irrigation' ? 'bg-blue-400'
                      : 'bg-yellow-400'}`} />
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {rec.message.length > 70
                      ? rec.message.slice(0, 70) + '...'
                      : rec.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <FaSeedling className="text-green-600 text-3xl mx-auto mb-2" />
              <p className="text-gray-500 text-sm">{t.noRecommendations}</p>
              <Link to="/recommend"
                className="text-green-400 text-xs hover:underline">
                {t.generateAdvice}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Farms List */}
      {farms.length > 0 && (
        <div className="mt-6 bg-[#0d1f17] border border-[#1a3a2a] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-xs uppercase tracking-wider">
              {t.registeredFarms} ({farms.length})
            </p>
            <Link to="/farm"
              className="text-green-400 text-xs hover:underline">
              {t.addFarm}
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {farms.map(farm => (
              <div key={farm.id}
                className="bg-[#0a1628] border border-[#1a3a2a] rounded-lg p-3
                  hover:border-green-700 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <FaLeaf className="text-green-500 text-xs" />
                  <p className="text-white text-sm font-semibold">
                    {farm.farmName}
                  </p>
                </div>
                <p className="text-gray-500 text-xs">
                  {farm.soilType} · {farm.cropType}
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  {farm.areaAcres} acres
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard