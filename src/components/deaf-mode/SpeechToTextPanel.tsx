import { useState } from 'react';
import { useSpeechRecognition } from '../../features/speech/useSpeechRecognition';
import { Download, Mic, MicOff, Trash2 } from 'lucide-react';

interface TranscriptEntry {
    text: string;
    confidence: number;
    timestamp: Date;
}

export function SpeechToTextPanel() {
    const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
    const [error, setError] = useState<string | null>(null);

    const {
        isListening,
        interimTranscript,
        startListening,
        stopListening,
        resetTranscript,
        isSupported
    } = useSpeechRecognition({
        continuous: true,
        language: 'en-US',
        onResult: (text, confidence) => {
            setTranscripts(prev => [...prev, {
                text,
                confidence,
                timestamp: new Date()
            }]);
            setError(null);
        },
        onError: (err) => {
            setError(err);
        }
    });

    const downloadTranscript = () => {
        const fullText = transcripts.map(t => `[${t.timestamp.toLocaleTimeString()}] ${t.text}`).join('\n');
        const blob = new Blob([fullText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transcript-${new Date().toISOString()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const clearAll = () => {
        setTranscripts([]);
        resetTranscript();
        setError(null);
    };

    if (!isSupported) {
        return (
            <div className="card-clay" style={{ padding: '40px', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--clay-error, #EF4444)', marginBottom: '16px' }}>
                    ❌ Speech Recognition Not Supported
                </h2>
                <p style={{ color: '#6B7280' }}>
                    Please use Chrome, Edge, or Safari for speech recognition features.
                </p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

            {/* Controls */}
            <div className="controls flex gap-4 flex-wrap" style={{ marginBottom: '24px' }}>
                <button
                    className="btn-clay btn-primary btn-icon flex items-center gap-2 px-6 py-3 rounded-2xl border-none font-semibold text-white cursor-pointer transition-all hover:-translate-y-1 shadow-md"
                    onClick={isListening ? stopListening : startListening}
                    style={{
                        background: isListening
                            ? 'linear-gradient(135deg, #EF4444, #DC2626)'
                            : 'linear-gradient(135deg, #6366F1, #8B5CF6)'
                    }}
                >
                    {isListening ? (
                        <>
                            <MicOff size={20} /> Stop Listening
                        </>
                    ) : (
                        <>
                            <Mic size={20} /> Start Listening
                        </>
                    )}
                </button>

                <button
                    className="btn-clay flex items-center gap-2 px-6 py-3 rounded-2xl border-none font-semibold bg-white text-gray-800 cursor-pointer transition-all hover:-translate-y-1 shadow-sm"
                    onClick={clearAll}
                    disabled={transcripts.length === 0}
                    style={{ opacity: transcripts.length === 0 ? 0.5 : 1 }}
                >
                    <Trash2 size={20} /> Clear All
                </button>

                <button
                    className="btn-clay flex items-center gap-2 px-6 py-3 rounded-2xl border-none font-semibold bg-white text-gray-800 cursor-pointer transition-all hover:-translate-y-1 shadow-sm"
                    onClick={downloadTranscript}
                    disabled={transcripts.length === 0}
                    style={{ opacity: transcripts.length === 0 ? 0.5 : 1 }}
                >
                    <Download size={20} /> Download
                </button>
            </div>

            {/* Live Status */}
            {isListening && (
                <div className="card-clay" style={{
                    background: 'linear-gradient(135deg, #ECFDF5, #F0FDF4)',
                    border: '2px solid #10B981',
                    borderRadius: '24px',
                    padding: '16px',
                    marginBottom: '24px',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                    animation: 'fadeInUp 0.4s ease'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '12px',
                            height: '12px',
                            background: '#10B981',
                            borderRadius: '50%',
                            animation: 'pulse 1.5s ease infinite'
                        }} />
                        <span style={{
                            color: '#059669',
                            fontWeight: 600,
                            fontSize: '16px'
                        }}>
                            Listening... Speak now
                        </span>
                    </div>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="card-clay" style={{
                    background: 'linear-gradient(135deg, #FEF2F2, #FEE2E2)',
                    border: '2px solid #EF4444',
                    borderRadius: '24px',
                    padding: '16px',
                    marginBottom: '24px',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.05)'
                }}>
                    <p style={{ color: '#B91C1C', margin: 0, fontWeight: 500 }}>
                        ⚠️ {error}
                    </p>
                </div>
            )}

            {/* Interim Results (what you're saying now) */}
            {interimTranscript && (
                <div className="card-clay" style={{
                    background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
                    borderRadius: '24px',
                    padding: '24px',
                    marginBottom: '24px',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.05)'
                }}>
                    <p style={{
                        color: '#2563EB',
                        fontStyle: 'italic',
                        margin: 0,
                        fontSize: '18px',
                        lineHeight: 1.6
                    }}>
                        {interimTranscript}
                    </p>
                </div>
            )}

            {/* Final Transcript */}
            <div className="card-clay" style={{
                background: 'white',
                borderRadius: '32px',
                padding: '32px',
                boxShadow: '0 15px 30px rgba(0,0,0,0.08)'
            }}>
                <h3 style={{
                    fontSize: '20px',
                    marginBottom: '24px',
                    color: '#1F2937',
                    fontWeight: 700
                }}>
                    📝 Transcript
                </h3>

                <div style={{
                    maxHeight: '400px',
                    overflowY: 'auto',
                    padding: '8px'
                }}>
                    {transcripts.length > 0 ? (
                        transcripts.map((entry, index) => (
                            <div key={index} style={{
                                borderLeft: '4px solid #6366F1',
                                paddingLeft: '20px',
                                marginBottom: '20px',
                                animation: 'fadeInUp 0.3s ease'
                            }}>
                                <p style={{
                                    color: '#1F2937',
                                    fontSize: '18px',
                                    marginBottom: '8px',
                                    lineHeight: '1.6'
                                }}>
                                    {entry.text}
                                </p>
                                <div style={{
                                    display: 'flex',
                                    gap: '16px',
                                    fontSize: '13px',
                                    color: '#6B7280',
                                    fontWeight: 500
                                }}>
                                    <span>
                                        ✓ Confidence: {(entry.confidence * 100).toFixed(0)}%
                                    </span>
                                    <span>
                                        🕒 {entry.timestamp.toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: '#9CA3AF'
                        }}>
                            <p style={{ fontSize: '18px', marginBottom: '8px', fontWeight: 500 }}>
                                No transcripts yet
                            </p>
                            <p style={{ fontSize: '14px' }}>
                                Click "Start Listening" to begin transcription
                            </p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
