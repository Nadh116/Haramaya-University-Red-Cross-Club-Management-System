const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
};

class Logger {
    constructor() {
        this.logLevel = process.env.LOG_LEVEL || 'INFO';
        this.logToFile = process.env.NODE_ENV === 'production';
    }

    formatMessage(level, message, meta = {}) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            ...meta
        };

        if (process.env.NODE_ENV === 'development') {
            return `[${timestamp}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
        }

        return JSON.stringify(logEntry);
    }

    writeToFile(level, formattedMessage) {
        if (!this.logToFile) return;

        const date = new Date().toISOString().split('T')[0];
        const logFile = path.join(logsDir, `${date}.log`);
        const errorLogFile = path.join(logsDir, `${date}-error.log`);

        // Write to general log file
        fs.appendFileSync(logFile, formattedMessage + '\n');

        // Write errors to separate error log file
        if (level === 'ERROR') {
            fs.appendFileSync(errorLogFile, formattedMessage + '\n');
        }
    }

    log(level, message, meta = {}) {
        const currentLevel = LOG_LEVELS[this.logLevel.toUpperCase()] || LOG_LEVELS.INFO;
        const messageLevel = LOG_LEVELS[level.toUpperCase()] || LOG_LEVELS.INFO;

        if (messageLevel <= currentLevel) {
            const formattedMessage = this.formatMessage(level, message, meta);

            // Console output
            console.log(formattedMessage);

            // File output for production
            this.writeToFile(level, formattedMessage);
        }
    }

    error(message, meta = {}) {
        this.log('ERROR', message, meta);
    }

    warn(message, meta = {}) {
        this.log('WARN', message, meta);
    }

    info(message, meta = {}) {
        this.log('INFO', message, meta);
    }

    debug(message, meta = {}) {
        this.log('DEBUG', message, meta);
    }

    // Express middleware for request logging
    requestLogger() {
        return (req, res, next) => {
            const start = Date.now();

            res.on('finish', () => {
                const duration = Date.now() - start;
                const logData = {
                    method: req.method,
                    url: req.url,
                    status: res.statusCode,
                    duration: `${duration}ms`,
                    ip: req.ip || req.connection.remoteAddress,
                    userAgent: req.get('User-Agent')
                };

                if (res.statusCode >= 400) {
                    this.error(`HTTP ${res.statusCode} - ${req.method} ${req.url}`, logData);
                } else {
                    this.info(`HTTP ${res.statusCode} - ${req.method} ${req.url}`, logData);
                }
            });

            next();
        };
    }

    // Security event logging
    securityLog(event, details = {}) {
        this.error(`SECURITY EVENT: ${event}`, {
            ...details,
            timestamp: new Date().toISOString(),
            severity: 'HIGH'
        });
    }
}

module.exports = new Logger();