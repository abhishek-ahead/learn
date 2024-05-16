import { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { GROUP_TYPE, SCREEN } from "../constant";
import {
  backIcon,
  bullhornIcon,
  copydefault,
  editIcon,
  forwardIcon,
  qrIcon,
  shareIcon,
  userAddIcon,
  userwaitIconwhite
} from "../constant/icons";
import { AppContext } from "../context/app";
import { updateSetting } from "../services/group";
import { chatNavigation } from "../store/reducer";
import { appStyle, mainStyle } from "../styles";

const GroupSetting = ({ navigation, route, id }) => {
  const dispatch = useDispatch();
  id = route?.params?.id || id;
  const group = useSelector((state) => state.group.groups[id]);
  const { translation, getGroupDetails, Styles } = useContext(AppContext);

  const handleBackNavigation = () => {
    Platform.OS !== "web"
      ? navigation.goBack()
      : dispatch(chatNavigation({ id, screen: SCREEN.profile }));
  };

  const [setting, setSetting] = useState(group?.settings);
  const toggle = useRef(false);

  const handleToggle = ({ level, setting, value }) => {
    toggle.current = true;
    setSetting((prev) => {
      const data = { ...prev };
      data[level] = {
        ...data[level],
        [setting]: value,
      };
      return data;
    });
  };

  useEffect(() => {
    if (toggle.current) updateSetting({ group: id, settings: setting });
  }, [setting]);

  useEffect(() => {
    if (!group) getGroupDetails(id);
  }, []);

  useEffect(() => {
    if (group && JSON.stringify(group.settings) != JSON.stringify(setting)) {
      toggle.current = false;
      setSetting(group.settings);
    }
  }, [group?.settings]);

  return (
    <View style={mainStyle}>
      <View style={{ ...Styles.chatBubble, ...appStyle, ...Styles.userinfo }}>
        <View style={{ ...Styles.chatBubbleHeader }}>
          <Pressable
            onPress={handleBackNavigation}
            style={Styles.chatBubbleHeaderOption}
          >
            <View style={Styles.chatBubbleHeaderOptionIcon}>
              <View style={{ ...Styles.icon, ...Styles.icon24 }}>
                {backIcon(Styles.icondefault)}
              </View>
            </View>
          </Pressable>
          <View style={Styles.chatBubbleHeaderInfo}>
            <Text style={{ ...Styles.chatBubbleHeaderTitle }}>
              {translation.groupSettings}
            </Text>
          </View>
        </View>
        {!setting ? (
          <View style={{ ...Styles.itemCenter, flex: 1 }}><ActivityIndicator size={"large"} color="#6a6f75" /></View>
        ) : (
          <ScrollView style={{ width: "100%" }}>
            <View style={{ flex: 1, ...appStyle, ...Styles.userinfowrap }}>
              <View>
                <Text style={{ ...Styles.fontsizetitle, ...Styles.fontBold, ...Styles.fontdefault }}>
                  {`${translation.membersCan} :`}
                </Text>
              </View>
              <View style={{ ...Styles.userinfolinks, ...Styles.block }}>
                <View
                  style={{
                    ...Styles.userinfolinkitem,
                    ...Styles.alignItemsStart,
                    borderTopWidth: 0,
                    ...Styles.cursor,
                  }}
                >
                  <View
                    style={{
                      ...Styles.userinfolinkicon,
                      backgroundColor: "#057EFC",
                    }}
                  >
                    <View style={{ ...Styles.icon20 }}>{editIcon(Styles.iconwhite)}</View>
                  </View>
                  <View style={{ ...Styles.userinfolinkcont }}>
                    <Text style={{ ...Styles.fontdefault }}>
                      {translation.editGroupSetting}
                    </Text>
                    <Text
                      style={{ ...Styles.fontlight, ...Styles.fontsizesmall }}
                    >
                      {translation.editGroupSettingDescription}
                    </Text>
                  </View>
                  <View style={{ ...Styles.userinfolinkiconright }}>
                    <Switch
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={
                        setting.member.editDetails ? "#057EFC" : "#f4f3f4"
                      }
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={(value) =>
                        handleToggle({
                          level: "member",
                          setting: "editDetails",
                          value,
                        })
                      }
                      value={setting.member.editDetails}
                    />
                  </View>
                </View>
                <View
                  style={{
                    ...Styles.userinfolinkitem,
                    ...Styles.alignItemsStart,
                    ...Styles.cursor,
                  }}
                >
                  <View
                    style={{
                      ...Styles.userinfolinkicon,
                      backgroundColor: "#057EFC",
                    }}
                  >
                    <View style={{ ...Styles.icon20 }}>{bullhornIcon(Styles.iconwhite)}</View>
                  </View>
                  <View style={{ ...Styles.userinfolinkcont }}>
                    <Text style={{ ...Styles.fontdefault }}>
                      {translation.sendMessages}
                    </Text>
                    <Text
                      style={{ ...Styles.fontlight, ...Styles.fontsizesmall }}
                    >
                      {translation.sendMessagesDescription}
                    </Text>
                  </View>
                  <View style={{ ...Styles.userinfolinkiconright }}>
                    <Switch
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={
                        setting.member.sendMessage ? "#057EFC" : "#f4f3f4"
                      }
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={(value) =>
                        handleToggle({
                          level: "member",
                          setting: "sendMessage",
                          value,
                        })
                      }
                      value={setting.member.sendMessage}
                    />
                  </View>
                </View>
                <View style={{ ...Styles.userinfolinkitem, ...Styles.cursor }}>
                  <View
                    style={{
                      ...Styles.userinfolinkicon,
                      backgroundColor: "#057EFC",
                    }}
                  >
                    <View style={{ ...Styles.icon20 }}>{userAddIcon()}</View>
                  </View>
                  <View style={{ ...Styles.userinfolinkcont }}>
                    <Text style={{ ...Styles.fontdefault }}>
                      {translation.addOtherMembers}
                    </Text>
                  </View>
                  <View style={{ ...Styles.userinfolinkiconright }}>
                    <Switch
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={
                        setting.member.addMember ? "#057EFC" : "#f4f3f4"
                      }
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={(value) =>
                        handleToggle({
                          level: "member",
                          setting: "addMember",
                          value,
                        })
                      }
                      value={setting.member.addMember}
                    />
                  </View>
                </View>
              </View>

              <View>
                <Text style={{ ...Styles.fontsizetitle, ...Styles.fontBold, ...Styles.fontdefault }}>
                  {`${translation.adminsCan}:`}
                </Text>
              </View>
              <View style={{ ...Styles.userinfolinks, ...Styles.block }}>
                <View
                  style={{
                    ...Styles.userinfolinkitem,
                    ...Styles.alignItemsStart,
                    borderTopWidth: 0,
                    ...Styles.cursor,
                  }}
                >
                  <View
                    style={{
                      ...Styles.userinfolinkicon,
                      backgroundColor: "#00B533",
                    }}
                  >
                    <View style={{ ...Styles.icon18 }}>{userwaitIconwhite}</View>
                  </View>
                  <View style={{ ...Styles.userinfolinkcont }}>
                    <Text style={{ ...Styles.fontdefault }}>
                      {translation.approveNewMembers}
                    </Text>
                    <Text
                      style={{ ...Styles.fontlight, ...Styles.fontsizesmall }}
                    >
                      {translation.approveNewMembersDescription}
                    </Text>
                  </View>
                  <View style={{ ...Styles.userinfolinkiconright }}>
                    <Switch
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={
                        setting.admin.approveMember ? "#057EFC" : "#f4f3f4"
                      }
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={(value) =>
                        handleToggle({
                          level: "admin",
                          setting: "approveMember",
                          value,
                        })
                      }
                      value={setting.admin.approveMember}
                    />
                  </View>
                </View>
              </View>
              {/* Invite Code Start */}
              <View style={{ ...Styles.userselfinfotop, ...Styles.block, marginBottom: 0, }}>
                <View style={{ ...Styles.thumbImg, ...Styles.userselfinfotopthumb }}>
                  <Image style={Styles.userselfinfotopthumbimg} source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }} />
                </View>
                <View style={Styles.userselfinfotopinfo}>
                  <Text
                    style={{
                      ...Styles.userselfinfotopname,
                      ...Styles.fontsizetitle,
                      ...Styles.fontprimary
                    }}
                  >
                    Best Friends Group
                  </Text>
                  <Text style={{ ...Styles.userinfostatus, ...Styles.fontlight, ...Styles.fontsizesmall, ...Styles.mtop2 }} numberOfLines={2}
                  >Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Text>
                </View>
              </View>
              <View>
                <Text style={{ ...Styles.fontlight, ...Styles.fontsizesmall }}>
                  Members do not need approval from an admin to join this group. Edit in <Text style={Styles.fontlink}>group settings</Text>.
                </Text>
              </View>
              <View style={{ ...Styles.userinfolinks, ...Styles.block, marginTop: 15, }}>
                <View style={{ ...Styles.userinfolinkitem, borderTopWidth: 0 }}>
                  <View style={{ ...Styles.userinfolinkicon }}>
                    <View style={{ ...Styles.icon20 }}>{forwardIcon}</View>
                  </View>
                  <Text style={{ ...Styles.userinfolinktext }}>Send Link Via Circuit Chat</Text>
                </View>
                <View style={{ ...Styles.userinfolinkitem }}>
                  <View style={{ ...Styles.userinfolinkicon }}>
                    <View style={{ ...Styles.icon16 }}>{shareIcon(Styles.icondefault)}</View>
                  </View>
                  <Text style={{ ...Styles.userinfolinktext }}>Share Link</Text>
                </View>
                <View style={{ ...Styles.userinfolinkitem }}>
                  <View style={{ ...Styles.userinfolinkicon }}>
                    <View style={{ ...Styles.icon20 }}>{copydefault(Styles.icondefault)}</View>
                  </View>
                  <Text style={{ ...Styles.userinfolinktext }}>Copy Link</Text>
                </View>
                <View style={{ ...Styles.userinfolinkitem }}>
                  <View style={{ ...Styles.userinfolinkicon }}>
                    <View style={{ ...Styles.icon20 }}>{qrIcon(Styles.icondefault)}</View>
                  </View>
                  <Text style={{ ...Styles.userinfolinktext }}>QR Code</Text>
                </View>
              </View>
              <View style={{ ...Styles.userinfolinks, ...Styles.block }}>
                <View style={{ ...Styles.userinfolinkitem, borderTopWidth: 0 }}>
                  <Text style={{ ...Styles.userinfolinktext, ...Styles.fontdanger }}>Reset Link</Text>
                </View>
              </View>
              {/* Invite Code End */}



              {/* QR Code Start */}
              <View style={{ ...Styles.qrcodeblock, ...Styles.block }}>
                <View style={{ ...Styles.qrcodeblockthumb }}>
                  <Image style={{ ...Styles.qrcodeblockthumbimg, ...Styles.thumbImg, ...Styles.noborder }} source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }} />
                </View>
                <View>
                  <Text style={{ ...Styles.fontsizetitle, ...Styles.fontBold, ...Styles.fontdefault, ...Styles.textcenter }}>Best Friends Groups</Text>
                  <Text style={{ ...Styles.fontlight, ...Styles.textcenter, ...Styles.mtop2 }}>Circuit Chat Group </Text>
                </View>
                <View style={{}}>
                  <Image style={{ ...Styles.qrcodeimg }} source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/5/5e/QR_Code_example.png" }} />
                </View>
              </View>
              <View style={{ ...Styles.mtop0 }}><Text style={{ ...Styles.fontsizesmall, ...Styles.fontlight, ...Styles.textcenter }}>This group QR code is private. if it is share with someone, they can scan it with their Circuit Chat Camera to join this group.</Text></View>

              <View style={{ ...Styles.userinfolinkitem, borderTopWidth: 0, marginTop: 10 }}>
                <Text style={{ ...Styles.userinfolinktext, ...Styles.fontlink, ...Styles.textcenter }}>Reset QR Code</Text>
              </View>
              {/* QR Code End */}



              {/* <View style={{ ...Styles.userinfolinks, ...Styles.block }}>
                <View
                  style={{
                    ...Styles.userinfolinkitem,
                    borderTopWidth: 0,
                    ...Styles.cursor,
                  }}
                >
                  <View style={{ ...Styles.userinfolinkcont }}>
                    <Text style={{ ...Styles.fontdefault }}>
                      {translation.groupAdmins}
                    </Text>
                    <Text
                      style={{ ...Styles.fontlight, ...Styles.fontsizesmall }}
                    >
                      {group.members
                        .filter((member) =>
                          [
                            MEMBER_GROUP_ROLE.superAdmin,
                            MEMBER_GROUP_ROLE.admin,
                          ].includes(member.role)
                        )
                        .map((member) => member.user.name)
                        .join(", ")}
                    </Text>
                  </View>
                  <View style={{ ...Styles.userinfolinkiconright }}>
                    {rightArrow({ ...Styles.icondefault, ...Styles.icon20 })}
                  </View>
                </View>
              </View> */}
              {group.type == GROUP_TYPE.password_protected ? (
                <View style={{ ...Styles.userinfolinks, ...Styles.block }}>
                  <View
                    style={{
                      ...Styles.userinfolinkitem,
                      borderTopWidth: 0,
                      ...Styles.cursor,
                    }}
                  >
                    <View style={{ ...Styles.userinfolinkcont }}>
                      <Text style={{ ...Styles.fontdefault }}>
                        {translation.changePassword}
                      </Text>
                    </View>
                    <View style={{ ...Styles.userinfolinkiconright }}>
                      {rightArrow({ ...Styles.icondefault, ...Styles.icon20 })}
                    </View>
                  </View>
                </View>
              ) : null}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default GroupSetting;
