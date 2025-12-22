import React from 'react';
import RedCrossSymbol from './RedCrossSymbol';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details
        console.error('Error Boundary caught an error:', error, errorInfo);

        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // In production, you would send this to an error reporting service
        if (process.env.NODE_ENV === 'production') {
            // Example: Send to error reporting service
            // errorReportingService.captureException(error, { extra: errorInfo });
        }
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                    <div className="max-w-md w-full text-center">
                        <div className="mb-8 animate-scale-in">
                            <RedCrossSymbol size="xl" variant="circle" className="mx-auto mb-4" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Oops! Something went wrong
                        </h1>

                        <p className="text-gray-600 mb-8">
                            We're sorry, but something unexpected happened.
                            Our team has been notified and is working to fix the issue.
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={this.handleReload}
                                className="btn btn-primary w-full"
                            >
                                <i className="fas fa-redo mr-2"></i>
                                Try Again
                            </button>

                            <button
                                onClick={this.handleGoHome}
                                className="btn btn-secondary w-full"
                            >
                                <i className="fas fa-home mr-2"></i>
                                Go to Home
                            </button>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-8 text-left">
                                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                                    Show Error Details (Development Only)
                                </summary>
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                                    <h3 className="text-sm font-medium text-red-800 mb-2">Error:</h3>
                                    <pre className="text-xs text-red-700 whitespace-pre-wrap">
                                        {this.state.error && this.state.error.toString()}
                                    </pre>

                                    <h3 className="text-sm font-medium text-red-800 mb-2 mt-4">Stack Trace:</h3>
                                    <pre className="text-xs text-red-700 whitespace-pre-wrap">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                </div>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;