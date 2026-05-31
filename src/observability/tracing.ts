import {
  SpanStatusCode,
  context,
  trace,
  type Span,
  type SpanOptions,
} from "@opentelemetry/api";

export const tracer = trace.getTracer("ground-control", "0.1.0");

export function withSpan<T>(
  name: string,
  attributes: Record<string, string | number | boolean | undefined>,
  operation: (span: Span) => T,
  options?: SpanOptions,
): T {
  const span = tracer.startSpan(name, options);

  for (const [key, value] of Object.entries(attributes)) {
    if (value !== undefined) {
      span.setAttribute(key, value);
    }
  }

  return context.with(trace.setSpan(context.active(), span), () => {
    try {
      const result = operation(span);

      if (isPromiseLike(result)) {
        return result
          .then((value) => {
            span.setStatus({ code: SpanStatusCode.OK });
            return value;
          })
          .catch((error) => {
            recordSpanError(span, error);
            throw error;
          })
          .finally(() => span.end()) as T;
      }

      span.setStatus({ code: SpanStatusCode.OK });
      span.end();
      return result;
    } catch (error) {
      recordSpanError(span, error);
      span.end();
      throw error;
    }
  });
}

export function recordSpanError(span: Span, error: unknown) {
  span.recordException(error instanceof Error ? error : new Error(String(error)));
  span.setStatus({
    code: SpanStatusCode.ERROR,
    message: error instanceof Error ? error.message : String(error),
  });
}

function isPromiseLike<T>(value: T | Promise<T>): value is Promise<T> {
  return typeof value === "object" && value !== null && "then" in value;
}
