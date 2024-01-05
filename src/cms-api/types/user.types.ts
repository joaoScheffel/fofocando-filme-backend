import {TimesTamps} from "./timestamps.types";

export interface IUser extends TimesTamps{
    userUuid: string
    username: string
    email: string

    photoUrl: string
    lastActivity: Date

    typePermission: IUserPermission

    googleSub: string
}


export enum IUserPermission {
    DEFAULT = 'DEFAULT',
    ADMIN = 'ADMIN',
    MASTER = 'MASTER'
}