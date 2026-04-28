import { useState, useRef, useCallback } from 'react';

export function useVoice({ onResult, onError }) {
  const [listening, setListening]   = useState(false);
  const [speaking,  setSpeaking]    = useState(false);
  const recognitionRef = useRef(null);
  const synthRef       = useRef(window.speechSynthesis);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onError?.('Speech recognition not supported in this browser.');
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart  = () => setListening(true);
    rec.onend    = () => setListening(false);
    rec.onerror  = (e) => { setListening(false); onError?.(e.error); };
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      onResult?.(transcript);
    };

    recognitionRef.current = rec;
    rec.start();
  }, [onResult, onError]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const speak = useCallback((text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    // Strip markdown for speech
    const clean = text
      .replace(/\*\*/g, '')
      .replace(/[#*`|]/g, '')
      .replace(/\n/g, ' ')
      .slice(0, 400);

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate   = 1.2;
    utterance.pitch  = 1.15;
    utterance.volume = 1;

    // Prefer female voice
    const voices = synthRef.current.getVoices();
    const preferred =
      voices.find(v => v.name === 'Google UK English Female') ||
      voices.find(v => v.name === 'Google US English') ||
      voices.find(v => /female/i.test(v.name) && v.lang.startsWith('en')) ||
      voices.find(v => v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Moira')) ||
      voices.find(v => v.lang.startsWith('en-') && v.name.toLowerCase().includes('female')) ||
      voices.find(v => v.lang.startsWith('en'));
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend   = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    synthRef.current.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    synthRef.current?.cancel();
    setSpeaking(false);
  }, []);

  return { listening, speaking, startListening, stopListening, speak, stopSpeaking };
}
