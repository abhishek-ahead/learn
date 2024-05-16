import React, { useContext } from "react";
import { Image, Modal, Platform, Pressable, Text, View } from "react-native";
import { MenuOption } from "react-native-popup-menu";
import { MEMBER_GROUP_ROLE, SCREEN } from "../../constant";
import {
  deleteIcon,
  messageDefault,
  profile,
  userpendingIcondanger,
  userpendingIcondefault,
} from "../../constant/icons";
import { AppContext } from "../../context/app";
import { GroupContext } from "../../context/group";
import { dismissAdmin, makeAdmin, removeMember } from "../../services/group";
import Styles from "../../styles";

const Options = ({ onClose }) => {
  const { translation } = useContext(AppContext);
  const { selectedMember, setSelectedMember, handleNavigate, group } =
    useContext(GroupContext);
  const setClose = () => setSelectedMember(null);

  return (
    <Pressable
      style={{
        ...Styles.chatBubble,
        ...Styles.optionsmodalContainer,
        ...Styles.modalContainer,
        margin: 0,
        justifyContent: "flex-end",
      }}
      onPress={onClose}
    >
      <View style={Styles.optionheader}>
        <Image
          style={{ ...Styles.optionheaderowner }}
          source={{ uri: selectedMember.user.avatar }}
        />
        <View style={Styles.optionheaderInfo}>
          <View style={Styles.optionheaderinfotitle}>
            <Text style={Styles.optionheaderinfoname}>
              {selectedMember.user.name}
            </Text>
          </View>
          {/* <View style={Styles.optionheaderinfofooter}>
              <MessageContentType message={message} />
            </View> */}
        </View>
      </View>
      <View style={Styles.optionsmodaloptions}>
        <MenuOption
          onSelect={() => {
            handleNavigate(SCREEN.profile, selectedMember.user._id);
            setClose();
          }}
          style={Styles.optionsmodalitem}
        >
          <View style={{ ...Styles.optionsmodalitemicon, ...Styles.icon24 }}>
            {profile}
          </View>
          <Text style={Styles.optionsmodalitemtext}>
            {translation.chatInfo}
          </Text>
        </MenuOption>
        <MenuOption
          onSelect={() => {
            handleNavigate(SCREEN.message, selectedMember.user._id);
            setClose();
          }}
          style={Styles.optionsmodalitem}
        >
          <View style={Styles.optionsmodalitemicon}>{messageDefault}</View>
          <Text style={Styles.optionsmodalitemtext}>{translation.message}</Text>
        </MenuOption>
        {group.admin || group.moderator ? (
          <>
            <MenuOption
              onSelect={() => {
                {
                  [
                    MEMBER_GROUP_ROLE.admin,
                    MEMBER_GROUP_ROLE.superAdmin,
                  ].includes(selectedMember.role)
                    ? dismissAdmin({
                        group: group._id,
                        member: selectedMember.user._id,
                      })
                    : makeAdmin({
                        group: group._id,
                        member: selectedMember.user._id,
                      });
                }
                setClose();
              }}
              style={Styles.optionsmodalitem}
            >
              {[MEMBER_GROUP_ROLE.admin, MEMBER_GROUP_ROLE.superAdmin].includes(
                selectedMember.role
              ) ? (
                <>
                  <View style={Styles.optionsmodalitemicon}>
                    {userpendingIcondanger}
                  </View>
                  <Text
                    style={{
                      ...Styles.optionsmodalitemtext,
                      ...Styles.fontdanger,
                    }}
                  >
                    {translation.dismissAdmin}
                  </Text>
                </>
              ) : (
                <>
                  <View style={Styles.optionsmodalitemicon}>
                    {userpendingIcondefault}
                  </View>
                  <Text style={Styles.optionsmodalitemtext}>
                    {translation.makeAdmin}
                  </Text>
                </>
              )}
            </MenuOption>
            <MenuOption
              onSelect={() => {
                removeMember({
                  group: group._id,
                  user: selectedMember.user._id,
                });
                setClose();
              }}
              style={Styles.optionsmodalitem}
            >
              <View style={Styles.optionsmodalitemicon}>{deleteIcon}</View>
              <Text
                style={{ ...Styles.optionsmodalitemtext, ...Styles.fontdanger }}
              >
                {`${translation.remove} ${
                  selectedMember.user.name.split(" ")[0]
                }`}
              </Text>
            </MenuOption>
          </>
        ) : null}
      </View>
      <MenuOption
        onSelect={() => {
          setClose();
        }}
        style={{ ...Styles.cancelButton }}
      >
        <Text style={{ ...Styles.cancelButtonText, ...Styles.textcenter }}>{translation.cancel}</Text>
      </MenuOption>
    </Pressable>
  );
};

export const GroupMemberPopupOptions = () => {
  const { selectedMember, setSelectedMember } = useContext(GroupContext);
  const onClose = () => setSelectedMember(null);
  if (selectedMember)
    if (Platform.OS == "web")
      return (
        <View style={Styles.optionsmodalWrap}>
          <Options onClose={onClose} />
        </View>
      );
    else
      return (
        <Modal
          transparent={true}
          visible={selectedMember ? true : false}
          onRequestClose={onClose}
          statusBarTranslucent
        >
          <Options onClose={onClose} />
        </Modal>
      );
};
