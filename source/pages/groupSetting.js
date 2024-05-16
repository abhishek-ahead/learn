import { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Switch,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { GROUP_TYPE, SCREEN } from "../constant";
import {
  backIcon,
  bullhornIconwhite,
  editIconwhite,
  rightArrow,
  useraddIconwhite,
  userwaitIconwhite,
} from "../constant/icons";
import { AppContext } from "../context/app";
import { updateSetting } from "../services/group";
import { chatNavigation } from "../store/reducer";
import Styles, { appStyle, mainStyle } from "../styles";

const GroupSetting = ({ navigation, route, id }) => {
  const dispatch = useDispatch();
  id = route?.params?.id || id;
  const group = useSelector((state) => state.group.groups[id]);
  const { translation, getGroupDetails } = useContext(AppContext);

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
                {backIcon}
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
          <ActivityIndicator style={{ paddingTop: 10 }} size={"large"} />
        ) : (
          <View style={{ flex: 1, ...appStyle, ...Styles.userinfowrap }}>
            <View>
              <Text style={{ ...Styles.fontsizetitle, ...Styles.fontBold }}>
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
                  <View style={{ ...Styles.icon20 }}>{editIconwhite}</View>
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
                  <View style={{ ...Styles.icon20 }}>{bullhornIconwhite}</View>
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
                  <View style={{ ...Styles.icon20 }}>{useraddIconwhite}</View>
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
              <Text style={{ ...Styles.fontsizetitle, ...Styles.fontBold }}>
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
                  {rightArrow}
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
                    {rightArrow}
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        )}
      </View>
    </View>
  );
};

export default GroupSetting;
