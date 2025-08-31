// Shared SDK logger
import { hydrateConfig } from './unifiedConfiguration';

export type LogLevel = 'silent'|'error'|'warn'|'info'|'debug'|'trace';
export interface LogEvent { level: LogLevel; scope?: string; args: any[]; ts: number; }
export type LogTransport = (e: LogEvent) => void;

const ORDER: Record<LogLevel, number> = { silent:0, error:1, warn:2, info:3, debug:4, trace:5 };
let currentLevel: LogLevel | null = null;
let lastConfiguredLevel: string | null = null; // raw string from hydration for change detection
let transport: LogTransport | null = null;
let initialized = false;

export function initLogger(level?: LogLevel, t?: LogTransport) {
  if (!initialized) initialized = true;
  if (level) currentLevel = level;
  if (t) transport = t;
  if (!currentLevel) {
    const cfg = hydrateConfig().config;
    currentLevel = cfg.logLevel || 'error';
    lastConfiguredLevel = currentLevel;
  }
}

export function setLevel(level: LogLevel) { currentLevel = level; }
export function setTransport(t?: LogTransport) { transport = t || null; }

function refreshLevelIfChanged() {
  try {
    const cfg = hydrateConfig().config; // fresh hydration reflects env changes
    if (cfg.logLevel !== lastConfiguredLevel) {
      currentLevel = cfg.logLevel;
      lastConfiguredLevel = cfg.logLevel;
    }
  } catch {/* ignore hydration errors here */}
}

function enabled(need: LogLevel): boolean {
  if (!currentLevel) initLogger();
  refreshLevelIfChanged();
  return ORDER[currentLevel!] >= ORDER[need];
}

function emit(level: LogLevel, scope: string|undefined, args: any[]) {
  if (!enabled(level)) return;
  const evt: LogEvent = { level, scope, args, ts: Date.now() };
  if (transport) { try { transport(evt); } catch {/* swallow */} }
  else {
    const tag = `[camunda-sdk][${level}]${scope?`[${scope}]`:''}`;
    const method = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
    // eslint-disable-next-line no-console
    (console as any)[method](tag, ...args);
  }
}

export interface Logger { error(...a:any[]):void; warn(...a:any[]):void; info(...a:any[]):void; debug(...a:any[]):void; trace(...a:any[]):void; scope(child: string): Logger; }

export function getLogger(scope?: string): Logger {
  const sc = scope;
  const make = (s?: string): Logger => ({
    error: (...a:any[]) => emit('error', s, a),
    warn:  (...a:any[]) => emit('warn', s, a),
    info:  (...a:any[]) => emit('info', s, a),
    debug: (...a:any[]) => emit('debug', s, a),
    trace: (...a:any[]) => emit('trace', s, a),
    scope(child: string) { return make(s ? `${s}:${child}` : child); }
  });
  return make(sc);
}

// Initialize at module load with current config (idempotent).
initLogger();