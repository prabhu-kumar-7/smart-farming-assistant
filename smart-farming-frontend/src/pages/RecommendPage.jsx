import { useState } from 'react'
import API from '../api/axios'
import { useLanguage } from '../context/LanguageContext'
import { FaSeedling, FaTint, FaFlask } from 'react-icons/fa'

function RecommendPage() {
  const { t } = useLanguage()
  const [farmId, setFarmId]   = useState('')
  const [recs, setRecs]       = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const recStyle = {
    crop:       { icon: <FaSeedling />, accent: 'border-green-600',
                  badge: 'bg-green-900/40 text-green-400',  label: t.cropRec       },
    irrigation: { icon: <FaTint />,     accent: 'border-blue-600',
                  badge: 'bg-blue-900/40 text-blue-400',    label: t.irrigationRec },
    fertilizer: { icon: <FaFlask />,    accent: 'border-yellow-600',
                  badge: 'bg-yellow-900/40 text-yellow-400',label: t.fertilizerRec },
  }

  const fetchRecs = async () => {
    if (!farmId) return
    setLoading(true)
    setError(null)
    try {
      const res = await API.post('/recommend', { farmId: parseInt(farmId) })
      setRecs(res.data)
    } catch {
      setError('Failed to get recommendations.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 min-h-screen bg-[#0a1628]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          🌿 {t.recommendTitle}
        </h1>
        <p className="text-gray-400 text-sm mt-1">{t.recommendSubtitle}</p>
      </div>

      <div className="flex gap-3 mb-6">
        <input type="number" value={farmId}
          onChange={e => setFarmId(e.target.value)}
          placeholder={t.enterFarmId}
          className="bg-[#0d1f17] border border-[#1a3a2a] text-white
            placeholder-gray-600 rounded-lg px-4 py-2.5 text-sm
            focus:outline-none focus:border-green-600 w-48" />
        <button onClick={fetchRecs} disabled={loading}
          className="bg-green-700 hover:bg-green-600 text-white px-6
            py-2.5 rounded-lg text-sm font-semibold transition-colors
            disabled:opacity-50">
          {loading ? t.analyzing : t.getAdvice}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700
          text-red-400 p-3 rounded-lg text-sm mb-4">{error}</div>
      )}

      <div className="space-y-4">
        {recs.map((rec, i) => {
          const style = recStyle[rec.recType] || recStyle.crop
          return (
            <div key={i}
              className={`bg-[#0d1f17] border-l-4 ${style.accent}
                border border-[#1a3a2a] rounded-xl p-5`}>
              <div className="flex items-center gap-3 mb-3">
                <span className={`${style.badge} px-3 py-1 rounded-full
                  text-xs font-semibold flex items-center gap-1.5`}>
                  {style.icon}
                  {style.label}
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {rec.message}
              </p>
              <p className="text-gray-600 text-xs mt-3">
                {t.generated}: {new Date(rec.generatedAt).toLocaleString()}
              </p>
            </div>
          )
        })}
      </div>

      {recs.length === 0 && !loading && (
        <div className="text-center py-16">
          <p className="text-6xl mb-4">🌱</p>
          <p className="text-gray-500 text-sm">{t.enterFarmIdRec}</p>
        </div>
      )}
    </div>
  )
}

export default RecommendPage