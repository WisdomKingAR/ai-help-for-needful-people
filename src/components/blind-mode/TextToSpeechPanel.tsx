import React, { useState } from 'react';
import { useTextToSpeech } from '../../features/speech/useTextToSpeech';
import { Play, Pause, Square, Volume2, Zap, Turtle, Rabbit } from 'lucide-react';

export function TextToSpeechPanel() {
    const [text, setText] = useState('');

    const {
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
        isSupported
    } = useTextToSpeech();

    // Sample texts for testing
    const sampleTexts = [
        "Welcome to the Accessibility Companion. This is a text-to-speech demonstration.",
        "The quick brown fox jumps over the lazy dog.",
        "I can help you read any text aloud with adjustable speed and voice options.",
    ];

    const handleSpeak = () => {
        if (!text.trim()) {
            alert('Please enter some text first');
            return;
        }
        speak(text);
    };

    const loadSampleText = (sampleText: string) => {
        setText(sampleText);
    };

    if (!isSupported) {
        return (
            <div className="card-clay" style={{ padding: '40px', textAlign: 'center' }}>
                <h2 style={{ color: '#EF4444', marginBottom: '16px' }}>
                    ❌ Text-to-Speech Not Supported
                </h2>
                <p style={{ color: '#6B7280' }}>
                    Please use a modern browser that supports Web Speech API.
                </p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

            {/* Text Input Area */}
            <div className="card-clay" style={{
                marginBottom: '24px',
                background: 'white',
                borderRadius: '32px',
                padding: '32px',
                boxShadow: '0 15px 30px rgba(0,0,0,0.08)'
            }}>
                <h3 style={{ marginBottom: '20px', fontSize: '20px', color: '#1F2937', fontWeight: 700 }}>
                    📝 Enter Text to Speak
                </h3>

                <textarea
                    className="input-clay"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type or paste text here..."
                    rows={6}
                    style={{
                        width: '100%',
                        padding: '20px',
                        borderRadius: '24px',
                        border: '2px solid transparent',
                        background: '#F9FAFB',
                        boxShadow: 'inset 2px 2px 5px rgba(0, 0, 0, 0.05)',
                        fontSize: '16px',
                        lineHeight: '1.6',
                        resize: 'vertical',
                        outline: 'none',
                        color: '#1F2937',
                        fontFamily: 'inherit'
                    }}
                />

                <div style={{
                    marginTop: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '14px',
                    color: '#6B7280'
                }}>
                    <span>{text.length} characters</span>
                    <span>~{Math.ceil(text.split(' ').length / 150)} min read time</span>
                </div>

                {/* Sample Texts */}
                <div style={{ marginTop: '20px' }}>
                    <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '12px', fontWeight: 500 }}>
                        Quick samples:
                    </p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {sampleTexts.map((sample, index) => (
                            <button
                                key={index}
                                onClick={() => loadSampleText(sample)}
                                style={{
                                    padding: '10px 16px',
                                    borderRadius: '16px',
                                    border: 'none',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #F3F4F6, #E5E7EB)',
                                    color: '#4B5563',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                Sample {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Voice Settings */}
            <div className="card-clay" style={{
                marginBottom: '24px',
                background: 'white',
                borderRadius: '32px',
                padding: '32px',
                boxShadow: '0 15px 30px rgba(0,0,0,0.08)'
            }}>
                <h3 style={{ marginBottom: '20px', fontSize: '20px', color: '#1F2937', fontWeight: 700 }}>
                    🎙️ Voice Settings
                </h3>

                {/* Voice Selection */}
                <div style={{ marginBottom: '24px' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: 600,
                        marginBottom: '10px',
                        color: '#374151'
                    }}>
                        Select Voice
                    </label>
                    <select
                        value={voices.indexOf(selectedVoice as SpeechSynthesisVoice)}
                        onChange={(e) => setSelectedVoice(voices[Number(e.target.value)])}
                        style={{
                            width: '100%',
                            padding: '16px',
                            borderRadius: '16px',
                            border: '2px solid #E5E7EB',
                            background: 'white',
                            fontSize: '14px',
                            cursor: 'pointer',
                            color: '#1F2937'
                        }}
                    >
                        {voices.map((voice, index) => (
                            <option key={index} value={index}>
                                {voice.name} ({voice.lang})
                            </option>
                        ))}
                    </select>
                    <p style={{
                        fontSize: '12px',
                        color: '#6B7280',
                        marginTop: '8px'
                    }}>
                        {voices.length} voices available
                    </p>
                </div>

                {/* Speed Control */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px'
                    }}>
                        <label style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#374151',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            <Zap size={16} className="text-yellow-500" />
                            Speed
                        </label>
                        <span style={{
                            fontSize: '16px',
                            fontWeight: 700,
                            color: '#6366F1'
                        }}>
                            {rate.toFixed(1)}x
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                        <Turtle size={20} color="#6B7280" />
                        <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            style={{
                                flex: 1,
                                cursor: 'pointer',
                                accentColor: '#6366F1',
                                height: '6px',
                                borderRadius: '3px'
                            }}
                        />
                        <Rabbit size={20} color="#6B7280" />
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap'
                    }}>
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((presetSpeed) => (
                            <button
                                key={presetSpeed}
                                onClick={() => setRate(presetSpeed)}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    background: rate === presetSpeed
                                        ? 'linear-gradient(135deg, #6366F1, #8B5CF6)'
                                        : '#F3F4F6',
                                    color: rate === presetSpeed ? 'white' : '#4B5563',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    cursor: 'pointer'
                                }}
                            >
                                {presetSpeed}x
                            </button>
                        ))}
                    </div>
                </div>

                {/* Pitch Control */}
                <div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px'
                    }}>
                        <label style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#374151'
                        }}>
                            Pitch
                        </label>
                        <span style={{
                            fontSize: '16px',
                            fontWeight: 700,
                            color: '#EC4899'
                        }}>
                            {pitch.toFixed(1)}
                        </span>
                    </div>

                    <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={pitch}
                        onChange={(e) => setPitch(Number(e.target.value))}
                        style={{
                            width: '100%',
                            cursor: 'pointer',
                            accentColor: '#EC4899',
                            height: '6px',
                            borderRadius: '3px'
                        }}
                    />
                </div>
            </div>

            {/* Controls */}
            <div className="controls flex gap-4 flex-wrap" style={{ marginBottom: '24px' }}>
                {!isSpeaking && (
                    <button
                        onClick={handleSpeak}
                        disabled={!text.trim()}
                        className="flex items-center gap-2 px-8 py-4 rounded-2xl border-none font-bold text-white text-lg transition-all hover:-translate-y-1 shadow-lg"
                        style={{
                            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                            opacity: text.trim() ? 1 : 0.5,
                            cursor: text.trim() ? 'pointer' : 'not-allowed',
                            flex: 1
                        }}
                    >
                        <Play size={24} fill="currentColor" /> Speak
                    </button>
                )}

                {isSpeaking && !isPaused && (
                    <button
                        onClick={pause}
                        className="flex items-center gap-2 px-8 py-4 rounded-2xl border-none font-bold text-white text-lg transition-all hover:-translate-y-1 shadow-lg cursor-pointer flex-1"
                        style={{
                            background: 'linear-gradient(135deg, #F59E0B, #D97706)'
                        }}
                    >
                        <Pause size={24} fill="currentColor" /> Pause
                    </button>
                )}

                {isPaused && (
                    <button
                        onClick={resume}
                        className="flex items-center gap-2 px-8 py-4 rounded-2xl border-none font-bold text-white text-lg transition-all hover:-translate-y-1 shadow-lg cursor-pointer flex-1"
                        style={{
                            background: 'linear-gradient(135deg, #10B981, #059669)'
                        }}
                    >
                        <Play size={24} fill="currentColor" /> Resume
                    </button>
                )}

                {isSpeaking && (
                    <button
                        onClick={stop}
                        className="flex items-center gap-2 px-6 py-4 rounded-2xl border-none font-bold text-white text-lg transition-all hover:-translate-y-1 shadow-lg cursor-pointer"
                        style={{
                            background: 'linear-gradient(135deg, #EF4444, #DC2626)'
                        }}
                    >
                        <Square size={24} fill="currentColor" /> Stop
                    </button>
                )}
            </div>

            {/* Status Display */}
            {isSpeaking && (
                <div className="card-clay" style={{
                    background: 'linear-gradient(135deg, #F0F9FF, #DBEAFE)',
                    border: '2px solid #3B82F6',
                    borderRadius: '24px',
                    padding: '24px',
                    textAlign: 'center',
                    boxShadow: '0 10px 20px rgba(59, 130, 246, 0.15)',
                    animation: 'fadeInUp 0.4s ease'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        marginBottom: '16px'
                    }}>
                        <Volume2
                            size={32}
                            color="#2563EB"
                            style={{ animation: 'pulse 1s ease infinite' }}
                        />
                        <span style={{
                            fontSize: '20px',
                            fontWeight: 700,
                            color: '#1D4ED8'
                        }}>
                            {isPaused ? 'Paused' : 'Speaking...'}
                        </span>
                    </div>

                    {/* Visual Waveform */}
                    <div style={{
                        display: 'flex',
                        gap: '6px',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        height: '40px'
                    }}>
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    width: '6px',
                                    height: isPaused ? '10px' : `${Math.random() * 30 + 10}px`,
                                    background: '#3B82F6',
                                    borderRadius: '3px',
                                    transition: 'height 0.1s ease',
                                    animation: isPaused ? 'none' : `waveform ${0.3 + Math.random() * 0.3}s ease-in-out infinite alternate`
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
