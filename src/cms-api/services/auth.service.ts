import {Request, Response} from "express";
import {GoogleApiService} from "./google-api.service";
import {TokenPayload} from "google-auth-library";
import {GetTokenResponse} from "google-auth-library/build/src/auth/oauth2client";
import {IAuthRedirectQueryParams} from "../config/auth.config";
import {ServerError} from "../../shared/errors/server-error";
import {UnauthorizedError} from "../../shared/errors/unauthorized-error";
import {authTokenRepository, googleApiService, userRepository, userService} from "../../instances";
import {parseQueryParams} from "../../shared/utils/string.utils";
import {UserRepository} from "../repositories/user.repository";
import {IUser} from "../types/user.types";
import {BadRequestError} from "../../shared/errors/bad-request-error";
import {UserService} from "./user.service";
import {AuthTokenRepository} from "../repositories/auth-token.repository";
import {IAuthTokens} from "../types/auth-token.types";

export class AuthService {
    private googleApiService: GoogleApiService
    private userRepository: UserRepository
    private userService: UserService
    private authTokenRepository: AuthTokenRepository

    constructor() {
        this.googleApiService = googleApiService
        this.userRepository = userRepository
        this.userService = userService
        this.authTokenRepository = authTokenRepository
    }

   async validateAuthLogin(req: Request, res: Response): Promise<string> {
       let queryParams: IAuthRedirectQueryParams

       try {
           queryParams = parseQueryParams(req.url)

       } catch (e) {
           throw new BadRequestError('Invalid url')
       }

       if (!queryParams?.code) {
           throw new BadRequestError('Invalid code parameter')
       }

       const tokenResponse: GetTokenResponse = await this.googleApiService.verifyCode(queryParams.code)

       if (!tokenResponse?.tokens?.access_token) {
           throw new UnauthorizedError('User access token not found')
       }

       const payload: TokenPayload = await this.googleApiService.getPayloadFromTokenResponse(tokenResponse)

       const user: IUser = await this.userService.createOrGetUserByTokenPayload(payload)

       if (!user) {
           throw new ServerError('AuthService.validateAuthLogin at !user')
       }

       const authToken: IAuthTokens = {
           ...tokenResponse.tokens,
           userUuid: user.userUuid
       }

       await this.authTokenRepository.upsertAuthToken(authToken)

       return tokenResponse.tokens.id_token
   }
}