// logger.ts
import log from 'loglevel';

// Set the default log level
log.setLevel(log.levels.INFO);

// Create a custom logger that adds timestamps
const logger = log.getLogger('homie-lit');
logger.setLevel('info');

export default logger;