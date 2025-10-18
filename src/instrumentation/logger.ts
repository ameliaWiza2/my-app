type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogPayload = Record<string, unknown> | Error | string | undefined;

type Logger = {
  log: (scope: string, message: string, payload?: LogPayload) => void;
  warn: (scope: string, message: string, payload?: LogPayload) => void;
  error: (scope: string, message: string, payload?: LogPayload) => void;
};

const emitLog = (level: LogLevel, scope: string, message: string, payload?: LogPayload) => {
  const time = new Date().toISOString();
  const content = payload instanceof Error ? {name: payload.name, message: payload.message, stack: payload.stack} : payload;
  // eslint-disable-next-line no-console
  console[level === 'debug' ? 'log' : level](`[${time}] [${scope}] ${message}`, content ?? '');
};

export const logger: Logger = {
  log: (scope, message, payload) => emitLog('info', scope, message, payload),
  warn: (scope, message, payload) => emitLog('warn', scope, message, payload),
  error: (scope, message, payload) => emitLog('error', scope, message, payload),
};
