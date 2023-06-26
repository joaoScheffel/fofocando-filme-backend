import CmsConfig from "./cms.config";

export const jwtConfig = {
    secret: CmsConfig.JWT_SECRET,
    expiresIn: '1d',
}