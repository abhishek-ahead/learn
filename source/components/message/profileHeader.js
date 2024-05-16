/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import React, { useContext } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { CHAT_TYPE, SCREEN } from "../../constant";
import { AppContext } from "../../context/app";
import { MessageContext } from "../../context/message";

const ProfileHeader = ({ handleNavigate }) => {
  const { chat, group } = useContext(MessageContext);
  const { translation, Styles } = useContext(AppContext);
  if (chat)
    return (
      <View style={{marginVertical: 30 }}>
        <Pressable
          style={{...Styles.userinfotop, marginBottom:0}}
          onPress={() =>
            handleNavigate(
              chat._id,
              chat.chatType == CHAT_TYPE.user
                ? SCREEN.profile
                : SCREEN.groupProfile
            )
          }
        >
          <Image style={Styles.image80} source={{ uri: chat.avatar }} />
          <Text
            style={{
              ...Styles.userinfoname,
              ...Styles.fontBold,
              ...Styles.fontsizetitle,
              ...Styles.textcenter
            }}
          >
            {chat.name}
          </Text>
        </Pressable>
        <Text
          style={{
            ...Styles.userinfostatus,
            ...Styles.fontlight,
            ...Styles.textcenter,
          }}
        >
          {chat?.chatType == CHAT_TYPE.user
            ? chat.createdAt
              ? `${translation.friendSince} ${moment(chat.createdAt).format(
                  "MMM YYYY"
                )}`
              : null
            : `${translation.group} . ${group?.totalMembers} ${translation.members}`}
        </Text>
      </View>
    );
  return null;
};

export default ProfileHeader;
