/**
 * Lottery Error Recovery Component
 * Catches and handles errors in lottery application with recovery options
 */

import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  caughtError: Error | null;
  errorContext: string;
}

export class LotteryErrorCatcher extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { caughtError: null, errorContext: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { caughtError: error, errorContext: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Lottery App Error]', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ caughtError: null, errorContext: '' });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.caughtError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="text-6xl mb-4">🎰</div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {this.props.fallbackMessage || 'The lottery app encountered an unexpected error.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={this.handleRetry}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
