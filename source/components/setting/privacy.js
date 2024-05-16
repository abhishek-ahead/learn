import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Platform, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { PRIVACY_KEYS, PRIVACY_STATUS, SCREEN } from "../../constant";
import { backIcon, rightArrow } from "../../constant/icons";
import { SettingContext } from "../../context/setting";
import { getPrivacySetting } from "../../services/setting";
import Styles, { appStyle } from "../../styles";
import PrivacySettingOption from "./privacyOptions";

const PrivacySetting = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const settingContext = useContext(SettingContext);

  const handleBackNavigation = () =>
    Platform.OS !== "web"
      ? navigation.goBack()
      : settingContext.setOptionPage(null);

  const handleNavigate = (data) => {
    Platform.OS !== "web" ?
      navigation.navigate(SCREEN.privacyOption, data) :
      settingContext.setSelectOption(data)
  }

  useEffect(() => {
    getPrivacySetting().then(response => setData(response.data)).finally(() => setLoading(false))
  }, [])

  return (
    settingContext?.selectOption ?
      <PrivacySettingOption />
      : <View style={{ ...Styles.chatBubble, ...Styles.userinfo, flex: 1 }}>
        <View style={{ ...Styles.chatBubbleHeader }}>
          <Pressable
            onPress={handleBackNavigation}
            style={Styles.chatBubbleHeaderOption}
          >
            <View style={Styles.chatBubbleHeaderOptionIcon}>
              <View style={{ ...Styles.icon, ...Styles.icon24 }}>{backIcon}</View>
            </View>
          </Pressable>
          <View style={Styles.chatBubbleHeaderInfo}>
            <Text style={{ ...Styles.chatBubbleHeaderTitle }}>Privacy</Text>
          </View>
        </View>
        {loading ? (
          <View style={{ ...Styles.itemCenter, flex: 1 }}><ActivityIndicator size={"large"} color="#6a6f75" /></View>
        ) : <ScrollView style={{ width: "100%" }}>
          <View style={{ flex: 1, ...appStyle, ...Styles.userinfowrap }}>
            <View style={{ ...Styles.userinfolinks, ...Styles.block }}>
              <Pressable onPress={() => handleNavigate({ privacy: PRIVACY_KEYS.lastSeenOnline, value: { lastSeen: data.privacy.lastSeen, online: data.privacy.online } })} style={{ ...Styles.userinfolinkitem, borderTopWidth: 0, ...Styles.cursor }}>
                <Text style={{ ...Styles.userinfolinktext }}>
                  Last Seen & Online
                </Text>
                <Text style={{ ...Styles.userinfolinkcount, ...Styles.fontlight }} numberOfLines={1}>
                  {`${PRIVACY_STATUS[data.privacy.lastSeen]}, ${PRIVACY_STATUS[data.privacy.online]}`}
                </Text>
                <View style={{ ...Styles.userinfolinkiconright }}>
                  {rightArrow}
                </View>
              </Pressable>
              <Pressable onPress={() => handleNavigate({ privacy: PRIVACY_KEYS.profilePhoto, value: data.privacy.profilePhoto })} style={{ ...Styles.userinfolinkitem, ...Styles.cursor }}>
                <Text style={{ ...Styles.userinfolinktext }}>Profile Photo</Text>
                <Text style={{ ...Styles.userinfolinkcount, ...Styles.fontlight }} numberOfLines={1}>
                  {PRIVACY_STATUS[data.privacy.profilePhoto]}
                </Text>
                <View style={{ ...Styles.userinfolinkiconright }}>
                  {rightArrow}
                </View>
              </Pressable>
              <Pressable onPress={() => handleNavigate({ privacy: PRIVACY_KEYS.about, value: data.privacy.about })} style={{ ...Styles.userinfolinkitem, ...Styles.cursor }}>
                <Text style={{ ...Styles.userinfolinktext }}>About</Text>
                <Text style={{ ...Styles.userinfolinkcount, ...Styles.fontlight }} numberOfLines={1}>
                  {PRIVACY_STATUS[data.privacy.about]}
                </Text>
                <View style={{ ...Styles.userinfolinkiconright }}>
                  {rightArrow}
                </View>
              </Pressable>
              <Pressable onPress={() => handleNavigate({ privacy: PRIVACY_KEYS.group, value: data.privacy.group })} style={{ ...Styles.userinfolinkitem, ...Styles.cursor }}>
                <Text style={{ ...Styles.userinfolinktext }}>Groups</Text>
                <Text style={{ ...Styles.userinfolinkcount, ...Styles.fontlight }} numberOfLines={1}>
                  {PRIVACY_STATUS[data.privacy.group]}
                </Text>
                <View style={{ ...Styles.userinfolinkiconright }}>
                  {rightArrow}
                </View>
              </Pressable>
              {/* <Pressable onPress={() => handleNavigate({ privacy: PRIVACY_KEYS.status, value: data.privacy.status })} style={{ ...Styles.userinfolinkitem, ...Styles.cursor }}>
                <Text style={{ ...Styles.userinfolinktext }}>Status</Text>
                <Text style={{ ...Styles.userinfolinkcount, ...Styles.fontlight }} numberOfLines={1}>
                  {PRIVACY_STATUS[data.privacy.status]}
                </Text>
                <View style={{ ...Styles.userinfolinkiconright }}>
                  {rightArrow}
                </View>
              </Pressable> */}
            </View>
            {/* <View style={{ ...Styles.userinfolinks, ...Styles.block, marginBottom: 0, }}>
            <View style={{ ...Styles.userinfolinkitem, borderTopWidth: 0, ...Styles.cursor }}>
              <Text style={{ ...Styles.userinfolinktext }}>
                Live Location
              </Text>
              <Text style={{ ...Styles.userinfolinkcount, ...Styles.fontlight }} numberOfLines={1}>
                None
              </Text>
              <View style={{ ...Styles.userinfolinkiconright }}>
                {rightArrow}
              </View>
            </View>
          </View>
          <View>
            <Text style={{ ...Styles.fontlight, ...Styles.fontsizesmall }}>
              List of chats where you are sharing your live location.
            </Text>
          </View> */}
            {/* <View style={{ ...Styles.userinfolinks, ...Styles.block, marginTop: 15, marginBottom: 5, }}>
            <View style={{ ...Styles.userinfolinkitem, borderTopWidth: 0, ...Styles.cursor }}>
              <Text style={{ ...Styles.userinfolinktext }}>
                Calls
              </Text>
              <View style={{ ...Styles.userinfolinkiconright }}>
                {rightArrow}
              </View>
            </View>
          </View> */}
            <View style={{ ...Styles.userinfolinks, ...Styles.block, marginBottom: 0, }}>
              <View style={{ ...Styles.userinfolinkitem, borderTopWidth: 0, ...Styles.cursor }}>
                <Text style={{ ...Styles.userinfolinktext }}>
                  Block
                </Text>
                <Text style={{ ...Styles.userinfolinkcount, ...Styles.fontlight }} numberOfLines={1}>
                  None
                </Text>
                <View style={{ ...Styles.userinfolinkiconright }}>
                  {rightArrow}
                </View>
              </View>
            </View>
            <View>
              <Text style={{ ...Styles.fontlight, ...Styles.fontsizesmall }}>
                List of contacts you have blocked.
              </Text>
            </View>
            <View style={{ ...Styles.userinfolinks, ...Styles.block, marginTop: 15, }}>
              <View style={{ ...Styles.userinfolinkitem, borderTopWidth: 0, ...Styles.cursor }}>
                <Text style={{ ...Styles.userinfolinktext }}>
                  Read Receipts
                </Text>
                <View style={{ ...Styles.userinfolinkiconright }}>
                  <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    // thumbColor={
                    //   notificationSettings.group.showNotification
                    //     ? "#057EFC"
                    //     : "#f4f3f4"
                    // }
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={(value) =>
                      handleToggle({
                        setting: "group",
                        notification: "showNotification",
                        value,
                      })
                    }
                    value={data.privacy.readRecipts}
                  />
                </View>
              </View>
            </View>
            {/* <View style={{ ...Styles.userinfolinks, ...Styles.block, marginBottom: 0, }}>
            <View style={{ ...Styles.userinfolinkitem, borderTopWidth: 0, ...Styles.cursor }}>
              <Text style={{ ...Styles.userinfolinktext }}>
                Screen Lock
              </Text>
              <Text style={{ ...Styles.userinfolinkcount, ...Styles.fontlight }} numberOfLines={1}>
                None
              </Text>
              <View style={{ ...Styles.userinfolinkiconright }}>
                {rightArrow}
              </View>
            </View>
          </View>
          <View>
            <Text style={{ ...Styles.fontlight, ...Styles.fontsizesmall }}>
              Required Touch ID to unlock Circuit Chat
            </Text>
          </View> */}
          </View>
        </ScrollView>}
      </View>
  )
}

export default PrivacySetting;
