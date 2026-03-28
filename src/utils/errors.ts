/**
 * Custom Error Classes for Profits Patrol
 * Provides structured error handling with context and status codes
 */

export class AppError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number = 500,
        public context?: Record<string, any>
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace?.(this, this.constructor);
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            statusCode: this.statusCode,
            context: this.context,
            stack: this.stack
        };
    }
}

export class ValidationError extends AppError {
    constructor(message: string, context?: Record<string, any>) {
        super(message, 'VALIDATION_ERROR', 400, context);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized access', context?: Record<string, any>) {
        super(message, 'UNAUTHORIZED', 403, context);
    }
}

export class RateLimitError extends AppError {
    constructor(remainingTime: number) {
        super(
            `Rate limit exceeded. Try again in ${Math.ceil(remainingTime / 1000)} seconds.`,
            'RATE_LIMIT_EXCEEDED',
            429,
            { remainingTime }
        );
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string, context?: Record<string, any>) {
        super(`${resource} not found`, 'NOT_FOUND', 404, context);
    }
}

export class ConflictError extends AppError {
    constructor(message: string, context?: Record<string, any>) {
        super(message, 'CONFLICT', 409, context);
    }
}
