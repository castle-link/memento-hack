import type { DomainError } from "@/lib/errors";
import { datadogLogs, HandlerType } from "@datadog/browser-logs";
import { SerializedError } from "@reduxjs/toolkit";

const LOGGER_CONFIG = {
  clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN,
  site: "us3.datadoghq.com",
  service: "memento-app-web",
  env: process.env.NEXT_PUBLIC_APP_ENV,
  forwardErrorsToLogs: true,
  useSecureSessionCookie: true,
  useCrossSiteSessionCookie: true,
  proxyUrl: "/api/logs",
};

const LOGGER_HANDLERS: HandlerType[] =
  process.env.NEXT_PUBLIC_APP_ENV === "prod" ? ["http"] : ["console", "http"];

export class WebLogger {
  private get defaultMetadata() {
    return {
      host: window.location.host,
    };
  }

  private init() {
    datadogLogs.init(LOGGER_CONFIG);

    // Log to both console and datadog
    datadogLogs.logger.setHandler(LOGGER_HANDLERS);
  }

  config = ({ service }: { service: string }) => {
    // noop for now - not needed
  };

  setContext = (context: Record<string, any>) => {
    datadogLogs.logger.setContext(context);
  };

  private isInitialized() {
    return !!datadogLogs.getInitConfiguration();
  }

  error = (message: string, messageContext?: Record<string, any>) => {
    if (!this.isInitialized()) this.init();

    datadogLogs.logger.error(message, {
      ...this.defaultMetadata,
      ...messageContext,
    });
  };

  logError = (
    error: Error | string | SerializedError | DomainError,
    message?: string,
    messageContext?: Record<string, any>
  ) => {
    const errorMessage =
      (typeof error === "object" ? error.message : error) ||
      "An error occurred";
    const logMessage = message || errorMessage;
    const stack =
      typeof error === "object" && "stack" in error ? error.stack : null;
    const name =
      typeof error === "object" && "name" in error ? error.name : null;
    const code =
      typeof error === "object" && "code" in error ? error.code : null;
    const details =
      typeof error === "object" && "details" in error
        ? { details: error.details }
        : {};
    this.error(logMessage, {
      error: errorMessage,
      stack,
      name,
      code,
      ...details,
      ...messageContext,
    });
  };

  info = (message: string, messageContext?: Record<string, any>) => {
    if (!this.isInitialized()) this.init();

    datadogLogs.logger.info(message, {
      ...this.defaultMetadata,
      ...messageContext,
    });
  };

  warn = (message: string, messageContext?: Record<string, any>) => {
    if (!this.isInitialized()) this.init();

    datadogLogs.logger.warn(message, {
      ...this.defaultMetadata,
      ...messageContext,
    });
  };
}
