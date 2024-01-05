import {Router} from "express";
import {authController} from "../instances";

export class Routes {
    private routes = Router()

    get mainConfiguration(): Router {
        this.authRoutes()

        return this.routes
    }

    private authRoutes() {
        this.routes.get('/auth/generate-auth-url', authController.generateAuthUrl.bind(authController))
        this.routes.get('/auth/redirect-google', authController.redirectAuthLogin.bind(authController))
        this.routes.post('/auth/refresh-token')
    }
}