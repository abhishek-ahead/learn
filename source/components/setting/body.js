import React, { useContext, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View
} from "react-native";
import { MODE, SCREEN } from "../../constant";
import {
  editIcon,
  notificationsIcon,
  privacyIcon,
  rightArrowIcon,
  starredIcon
} from "../../constant/icons";
import { AppContext } from "../../context/app";
import { AuthContext } from "../../context/auth";
import { SettingContext } from "../../context/setting";
import { appStyle } from "../../styles";


const SettingBody = () => {
  const { user } = useContext(AuthContext);
  const { handlePageNav } = useContext(SettingContext);
  const { setShowImage, translation, setMode, mode, Styles } = useContext(AppContext);

  const navigateProfile = () => {
    if (Platform.OS == "web") {
      window.top.postMessage(
        {
          type: "redirect",
          link: user.link,
        },
        "*"
      );
    }
  };

  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <View style={{ ...Styles.userinfo, flex: 1 }}>
      <ScrollView style={{ width: "100%" }}>
        <View style={{ flex: 1, ...appStyle, ...Styles.userinfowrap }}>

          <View style={{ ...Styles.userselfinfotop, ...Styles.block }}>
            <Pressable onPress={() => setShowImage({ media: user?.avatar })} style={{ ...Styles.thumbImg, ...Styles.userselfinfotopthumb }}>
              <Image style={Styles.userselfinfotopthumbimg} source={{ uri: user.avatar }} />
              {/* <View style={{ ...Styles.userselfinfotopiediticon, ...Styles.itemCenter }}>
                                <Svg viewBox="0 -960 960 960" style={{ ...Styles.icon12, fill: "#fff" }}><Path d="M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l50-54q11-12 26.5-19t32.5-7h170q17 0 32.5 7t26.5 19l50 54h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Z"></Path></Svg>
                            </View> */}
            </Pressable>
            <View style={Styles.userselfinfotopinfo}>
              <Pressable onPress={navigateProfile}>
                <Text
                  style={{
                    ...Styles.userselfinfotopname,
                    ...Styles.fontsizetitle,
                    ...Styles.fontprimary
                  }}
                >
                  {user.name}
                </Text>
              </Pressable>
              <Text
                style={{ ...Styles.userinfostatus, ...Styles.fontlight }}
                numberOfLines={1}
              >
                {user.about}
              </Text>
            </View>
            <Pressable onPress={() => handlePageNav(SCREEN.about)} style={{ ...Styles.userselfinfotopIcon, ...Styles.itemCenter }}>
              <View style={Styles.icon16}>{editIcon(Styles.icondefault)}</View>
            </Pressable>
          </View>

          <View style={{ ...Styles.userinfolinks, ...Styles.block }}>
            <Pressable onPress={() => handlePageNav(SCREEN.settingStarred)} style={{ ...Styles.userinfolinkitem, borderTopWidth: 0 }}>
              <View style={{ ...Styles.userinfolinkicon }}>
                <View style={{ ...Styles.icon20 }}>{starredIcon(Styles.iconprimary)}</View>
              </View>
              <Text style={{ ...Styles.userinfolinktext }}>{translation.starredMessage}</Text>
              <View style={{ ...Styles.userinfolinkiconright }}>
                {rightArrowIcon({ ...Styles.icondefault, ...Styles.icon20 })}
              </View>
            </Pressable>
            {/* <Pressable onPress={() => handlePageNav(SCREEN.account)} style={{ ...Styles.userinfolinkitem }}>
                            <View style={{ ...Styles.userinfolinkicon }}>
                                <View style={{ ...Styles.icon24 }}>{profileactive}</View>
                            </View>
                            <Text style={{ ...Styles.userinfolinktext }}>Account Setting</Text>
                            <View style={{ ...Styles.userinfolinkiconright }}>
                                {rightArrowIcon({ ...Styles.icondefault, ...Styles.icon20 })}
                            </View>
                        </Pressable> */}
            <Pressable onPress={() => handlePageNav(SCREEN.privacy)} style={{ ...Styles.userinfolinkitem }}>
              <View style={{ ...Styles.userinfolinkicon }}>
                <View style={{ ...Styles.icon24 }}>{privacyIcon(Styles.iconprimary)}</View>
              </View>
              <Text style={{ ...Styles.userinfolinktext }}>Privacy Settings</Text>
              <View style={{ ...Styles.userinfolinkiconright }}>
                {rightArrowIcon({ ...Styles.icondefault, ...Styles.icon20 })}
              </View>
            </Pressable>
            <Pressable
              onPress={() => handlePageNav(SCREEN.notification)}
              style={{ ...Styles.userinfolinkitem }}
            >
              <View style={{ ...Styles.userinfolinkicon }}>
                <View style={{ ...Styles.icon20 }}>{notificationsIcon(Styles.iconprimary)}</View>
              </View>
              <Text style={{ ...Styles.userinfolinktext }}>{translation.notification}</Text>
              <View style={{ ...Styles.userinfolinkiconright }}>
                {rightArrowIcon({ ...Styles.icondefault, ...Styles.icon20 })}
              </View>
            </Pressable>
            {/* <View style={{ ...Styles.userinfolinkitem }}>
                    <View style={{ ...Styles.userinfolinkicon }}>
                        <View style={{ ...Styles.icon20 }}>{infoIcon(Styles.iconprimary)}</View>
                    </View>
                    <Text style={{ ...Styles.userinfolinktext }}>About</Text>
                    <View style={{ ...Styles.userinfolinkiconright }}>
                        {rightArrowIcon({ ...Styles.icondefault, ...Styles.icon20 })}
                    </View>
                </View> */}
            {/* <View style={{ ...Styles.userinfolinkitem }}>
                    <View style={{ ...Styles.userinfolinkicon }}>
                        <View style={{ ...Styles.icon18 }}>{shareIcon(Styles.iconprimary)}</View>
                    </View>
                    <Text style={{ ...Styles.userinfolinktext }}>Share</Text>
                    <View style={{ ...Styles.userinfolinkiconright }}>
                        {rightArrowIcon({ ...Styles.icondefault, ...Styles.icon20 })}
                    </View>
                </View>
                <View style={{ ...Styles.userinfolinkitem }}>
                    <View style={{ ...Styles.userinfolinkicon }}>
                        <View style={{ ...Styles.icon18 }}>{rateIcon(Styles.icondefault)}</View>
                    </View>
                    <Text style={{ ...Styles.userinfolinktext }}>Rate Us</Text>
                    <View style={{ ...Styles.userinfolinkiconright }}>
                        {rightArrowIcon({ ...Styles.icondefault, ...Styles.icon20 })}
                    </View>
                </View> */}
          </View>
          <View style={{ ...Styles.userinfolinks, ...Styles.block, marginTop: 0, }}>
            <View style={{ ...Styles.userinfolinkitem, borderTopWidth: 0, ...Styles.cursor, ...Styles.userinfolinkitemtoggle }}>
              <Text style={{ ...Styles.userinfolinktext }}>
                Dark Mode
              </Text>
              {/* <Text style={{ ...Styles.userinfolinkcount, ...Styles.fontlight }}>ON</Text> */}
              <View style={{ ...Styles.userinfolinkiconright }}>
                <Switch
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={isEnabled ? '#057EFC' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={(value) => {
                    if (value) setMode(MODE.dark)
                    else setMode(MODE.light)
                  }}
                  value={mode == MODE.dark ? true : false}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingBody;
