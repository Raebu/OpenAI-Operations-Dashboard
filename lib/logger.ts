type LogLevel = 'info' | 'warn' | 'error';

type LogContext = Record<string, string | number | boolean | null | undefined>;

function write(level: LogLevel, message: string, context: LogContext = {}) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    service: 'openai-operations-dashboard',
    ...context
  };

  const line = JSON.stringify(entry);
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.info(line);
}

export const logger = {
  info: (message: string, context?: LogContext) => write('info', message, context),
  warn: (message: string, context?: LogContext) => write('warn', message, context),
  error: (message: string, context?: LogContext) => write('error', message, context)
};
