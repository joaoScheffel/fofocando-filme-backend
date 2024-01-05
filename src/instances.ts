import {BlogApiApp} from "./blog-api/app";
import {AuthController} from "./cms-api/controllers/auth.controller";
import {AuthService} from "./cms-api/services/auth.service";
import {GoogleApiService} from "./cms-api/services/google-api.service";
import {UserRepository} from "./cms-api/repositories/user.repository";
import {CmsApiApp} from "./cms-api/app";
import CmsConfig from "./cms-api/config/cms.config";
import {UserService} from "./cms-api/services/user.service";
import {AuthTokenRepository} from "./cms-api/repositories/auth-token.repository";

CmsConfig.load()

export const userRepository: UserRepository = new UserRepository()
export const userService: UserService = new UserService()
export const authTokenRepository: AuthTokenRepository = new AuthTokenRepository()
export const googleApiService: GoogleApiService = new GoogleApiService()
export const authService: AuthService = new AuthService()
export const authController: AuthController = new AuthController()
export const cmsApiApp: CmsApiApp = new CmsApiApp()
export const blogApiApp: BlogApiApp = new BlogApiApp()
