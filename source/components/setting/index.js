import { useContext } from "react";
import { View } from "react-native";
import { SCREEN } from "../../constant";
import { AppContext } from "../../context/app";
import { SettingContext } from "../../context/setting";
import Styles, { appStyle, mainStyle } from "../../styles";
import Header from "../header";
import NavBar from "../navbar";
import AccountSetting from "./account";
import SettingBody from "./body";
import NotificationSetting from "./notification";
import PrivacySetting from "./privacy";
import Starred from "./starred";

const SettingScreen = () => {
  const { optionPage } = useContext(SettingContext);
  switch (optionPage) {
    case SCREEN.account:
      return <AccountSetting />;
    case SCREEN.privacy:
      return <PrivacySetting />;
    case SCREEN.notification:
      return <NotificationSetting />;
    case SCREEN.settingStarred:
      return <Starred />;
    default:
      return <SettingBody />;
  }
};

export default () => {
  const { optionPage } = useContext(SettingContext);
  const { tabNav, translation } = useContext(AppContext);
  return (
    <View style={{ ...mainStyle, marginRight: 10 }}>
      <View style={{ ...Styles.chatBubble, ...appStyle }}>
        {!optionPage ? (
          <View style={Styles.chatBubbleHeader}>
            <Header name={translation[tabNav]} />
          </View>
        ) : null}
        {/* Rendering active user  */}
        <SettingScreen />
        <NavBar />
      </View>
    </View>
  );
};
