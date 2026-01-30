import { useState, useEffect, useCallback } from 'react';

interface UseTextToSpeechReturn {
    speak: (text: string) => void;
    stop: () => void;
    isSpeaking: boolean;
    voices: SpeechSynthesisVoice[];
    selectedVoice: SpeechSynthesisVoice | null;
    setVoice: (voice: SpeechSynthesisVoice) => void;
    rate: number;
    setRate: (rate: number) => void;
    pitch: number;
    setPitch: (pitch: number) => void;
}

export const useTextToSpeech = (): UseTextToSpeechReturn => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            // Try to set a default English voice
            const defaultVoice = availableVoices.find(v => v.lang.includes('en-US')) || availableVoices[0];
            if (defaultVoice) setSelectedVoice(defaultVoice);
        };

        loadVoices();

        // Chrome loads voices asynchronously
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    const speak = useCallback((text: string) => {
        if (!text) return;

        // Cancel current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.rate = rate;
        utterance.pitch = pitch;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [selectedVoice, rate, pitch]);

    const stop = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, []);

    return {
        speak,
        stop,
        isSpeaking,
        voices,
        selectedVoice,
        setVoice: setSelectedVoice,
        rate,
        setRate,
        pitch,
        setPitch
    };
};
