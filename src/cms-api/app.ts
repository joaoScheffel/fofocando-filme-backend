import express, {Express} from "express"
import morgan from 'morgan'
import CmsConfig from "./cms-config"

export class CmsApiApp {
    private _express: Express

    constructor() {
        this._express = express()
        this.mainConfiguration()
    }

    private mainConfiguration(): void {
        CmsConfig.load()

        this.middlewares()

        this.appListen()
    }

    private middlewares(): void {
        this._express.use(morgan('dev'))
        this._express.use(express.json())
        this._express.use(express.urlencoded({extended: true}))
    }

    private appListen(): void {
        const port = CmsConfig.CMS_PORT
        this._express.listen(port, () => {
            console.log(`Server running in http://localhost:${port} `)
        })
    }
}