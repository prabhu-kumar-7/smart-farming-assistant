import { useState, useRef, useEffect } from 'react'
import API from '../api/axios'
import { useLanguage } from '../context/LanguageContext'
import {
  FaRobot, FaUser, FaPaperPlane, FaLeaf,
  FaMicrophone, FaMicrophoneSlash,
  FaVolumeUp, FaVolumeMute
} from 'react-icons/fa'

function ChatPage() {
  const { t } = useLanguage()

  const [farmId, setFarmId]       = useState('')
  const [input, setInput]         = useState('')
  const [messages, setMessages]   = useState([
    { role: 'ai', text: t.welcomeMsg }
  ])
  const [loading, setLoading]     = useState(false)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking]   = useState(false)
  const [voiceOn, setVoiceOn]     = useState(true)

  const bottomRef      = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Update welcome message when language changes
  useEffect(() => {
    setMessages([{ role: 'ai', text: t.welcomeMsg }])
  }, [t])

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Voice input not supported. Please use Chrome or Edge.')
      return
    }
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.lang = 'en-IN'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.onstart  = () => setListening(true)
    recognition.onresult = (e) => {
      setInput(e.results[0][0].transcript)
      setListening(false)
    }
    recognition.onerror  = () => setListening(false)
    recognition.onend    = () => setListening(false)
    recognition.start()
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  const speakText = (text) => {
    if (!voiceOn) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang   = 'en-IN'
    utterance.rate   = 0.95
    utterance.onstart = () => setSpeaking(true)
    utterance.onend   = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }

  const sendMessage = async (text) => {
    const query = text || input.trim()
    if (!query || !farmId) {
      if (!farmId) alert(t.noFarmId)
      return
    }
    setMessages(prev => [...prev, { role: 'user', text: query }])
    setInput('')
    setLoading(true)
    try {
      const res = await API.post('/chat', {
        farmId: parseInt(farmId),
        userQuery: query,
      })
      const reply = res.data.reply
      setMessages(prev => [...prev, { role: 'ai', text: reply }])
      speakText(reply)
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: t.errorReply }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const suggestions = [t.q1, t.q2, t.q3, t.q4]

  return (
    <div className="flex flex-col h-screen bg-[#0a1628] p-6 gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FaRobot className="text-green-400" />
            {t.chatTitle}
          </h1>
          <p className="text-gray-400 text-sm mt-1">{t.chatSubtitle}</p>
        </div>
        <button
          onClick={() => { setVoiceOn(!voiceOn); if (speaking) stopSpeaking() }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg
            text-sm font-medium border transition-colors
            ${voiceOn
              ? 'bg-green-900/40 border-green-700 text-green-400'
              : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
          {voiceOn
            ? <><FaVolumeUp /> {t.voiceOn}</>
            : <><FaVolumeMute /> {t.voiceOff}</>}
        </button>
      </div>

      {/* Farm ID */}
      <input type="number" value={farmId}
        onChange={e => setFarmId(e.target.value)}
        placeholder={t.farmIdPlaceholder}
        className="bg-[#0d1f17] border border-[#1a3a2a] text-white
          placeholder-gray-600 rounded-lg px-4 py-2.5 text-sm
          focus:outline-none focus:border-green-600" />

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => sendMessage(s)}
              className="bg-[#0d1f17] border border-[#1a3a2a]
                text-gray-300 text-xs px-3 py-1.5 rounded-full
                hover:border-green-600 hover:text-green-400
                transition-colors flex items-center gap-1">
              <FaLeaf className="text-green-600 text-[10px]" />
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto chat-scroll bg-[#0d1f17]
        border border-[#1a3a2a] rounded-xl p-4 space-y-4">

        {messages.map((msg, i) => (
          <div key={i}
            className={`flex items-start gap-3
              ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`p-2 rounded-full text-white text-xs shrink-0
              ${msg.role === 'user'
                ? 'bg-green-700'
                : 'bg-[#1a3a2a] border border-green-800'}`}>
              {msg.role === 'user'
                ? <FaUser />
                : <FaRobot className="text-green-400" />}
            </div>
            <div className={`max-w-[75%] rounded-2xl px-4 py-3
              text-sm leading-relaxed
              ${msg.role === 'user'
                ? 'bg-green-700 text-white rounded-tr-none'
                : 'bg-[#0a1628] border border-[#1a3a2a] text-gray-300 rounded-tl-none'}`}>
              {msg.text}
              {msg.role === 'ai' && (
                <button onClick={() => speakText(msg.text)}
                  className="mt-2 flex items-center gap-1 text-xs
                    text-green-600 hover:text-green-400 transition-colors">
                  <FaVolumeUp className="text-[10px]" />
                  {t.readAloud}
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-[#1a3a2a] border border-green-800">
              <FaRobot className="text-green-400 text-xs" />
            </div>
            <div className="bg-[#0a1628] border border-[#1a3a2a]
              rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:0.1s]" />
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}

        {speaking && (
          <div className="flex items-center gap-2 text-green-400 text-xs">
            <FaVolumeUp className="animate-pulse" />
            <span>{t.speaking}</span>
            <button onClick={stopSpeaking}
              className="text-red-400 hover:text-red-300 ml-2">
              {t.stop}
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Row */}
      <div className="flex gap-3">
        <button
          onClick={listening ? stopListening : startListening}
          className={`px-4 rounded-xl transition-colors flex items-center
            justify-center border
            ${listening
              ? 'bg-red-700 border-red-600 text-white animate-pulse'
              : 'bg-[#0d1f17] border-[#1a3a2a] text-gray-400 hover:border-green-600'}`}>
          {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>
        <textarea value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={listening ? t.listeningPlaceholder : t.chatPlaceholder}
          rows={2}
          className="flex-1 bg-[#0d1f17] border border-[#1a3a2a] text-white
            placeholder-gray-600 rounded-xl px-4 py-3 text-sm resize-none
            focus:outline-none focus:border-green-600" />
        <button onClick={() => sendMessage()}
          disabled={loading || !input.trim() || !farmId}
          className="bg-green-700 hover:bg-green-600 text-white px-5
            rounded-xl transition-colors disabled:opacity-40
            flex items-center justify-center">
          <FaPaperPlane />
        </button>
      </div>

      <p className="text-xs text-gray-600 text-center">{t.chatHint}</p>
    </div>
  )
}

export default ChatPage