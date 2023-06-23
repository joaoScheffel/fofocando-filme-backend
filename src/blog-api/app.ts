import express, {Express} from "express"
import morgan from 'morgan'
import BlogConfig from "./blog-config"

export class BlogApiApp {
    private _express: Express

    constructor() {
        this._express = express()
        this.mainConfiguration()
    }

    private mainConfiguration(): void {
        BlogConfig.load()

        this.middlewares()

        this.appListen()
    }

    private middlewares(): void {
        this._express.use(morgan('dev'))
        this._express.use(express.json())
        this._express.use(express.urlencoded({extended: true}))
    }

    private appListen(): void {
        const port = BlogConfig.BLOG_PORT
        this._express.listen(port, () => {
            console.log(`Server running in http://localhost:${port} `)
        })
    }
}