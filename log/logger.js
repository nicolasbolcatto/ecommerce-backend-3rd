import winston from "winston"

function buildConsoleLogger() {
    return winston.createLogger({
        transports: [new winston.transports.Console( { level: 'info' })]
    })
}

function buildFileLogger() {
    
    return winston.createLogger({
        transports: [
            new winston.transports.File( { filename: './log/warn.log', level: 'warn' }),
            new winston.transports.File( { filename: './log/error.log', level: 'error' })
        ]
    })
}

export const consoleLogger = buildConsoleLogger()
export const fileLogger = buildFileLogger()