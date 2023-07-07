import {TimesTamps} from "./timestamps.types";

export interface IUser extends TimesTamps{
    userUuid: string
    username: string
    email: string
    telephone: string

    photoUrl: string
    lastActivity: Date

    password: string
    passwordUpdatedAt: Date
    typePermission: IUserPermission
}


export enum IUserPermission {
    DEFAULT = 'DEFAULT',
    ADMIN = 'ADMIN',
    MASTER = 'MASTER'
}