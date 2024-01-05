import {NextFunction, Request, Response} from "express";
import {GoogleApiService} from "../services/google-api.service";
import {AuthService} from "../services/auth.service";
import {authService, googleApiService} from "../../instances";

export class AuthController {
    private authService: AuthService
    private googleApiService: GoogleApiService

    constructor() {
        this.authService = authService
        this.googleApiService = googleApiService
    }

    async generateAuthUrl(req: Request, res: Response, next: NextFunction) {
        const authUrl: string = await this.googleApiService.generateAuthUrl()

        return res.status(200).json({message: 'Auth url generated successfully', authUrl: authUrl})
    }

    async redirectAuthLogin(req: Request, res: Response, next: NextFunction) {
        const accessToken: string = await this.authService.validateAuthLogin(req, res)

        return res.status(200).json({message: 'User logged in successfully', accessToken: accessToken})
    }
}