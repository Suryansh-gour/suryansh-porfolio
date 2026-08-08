import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
};

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/**
 * Browser speech-to-text + server-backed text-to-speech.
 * TTS calls /api/tts (custom cloned voice -> Lovable AI voice) and falls back
 * to the native browser voice if the endpoint is unavailable.
 */
export function useVoiceAssistant() {
  const [sttSupported, setSttSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [interim, setInterim] = useState("");
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    setSttSupported(Boolean(getRecognitionCtor()));
  }, []);

  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    cleanupAudio();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, [cleanupAudio]);

  const speakNatively = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.02;
    utterance.pitch = 1;
    const preferred = window.speechSynthesis
      .getVoices()
      .find((v) => /en-IN|en-GB|Google UK|Natural/i.test(`${v.lang} ${v.name}`));
    if (preferred) utterance.voice = preferred;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const speak = useCallback(
    async (text: string) => {
      const clean = text.replace(/[*_`#>]/g, "").trim();
      if (!clean) return;
      stopSpeaking();
      setSpeaking(true);
      setVoiceError(null);

      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: clean }),
        });
        if (!res.ok) throw new Error(`tts ${res.status}`);
        const blob = await res.blob();
        if (!blob.size) throw new Error("empty audio");

        const url = URL.createObjectURL(blob);
        objectUrlRef.current = url;
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => {
          setSpeaking(false);
          cleanupAudio();
        };
        audio.onerror = () => {
          cleanupAudio();
          speakNatively(clean);
        };
        await audio.play();
      } catch {
        // graceful fallback — visitors never see a technical error
        speakNatively(clean);
      }
    },
    [cleanupAudio, speakNatively, stopSpeaking],
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const startListening = useCallback(
    (onResult: (text: string) => void) => {
      const Ctor = getRecognitionCtor();
      if (!Ctor) {
        setVoiceError("Voice input isn't supported in this browser. Try Chrome or Edge.");
        return;
      }
      stopSpeaking();
      setVoiceError(null);
      setInterim("");

      const recognition = new Ctor();
      recognition.lang = "en-IN";
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onresult = (event: any) => {
        let finalText = "";
        let partial = "";
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i];
          if (result.isFinal) finalText += result[0].transcript;
          else partial += result[0].transcript;
        }
        setInterim(partial);
        if (finalText.trim()) {
          setInterim("");
          onResult(finalText.trim());
        }
      };
      recognition.onerror = (event: any) => {
        setListening(false);
        setInterim("");
        const code = event?.error;
        if (code === "not-allowed" || code === "service-not-allowed") {
          setVoiceError("Microphone access was blocked. Enable it in your browser to talk to me.");
        } else if (code === "no-speech") {
          setVoiceError("I didn't catch that — try speaking again.");
        } else if (code !== "aborted") {
          setVoiceError("Voice input failed. You can still type your question.");
        }
      };
      recognition.onend = () => {
        setListening(false);
        setInterim("");
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
        setListening(true);
      } catch {
        setListening(false);
      }
    },
    [stopSpeaking],
  );

  useEffect(
    () => () => {
      recognitionRef.current?.abort();
      cleanupAudio();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    },
    [cleanupAudio],
  );

  return {
    sttSupported,
    listening,
    speaking,
    interim,
    voiceError,
    setVoiceError,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
