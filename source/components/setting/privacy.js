import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Platform, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { ONLINE_PRIVACY, PRIVACY_KEYS, PRIVACY_STATUS, SCREEN } from "../../constant";
import { backIcon, rightArrowIcon } from "../../constant/icons";
import { AppContext } from "../../context/app";
import { SettingContext } from "../../context/setting";
import { getPrivacySetting, updatePrivacySetting } from "../../services/setting";
import { appStyle } from "../../styles";
import PrivacySettingOption from "./privacyOptions";

const PrivacySetting = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const { translation, privacy, setPrivacy , Styles} = useContext(AppContext);
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
    getPrivacySetting().then(response => {
      if (response.success)
        setPrivacy((prev) => ({ ...prev, ...response.data.privacy }))
    }).finally(() => setLoading(false))
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
              <View style={{ ...Styles.icon, ...Styles.icon24 }}>{backIcon(Styles.icondefault)}</View>
            </View>
          </Pressable>
          <View style={Styles.chatBubbleHeaderInfo}>
            <Text style={{ ...Styles.chatBubbleHeaderTitle }}>{translation.privacy}</Text>
          </View>
        </View>
        {loading ? (
          <View style={{ ...Styles.itemCenter, flex: 1 }}><ActivityIndicator size={"large"} color="#6a6f75" /></View>
        ) : <ScrollView style={{ width: "100%" }}>
          <View style={{ flex: 1, ...appStyle, ...Styles.userinfowrap }}>
            <View style={{ ...Styles.userinfolinks, ...Styles.block }}>
              <Pressable onPress={() => handleNavigate({ privacy: PRIVACY_KEYS.lastSeenOnline })} style={{ ...Styles.userinfolinkitem, borderTopWidth: 0, ...Styles.cursor }}>
                <Text style={{ ...Styles.userinfolinktext }}>
                  {translation.lastSeenOnline}
                </Text>
                <Text style={{ ...Styles.userinfolinkcount, ...Styles.fontlight }} numberOfLines={1}>
                  {privacy.online == 1 || privacy.lastSeen == 3 && privacy.online == 0 ? `${PRIVACY_STATUS[privacy.lastSeen]}` : `${PRIVACY_STATUS[privacy.lastSeen]}, ${ONLINE_PRIVACY[privacy.online]}`}
                </Text>
                <View style={{ ...Styles.userinfolinkiconright }}>
                  {rightArrowIcon({ ...Styles.icondefault, ...Styles.icon20 })}
                </View>
              </Pressable>
              <Pressable onPress={() => handleNavigate({ privacy: PRIVACY_KEYS.profilePhoto })} style={{ ...Styles.userinfolinkitem, ...Styles.cursor }}>
                <Text style={{ ...Styles.userinfolinktext }}>{translation.prfilePhoto}</Text>
                <Text style={{ ...Styles.userinfolinkcount, ...Styles.fontlight }} numberOfLines={1}>
                  {PRIVACY_STATUS[privacy.profilePhoto]}
                </Text>
                <View style={{ ...Styles.userinfolinkiconright }}>
                  {rightArrowIcon({ ...Styles.icondefault, ...Styles.icon20 })}
                </View>
              </Pressable>
              <Pressable onPress={() => handleNavigate({ privacy: PRIVACY_KEYS.about })} style={{ ...Styles.userinfolinkitem, ...Styles.cursor }}>
                <Text style={{ ...Styles.userinfolinktext }}>{translation.about}</Text>
                <Text style={{ ...Styles.userinfolinkcount, ...Styles.fontlight }} numberOfLines={1}>
                  {PRIVACY_STATUS[privacy.about]}
                </Text>
                <View style={{ ...Styles.userinfolinkiconright }}>
                  {rightArrowIcon({ ...Styles.icondefault, ...Styles.icon20 })}
                </View>
              </Pressable>
              <Pressable onPress={() => handleNavigate({ privacy: PRIVACY_KEYS.group })} style={{ ...Styles.userinfolinkitem, ...Styles.cursor }}>
                <Text style={{ ...Styles.userinfolinktext }}>{translation.group}</Text>
                <Text style={{ ...Styles.userinfolinkcount, ...Styles.fontlight }} numberOfLines={1}>
                  {PRIVACY_STATUS[privacy.group]}
                </Text>
                <View style={{ ...Styles.userinfolinkiconright }}>
                  {rightArrowIcon({ ...Styles.icondefault, ...Styles.icon20 })}
                </View>
              </Pressable>
              {/* <Pressable onPress={() => handleNavigate({ privacy: PRIVACY_KEYS.status, value: privacy.status })} style={{ ...Styles.userinfolinkitem, ...Styles.cursor }}>
                <Text style={{ ...Styles.userinfolinktext }}>Status</Text>
                <Text style={{ ...Styles.userinfolinkcount, ...Styles.fontlight }} numberOfLines={1}>
                  {PRIVACY_STATUS[privacy.status]}
                </Text>
                <View style={{ ...Styles.userinfolinkiconright }}>
                  {rightArrowIcon({ ...Styles.icondefault, ...Styles.icon20 })}
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
                {rightArrowIcon({ ...Styles.icondefault, ...Styles.icon20 })}
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
                {rightArrowIcon({ ...Styles.icondefault, ...Styles.icon20 })}
              </View>
            </View>
          </View> */}
            {/* <View style={{ ...Styles.userinfolinks, ...Styles.block, marginBottom: 0, }}>
              <View style={{ ...Styles.userinfolinkitem, borderTopWidth: 0, ...Styles.cursor }}>
                <Text style={{ ...Styles.userinfolinktext }}>
                  Block
                </Text>
                <Text style={{ ...Styles.userinfolinkcount, ...Styles.fontlight }} numberOfLines={1}>
                  None
                </Text>
                <View style={{ ...Styles.userinfolinkiconright }}>
                  {rightArrowIcon({ ...Styles.icondefault, ...Styles.icon20 })}
                </View>
              </View>
            </View>
            <View>
              <Text style={{ ...Styles.fontlight, ...Styles.fontsizesmall }}>
                List of contacts you have blocked.
              </Text>
            </View> */}
            <View style={{ ...Styles.userinfolinks, ...Styles.block}}>
              <View style={{ ...Styles.userinfolinkitem, borderTopWidth: 0, ...Styles.cursor, ...Styles.userinfolinkitemtoggle }}>
                <Text style={{ ...Styles.userinfolinktext }}>
                  {translation.readRecipt}
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
                    onValueChange={(value) => {
                      setPrivacy(prev => ({ ...prev, readRecipts: value }))
                      updatePrivacySetting({ readRecipts: value })
                    }}
                    value={privacy.readRecipts}
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
                {rightArrowIcon({ ...Styles.icondefault, ...Styles.icon20 })}
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
