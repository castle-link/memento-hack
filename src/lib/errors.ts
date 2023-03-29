import { Logger } from "@/utils/logger";
import { ApiError as ApiErrorResponse } from "@/types";

// Base domain error used to create other errors: https://rclayton.silvrback.com/custom-errors-in-node-js
export class DomainError extends Error {
  name: string;
  details: Record<string, any> | undefined;
  constructor(message: string, details?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFound extends DomainError {
  constructor(message?: string) {
    super(message || "Not found");
    Object.setPrototypeOf(this, NotFound.prototype);
  }
}

export class ApiError extends DomainError {
  status: number;
  body: any;
  response: Promise<ApiErrorResponse> | null;

  constructor(response: Response) {
    const message = `Resquest failed with response status ${response.status} ${response.statusText}`;

    Logger.error(message, {
      url: response.url,
      status: response.status,
      statusText: response.statusText,
    });

    super(message);

    this.status = response.status;
    this.response = response.bodyUsed
      ? null
      : response.headers.get("Content-Type")?.includes("application/json")
      ? getResponseJson(response)
      : getResponseText(response);

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class HttpError extends DomainError {
  status: number;
  response: Promise<any> | null;

  constructor(response: Response) {
    const message = `Resquest failed with response status ${response.status} ${response.statusText}`;

    Logger.error(message, {
      url: response.url,
      status: response.status,
      statusText: response.statusText,
    });

    super(message);

    this.status = response.status;
    this.response = response.bodyUsed
      ? null
      : response.headers.get("Content-Type")?.includes("application/json")
      ? getResponseJson(response)
      : getResponseText(response);

    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

const getResponseJson = (response: Response) => {
  try {
    return response.json();
  } catch {
    return null;
  }
};
const getResponseText = (response: Response) => {
  try {
    return response.text();
  } catch {
    return null;
  }
};

export class RateLimitError extends DomainError {
  constructor(response?: Response) {
    const message = `Resquest was rate limit with response status ${
      response?.status ? response?.status : 429
    }${response?.statusText ? ` ${response?.statusText}` : ""}${
      response?.body ? response.body.toString() : ""
    }`;

    Logger.error(message);

    super(message);
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

export class UserRejectedSignatureRequest extends DomainError {
  constructor() {
    super("User rejected signature request");
    Object.setPrototypeOf(this, UserRejectedSignatureRequest.prototype);
  }
}

export class RequestTimeout extends DomainError {
  constructor() {
    super("⏱ Request timed out");
    Object.setPrototypeOf(this, RequestTimeout.prototype);
  }
}

export class NotAvailable extends DomainError {
  constructor(message?: string) {
    super(`🔎 Not available${message ? `: ${message}` : ""}`);
    Object.setPrototypeOf(this, NotAvailable.prototype);
  }
}
