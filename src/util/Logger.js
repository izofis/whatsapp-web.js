'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Simple file-based logger for WhatsApp Web.js
 * Logs are written to logs/whatsapp-client-YYYY-MM-DD.json in JSON format
 * Daily rotation: Her gün yeni bir dosya oluşturulur
 * 
 * Bu dosya geçici bir çözümdür. Update sonrası kolayca kaldırılabilir veya tekrar eklenebilir.
 * 
 * Kullanım:
 *   const logger = require('./util/Logger');
 *   logger.info('Message');
 *   logger.error('Error', errorObject);
 * 
 * Kaldırma:
 *   1. Bu dosyayı silin: src/util/Logger.js
 *   2. Client.js'ten import satırını kaldırın
 */
class Logger {
    constructor() {
        this.logDir = path.join(process.cwd(), 'logs');
        this.ensureLogDirectory();
    }

    ensureLogDirectory() {
        if (!fs.existsSync(this.logDir)) {
            try {
                fs.mkdirSync(this.logDir, { recursive: true });
            } catch (err) {
                console.error('[Logger] Failed to create log directory:', err.message);
            }
        }
    }

    /**
     * Günlük log dosya adını döndürür
     * Format: whatsapp-client-YYYY-MM-DD.json
     */
    getLogFileName() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        return path.join(this.logDir, `whatsapp-client-${dateStr}.json`);
    }

    writeLog(level, message, ...args) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            args: args.length > 0 ? args : undefined
        };
        
        const logLine = JSON.stringify(logEntry) + '\n';
        
        // Console'a da yaz (renkli)
        const consoleMsg = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        if (level === 'error') {
            console.error(consoleMsg, ...args);
        } else if (level === 'warn') {
            console.warn(consoleMsg, ...args);
        } else {
            console.log(consoleMsg, ...args);
        }
        
        // Günlük dosyaya yaz (her gün yeni dosya)
        try {
            const logFile = this.getLogFileName();
            fs.appendFileSync(logFile, logLine);
        } catch (err) {
            console.error('[Logger] Failed to write log:', err.message);
        }
    }

    info(message, ...args) {
        this.writeLog('info', message, ...args);
    }

    warn(message, ...args) {
        this.writeLog('warn', message, ...args);
    }

    error(message, ...args) {
        this.writeLog('error', message, ...args);
    }

    debug(message, ...args) {
        this.writeLog('debug', message, ...args);
    }
}

// Singleton instance
const logger = new Logger();

module.exports = logger;
