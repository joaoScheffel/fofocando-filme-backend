import {TimesTamps} from "./timestamps.types";


export interface IRefreshToken extends TimesTamps{
    userUuid: string
    refreshToken: string
    expiresIn: Date
}