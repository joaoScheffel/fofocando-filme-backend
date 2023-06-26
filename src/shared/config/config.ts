import dotenv from "dotenv"

export default class Config {
    static NODE_ENV: string
    static DATABASE_URL: string
    static JWT_SECRET: string

    static load(): void {
        dotenv.config()

        this.NODE_ENV = process.env.NODE_ENV || null
        this.DATABASE_URL = process.env.DATABASE_URL || null

        this.validate()
    }

    private static validate(): void {
        const requiredVariables = [
            "DATABASE_URL",
            "NODE_ENV",
        ]

        for (const variable of requiredVariables) {
            if (!this[variable]) {
                throw new Error(`Environment variable ${variable} is not set.`)
            }
        }
    }
}