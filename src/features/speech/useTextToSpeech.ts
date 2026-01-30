import { useState, useEffect, useCallback } from 'react';

interface UseTextToSpeechProps {
    defaultRate?: number;
    defaultPitch?: number;
    defaultVolume?: number;
}

export function useTextToSpeech({
    defaultRate = 1,
    defaultPitch = 1,
    defaultVolume = 1
}: UseTextToSpeechProps = {}) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [rate, setRate] = useState(defaultRate);
    const [pitch, setPitch] = useState(defaultPitch);
    const [volume, setVolume] = useState(defaultVolume);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        if (!('speechSynthesis' in window)) {
            console.error('Text-to-speech not supported');
            setIsSupported(false);
            return;
        }

        setIsSupported(true);

        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            console.log(`📢 Loaded ${availableVoices.length} voices`);
            setVoices(availableVoices);

            // Set default voice (prefer English)
            if (availableVoices.length > 0 && !selectedVoice) {
                const englishVoice = availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
                setSelectedVoice(englishVoice);
            }
        };

        loadVoices();

        // Chrome loads voices asynchronously
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const speak = useCallback((text: string) => {
        if (!text.trim()) {
            console.warn('Cannot speak empty text');
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Set voice parameters
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        utterance.onstart = () => {
            console.log('🗣️ Started speaking');
            setIsSpeaking(true);
            setIsPaused(false);
        };

        utterance.onend = () => {
            console.log('✅ Finished speaking');
            setIsSpeaking(false);
            setIsPaused(false);
        };

        utterance.onerror = (error) => {
            console.error('❌ Speech synthesis error:', error);
            setIsSpeaking(false);
            setIsPaused(false);
        };

        utterance.onpause = () => {
            setIsPaused(true);
        };

        utterance.onresume = () => {
            setIsPaused(false);
        };

        window.speechSynthesis.speak(utterance);
    }, [selectedVoice, rate, pitch, volume]);

    const pause = useCallback(() => {
        window.speechSynthesis.pause();
        setIsPaused(true);
    }, []);

    const resume = useCallback(() => {
        window.speechSynthesis.resume();
        setIsPaused(false);
    }, []);

    const stop = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
    }, []);

    return {
        speak,
        pause,
        resume,
        stop,
        isSpeaking,
        isPaused,
        voices,
        selectedVoice,
        setSelectedVoice,
        rate,
        setRate,
        pitch,
        setPitch,
        volume,
        setVolume,
        isSupported
    };
}
