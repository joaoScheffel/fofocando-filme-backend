import dotenv from "dotenv"
import Config from "../shared/config"

export default class CmsConfig extends Config{
    static CMS_PORT: number
    static CMS_API_KEY: string
    static load(): void {
        dotenv.config()
        this.CMS_PORT = parseInt(process.env.CMS_PORT || "8787")
        this.CMS_API_KEY = process.env.CMS_API_KEY || null

        this.validateCmsConfig()
    }

    private static validateCmsConfig(): void {
        const requiredVariables = [
            "CMS_PORT",
            "CMS_API_KEY",
        ]

        for (const variable of requiredVariables) {
            if (!this[variable]) {
                throw new Error(`Environment cms variable ${variable} is not set.`)
            }
        }
    }
}