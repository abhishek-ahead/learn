import { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { backIcon } from "../../constant/icons";
import { AppContext } from "../../context/app";
import { SettingContext } from "../../context/setting";
import {
  getNotificationSetting,
  updateNotificationSetting,
} from "../../services/setting";
import { appStyle } from "../../styles";

const NotificationSetting = ({ navigation }) => {
  const { translation, Styles } = useContext(AppContext);
  const settingContext = useContext(SettingContext);
  const toggle = useRef(false);
  const initialState = {
    message: {
      showNotification: true,
      reactionNotification: true,
    },
    group: {
      showNotification: true,
      reactionNotification: true,
    },
    showPreview: true,
  };
  const [notificationSettings, setNotificationSetting] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const handleBackNavigation = () =>
    Platform.OS !== "web"
      ? navigation.goBack()
      : settingContext.setOptionPage(null);

  useEffect(() => {
    if (toggle.current) updateNotificationSetting(notificationSettings);
  }, [notificationSettings]);

  useEffect(() => {
    getNotificationSetting()
      .then((response) => {
        setNotificationSetting(response.data);
      })
      .catch((err) => console.log("error while getting notification"))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = ({ setting, notification, value }) => {
    toggle.current = true;
    setNotificationSetting((prev) => {
      const data = { ...prev };
      data[setting] = {
        ...data[setting],
        [notification]: value,
      };
      return data;
    });
  };
  return (
    <View style={{ ...Styles.chatBubble, ...Styles.userinfo, flex: 1 }}>
      <View style={{ ...Styles.chatBubbleHeader }}>
        <Pressable
          onPress={handleBackNavigation}
          style={Styles.chatBubbleHeaderOption}
        >
          <View style={Styles.chatBubbleHeaderOptionIcon}>
            <View style={{ ...Styles.icon, ...Styles.icon24 }}>{backIcon(Styles.icondefault)}</View>
          </View>
        </Pressable>
        <View style={Styles.chatBubbleHeaderInfo}>
          <Text style={{ ...Styles.chatBubbleHeaderTitle }}>
            {translation.notificationSetting}
          </Text>
        </View>
      </View>
      {loading ? (
        <View style={{ ...Styles.itemCenter, flex: 1 }}><ActivityIndicator size={"large"} color="#6a6f75" /></View>
      ) : (
        <ScrollView style={{ width: "100%" }}>
          <View style={{ flex: 1, ...appStyle, ...Styles.userinfowrap }}>
            <View>
              <Text style={{ ...Styles.fontlight }}>
                {translation.messageNotifications}
              </Text>
            </View>
            <View style={{ ...Styles.userinfolinks, ...Styles.block }}>
              <View
                style={{
                  ...Styles.userinfolinkitem,
                  borderTopWidth: 0,
                  ...Styles.cursor,
                  ...Styles.userinfolinkitemtoggle
                }}
              >
                <Text style={{ ...Styles.userinfolinktext }}>
                  {translation.showNotifications}
                </Text>
                <View style={{ ...Styles.userinfolinkiconright }}>
                  <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={
                      notificationSettings.message.showNotification
                        ? "#057EFC"
                        : "#f4f3f4"
                    }
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={(value) =>
                      handleToggle({
                        setting: "message",
                        notification: "showNotification",
                        value,
                      })
                    }
                    value={notificationSettings.message.showNotification}
                  />
                </View>
              </View>
              {/* <View style={{ ...Styles.userinfolinkitem, ...Styles.cursor }}>
              <Text style={{ ...Styles.userinfolinktext }}>Sound</Text>
              <Text
                style={{ ...Styles.userinfolinkcount, ...Styles.fontlight }}
              >
                Note
              </Text>
              <View style={{ ...Styles.userinfolinkiconright }}>
                {rightArrowIcon({ ...Styles.icondefault, ...Styles.icon20 })}
              </View>
            </View> */}
              <View style={{ ...Styles.userinfolinkitem, ...Styles.cursor, ...Styles.userinfolinkitemtoggle }}>
                <Text style={{ ...Styles.userinfolinktext }}>
                  {translation.reactionNotifications}
                </Text>
                <View style={{ ...Styles.userinfolinkiconright }}>
                  <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={
                      notificationSettings.message.reactionNotification
                        ? "#057EFC"
                        : "#f4f3f4"
                    }
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={(value) =>
                      handleToggle({
                        setting: "message",
                        notification: "reactionNotification",
                        value,
                      })
                    }
                    value={notificationSettings.message.reactionNotification}
                  />
                </View>
              </View>
            </View>
            <View>
              <Text style={{ ...Styles.fontlight }}>
                {translation.groupNotifications}
              </Text>
            </View>
            <View style={{ ...Styles.userinfolinks, ...Styles.block }}>
              <View
                style={{
                  ...Styles.userinfolinkitem,
                  borderTopWidth: 0,
                  ...Styles.cursor,
                  ...Styles.userinfolinkitemtoggle
                }}
              >
                <Text style={{ ...Styles.userinfolinktext }}>
                  {translation.showNotifications}
                </Text>
                <View style={{ ...Styles.userinfolinkiconright }}>
                  <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={
                      notificationSettings.group.showNotification
                        ? "#057EFC"
                        : "#f4f3f4"
                    }
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={(value) =>
                      handleToggle({
                        setting: "group",
                        notification: "showNotification",
                        value,
                      })
                    }
                    value={notificationSettings.group.showNotification}
                  />
                </View>
              </View>
              {/* <View style={{ ...Styles.userinfolinkitem, ...Styles.cursor }}>
              <Text style={{ ...Styles.userinfolinktext }}>Sound</Text>
              <Text
                style={{ ...Styles.userinfolinkcount, ...Styles.fontlight }}
              >
                Note
              </Text>
              <View style={{ ...Styles.userinfolinkiconright }}>
                {rightArrowIcon({ ...Styles.icondefault, ...Styles.icon20 })}
              </View>
            </View> */}
              <View style={{ ...Styles.userinfolinkitem, ...Styles.cursor, ...Styles.userinfolinkitemtoggle }}>
                <Text style={{ ...Styles.userinfolinktext }}>
                  {translation.reactionNotifications}
                </Text>
                <View style={{ ...Styles.userinfolinkiconright }}>
                  <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={
                      notificationSettings.group.reactionNotification
                        ? "#057EFC"
                        : "#f4f3f4"
                    }
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={(value) =>
                      handleToggle({
                        setting: "group",
                        notification: "reactionNotification",
                        value,
                      })
                    }
                    value={notificationSettings.group.reactionNotification}
                  />
                </View>
              </View>
            </View>
            <View>
              <Text style={{ ...Styles.fontlight }}>{translation.preview}</Text>
            </View>
            <View
              style={{
                ...Styles.userinfolinks,
                ...Styles.block,
                marginBottom: 0,
              }}
            >
              <View
                style={{
                  ...Styles.userinfolinkitem,
                  borderTopWidth: 0,
                  ...Styles.cursor,
                  ...Styles.userinfolinkitemtoggle
                }}
              >
                <Text style={{ ...Styles.userinfolinktext }}>
                  {translation.showPreview}
                </Text>
                <View style={{ ...Styles.userinfolinkiconright }}>
                  <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={
                      notificationSettings.showPreview ? "#057EFC" : "#f4f3f4"
                    }
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={(value) => {
                      toggle.current = true;
                      setNotificationSetting((prev) => ({
                        ...prev,
                        showPreview: value,
                      }));
                    }}
                    value={notificationSettings.showPreview}
                  />
                </View>
              </View>
            </View>
            <View>
              <Text style={{ ...Styles.fontlight, ...Styles.fontsizesmall }}>
                {translation.previewMessageTextInsideNewMessageNotifications}
              </Text>
            </View>

            <View
              style={{
                ...Styles.userinfolinks,
                ...Styles.block,
                marginBottom: 0,
                marginTop: 15,
              }}
            >
              <Pressable
                onPress={() => {
                  toggle.current = true;
                  setNotificationSetting({
                    message: {
                      showNotification: true,
                      reactionNotification: true,
                    },
                    group: {
                      showNotification: true,
                      reactionNotification: true,
                    },
                    showPreview: true,
                  });
                }}
                style={{
                  ...Styles.userinfolinkitem,
                  borderTopWidth: 0,
                  ...Styles.cursor,
                }}
              >
                <Text
                  style={{ ...Styles.userinfolinktext, ...Styles.fontdanger }}
                >
                  {translation.resetNotificationsSettings}
                </Text>
              </Pressable>
            </View>
            <View>
              <Text style={{ ...Styles.fontlight, ...Styles.fontsizesmall }}>
                {
                  translation.resetAllNotificationSettingsIncludingCustomNotificationsettingforYourChats
                }
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default NotificationSetting;
