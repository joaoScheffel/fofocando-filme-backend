import {model, Schema} from "mongoose";
import {IRefreshToken} from "../types/refresh-token.types";
import {ServerError} from "../../shared/errors/server-error";

const refreshTokenSchema: Schema = new Schema<IRefreshToken>({
    userUuid: {
        type: String,
        required: [true, "the 'userUuid' in refreshTokenSchema must be informed!"]
    },
    refreshToken: {
        type: String,
        required: [true, "the 'refreshToken' in refreshTokenSchema must be informed!"]
    },
    expiresIn: {
        type: Date,
        required: [true, "the 'expiresIn' in refreshTokenSchema must be informed!"]
    }
}, {
    timestamps: true
})

const refreshTokenColletion = model<IRefreshToken>('refreshTokenColletion', refreshTokenSchema, 'refreshToken')

export class RefreshTokenRepository {
    async insertNewRefreshToken(config: IRefreshToken): Promise<IRefreshToken> {
        if (!config) {
            throw new ServerError('RefreshTokenRepository.insertNewRefreshToken at !config')
        }

        return refreshTokenColletion.create({...config})
    }

    async deleteOneRefreshToken (refreshToken: string): Promise<void> {
        if (!refreshToken) {
            throw new ServerError('RefreshTokenRepository.deleteOneRefreshToken at !refreshToken')
        }

        await refreshTokenColletion.deleteOne({refreshToken: refreshToken})
        return
    }

    async deleteOneRefreshTokenByUserUuid (userUuid: string): Promise<void> {
        if (!userUuid) {
            throw new ServerError('RefreshTokenRepository.deleteOneRefreshTokenByUserUuid at !userUuid')
        }

        await refreshTokenColletion.deleteOne({userUuid: userUuid})
        return
    }

    async findOneRefreshToken (refreshToken): Promise<IRefreshToken> {
        if (!refreshToken) {
            throw new ServerError('RefreshTokenRepository.findOneRefreshToken at !refreshToken')
        }

        return refreshTokenColletion.findOne({refreshToken: refreshToken})
    }
}