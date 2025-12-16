import React from "react";
import { FaExclamationTriangle, FaRedo } from "react-icons/fa";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
          {/* Styled to match client portfolio theme */}
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl max-w-lg w-full shadow-2xl">
            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
              <FaExclamationTriangle className="text-3xl text-red-500" />
            </div>

            <h1 className="text-2xl font-bold mb-2 font-display">
              Something went wrong
            </h1>
            <p className="text-zinc-400 mb-6 font-light">
              We encountered an unexpected error. Please try refreshing the
              page.
            </p>

            {/* Error Details (Only visible in dev or if desired, simplified for client) */}
            <div className="bg-black/50 rounded-lg p-4 mb-6 text-left overflow-auto max-h-48 border border-white/5">
              <p className="font-mono text-red-400 text-sm mb-2 break-all">
                {this.state.error && this.state.error.toString()}
              </p>
              <details className="text-zinc-600 text-xs font-mono cursor-pointer">
                <summary className="hover:text-zinc-400 transition-colors">
                  Technical Details
                </summary>
                <div className="mt-2 whitespace-pre-wrap">
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </div>
              </details>
            </div>

            <div className="flex justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105"
              >
                <FaRedo />
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
