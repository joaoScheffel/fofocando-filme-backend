import {model, Schema} from "mongoose";
import {IUser} from "../types/user.types";
import {ServerError} from "../../shared/errors/server-error";

const userSchema: Schema = new Schema<IUser>({
    userUuid: {
        type: String,
        required: [true, "the 'userUuid' in userSchema must be informed!"],
        unique: true
    },
    username: {
      type: String,
      required: [true, "the 'username' in userSchema must be informed!"]
    },
    email: {
        type: String,
        required: [true, "the 'email' in userSchema must be informed!"],
        unique: true
    },
    typePermission: {
        type: String,
        required: [true, "the 'typePermission' in userSchema must be informed!"]
    },
    lastActivity: {
        type: Date,
        required: [true, "the 'lastActivity' in userSchema must be informed!"]
    },
    photoUrl: {
        type: String,
    },
    googleSub: {
        type: String,
        required: [true, "the 'googleSub' in userSchema must be informed!"],
        unique: true
    }
}, {timestamps: true})

const userCollection = model<IUser>('userCollection', userSchema, 'users')

export class UserRepository {
    async insertNewUser(config: IUser): Promise<IUser> {
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

    async findOneBySub (sub: string): Promise<IUser> {
        if (!sub) {
            throw new ServerError('UserRepository.insertNewRefreshToken at !email')
        }

        return userCollection.findOne({googleSub: sub})
    }
}