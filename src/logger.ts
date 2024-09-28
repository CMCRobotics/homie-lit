// logger.ts
import log from 'loglevel';

// Set the default log level
log.setLevel(log.levels.INFO);

// Create a custom logger that adds timestamps
const logger = {
  debug: (message: string, ...args: any[]) => log.debug(`[${new Date().toISOString()}] ${message}`, ...args),
  info: (message: string, ...args: any[]) => log.info(`[${new Date().toISOString()}] ${message}`, ...args),
  warn: (message: string, ...args: any[]) => log.warn(`[${new Date().toISOString()}] ${message}`, ...args),
  error: (message: string, ...args: any[]) => log.error(`[${new Date().toISOString()}] ${message}`, ...args),
};

export default logger;