import {JsonWebTokenError, verify, sign} from "jsonwebtoken";
import {ServerError} from "../../shared/errors/server-error";
import {UnauthorizedError} from "../../shared/errors/unauthorized-error";
import {IAuthJwt} from "../config/auth.config";
import CmsConfig from "../config/cms.config";
import {RefreshTokenRepository} from "../repositories/refresh-token.repository";
import {IRefreshToken} from "../types/refresh-token.types";
import {v4 as uuidV4} from 'uuid'
import {UserRepository} from "../repositories/user.repository";

export class AuthService {
    private refreshTokenRepository: RefreshTokenRepository
    private userRepository: UserRepository

    constructor() {
        this.refreshTokenRepository = new RefreshTokenRepository()
        this.userRepository = new UserRepository()
    }

    async createAccessToken(payload: IAuthJwt): Promise<string> {
        if (!payload) {
            throw new ServerError('AuthService.createAccessToken at !payload')
        }

        if (!await this.userRepository.findOneByUserUuid(payload?.userUuid)) {
            throw new ServerError('AuthService.createAccessToken at !await this.userRepository.findOneByUserUuid(payload.userUuid')
        }

        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1);

        const refreshTokenToSave: IRefreshToken = {
            userUuid: payload.userUuid,
            refreshToken: payload.refreshToken,
            expiresIn: expirationDate
        }

        await this.refreshTokenRepository.insertNewRefreshToken(refreshTokenToSave)

        return sign(payload, CmsConfig.JWT_SECRET, {expiresIn: '1h'})
    }

    private async verifyToken(token: string): Promise<IAuthJwt> {
        if (!token) {
            throw new ServerError('AuthService.verifyToken at !token')
        }
        let verifiedToken: IAuthJwt

        try {
            verifiedToken = verify(token, CmsConfig.JWT_SECRET) as IAuthJwt
        } catch (error) {
            if (error instanceof JsonWebTokenError && error.message === 'jwt expired') {
                throw new UnauthorizedError('Expired access token');
            } else {
                throw new UnauthorizedError('Invalid access token');
            }
        }

        if (!await this.userRepository.findOneByUserUuid(verifiedToken?.userUuid)) {
            await this.refreshTokenRepository.deleteOneRefreshTokenByUserUuid(verifiedToken?.userUuid)
            throw new UnauthorizedError('User not found')
        }

        return verifiedToken
    }

    private async refreshToken(refreshToken: string): Promise<string> {
        if (!refreshToken) {
            throw new ServerError('AuthService.refreshToken at !refreshToken')
        }

        const token: IRefreshToken = await this.refreshTokenRepository.findOneRefreshToken(refreshToken)

        if (!token || token.expiresIn > new Date()) {
            await this.refreshTokenRepository.deleteOneRefreshToken(refreshToken)
            throw new UnauthorizedError('Expired refresh token, please login again');
        }

        if (!await this.userRepository.findOneByUserUuid(token?.userUuid)) {
            throw new UnauthorizedError('User not found')
        }

        const payload: IAuthJwt = {
            refreshToken: uuidV4(),
            userUuid: token.userUuid
        }

        return this.createAccessToken(payload)
    }
}