import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] p-4">
                    <div className="glass-panel p-8 rounded-3xl max-w-md w-full text-center border-red-500/30">
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-10 h-10 text-red-500" />
                        </div>

                        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
                        <p className="text-white/60 mb-8 leading-relaxed">
                            Our AI encountered an unexpected issue. We've logged it and are looking into it.
                        </p>

                        <div className="bg-black/30 p-4 rounded-xl mb-8 text-left overflow-auto max-h-32 text-xs font-mono text-red-300">
                            {this.state.error?.message}
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-4 bg-red-500 hover:bg-red-600 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                        >
                            <RefreshCcw className="w-5 h-5" />
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
