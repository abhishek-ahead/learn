import { ResizeMode, Video } from "expo-av";
import React, { useContext } from "react";
import { Image, Modal, Platform, Pressable, Text, View } from "react-native";
import { MenuOption } from "react-native-popup-menu";
import { CHAT_TYPE, CONTENT_TYPE, PERMISSION } from "../../constant";
import {
  deleteIcon,
  forwardIcon,
  replyIcon,
  starIcon,
  unstarredMessage,
} from "../../constant/icons";
import { AppContext } from "../../context/app";
import { AuthContext } from "../../context/auth";
import { MessageContext } from "../../context/message";
import { markStarred, markUnstarred } from "../../services/message";
import Styles from "../../styles";
import MessageContentType from "../messageContentType";

const Options = ({ onClose }) => {
  const { USER_ID } = useContext(AuthContext);
  const { setForwardOpen, setDeleteOpen, translation, permissions } =
    useContext(AppContext);
  const {
    selectedMessage: message,
    setReply,
    setSelectedMessage,
  } = useContext(MessageContext);
  const setClose = () => setSelectedMessage(null);
  return (
    <Pressable
      style={{
        borderTopLeftRadius: Platform.OS == "web" ? 10 : 0,
        borderTopRightRadius: Platform.OS == "web" ? 10 : 0,
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
          source={{ uri: message.user.avatar }}
        />
        <View style={Styles.optionheaderInfo}>
          <View style={Styles.optionheaderinfotitle}>
            <Text style={Styles.optionheaderinfoname}>
              {message.sender == USER_ID ? translation.you : message.user.name}
            </Text>
          </View>
          <View style={Styles.optionheaderinfofooter}>
            <MessageContentType message={message} />
          </View>
        </View>
        {message.contentType == CONTENT_TYPE.image ? (
          <Image
            style={{ ...Styles.optionheadermedia }}
            source={{ uri: message.media }}
          />
        ) : message.contentType == CONTENT_TYPE.video ? (
          <Video
            style={{ ...Styles.optionheadermedia }}
            videoStyle={{
              height: 40,
              width: 40,
              borderRadius: 5,
            }}
            source={{ uri: message.media }}
            useNativeControls={false}
            resizeMode={ResizeMode.COVER}
            isLooping={false}
            usePoster
          />
        ) : null}
      </View>
      <View style={Styles.optionsmodaloptions}>
        <MenuOption
          onSelect={() => {
            setForwardOpen([message._id]);
            setClose();
          }}
          style={Styles.optionsmodalitem}
        >
          <View style={Styles.optionsmodalitemicon}>{forwardIcon}</View>
          <Text style={Styles.optionsmodalitemtext}>{translation.forward}</Text>
        </MenuOption>
        <MenuOption
          onSelect={() => {
            setReply(message);
            setClose();
          }}
          style={Styles.optionsmodalitem}
        >
          <View style={Styles.optionsmodalitemicon}>{replyIcon}</View>
          <Text style={Styles.optionsmodalitemtext}>{translation.reply}</Text>
        </MenuOption>
        {permissions.includes(PERMISSION.enable_disable_star_messages) ? (
          message.starred ? (
            <MenuOption
              onSelect={() => {
                markUnstarred({
                  chat:
                    message.receiverType == CHAT_TYPE.group
                      ? message.receiver
                      : message.sender == USER_ID
                        ? message.receiver
                        : message.sender,
                  messages: [message._id],
                });
                setClose();
              }}
              style={Styles.optionsmodalitem}
            >
              <View style={Styles.optionsmodalitemicon}>
                {unstarredMessage}
              </View>
              <Text style={Styles.optionsmodalitemtext}>
                {translation.unstarred}
              </Text>
            </MenuOption>
          ) : (
            <MenuOption
              onSelect={() => {
                markStarred({
                  chat:
                    message.receiverType == CHAT_TYPE.group
                      ? message.receiver
                      : message.sender == USER_ID
                        ? message.receiver
                        : message.sender,
                  messages: [message._id],
                });
                setClose();
              }}
              style={Styles.optionsmodalitem}
            >
              <View style={Styles.optionsmodalitemicon}>{starIcon}</View>
              <Text style={Styles.optionsmodalitemtext}>
                {translation.starred}
              </Text>
            </MenuOption>
          )
        ) : null}
        {permissions.includes(PERMISSION.allow_delete_message) ? (
          <MenuOption
            onSelect={() => {
              setDeleteOpen(message);
              setClose();
            }}
            style={Styles.optionsmodalitem}
          >
            <View style={Styles.optionsmodalitemicon}>{deleteIcon}</View>
            <Text style={[Styles.optionsmodalitemtext, Styles.fontdanger]}>
              {translation.delete}
            </Text>
          </MenuOption>
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

export const MessagePopupOptions = () => {
  const { selectedMessage: message, setSelectedMessage } =
    useContext(MessageContext);
  const onClose = () => setSelectedMessage(null);
  if (message) {
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
          visible={message ? true : false}
          onRequestClose={onClose}
          statusBarTranslucent
        >
          <Options onClose={onClose} />
        </Modal>
      );
  }
};
