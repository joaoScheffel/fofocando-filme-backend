import {blogApiApp, cmsApiApp} from "./instances";

try {
    cmsApiApp.mainConfiguration()
    blogApiApp.mainConfiguration()
} catch (e) {
    console.log('[INDEX]: Uncaught error!')
    console.log(e)
}