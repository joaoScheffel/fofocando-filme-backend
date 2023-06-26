import express, {Express} from "express"
import morgan from 'morgan'
import CmsConfig from "./config/cms.config"
import logger from "../shared/utils/logger";
import {DbConfig} from "../shared/db/db.config";
import {RequestErrorMiddleware} from "../shared/middlewares/request-error.middleware";

export class CmsApiApp {
    private _express: Express
    protected apiName: string = "Cms Api"

    constructor() {
        this._express = express()
        this.mainConfiguration()
    }

    private mainConfiguration(): void {
        CmsConfig.load()

        this.middlewares()

        this.startDb()

        //This middleware must be fixed before appListen
        this._express.use(new RequestErrorMiddleware().validateErrors)
        this.appListen()
    }

    private middlewares(): void {
        logger.debug(`Setting ${this.apiName} middlewares!`)
        this._express.use(morgan('dev'))
        this._express.use(express.json())
        this._express.use(express.urlencoded({extended: true}))
        logger.info(`Successfully configured ${this.apiName} middlewares!`)
    }

    private startDb() {
        new DbConfig(this.apiName)
    }

    private appListen(): void {
        const port = CmsConfig.CMS_PORT
        this._express.listen(port, () => {
            logger.info(`${this.apiName} Server running in http://localhost:${port}`)
        })
    }
}