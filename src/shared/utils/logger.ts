import * as winston from 'winston';

class Logger {
    private logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `[${level}] [${timestamp}]: ${message}`
                }),
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: 'backend.log' }),
            ],
        });
    }

    public info(message: string): void {
        this.logger.log('info', message)
    }

    public error(message: string): void {
        this.logger.log('error', message)
    }

    public warn(message: string): void {
        this.logger.log('warn', message)
    }

    public debug(message: string): void {
        this.logger.log('debug', message)
    }
}

export default new Logger();