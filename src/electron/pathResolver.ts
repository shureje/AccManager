import { app } from "electron";
import { isDev } from "./util.js";
import path from "path";

export function getPreloadPath() {
    return path.join(
        app.getAppPath(),
        isDev() ? '' : '..',
        'dist-electron/preload.cjs'
    )
}

export function getIconPath() {
    return path.join(
        app.getAppPath(),
        isDev() ? 'src/electron/assets/x.ico' : 'dist-electron/x.ico'
    )
}