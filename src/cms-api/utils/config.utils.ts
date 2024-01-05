import CmsConfig from "../config/cms.config";

export function getCmsApplicationUrl(): string {
    if (CmsConfig.NODE_ENV.toLowerCase() === 'development') {
        return 'http://localhost:' + CmsConfig.CMS_PORT
    }

    return ''
}