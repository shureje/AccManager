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
  if (isDev()) {
    return path.join(app.getAppPath(), 'src/electron/assets/x.ico');
  } else {
    return path.join(process.resourcesPath, 'x.ico');
  }
}