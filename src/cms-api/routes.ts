import {Router} from "express";

export class Routes {
    private routes = Router()

    get mainConfiguration() {
        this.authRoutes()

        return this.routes
    }

    private authRoutes() {
        this.routes.post('/auth/refresh-token')
    }
}