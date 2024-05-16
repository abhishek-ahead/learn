import { useContext } from "react";
import { Pressable, Text, View } from "react-native";
import People from "../components/people";
import { NAV_TABS } from "../constant";
import { upArrow } from "../constant/icons";
import { AppContext } from "../context/app";
import Setting from "../pages/setting";
import Styles, { appStyle, mainStyle } from "../styles";
import SettingStarred from "./../components/setting/starred";
import Chat from "./chat";
import ChatMedia from "./chatMedia";
import ChatOpens from "./chatOpen";
import ChatProfile from "./chatProfile";
import ChatStarred from "./chatStarred";
import Message from "./message";
import GroupSetting from "./groupSetting";
import GroupMembers from "./groupMembers";
import GroupPendingRequest from "./groupPendingRequest";

export {
  Chat,
  ChatMedia,
  ChatOpens,
  ChatProfile,
  ChatStarred,
  Message,
  SettingStarred,
  GroupSetting,
  GroupMembers,
  GroupPendingRequest,
};

const Body = ({ params }) => {
  const { tabNav } = useContext(AppContext);
  switch (tabNav) {
    case NAV_TABS.chat:
      return <Chat {...params} />;
    case NAV_TABS.people:
      return <People {...params} />;
    case NAV_TABS.setting:
      return <Setting {...params} />;
  }
};

export default ({ navigation, route }) => {
  const { tabNav, minimize, handleMinimize, translation } =
    useContext(AppContext);
  return (
    <View style={{ ...mainStyle, marginLeft: 0 }}>
      {!minimize ? (
        <Body params={{ navigation, route }} />
      ) : (
        <Pressable
          onPress={() => handleMinimize()}
          style={{
            ...Styles.chatBubblemin,
            ...appStyle,
            marginLeft: 10,
            marginRight: 10,
          }}
        >
          <View style={Styles.chatBubbleHeader}>
            <View style={Styles.chatBubbleHeaderInfo}>
              <Text style={Styles.chatBubbleHeaderTitle}>
                {translation[tabNav]}
              </Text>
            </View>
            <View style={Styles.chatBubbleHeaderOption}>
              <View style={Styles.chatBubbleHeaderOptionIcon}>
                <View style={{ ...Styles.icon, ...Styles.icon24 }}>
                  {upArrow}
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      )}
    </View>
  );
};
