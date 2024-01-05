import {UserRepository} from "../repositories/user.repository";
import {UserService} from "./user.service";
import {userRepository, userService} from "../../instances";

export class AuthTokenService {
    private userRepository: UserRepository
    private userService: UserService

    constructor() {
        this.userRepository = userRepository
        this.userService = userService
    }
}