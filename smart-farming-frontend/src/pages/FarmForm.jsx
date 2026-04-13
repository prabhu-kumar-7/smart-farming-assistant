import { useState } from 'react'
import API from '../api/axios'
import { FaMapMarkerAlt, FaLeaf } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'

// Keys are always English — used for DB + district lookup
// Translated names come from translations.js
const stateDistricts = {
  "Tamil Nadu": [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli",
    "Salem", "Tirunelveli", "Vellore", "Erode", "Thanjavur",
    "Dindigul", "Tiruppur", "Kancheepuram", "Krishnagiri",
    "Namakkal", "Cuddalore", "Villupuram", "Pudukottai",
    "Ramanathapuram", "Virudhunagar", "Theni"
  ],
  "Karnataka": [
    "Bangalore Urban", "Mysuru", "Hubli-Dharwad", "Mangaluru",
    "Belagavi", "Kalaburagi", "Ballari", "Vijayapura",
    "Shivamogga", "Tumkur", "Raichur", "Bidar", "Hassan",
    "Chitradurga", "Udupi", "Chikkamagaluru", "Mandya"
  ],
  "Kerala": [
    "Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur",
    "Kollam", "Palakkad", "Alappuzha", "Kannur", "Kottayam",
    "Malappuram", "Kasaragod", "Pathanamthitta", "Idukki", "Wayanad"
  ],
  "Andhra Pradesh": [
    "Visakhapatnam", "Vijayawada", "Guntur", "Nellore",
    "Kurnool", "Tirupati", "Rajahmundry", "Kakinada",
    "Anantapur", "Kadapa", "Ongole", "Eluru", "Srikakulam",
    "Vizianagaram", "Chittoor"
  ],
  "Telangana": [
    "Hyderabad", "Warangal", "Nizamabad", "Karimnagar",
    "Khammam", "Mahbubnagar", "Nalgonda", "Adilabad",
    "Medak", "Rangareddy", "Sangareddy", "Siddipet"
  ],
  "Maharashtra": [
    "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad",
    "Solapur", "Kolhapur", "Amravati", "Satara", "Latur",
    "Jalgaon", "Akola", "Osmanabad", "Ratnagiri", "Sangli"
  ],
  "Gujarat": [
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar",
    "Jamnagar", "Junagadh", "Anand", "Gandhinagar", "Mehsana",
    "Kutch", "Banaskantha", "Patan", "Sabarkantha"
  ],
  "Rajasthan": [
    "Jaipur", "Jodhpur", "Kota", "Bikaner", "Udaipur",
    "Ajmer", "Bhilwara", "Alwar", "Bharatpur", "Sikar",
    "Pali", "Sri Ganganagar", "Tonk", "Barmer", "Jaisalmer"
  ],
  "Uttar Pradesh": [
    "Lucknow", "Kanpur", "Agra", "Varanasi", "Allahabad",
    "Meerut", "Bareilly", "Aligarh", "Moradabad", "Gorakhpur",
    "Mathura", "Firozabad", "Muzaffarnagar", "Saharanpur"
  ],
  "Punjab": [
    "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda",
    "Hoshiarpur", "Gurdaspur", "Fatehgarh Sahib", "Moga",
    "Sangrur", "Faridkot", "Ferozepur", "Nawanshahr"
  ],
  "Haryana": [
    "Gurugram", "Faridabad", "Hisar", "Rohtak", "Panipat",
    "Ambala", "Karnal", "Sonipat", "Yamunanagar", "Bhiwani",
    "Sirsa", "Jhajjar", "Jind", "Fatehabad"
  ],
  "West Bengal": [
    "Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri",
    "Bardhaman", "Malda", "Murshidabad", "Jalpaiguri",
    "Cooch Behar", "Nadia", "Bankura", "Purulia", "Birbhum"
  ],
  "Madhya Pradesh": [
    "Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain",
    "Sagar", "Dewas", "Satna", "Ratlam", "Rewa",
    "Singrauli", "Burhanpur", "Khandwa", "Chhindwara"
  ],
  "Bihar": [
    "Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Munger",
    "Darbhanga", "Purnia", "Arrah", "Begusarai", "Katihar",
    "Chapra", "Sitamarhi", "Samastipur", "Hajipur"
  ],
  "Odisha": [
    "Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur",
    "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada",
    "Jharsuguda", "Koraput", "Rayagada", "Kendujhar"
  ],
}

function FarmForm() {
  // ── Language hook — all text comes from translations.js ───
  const { t } = useLanguage()

  const [form, setForm] = useState({
    farmerName: '', phone: '', email: '',
    state: '', district: '', localLocation: '',
    farmName: '', soilType: '', cropType: '',
    areaAcres: '', latitude: '', longitude: '',
  })

  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  // Get districts for selected state — always English keys
  const districts = form.state ? stateDistricts[form.state] || [] : []

  const handleChange = e => {
    const { name, value } = e.target
    // Reset district + village when state changes
    if (name === 'state') {
      setForm({ ...form, state: value, district: '', localLocation: '' })
      return
    }
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    // Build combined location string for DB
    const locationString =
      `${form.localLocation}, ${form.district}, ${form.state}`

    try {
      const payload = {
        farmerName: form.farmerName,
        phone:      form.phone,
        email:      form.email,
        location:   locationString,   // e.g. "Ukkadam, Coimbatore, Tamil Nadu"
        farmName:   form.farmName,
        soilType:   form.soilType,
        cropType:   form.cropType,
        areaAcres:  form.areaAcres,
        latitude:   form.latitude,
        longitude:  form.longitude,
      }

      const res = await API.post('/farm', payload)
      setMessage({
        type: 'success',
        text: `${t.successMsg} ${res.data.farmId} | ${locationString}`
      })

      // Reset form after success
      setForm({
        farmerName: '', phone: '', email: '',
        state: '', district: '', localLocation: '',
        farmName: '', soilType: '', cropType: '',
        areaAcres: '', latitude: '', longitude: '',
      })
    } catch {
      setMessage({ type: 'error', text: t.errorMsg })
    } finally {
      setLoading(false)
    }
  }

  // ── Reusable styles ───────────────────────────────────────
  const inputClass = `w-full bg-[#0a1628] border border-[#1a3a2a]
    rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600
    focus:outline-none focus:border-green-600 transition-colors`

  const labelClass = "text-xs text-gray-400 mb-1 block"

  const sectionTitle = `text-green-400 text-xs font-semibold uppercase
    tracking-wider mb-4 pb-2 border-b border-[#1a3a2a]`

  return (
    <div className="p-6 min-h-screen bg-[#0a1628]">

      {/* ── Page Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FaLeaf className="text-green-500" />
          {t.registerFarm}
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          {t.registerSubtitle}
        </p>
      </div>

      {/* ── Success / Error Message ── */}
      {message && (
        <div className={`p-3 rounded-lg mb-5 text-sm font-medium border
          ${message.type === 'success'
            ? 'bg-green-900/30 border-green-700 text-green-400'
            : 'bg-red-900/30 border-red-700 text-red-400'}`}>
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-[#0d1f17] border border-[#1a3a2a] rounded-xl p-6 space-y-5"
      >

        {/* ══ SECTION 1: Farmer Information ══ */}
        <div>
          <p className={sectionTitle}>{t.farmerInfo}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t.fullName} *</label>
              <input
                name="farmerName"
                value={form.farmerName}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Ravi Kumar"
              />
            </div>
            <div>
              <label className={labelClass}>{t.phone} *</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="9876543210"
              />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>{t.email}</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                className={inputClass}
                placeholder="ravi@farm.com"
              />
            </div>
          </div>
        </div>

        {/* ══ SECTION 2: Location ══ */}
        <div>
          <p className={sectionTitle}>
            <FaMapMarkerAlt className="inline mr-1" />
            {t.locationSection}
          </p>

          <div className="grid grid-cols-3 gap-4">

            {/* State — displays translated, stores English key */}
            <div>
              <label className={labelClass}>{t.selectState} *</label>
              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">{t.selectState}</option>
                {Object.keys(stateDistricts).sort().map(stateKey => (
                  <option key={stateKey} value={stateKey}>
                    {/* Show translated name, keep English key as value */}
                    {t.states?.[stateKey] || stateKey}
                  </option>
                ))}
              </select>
            </div>

            {/* District — disabled until state is selected */}
            <div>
              <label className={labelClass}>{t.selectDistrict} *</label>
              <select
                name="district"
                value={form.district}
                onChange={handleChange}
                required
                disabled={!form.state}
                className={`${inputClass}
                  ${!form.state ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <option value="">
                  {form.state ? t.selectDistrict : t.selectStateFirst}
                </option>
                {districts.map(districtKey => (
                  <option key={districtKey} value={districtKey}>
                    {/* Show translated name, keep English key as value */}
                    {t.districts?.[districtKey] || districtKey}
                  </option>
                ))}
              </select>
            </div>

            {/* Village / Town — disabled until district is selected */}
            <div>
              <label className={labelClass}>{t.villageTown} *</label>
              <input
                name="localLocation"
                value={form.localLocation}
                onChange={handleChange}
                required
                disabled={!form.district}
                className={`${inputClass}
                  ${!form.district ? 'opacity-40 cursor-not-allowed' : ''}`}
                placeholder={
                  form.district
                    ? `${t.villageTown}...`
                    : t.selectDistrictFirst
                }
              />
            </div>
          </div>

          {/* Location Preview — only shows when all 3 are filled */}
          {form.state && form.district && form.localLocation && (
            <div className="mt-3 bg-[#0a1628] border border-green-800
              rounded-lg px-3 py-2 text-xs text-green-400">
              {t.fullLocation}: {form.localLocation},{' '}
              {t.districts?.[form.district] || form.district},{' '}
              {t.states?.[form.state] || form.state}
            </div>
          )}
        </div>

        {/* ══ SECTION 3: Farm Details ══ */}
        <div>
          <p className={sectionTitle}>{t.farmDetails}</p>
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className={labelClass}>{t.farmName} *</label>
              <input
                name="farmName"
                value={form.farmName}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Green Valley Farm"
              />
            </div>

            <div>
              <label className={labelClass}>{t.areaAcres}</label>
              <input
                name="areaAcres"
                type="number"
                value={form.areaAcres}
                onChange={handleChange}
                className={inputClass}
                placeholder="5.5"
              />
            </div>

            {/* Soil Type — translated options */}
            <div>
              <label className={labelClass}>{t.soilType} *</label>
              <select
                name="soilType"
                value={form.soilType}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">{t.selectSoil}</option>
                <option value="loamy">{t.soilLoamy}</option>
                <option value="sandy">{t.soilSandy}</option>
                <option value="clay">{t.soilClay}</option>
                <option value="silt">{t.soilSilt}</option>
              </select>
            </div>

            {/* Crop Type — translated options */}
            <div>
              <label className={labelClass}>{t.cropType}</label>
              <select
                name="cropType"
                value={form.cropType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">{t.selectCrop}</option>
                <option value="rice">{t.cropRice}</option>
                <option value="wheat">{t.cropWheat}</option>
                <option value="maize">{t.cropMaize}</option>
                <option value="sugarcane">{t.cropSugarcane}</option>
                <option value="groundnut">{t.cropGroundnut}</option>
                <option value="millet">{t.cropMillet}</option>
              </select>
            </div>
          </div>
        </div>

        {/* ══ SECTION 4: GPS Coordinates ══ */}
        <div>
          <p className={sectionTitle}>📍 {t.gpsCoords}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t.latitude}</label>
              <input
                name="latitude"
                type="number"
                step="any"
                value={form.latitude}
                onChange={handleChange}
                className={inputClass}
                placeholder="11.0168"
              />
            </div>
            <div>
              <label className={labelClass}>{t.longitude}</label>
              <input
                name="longitude"
                type="number"
                step="any"
                value={form.longitude}
                onChange={handleChange}
                className={inputClass}
                placeholder="76.9558"
              />
            </div>
          </div>
          <p className="text-gray-600 text-xs mt-2">{t.gpsHint}</p>
        </div>

        {/* ══ Submit Button ══ */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-700 hover:bg-green-600 text-white
            font-semibold py-3 rounded-lg transition-colors
            disabled:opacity-50 text-sm"
        >
          {loading ? t.registering : t.registerBtn}
        </button>

      </form>
    </div>
  )
}

export default FarmForm