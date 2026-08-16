import React, { useEffect, useRef, useState } from 'react'

const getSpeechRecognition = () => {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

const joinTranscript = (existingValue, transcript) => {
  const existing = existingValue.trimEnd()
  const spoken = transcript.trim()
  if (!spoken) return existingValue
  return existing ? `${existing} ${spoken}` : spoken
}

export default function VoiceInputButton({ value, onChange, label = 'your response' }) {
  const recognitionRef = useRef(null)
  const startingValueRef = useRef('')
  const [isSupported, setIsSupported] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setIsSupported(Boolean(getSpeechRecognition()))
    return () => {
      const activeRecognition = recognitionRef.current
      recognitionRef.current = null
      activeRecognition?.abort()
    }
  }, [])

  const stopListening = () => {
    recognitionRef.current?.stop()
    setIsListening(false)
    setMessage('Voice added. You can edit the text before continuing.')
  }

  const startListening = () => {
    const SpeechRecognition = getSpeechRecognition()
    if (!SpeechRecognition) return

    recognitionRef.current?.abort()
    const recognition = new SpeechRecognition()
    let endedWithError = false
    recognitionRef.current = recognition
    startingValueRef.current = value
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      if (recognitionRef.current !== recognition) return
      setIsListening(true)
      setMessage(`Listening for ${label}…`)
    }

    recognition.onresult = (event) => {
      if (recognitionRef.current !== recognition) return
      let transcript = ''
      for (let index = 0; index < event.results.length; index += 1) {
        transcript += event.results[index][0].transcript
      }
      onChange(joinTranscript(startingValueRef.current, transcript))
    }

    recognition.onerror = (event) => {
      if (recognitionRef.current !== recognition) return
      endedWithError = event.error !== 'aborted'
      setIsListening(false)
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setMessage('Microphone access was blocked. You can keep typing instead.')
      } else if (event.error === 'audio-capture') {
        setMessage('No microphone was found. You can keep typing instead.')
      } else if (event.error === 'no-speech') {
        setMessage("I didn't hear anything. Try again or keep typing.")
      } else if (event.error !== 'aborted') {
        setMessage('Voice input paused. You can try again or keep typing.')
      }
    }

    recognition.onend = () => {
      if (recognitionRef.current !== recognition) return
      setIsListening(false)
      recognitionRef.current = null
      if (!endedWithError) setMessage('Voice added. You can edit the text before continuing.')
    }

    setMessage('Starting microphone…')
    try {
      recognition.start()
    } catch {
      recognitionRef.current = null
      setIsListening(false)
      setMessage('Voice input could not start. You can try again or keep typing.')
    }
  }

  if (!isSupported) return null

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        aria-pressed={isListening}
        aria-label={isListening ? `Stop voice input for ${label}` : `Start voice input for ${label}`}
        onClick={isListening ? stopListening : startListening}
        className={`inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-full border px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${isListening ? 'border-accent bg-accent text-white' : 'border-line bg-white/80 text-ink hover:border-accent/40 hover:text-accent'}`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="8.5" y="3" width="7" height="12" rx="3.5" />
          <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M9 21h6" strokeLinecap="round" />
        </svg>
        {isListening ? 'Stop listening' : 'Speak my response'}
        {isListening && <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true" />}
      </button>
      <p className="max-w-md text-xs leading-5 text-muted" aria-live="polite">
        {message || "Uses your browser's speech recognition. Your transcript stays editable."}
      </p>
    </div>
  )
}
