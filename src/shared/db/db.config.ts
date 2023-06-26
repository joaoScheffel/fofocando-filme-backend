import mongoose from 'mongoose'
import logger from "../utils/logger";
import Config from "../config/config";

export class DbConfig {
    protected _uri: string
    protected apiName: string

    constructor(apiName: string) {
        this.apiName = apiName
        Config.load()
        this._uri = Config.DATABASE_URL
        this.mainConfiguration()
    }

    mainConfiguration() {
        this.connectToDatabase()
    }

    async connectToDatabase(): Promise<void> {
        logger.debug(`Starting ${this.apiName} db configuration.`)
        try {
            await mongoose.connect(this._uri);
            logger.info(`Successfully connected to ${this.apiName} db!`)
        } catch (e) {
            logger.error(`Error connecting to ${this.apiName} db, error log: ` + e);
        }
    }
}