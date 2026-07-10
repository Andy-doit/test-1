"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { logger } from "@/lib/utils/logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component để catch React errors
 * Sử dụng class component vì React chưa hỗ trợ Error Boundary với hooks
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error để tracking
    logger.error("[ErrorBoundary] Caught error:", error, errorInfo);

    // Gọi callback nếu có
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Nếu có custom fallback, sử dụng nó
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <h2 className="text-xl font-semibold">Đã xảy ra lỗi</h2>
            </div>

            <p className="text-sm text-muted-foreground">
              Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ với chúng tôi nếu vấn đề vẫn tiếp tục.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="rounded-md bg-destructive/10 p-3">
                <p className="text-xs font-mono text-destructive break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={this.handleReset}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Thử lại
              </Button>
              <Button asChild variant="default" className="flex-1">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Về trang chủ
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC để wrap component với Error Boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  const WrappedComponent = (props: P) => {
    return (
      <ErrorBoundary fallback={fallback} onError={onError}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || "Component"})`;

  return WrappedComponent;
}

