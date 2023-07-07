import CmsConfig from "./cms.config";

export interface IAuthJwt {
    userUuid: string,
    refreshToken: string,
}