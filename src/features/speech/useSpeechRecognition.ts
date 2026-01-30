import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechRecognitionProps {
    continuous?: boolean;
    language?: string;
    onResult?: (transcript: string, confidence: number) => void;
    onError?: (error: string) => void;
}

export function useSpeechRecognition({
    continuous = true,
    language = 'en-US',
    onResult,
    onError
}: UseSpeechRecognitionProps = {}) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(false);
    const [confidence, setConfidence] = useState(0);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const isListeningRef = useRef(false);

    useEffect(() => {
        // Check browser support
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognitionAPI) {
            onError?.('Speech recognition not supported. Please use Chrome, Edge, or Safari.');
            setIsSupported(false);
            return;
        }

        setIsSupported(true);

        // Initialize Web Speech API
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = continuous;
        recognition.interimResults = true;
        recognition.lang = language;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            console.log('🎤 Speech recognition started');
            setIsListening(true);
            isListeningRef.current = true;
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interim = '';
            let final = '';
            let latestConfidence = 0;

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                const transcriptPart = result[0].transcript;
                latestConfidence = result[0].confidence;

                if (result.isFinal) {
                    final += transcriptPart + ' ';
                    console.log('✅ Final:', transcriptPart, `(${(latestConfidence * 100).toFixed(0)}%)`);
                    onResult?.(transcriptPart, latestConfidence);
                } else {
                    interim += transcriptPart;
                }
            }

            if (final) {
                setTranscript(prev => prev + final);
                setConfidence(latestConfidence);
            }
            setInterimTranscript(interim);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('❌ Speech recognition error:', event.error);

            let errorMessage = 'Recognition error';
            switch (event.error) {
                case 'no-speech':
                    errorMessage = 'No speech detected. Please try again.';
                    break;
                case 'audio-capture':
                    errorMessage = 'Microphone not accessible. Please check permissions.';
                    break;
                case 'not-allowed':
                    errorMessage = 'Microphone permission denied.';
                    break;
                case 'network':
                    errorMessage = 'Network error. Check your internet connection.';
                    break;
                default:
                    errorMessage = `Error: ${event.error}`;
            }

            onError?.(errorMessage);
            setIsListening(false);
            isListeningRef.current = false;
        };

        recognition.onend = () => {
            console.log('🛑 Speech recognition ended');

            // Auto-restart for continuous mode
            if (continuous && isListeningRef.current) {
                try {
                    recognition.start();
                } catch (error) {
                    console.warn('Failed to auto-restart recognition');
                    setIsListening(false);
                    isListeningRef.current = false;
                }
            } else {
                setIsListening(false);
                isListeningRef.current = false;
            }
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                isListeningRef.current = false;
                recognitionRef.current.stop();
            }
        };
    }, [continuous, language]);

    const startListening = useCallback(() => {
        if (!recognitionRef.current) {
            onError?.('Recognition not initialized');
            return;
        }

        try {
            setTranscript('');
            setInterimTranscript('');
            recognitionRef.current.start();
            console.log('▶️ Starting recognition...');
        } catch (error) {
            console.warn('Recognition may already be active');
        }
    }, [onError]);

    const stopListening = useCallback(() => {
        isListeningRef.current = false;
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            console.log('⏹️ Stopping recognition...');
        }
        setIsListening(false);
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript('');
        setInterimTranscript('');
        setConfidence(0);
    }, []);

    return {
        isListening,
        transcript,
        interimTranscript,
        confidence,
        startListening,
        stopListening,
        resetTranscript,
        isSupported
    };
}
