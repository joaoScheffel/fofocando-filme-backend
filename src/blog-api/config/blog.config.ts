import dotenv from "dotenv"
import Config from "../../shared/config/config"

export default class BlogConfig extends Config{
    static BLOG_PORT: number
    static load(): void {
        dotenv.config()
        this.BLOG_PORT = parseInt(process.env.BLOG_PORT || "7878")

        this.validateBlogConfig()
    }

    private static validateBlogConfig(): void {
        const requiredVariables = [
            "BLOG_PORT",
        ]

        for (const variable of requiredVariables) {
            if (!this[variable]) {
                throw new Error(`Environment blog variable ${variable} is not set.`)
            }
        }
    }
}