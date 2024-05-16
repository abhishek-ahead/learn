import React, { useContext } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";
import { SCREEN } from "../../constant";
import {
  notificationsIcon,
  privacyIcon,
  rightArrow,
  staroutlineactive
} from "../../constant/icons";
import { AppContext } from "../../context/app";
import { AuthContext } from "../../context/auth";
import { SettingContext } from "../../context/setting";
import Styles, { appStyle } from "../../styles";


const SettingBody = () => {
  const { user } = useContext(AuthContext);
  const { handlePageNav } = useContext(SettingContext);
  const { setShowImage, translation } = useContext(AppContext);

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
              <>
                {user.about ? (
                  <Text
                    style={{ ...Styles.userinfostatus, ...Styles.fontlight }}
                    numberOfLines={1}
                  >
                    {user.about}
                  </Text>
                ) : null}
              </>
            </View>
          </View>

          <View style={{ ...Styles.userinfolinks, ...Styles.block }}>
            <Pressable onPress={() => handlePageNav(SCREEN.settingStarred)} style={{ ...Styles.userinfolinkitem, borderTopWidth: 0 }}>
              <View style={{ ...Styles.userinfolinkicon }}>
                <View style={{ ...Styles.icon20 }}>{staroutlineactive}</View>
              </View>
              <Text style={{ ...Styles.userinfolinktext }}>{translation.starredMessage}</Text>
              <View style={{ ...Styles.userinfolinkiconright }}>
                {rightArrow}
              </View>
            </Pressable>
            {/* <Pressable onPress={() => handlePageNav(SCREEN.account)} style={{ ...Styles.userinfolinkitem }}>
                            <View style={{ ...Styles.userinfolinkicon }}>
                                <View style={{ ...Styles.icon24 }}>{profileactive}</View>
                            </View>
                            <Text style={{ ...Styles.userinfolinktext }}>Account Setting</Text>
                            <View style={{ ...Styles.userinfolinkiconright }}>
                                {rightArrow}
                            </View>
                        </Pressable> */}
            {/* <Pressable onPress={() => handlePageNav(SCREEN.privacy)} style={{ ...Styles.userinfolinkitem }}>
              <View style={{ ...Styles.userinfolinkicon }}>
                <View style={{ ...Styles.icon24 }}>{privacyIcon}</View>
              </View>
              <Text style={{ ...Styles.userinfolinktext }}>Privacy Settings</Text>
              <View style={{ ...Styles.userinfolinkiconright }}>
                {rightArrow}
              </View>
            </Pressable> */}
            <Pressable
              onPress={() => handlePageNav(SCREEN.notification)}
              style={{ ...Styles.userinfolinkitem }}
            >
              <View style={{ ...Styles.userinfolinkicon }}>
                <View style={{ ...Styles.icon20 }}>{notificationsIcon}</View>
              </View>
              <Text style={{ ...Styles.userinfolinktext }}>{translation.notification}</Text>
              <View style={{ ...Styles.userinfolinkiconright }}>
                {rightArrow}
              </View>
            </Pressable>
            {/* <View style={{ ...Styles.userinfolinkitem }}>
                    <View style={{ ...Styles.userinfolinkicon }}>
                        <View style={{ ...Styles.icon20 }}>{infoIcon}</View>
                    </View>
                    <Text style={{ ...Styles.userinfolinktext }}>About</Text>
                    <View style={{ ...Styles.userinfolinkiconright }}>
                        {rightArrow}
                    </View>
                </View> */}
            {/* <View style={{ ...Styles.userinfolinkitem }}>
                    <View style={{ ...Styles.userinfolinkicon }}>
                        <View style={{ ...Styles.icon18 }}>{shareIconactive}</View>
                    </View>
                    <Text style={{ ...Styles.userinfolinktext }}>Share</Text>
                    <View style={{ ...Styles.userinfolinkiconright }}>
                        {rightArrow}
                    </View>
                </View>
                <View style={{ ...Styles.userinfolinkitem }}>
                    <View style={{ ...Styles.userinfolinkicon }}>
                        <View style={{ ...Styles.icon18 }}>{rateIcon}</View>
                    </View>
                    <Text style={{ ...Styles.userinfolinktext }}>Rate Us</Text>
                    <View style={{ ...Styles.userinfolinkiconright }}>
                        {rightArrow}
                    </View>
                </View> */}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingBody;
