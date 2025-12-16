import React from "react";
import { Button } from "./index"; // Assuming Button is available in the same directory or adjust import
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
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-lg w-full shadow-2xl">
            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
              <FaExclamationTriangle className="text-3xl text-red-500" />
            </div>

            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-zinc-400 mb-6">
              An unexpected error occurred. Our team has been notified.
            </p>

            <div className="bg-black/50 rounded-lg p-4 mb-6 text-left overflow-auto max-h-48 border border-zinc-800">
              <p className="font-mono text-red-400 text-sm mb-2">
                {this.state.error && this.state.error.toString()}
              </p>
              <details className="text-zinc-500 text-xs font-mono cursor-pointer">
                <summary className="hover:text-zinc-300 transition-colors">
                  Stack Trace Details
                </summary>
                <div className="mt-2 whitespace-pre-wrap">
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </div>
              </details>
            </div>

            <div className="flex justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
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
