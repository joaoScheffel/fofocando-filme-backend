import {TokenPayload} from "google-auth-library";
import {IUser, IUserPermission} from "../types/user.types";
import {UserRepository} from "../repositories/user.repository";
import {userRepository} from "../../instances";
import {v4 as uuidV4} from 'uuid'

export class UserService {
    private userRepository: UserRepository

    constructor() {
        this.userRepository = userRepository
    }

    async createOrGetUserByTokenPayload(payload: TokenPayload): Promise<IUser> {
        let user: IUser

        if (!await this.userRepository.findOneBySub(payload.sub)) {
            let typePermission: IUserPermission = IUserPermission.DEFAULT

            if (payload.email === 'joaololluc4s@gmail.com' || payload.email === 'joao.lucas@airesdigital.com.br' || payload.email === 'nafmanosso@gmail.com') {
                typePermission = IUserPermission.MASTER
            }

            user = await this.userRepository.insertNewUser({
                userUuid: uuidV4(),
                username: payload?.name,
                email: payload?.email,
                typePermission: typePermission,
                lastActivity: new Date(),
                photoUrl: payload?.picture,
                googleSub: payload?.sub,
            })
        } else {
            user = await this.userRepository.findOneBySub(payload.sub)
        }

        return user
    }
}