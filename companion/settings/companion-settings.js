import * as messaging from "messaging";
import { settingsStorage } from "settings";

////////////////////////////////////////////////////////////////////
///   functions
export function initialize() {
  // try load settings or apply defaults 
  applySettingOrDefault("dateVisible", true);
  applySettingOrDefault("sensorsVisible", true);
  applySettingOrDefault("batteryVisible", true);
  applySettingOrDefault("displayModeNight", false);
  applySettingOrDefault("autoDisplayMode", false);
  
  // handle changes on settings 
  settingsStorage.addEventListener("change", evt => {
    /* debug */
    console.log(`initialize companion settings -> ${evt}`);
    
    if (evt.oldValue !== evt.newValue) {
      sendValue(evt.key, evt.newValue);
    }
  });
}
function applySettingOrDefault(ident, defaultValue) {
  let currentValue = settingsStorage.getItem(ident);
  /* debug
  */
  console.log("applySettingOrDefault -> ident=" + ident + "; current=" + currentValue + "; default=" + defaultValue); 
  settingsStorage.setItem(ident, currentValue === null ? JSON.stringify(defaultValue) : currentValue);
}

function sendValue(key, val) {
  /* debug
  console.log(`companion settings -> ${key}`);
  */
  if (val) {
    sendSettingData({
      key: key,
      value: JSON.parse(val)
    });
  }
}
function sendSettingData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log("No peerSocket connection");
  }
}