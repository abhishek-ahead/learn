import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { MEMBER_GROUP_ROLE, SCREEN } from "../../constant";
import {
  addIconPrimary,
  linkoutlineprimary,
  optionButton,
  rightArrow,
  settingIconprimary,
  userpendingIconprimary,
} from "../../constant/icons";
import { AppContext } from "../../context/app";
import { GroupContext } from "../../context/group";
import { groupMembers } from "../../services/group";
import Styles from "../../styles";

export default ({ group, handleNavigate }) => {
  const { translation, setAddMemberGroup } = useContext(AppContext);
  const { selectedMember, setSelectedMember } = useContext(GroupContext);
  const [members, setMembers] = useState([]);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    groupMembers({ id: group._id, page: 0, limit: 2 })
      .then((res) => {
        if (res.success) setMembers(res.data.users);
      })
      .finally(() => setloading(false));
  }, []);

  return (
    <>
      {group.superAdmin || group.admin ? (
        <View style={{ ...Styles.userinfolinks, ...Styles.block }}>
          <Pressable
            onPress={() => handleNavigate(group._id, SCREEN.groupSetting)}
            style={{
              ...Styles.userinfolinkitem,
              borderTopWidth: 0,
            }}
          >
            <View style={{ ...Styles.userinfolinkicon }}>
              <View style={{ ...Styles.icon24 }}>{settingIconprimary}</View>
            </View>
            <Text style={{ ...Styles.userinfolinktext }}>
              {translation.groupSettings}
            </Text>
            <View style={{ ...Styles.userinfolinkiconright }}>
              {rightArrow}
            </View>
          </Pressable>
        </View>
      ) : null}
      <View style={Styles.mbot5}>
        <Text style={{ ...Styles.fontsizetitle, ...Styles.fontBold, ...Styles.fontdefault }}>
          {`${group.totalMembers}  ${translation.members}`}
        </Text>
      </View>
      <View style={{ ...Styles.userinfolinks, ...Styles.block }}>
        {group.superAdmin || group.admin || group.settings.member.addMember ? (
          <Pressable
            onPress={() => setAddMemberGroup(group._id)}
            style={{ ...Styles.userinfolinkitem, borderTopWidth: 0 }}
          >
            <View style={{ ...Styles.userinfolinkicon }}>
              <View style={{ ...Styles.icon24 }}>{addIconPrimary}</View>
            </View>
            <Text
              style={{
                ...Styles.userinfolinktext,
                ...Styles.fontlink,
              }}
            >
              {translation.addMembers}
            </Text>
            <View style={{ ...Styles.userinfolinkiconright }}>
              {rightArrow}
            </View>
          </Pressable>
        ) : null}
        {group.pendingMembers && (group.superAdmin || group.admin) ? (
          <>
            <Pressable
              onPress={() =>
                handleNavigate(group._id, SCREEN.groupPendingRequest)
              }
              style={{ ...Styles.userinfolinkitem, borderTopWidth: 0 }}
            >
              <View style={{ ...Styles.userinfolinkicon }}>
                <View style={{ ...Styles.icon18 }}>
                  {userpendingIconprimary}
                </View>
              </View>
              <Text
                style={{
                  ...Styles.userinfolinktext,
                  ...Styles.fontlink,
                }}
              >
                {translation.pendingRequest}
              </Text>
              <View style={{ ...Styles.userinfolinkiconright }}>
                <Text style={{ ...Styles.countbadge }}>{group.pendingRequest}</Text>
              </View>
            </Pressable>
            <Pressable
              // onPress={() => handleNavigate(group._id, SCREEN.groupSetting)}
              style={{ ...Styles.userinfolinkitem, borderTopWidth: 0 }}
            >
              <View style={{ ...Styles.userinfolinkicon }}>
                <View style={{ ...Styles.icon18 }}>{linkoutlineprimary}</View>
              </View>
              <Text
                style={{
                  ...Styles.userinfolinktext,
                  ...Styles.fontlink,
                }}
              >
                {translation.inviteLink}
              </Text>
              <View style={{ ...Styles.userinfolinkiconright }}>
                {rightArrow}
              </View>
            </Pressable>
          </>
        ) : null}

        {loading ? (
          <View style={{ ...Styles.itemCenter, height: 100 }}>
            <ActivityIndicator size={"small"} color="#6a6f75" />
          </View>
        ) : (
          members.map((member) => (
            <View
              key={`member_${member._id}`}
              style={{
                ...Styles.userinfolinkitem,
                borderTopWidth: 0,
              }}
            >
              <Image
                style={{ ...Styles.userinfolinkthumb }}
                source={{
                  uri: member.user.avatar,
                }}
              />
              <View style={{ ...Styles.userinfolinkcont }}>
                <Text style={{ ...Styles.fontdefault, ...Styles.font500 }}>
                  {member.user.name}
                </Text>
                {/* <Text
                style={{
                  ...Styles.fontlight,
                  ...Styles.fontsizesmall,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Lorem ipsum dolor sit amet, consectetur....
              </Text> */}
              </View>
              {[MEMBER_GROUP_ROLE.superAdmin, MEMBER_GROUP_ROLE.admin].includes(
                member.role
              ) ? (
                <View style={{ ...Styles.userinfolinkiconright }}>
                  <Text
                    style={{
                      ...Styles.fontsizesmall,
                      ...Styles.fontlight,
                    }}
                  >
                    {translation.admin}
                  </Text>
                </View>
              ) : null}
              {member.showOption &&
                member.user._id !== group.member.user._id ? (
                <Pressable
                  onPress={() => setSelectedMember(member)}
                  style={{ ...Styles.icon, ...Styles.icon18 }}
                >
                  {optionButton}
                </Pressable>
              ) : null}
            </View>
          ))
        )}
        {/* <Pressable
              onPress={() => handleNavigate(group._id, SCREEN.groupSetting)}
              style={{ ...Styles.userinfolinkitem, borderTopWidth: 0 }}
            >
              <Image
                style={{ ...Styles.userinfolinkthumb }}
                source={{
                  uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png",
                }}
              />
              <View style={{ ...Styles.userinfolinkcont }}>
                <Text
                  style={{ ...Styles.fontdefault, ...Styles.font500 }}
                >
                  Yuvika Dutt
                </Text>
                <Text
                  style={{
                    ...Styles.fontlight,
                    ...Styles.fontsizesmall,
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Lorem ipsum dolor sit amet, consectetur....
                </Text>
              </View>
              <View style={{ ...Styles.userinfolinkiconright }}>
                <Text
                  style={{
                    ...Styles.fontsizesmall,
                    ...Styles.fontlight,
                  }}
                >
                  Admin
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => handleNavigate(group._id, SCREEN.groupSetting)}
              style={{ ...Styles.userinfolinkitem, borderTopWidth: 0 }}
            >
              <Image
                style={{ ...Styles.userinfolinkthumb }}
                source={{
                  uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png",
                }}
              />
              <View style={{ ...Styles.userinfolinkcont }}>
                <Text
                  style={{ ...Styles.fontdefault, ...Styles.font500 }}
                >
                  Yuzika Roman
                </Text>
                <Text
                  style={{
                    ...Styles.fontlight,
                    ...Styles.fontsizesmall,
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Lorem ipsum dolor sit amet, consectetur....
                </Text>
              </View>
              <View style={{ ...Styles.userinfolinkiconright }}>
                {rightArrow}
              </View>
            </Pressable> */}
        {group.totalMembers > 2 ? (
          <Pressable
            onPress={() => handleNavigate(group._id, SCREEN.groupMembers)}
            style={{ ...Styles.userinfolinkitem }}
          >
            <View style={{ ...Styles.userinfolinkcont }}>
              <Text
                style={{
                  ...Styles.fontlink,
                  ...Styles.font500,
                  ...Styles.textcenter,
                }}
              >
                {translation.seeAll}
              </Text>
            </View>
          </Pressable>
        ) : null}
      </View>
    </>
  );
};
