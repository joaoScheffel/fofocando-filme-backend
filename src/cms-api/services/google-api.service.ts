import {LoginTicket, OAuth2Client, TokenPayload} from 'google-auth-library';
import CmsConfig from "../config/cms.config";
import {GetTokenResponse} from "google-auth-library/build/src/auth/oauth2client";
import {UnauthorizedError} from "../../shared/errors/unauthorized-error";
import {getCmsApplicationUrl} from "../utils/config.utils";
import {ServerError} from "../../shared/errors/server-error";

export class GoogleApiService {
    private oauthClient: OAuth2Client

    constructor() {
        this.oauthClient = new OAuth2Client(CmsConfig.GOOGLE_OAUTH_ID, CmsConfig.GOOGLE_OAUTH_SECRET, getCmsApplicationUrl() + '/auth/redirect-google')
    }

    async generateAuthUrl(): Promise<string> {
        try {
            const loginUrl: string = this.oauthClient.generateAuthUrl({
                access_type: 'offline',
                scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
            })

            return loginUrl
        } catch (e) {
            throw new ServerError('GoogleApiService.generateAuthUrl')
        }
    }

    async verifyCode(code: string): Promise<GetTokenResponse> {
        if (!code) {
            throw new UnauthorizedError('Google user code not found')
        }

        let tokenResponse: GetTokenResponse

        try {
            tokenResponse = await this.oauthClient.getToken(code)

        } catch (e) {
            throw new UnauthorizedError('Invalid or expired code, please try again')
        }

        if (!Object.keys(tokenResponse).length) {
            throw new UnauthorizedError('Google user token response not found')
        }

        return tokenResponse
    }

    async getPayloadFromTokenResponse(tokenResponse: GetTokenResponse): Promise<TokenPayload> {
        if (!Object.keys(tokenResponse).length) {
            throw new UnauthorizedError('Google user token response not found')
        }

        const idToken: string = tokenResponse?.tokens?.id_token

        if (!idToken) {
            throw new UnauthorizedError('Google user token id not found')
        }

        let ticket: LoginTicket

        try {
            ticket = await this.oauthClient.verifyIdToken({idToken, audience: this.oauthClient._clientId})

        } catch (e) {
            throw new ServerError('GoogleApiService.getPayloadFromTokenResponse')
        }

        const userPayload: TokenPayload = ticket.getPayload()

        if (!Object.keys(userPayload).length) {
            throw new UnauthorizedError('Google user payload not found')
        }

        return userPayload
    }

    async validateAccessToken(accessToken: string): Promise<TokenPayload> {
        if (!accessToken) {
            throw new UnauthorizedError('Access token not provided');
        }

        try {
            const ticket = await this.oauthClient.verifyIdToken({
                idToken: accessToken,
                audience: this.oauthClient._clientId
            });

            const payload = ticket.getPayload()

            if (!payload) {
                throw new UnauthorizedError('Invalid access token')
            }

            return payload;
        } catch (e) {
            if (e.message.toLowerCase().includes('token used too late')) {
                throw new UnauthorizedError('Access token expired')
            }

            throw new UnauthorizedError('Failed to validate access token');
        }
    }
}