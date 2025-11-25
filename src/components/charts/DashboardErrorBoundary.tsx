import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Specialized Error Boundary for Dashboard Components
 * Provides graceful fallback UI for dashboard widgets
 */
export class DashboardErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Dashboard Error (${this.props.componentName || 'Unknown'}):`, error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Card className="p-6 border-destructive/50">
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
            <AlertCircle className="w-10 h-10 text-destructive" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {this.props.componentName || 'Component'} Error
              </h3>
              <p className="text-sm text-muted-foreground">
                Unable to load this dashboard component
              </p>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <pre className="text-xs text-left p-3 bg-muted rounded max-w-full overflow-auto">
                {this.state.error.toString()}
              </pre>
            )}
            <Button
              onClick={this.handleReset}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </Button>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}
