import {model, Schema} from "mongoose";
import {IUser} from "../types/user.types";
import {ServerError} from "../../shared/errors/server-error";

const userSchema: Schema = new Schema<IUser>({
    userUuid: {
        type: String,
        required: [true, "the 'userUuid' in userSchema must be informed!"]
    },
    username: {
      type: String,
      required: [true, "the 'username' in userSchema must be informed!"]
    },
    email: {
        type: String,
        required: [true, "the 'email' in userSchema must be informed!"]
    },
    password: {
        type: String,
        required: [true, "the 'password' in userSchema must be informed!"]
    },
    typePermission: {
        type: String,
        required: [true, "the 'typePermission' in userSchema must be informed!"]
    },
    lastActivity: {
        type: Date,
        required: [true, "the 'lastActivity' in userSchema must be informed!"]
    },
    telephone: {
        type: String,
    },
    photoUrl: {
        type: String,
    },
    passwordUpdatedAt: {
        type: Date
    },
    isGoogleLogin: {
        type: Boolean
    }
})

const userCollection = model<IUser>('userCollection', userSchema, 'users')

export class UserRepository {
    async insertNewRefreshToken(config: IUser): Promise<IUser> {
        if (!config) {
            throw new ServerError('UserRepository.insertNewRefreshToken at !config')
        }

        return userCollection.create({...config})
    }

    async findOneByUserUuid (userUuid: string): Promise<IUser> {
        if (!userUuid) {
            throw new ServerError('UserRepository.insertNewRefreshToken at !userUuid')
        }

        return userCollection.findOne({userUuid: userUuid})
    }
}