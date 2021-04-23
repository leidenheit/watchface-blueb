/*
 *  Copyright:  Attila Varga, 2020 
 *  Project:    Watch Face ©BlueBeauty
 *  Mail:       attila.varga.dev@gmail.com
 */

import clock from "clock";
import document from "document";
import { HeartRateSensor } from "heart-rate";
import { today as userActivityToday } from "user-activity";
import { battery } from "power";
import { display } from "display";
import * as util from "../common/utils";
import { me as appbit } from "appbit";
import * as deviceSettings from "./device/settings";
import * as localeHelper from "../common/locale-helper";
import { preferences } from "user-settings";
import * as messaging from "messaging";

////////////////////////////////////////////////////////////////////
//    constants
const PERMISSION_HEART_RATE = "access_heart_rate";
const PERMISSION_USER_ACTIVITY = "access_activity";

////////////////////////////////////////////////////////////////////
///   permission check     
const userActivityPermissionGranted = appbit.permissions.granted(PERMISSION_USER_ACTIVITY);
const hrPermissionGranted = appbit.permissions.granted(PERMISSION_HEART_RATE);

////////////////////////////////////////////////////////////////////
///   sensors     
const sensorHR = HeartRateSensor && appbit.permissions.granted(PERMISSION_HEART_RATE) ? new HeartRateSensor() : null;

////////////////////////////////////////////////////////////////////
///   device
const deviceBattery = battery;

////////////////////////////////////////////////////////////////////
///   ui elements     
// clock
// const uiClockHours = document.getElementById("labelClockHours");
// const uiClockMinutes = document.getElementById("labelClockMinutes");
// const uiClockSeconds = document.getElementById("labelClockSeconds");
const uiClockFull = document.getElementById("labelClockFull");
// date
const uiDate = document.getElementById("labelDate");
// heart rate
const uiHeartRate = document.getElementById("labelHeartRate");
const uiHeartRateIcon = document.getElementById("heartRateIcon");
const uiHeartRateSatellite = document.getElementById("heartSatellite");
const uiHeartRateLine = document.getElementById("heartSatellitePath");
const gHeartRateGroup = document.getElementById("heartRate");
// steps-
const uiSteps = document.getElementById("labelSteps");
const uiStepsIcon = document.getElementById("stepsIcon");
const uiStepsSatellite = document.getElementById("stepsSatellite");
const uiStepsLine = document.getElementById("stepsSatellitePath");
// cals
const uiCals = document.getElementById("labelCals");
const uiCalsIcon = document.getElementById("calsIcon");
const uiCalsSatellite = document.getElementById("calsSatellite");
const uiCalsLine = document.getElementById("calsSatellitePath");
// active zone minutes
const uiAzm = document.getElementById("labelAzm");
const uiAzmIcon = document.getElementById("azmIcon");
const uiAzmSatellite = document.getElementById("azmSatellite");
const uiAzmLine = document.getElementById("azmSatellitePath");
// battery
const uiChargeLevel = document.getElementById("labelChargeLevel");
const uiChargeLevelRect = document.getElementById("batteryIcon");
// groups
const animGroupBlueBeauty = document.getElementById("animGroupBlueBeauty");

// earth 
const imgSurface1 = document.getElementById("surface1"); 
const imgSurface2 = document.getElementById("surface2");
const imgClouds1 = document.getElementById("clouds1"); 
const imgClouds2 = document.getElementById("clouds2");

let autoDisplayMode = false;
let useNightDisplayMode = false;
let isDayTime = true;
let previousDayTimePresent = false;

////////////////////////////////////////////////////////////////////
///   functions  
function enableAnimations(doEnable) {
  console.log("enableAnimations with value " + doEnable);
  if (doEnable === true) {
    animGroupBlueBeauty.animate("enable");
  } else {
    animGroupBlueBeauty.animate("disable");  
  }
}
function enableSensors(doEnable) {
  console.log("enableSensors with value " + doEnable);
  if (doEnable === true) {
    if (sensorHR) {
      sensorHR.start();
    }
  } else {
    if (sensorHR) {
      sensorHR.stop();
    }
  }
}
function formatDate(objDate, day, weekDay, month) {
  /* debug
  console.log(`${day}, ${weekDay}, ${month}`);
  */
  objDate.text = localeHelper.localizedDate(day, weekDay, month);
}
function updateActiviesAndChargeLevel() {
    // cals
    uiCals.text = userActivityPermissionGranted ? userActivityToday.adjusted["calories"] : "-";
    // steps
    uiSteps.text = userActivityPermissionGranted ? userActivityToday.adjusted["steps"] : "-";
    uiAzm.text = userActivityPermissionGranted ? userActivityToday.adjusted.activeZoneMinutes.total : "-";
    // battery charge level
    uiChargeLevel.width = Math.floor(deviceBattery.chargeLevel * 14 / 100);
    uiChargeLevel.style.fill = 'white';
}
function toggleDisplayMode(dayTimePresent) {
  
  if (previousDayTimePresent != dayTimePresent) {
    /* dbg */
    console.log(`toggleDisplayMode->isDayTime=${dayTimePresent};autoDisplayMode=${autoDisplayMode}`);
    previousDayTimePresent = dayTimePresent;
    
    imgSurface1.href = dayTimePresent ? 'earth364_with_clouds_4.png' : 'earth364_night_with_clouds.png';
    imgSurface2.href = dayTimePresent ? 'earth364_with_clouds_4.png' : 'earth364_night_with_clouds.png';
    imgClouds1.href = dayTimePresent ? 'clouds168.png' : 'old_clouds168_night.png'; // 'clouds168_night_3.png';
    imgClouds2.href = dayTimePresent ? 'clouds168.png' : 'old_clouds168_night.png';  // 'clouds168_night_3.png';
    uiClockFull.class = dayTimePresent ? 'clock-full' : 'clock-full-night';
    uiChargeLevel.class = dayTimePresent ? 'battery-charge-level' : 'battery-charge-level-night';
    uiChargeLevelRect.class = dayTimePresent ? 'battery-charge-level' : 'battery-charge-level-night';
    uiDate.class = dayTimePresent ? 'date' : 'date-night'
    uiHeartRate.class = dayTimePresent ? 'sensor' : 'sensor-night'
    uiHeartRateIcon.style.opacity = dayTimePresent ? 0.95 : 0.75
    uiSteps.class = dayTimePresent ? 'sensor' : 'sensor-night'
    uiStepsIcon.style.opacity = dayTimePresent ? 0.95 : 0.75
    uiCals.class = dayTimePresent ? 'sensor' : 'sensor-night'
    uiCalsIcon.style.opacity = dayTimePresent ? 0.95 : 0.75
    uiAzm.class = dayTimePresent ? 'sensor' : 'sensor-night'
    uiAzmIcon.style.opacity = dayTimePresent ? 0.95 : 0.75
  }
}
function checkApplyDisplayMode() {
  // console.log(`useNightDisplayMode=${useNightDisplayMode}; autoDisplayMode=${autoDisplayMode}`);
  if (useNightDisplayMode) {
    if (!autoDisplayMode) {
      toggleDisplayMode(false);
    } else {
      console.log(`isDayTime=${isDayTime}; useNightDisplayMode=${useNightDisplayMode}; autoDisplayMode=${autoDisplayMode}`);
      toggleDisplayMode(isDayTime);
    }
  } else {
      toggleDisplayMode(true);
  }
}

////////////////////////////////////////////////////////////////////
///   listeners  
// display 
display.addEventListener("change", () => {
      // enable animations and sensors only when display is active in order to conserve battery
      const displayIsOn = display.on;
      enableAnimations(displayIsOn);
      enableSensors(displayIsOn);
      if (displayIsOn) {
        updateActiviesAndChargeLevel();
      }
    });  
// heart rate
if (sensorHR) {
  sensorHR.addEventListener("reading", () => {
    // update heart rate here
    uiHeartRate.text = `${sensorHR.heartRate}`;
  });
  // inital start of heart sensor
  sensorHR.start();
}

////////////////////////////////////////////////////////////////////
///   settings callback
function blueBeautySettingsCallback(data) {
  console.log(`blueBeautySettingsCallback -> data: ${JSON.stringify(data)}`);
  if (!data) { return; }
  // visibility of date
  // console.log(`dateVisible.current -> ${uiDate.style.display}`);
  // console.log(`dateVisible.new -> ${data.dateVisible}`)
  uiDate.style.display = data.dateVisible ? 'inherit' : 'none';
  // visibility of sensors
  // console.log(`sensorsVisible.new -> ${data.sensorsVisible}`)
  uiHeartRate.style.display = data.sensorsVisible ? 'inherit' : 'none';
  uiHeartRateIcon.style.display = data.sensorsVisible ? 'inherit' : 'none';
  uiHeartRateSatellite.style.display = data.sensorsVisible ? 'inherit' : 'none';
  uiHeartRateLine.style.display = data.sensorsVisible ? 'inherit' : 'none';
  uiSteps.style.display = data.sensorsVisible ? 'inherit' : 'none';
  uiStepsIcon.style.display = data.sensorsVisible ? 'inherit' : 'none';
  uiStepsSatellite.style.display = data.sensorsVisible ? 'inherit' : 'none';
  uiStepsLine.style.display = data.sensorsVisible ? 'inherit' : 'none';
  uiCals.style.display = data.sensorsVisible ? 'inherit' : 'none';
  uiCalsIcon.style.display = data.sensorsVisible ? 'inherit' : 'none';
  uiCalsSatellite.style.display = data.sensorsVisible ? 'inherit' : 'none';
  uiCalsLine.style.display = data.sensorsVisible ? 'inherit' : 'none';
  uiAzm.style.display = data.sensorsVisible ? 'inherit' : 'none';
  uiAzmIcon.style.display = data.sensorsVisible ? 'inherit' : 'none';
  uiAzmSatellite.style.display = data.sensorsVisible ? 'inherit' : 'none';
  uiAzmLine.style.display = data.sensorsVisible ? 'inherit' : 'none';
  // visibility of battery
  // console.log(`batteryVisible.new -> ${data.batteryVisible}`)
  uiChargeLevel.style.display = data.batteryVisible ? 'inherit' : 'none';
  uiChargeLevelRect.style.display = data.batteryVisible ? 'inherit' : 'none';
  // night mode
  useNightDisplayMode = data.displayModeNight;
  autoDisplayMode = data.autoDisplayMode;
  checkApplyDisplayMode();
}

////////////////////////////////////////////////////////////////////
//    entry point
console.log("©BlueBeauty by Attila Varga");
// settings
deviceSettings.initializeWithCallback(blueBeautySettingsCallback);
enableAnimations(true);
enableSensors(true);
updateActiviesAndChargeLevel();
// clock & date
//clock.granularity = "seconds";
clock.granularity = "minutes";
clock.ontick = function(evt) {
  const today = evt.date;
  const hours = today.getHours();
  const hoursRaw = hours;
  const minutes = today.getMinutes();
  // const seconds = today.getSeconds();
  /* debug 
  console.log(`clock.ontick > today: ${today} > hours: ${hours}; > minutes: ${minutes}; > seconds: ${seconds};`);
  console.log(`preferences -> ${preferences.clockDisplay}`)
  */
    
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  uiClockFull.text = hours + ":" + util.zeroPad(minutes);
  formatDate(uiDate, today.getDate(), today.getDay(), today.getMonth());
    
  // auto switch display mode by current time
  // dbg switch when minute is even
  // isDayTime = (minutes % 2 === 0);
  isDayTime = (hoursRaw >= 6 && hoursRaw <= 19);
  checkApplyDisplayMode();
  
  // blinking heart rate icon
  /*
  const tickSecIsEven = (seconds % 2 === 0);
  const scaleCur = (tickSecIsEven ? 1 : 0.95);
  const translateCur = (tickSecIsEven ? 0 : 1);
  gHeartRateGroup.groupTransform.scale.x = scaleCur;
  gHeartRateGroup.groupTransform.scale.y = scaleCur;
  gHeartRateGroup.groupTransform.translate.x = translateCur;
  gHeartRateGroup.groupTransform.translate.y = translateCur;
  */
}