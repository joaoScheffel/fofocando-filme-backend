import {TimesTamps} from "./timestamps.types";
import {Credentials} from "google-auth-library";

export interface IAuthTokens extends TimesTamps, Credentials{
    userUuid: string
}