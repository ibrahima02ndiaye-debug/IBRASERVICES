/**
 * Centralized Error Handling Utilities
 */

export class AppError extends Error {
    constructor(
        message: string,
        public code?: string,
        public statusCode?: number,
        public isOperational = true
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 'VALIDATION_ERROR', 400);
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication failed') {
        super(message, 'AUTH_ERROR', 401);
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string) {
        super(`${resource} not found`, 'NOT_FOUND', 404);
    }
}

export class NetworkError extends AppError {
    constructor(message: string = 'Network request failed') {
        super(message, 'NETWORK_ERROR', 0);
    }
}

/**
 * User-friendly error messages mapping
 */
const errorMessages: Record<string, string> = {
    NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
    AUTH_ERROR: 'Please log in to continue.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    NOT_FOUND: 'The requested resource was not found.',
    SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
    TIMEOUT: 'The request took too long. Please try again.',
};

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: Error | AppError): string {
    if (error instanceof AppError && error.code) {
        return errorMessages[error.code] || error.message;
    }

    // Handle common fetch/axios errors
    if (error.message.includes('fetch') || error.message.includes('Network')) {
        return errorMessages.NETWORK_ERROR;
    }

    if (error.message.includes('timeout')) {
        return errorMessages.TIMEOUT;
    }

    return errorMessages.SERVER_ERROR;
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> {
    let lastError: Error;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;

            // Don't retry on validation or authentication errors
            if (
                error instanceof ValidationError ||
                error instanceof AuthenticationError ||
                error instanceof NotFoundError
            ) {
                throw error;
            }

            // Calculate delay with exponential backoff
            const delay = baseDelay * Math.pow(2, i);

            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay));

            console.warn(`Retry attempt ${i + 1}/${maxRetries} after ${delay}ms`);
        }
    }

    throw lastError!;
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: any): never {
    // Handle fetch/axios errors
    if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const message = error.response.data?.message || error.message;

        switch (status) {
            case 400:
                throw new ValidationError(message);
            case 401:
                throw new AuthenticationError(message);
            case 404:
                throw new NotFoundError(message);
            default:
                throw new AppError(message, 'SERVER_ERROR', status);
        }
    } else if (error.request) {
        // Request made but no response received
        throw new NetworkError();
    } else {
        // Something else happened
        throw new AppError(error.message || 'An unexpected error occurred');
    }
}

/**
 * Log error for monitoring (placeholder for future integration)
 */
export function logError(error: Error, context?: Record<string, any>) {
    if (process.env.NODE_ENV === 'development') {
        console.error('Error logged:', {
            message: error.message,
            stack: error.stack,
            context,
        });
    }

    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // Example:
    // Sentry.captureException(error, { extra: context });
}

/**
 * Safely execute async function with error handling
 */
export async function safeAsync<T>(
    fn: () => Promise<T>,
    fallback?: T
): Promise<T | undefined> {
    try {
        return await fn();
    } catch (error) {
        logError(error as Error);
        return fallback;
    }
}
