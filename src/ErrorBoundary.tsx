import React, { Component, ReactNode } from 'react';
import { isRecoverableChunkOrHookError } from './utils/lazyWithRetry';

const BOUNDARY_RELOAD_KEY = 'arc_boundary_reload_ts';
const BOUNDARY_RELOAD_COOLDOWN_MS = 15000;

interface ErrorBoundaryProps {
  children: ReactNode;
  resetKey?: string | number;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimer: ReturnType<typeof setTimeout> | null = null;

  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    retryCount: 0,
  };

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  public componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.clearRetryTimer();
      this.setState({ hasError: false, error: null, retryCount: 0 });
    }
  }

  public componentDidCatch(error: Error) {
    if (isRecoverableChunkOrHookError(error)) {
      // First attempt automatic in-place remount recovery (up to 2 times)
      if (this.state.retryCount < 2) {
        this.clearRetryTimer();
        this.retryTimer = setTimeout(() => {
          this.setState((prev) => ({
            hasError: false,
            error: null,
            retryCount: prev.retryCount + 1,
          }));
        }, 120);
        return;
      }

      // If in-place remount still hits a stale Vite chunk hash, trigger a single guarded reload
      try {
        const now = Date.now();
        const lastReload = parseInt(sessionStorage.getItem(BOUNDARY_RELOAD_KEY) || '0', 10);
        if (!lastReload || now - lastReload > BOUNDARY_RELOAD_COOLDOWN_MS) {
          sessionStorage.setItem(BOUNDARY_RELOAD_KEY, String(now));
          window.location.reload();
          return;
        }
      } catch {
        // Ignore sessionStorage restrictions
      }
    }
  }

  public componentWillUnmount() {
    this.clearRetryTimer();
  }

  private clearRetryTimer() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
  }

  private handleManualReset = () => {
    this.clearRetryTimer();
    this.setState({ hasError: false, error: null, retryCount: 0 });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError && this.state.error) {
      // While auto-retrying a recoverable chunk/hook glitch, render a subtle recovery state instead of a crash screen
      if (isRecoverableChunkOrHookError(this.state.error) && this.state.retryCount < 2) {
        return (
          <div className="min-h-[40vh] flex items-center justify-center p-8 text-center">
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full bg-[#c5a880] animate-ping" />
              <span>Synchronizing view module...</span>
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6 bg-[#faf9f8]">
          <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-[#003334]/10 text-[#003334] flex items-center justify-center mx-auto font-serif font-bold text-lg">
              !
            </div>
            <div className="space-y-2">
              <h2 className="font-serif font-bold text-xl text-[#003334]">
                View Temporarily Interrupted
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                This page module was updated or interrupted while loading. Click below to restore the view immediately.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleManualReset}
                className="px-5 py-2.5 rounded-xl bg-[#003334] hover:bg-[#236963] text-white text-xs font-bold transition-all cursor-pointer"
              >
                Retry View
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
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
