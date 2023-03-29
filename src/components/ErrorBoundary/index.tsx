import React from "react";
import { Custom500 } from "../../../pages/500";
import { Logger } from "@/utils/logger";

interface PropState {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  PropState,
  ErrorBoundaryState
> {
  constructor(props: PropState) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error(error, "Caught a React exception, showing 500 error page", {
      errorInfo,
    });
    this.setState({ hasError: true });
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <Custom500 />;
    }

    // if (typeof window === "undefined") return <></>;

    return this.props.children;
  }
}
