import {model, Schema} from "mongoose";
import {IAuthTokens} from "../types/auth-token.types";
import {ServerError} from "../../shared/errors/server-error";

const authTokenSchema: Schema = new Schema<IAuthTokens>({
    userUuid: {
        type: String,
        required: [true, "the 'userUuid' in authTokenSchema must be informed!"],
        unique: true
    },
    access_token: {
        type: String,
        required: [true, "the 'access_token' in authTokenSchema must be informed!"],
        unique: true
    },
    refresh_token: {
        type: String,
        required: [true, "the 'refresh_token' in authTokenSchema must be informed!"],
        unique: true
    },
    scope: {
        type: String,
        required: [true, "the 'scope' in authTokenSchema must be informed!"]
    },
    token_type: {
        type: String,
        required: [true, "the 'token_type' in authTokenSchema must be informed!"]
    },
    expiry_date: {
        type: Number,
        required: [true, "the 'expiry_date' in authTokenSchema must be informed!"]
    },
    id_token: {
        type: String,
        required: [true, "the 'id_token' in authTokenSchema must be informed!"],
        unique: true
    }
}, {
    timestamps: true
})

const authTokensCollection = model<IAuthTokens>('authTokensCollection', authTokenSchema, 'authTokens')

export class AuthTokenRepository {
    async insertNewAuthToken(config: IAuthTokens): Promise<IAuthTokens> {
        if (!config) {
            throw new ServerError('AuthTokenRepository.insertNewAuthToken at !config')
        }

        return authTokensCollection.create({...config})
    }

    async findOneByUserUuid (userUuid: string): Promise<IAuthTokens> {
        if (!userUuid) {
            throw new ServerError('AuthTokenRepository.findOneByUserUuid at !userUuid')
        }

        return authTokensCollection.findOne({userUuid: userUuid})
    }

    async upsertAuthToken(config: IAuthTokens): Promise<IAuthTokens> {
        if (!config) {
            throw new ServerError('AuthTokenRepository.upsertAuthToken at !config');
        }

        return authTokensCollection.findOneAndUpdate({ userUuid: config.userUuid }, { $set: config }, { upsert: true, new: true, runValidators: true })
    }
}