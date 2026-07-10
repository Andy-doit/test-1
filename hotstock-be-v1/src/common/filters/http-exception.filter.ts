import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
}

/**
 * Global exception filter that catches all HttpExceptions and returns
 * a consistent JSON response shape.
 *
 * Response format:
 * {
 *   statusCode: 400,
 *   message: "...",
 *   error: "Bad Request",
 *   timestamp: "2024-01-01T00:00:00.000Z",
 *   path: "/api/v1/..."
 * }
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Extract message from the exception response
    let message: string;
    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null
    ) {
      const responseObj = exceptionResponse as Record<string, unknown>;
      if (Array.isArray(responseObj.message)) {
        // class-validator returns an array of messages
        message = (responseObj.message as string[]).join('; ');
      } else if (typeof responseObj.message === 'string') {
        message = responseObj.message;
      } else {
        message = exception.message;
      }
    } else {
      message = exception.message;
    }

    // Map status code to error name
    const error = this.getErrorName(status);

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Log 5xx errors as errors, 4xx as warnings
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url} ${status} - ${message}`,
        exception.stack,
      );
    } else {
      this.logger.warn(
        `${request.method} ${request.url} ${status} - ${message}`,
      );
    }

    response.status(status).send(errorResponse);
  }

  private getErrorName(status: number): string {
    const statusNames: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'Bad Request',
      [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
      [HttpStatus.FORBIDDEN]: 'Forbidden',
      [HttpStatus.NOT_FOUND]: 'Not Found',
      [HttpStatus.METHOD_NOT_ALLOWED]: 'Method Not Allowed',
      [HttpStatus.CONFLICT]: 'Conflict',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
      [HttpStatus.TOO_MANY_REQUESTS]: 'Too Many Requests',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
      [HttpStatus.BAD_GATEWAY]: 'Bad Gateway',
      [HttpStatus.SERVICE_UNAVAILABLE]: 'Service Unavailable',
      [HttpStatus.GATEWAY_TIMEOUT]: 'Gateway Timeout',
    };

    return statusNames[status] || 'Error';
  }
}
