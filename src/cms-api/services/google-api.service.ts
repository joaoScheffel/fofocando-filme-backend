import {OAuth2Client, TokenPayload} from 'google-auth-library';
import CmsConfig from "../config/cms.config";
import {GetTokenResponse} from "google-auth-library/build/src/auth/oauth2client";
import {UnauthorizedError} from "../../shared/errors/unauthorized-error";

export class GoogleApiService {
    private oauthClient: OAuth2Client;

    constructor() {
        CmsConfig.load()

        this.oauthClient = new OAuth2Client(CmsConfig.GOOGLE_OAUTH_ID)
    }

    async verifyCode(code: string): Promise<TokenPayload> {
        const tokenResponse: GetTokenResponse = await this.oauthClient.getToken(code)
        const idToken: string = tokenResponse.tokens.id_token

        if (!idToken) {
            throw new UnauthorizedError('Google user token id not found')
        }

        const ticket = await this.oauthClient.verifyIdToken({idToken, audience: this.oauthClient._clientId});

        const userPayload: TokenPayload = ticket.getPayload()

        if (!Object.keys(userPayload).length) {
            throw new UnauthorizedError('Google user payload not found')
        }

        return userPayload
    }
}