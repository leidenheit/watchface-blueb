/*
 *  Copyright:  Attila Varga, 2020 
 *  Project:    Watch Face ©BlueBeauty
 *  Mail:       attila.varga.dev@gmail.com
 */

import * as messaging from "messaging";
import * as fileSystem from "fs";
import { me } from "appbit";
import { me as device } from "device";

////////////////////////////////////////////////////////////////////
///   variables & constants  
const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";
let blueBeautySettings, onSettingsChange;

////////////////////////////////////////////////////////////////////
///   entry point
// Received message containing settings data
messaging.peerSocket.addEventListener("message", function(evt) {
  /* debug;
  console.log(`messagingApi.messageReceived -> ${evt.data.key}`)
  */
  
  blueBeautySettings[evt.data.key] = evt.data.value;
  onSettingsChange(blueBeautySettings);
})
// register for unload event
me.addEventListener("unload", saveBlueBeautySettings);

////////////////////////////////////////////////////////////////////
///   functions
export function initializeWithCallback(callback) {
  blueBeautySettings = loadBlueBeautySettings();
  /* debug;
  console.log(`initializeWithCallback -> settings: ${blueBeautySettings}`);
  */
  onSettingsChange = callback;
  onSettingsChange(blueBeautySettings);
}
function loadBlueBeautySettings() {
  try {
    return fileSystem.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    console.log(`exception@loadBlueBeautySettings -> ${ex}`);
    // fallback
    return {"dateVisible": true, "sensorsVisible": true, "batteryVisible": true, "displayModeNight": false, "autoDisplayMode": false};
  }
}
function saveBlueBeautySettings() {
  /* debug;
  console.log(`saveBlueBeautySettings -> ${JSON.stringify(blueBeautySettings)}`);
  */
  fileSystem.writeFileSync(SETTINGS_FILE, blueBeautySettings, SETTINGS_TYPE);
}