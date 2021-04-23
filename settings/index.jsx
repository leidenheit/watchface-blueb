import { gettext } from "i18n";

////////////////////////////////////////////////////////////////////
///   functions
function BlueBeautySettings(props) {
  return (
    <Page> 
      <Section
        title={<Text bold align="center">{gettext("thankYouTitle")}</Text>}>
        <Text>{gettext("thankYouDescription")}</Text>
      </Section>
      <Section
        title={<Text bold align="center">{gettext("title")}</Text>}>
        <Toggle
          settingsKey="dateVisible"
          label={gettext("showDate")}
        />
        <Toggle
          settingsKey="sensorsVisible"
          label={gettext("showSensors")}
        />
        <Toggle
          settingsKey="batteryVisible"
          label={gettext("showBattery")}
        />
      </Section>
      <Section
        title={<Text bold align="center">{gettext("experimental")}</Text>}>
        <Toggle
          settingsKey="displayModeNight"
          label={gettext("displayModeNight")}
        />
        { props.settings['displayModeNight'] === 'true' &&
          <Section>
            <Toggle
              settingsKey="autoDisplayMode"
              label={gettext("autoDisplayMode")}
            />
          </Section>
        }
      </Section>
      <Section
        title={<Text bold align="center">{gettext("about")}</Text>}>
        <Text>{gettext("product")}</Text>
        <Text>{gettext("developer")}</Text>
        <Text>{gettext("copyright")}</Text>
      </Section>
      <Section
        title={<Text bold align="center">{gettext("donationTitle")}</Text>}>
        <Text align="center"><Link source="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CL4BVUUU4YQEJ&source=url">{gettext("donationLink")}</Link></Text>
      </Section>
    </Page>
  );
}

////////////////////////////////////////////////////////////////////
///   entry point
registerSettingsPage(BlueBeautySettings);