import { useContext } from "react";
import { Image, Modal, Platform, Pressable, Text, View } from "react-native";
import { MenuOption } from "react-native-popup-menu";
import { useSelector } from "react-redux";
import {
  CHAT_TYPE,
  CONTENT_TYPE,
  PERMISSION,
  SCREEN,
  USER_STATUS,
} from "../constant";
import {
  archiveIcon,
  blockIcon,
  deletedanger,
  markReaddefault,
  markUnreaddefault,
  mutedefault,
  pindefault,
  profile,
  reportFlag,
  unarchive,
  unmutedefault,
} from "../constant/icons";
import { AppContext } from "../context/app";
import { AuthContext } from "../context/auth";
import {
  chatArchive,
  chatDelete,
  chatMarkRead,
  chatMarkUnRead,
  chatUnarchive,
  chatUnmute,
  chatUnpin,
} from "../services/chat";
import { blockFriend, unblockFriend } from "../services/friend";
import { exitGroup } from "../services/group";
import { report } from "../services/user";
import Styles from "../styles";
import { formatDate } from "../utils/helper";
import MessageContentType from "./messageContentType";
import MessageStatus from "./messageStatus";

const Options = ({ item, setOpenOption, handleNavigate, context }) => {
  const { setConfimationDialog, translation } = useContext(AppContext);
  const onClose = () => setOpenOption(null);
  if (item)
    if (Platform.OS == "web")
      return (
        <View style={Styles.optionsmodalWrap}>
          <PopupOption
            item={item}
            onClose={onClose}
            handleNavigate={handleNavigate}
            setConfimationDialog={setConfimationDialog}
            context={context}
          />
        </View>
      );
    else
      return (
        <Modal
          transparent={true}
          visible={item ? true : false}
          onRequestClose={onClose}
          statusBarTranslucent
        >
          <PopupOption
            item={item}
            onClose={onClose}
            handleNavigate={handleNavigate}
            setConfimationDialog={setConfimationDialog}
            context={context}
          />
        </Modal>
      );
  return null;
};

export default Options;

export const PopupOption = ({
  item,
  handleNavigate,
  onClose,
  setConfimationDialog,
  context,
}) => {
  const { handleChatPin, setMuteOpen, translation, permissions } =
    useContext(AppContext);
  const { archive, pin: pinChat, unread, mute, blocked } = item;
  const users = useSelector((state) => state.chats.users);
  const { USER_ID } = useContext(AuthContext);
  const opens = useSelector((state) => state.chats.opens);
  const group = useSelector((state) => state.group.groups?.[item.chat._id]);

  return (
    <Pressable
      onPress={onClose}
      onPointer
      style={{
        borderTopLeftRadius: Platform.OS == "web" ? 10 : 0,
        borderTopRightRadius: Platform.OS == "web" ? 10 : 0,
        justifyContent: "flex-end",
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "100%",
        ...Styles.modalContainer,
        margin: 0,
      }}
    >
      <View style={Styles.optionsmodalContainer}>
        {context !== "message" ? (
          <View style={Styles.optionheader}>
            {/* <View style={Styles.chatListItem}>
              <View style={Styles.chatListItemInner}> */}
            <View style={Styles.chatListItemthumb}>
              <Image
                style={{ ...Styles.thumbImg, ...Styles.chatListItemthumbImg }}
                source={{ uri: item.chat.avatar }}
              />
              {users[item.chat._id]?.active && (
                <View style={Styles.chatListItemStatus}></View>
              )}
            </View>
            <View style={Styles.chatListIteminfo}>
              <View style={Styles.chatListIteminfoTop}>
                <Text style={Styles.chatListIteminfoTitle} numberOfLines={1}>
                  {item.chat.name}
                </Text>
                <View style={{ ...Styles.chatListItemOptions }}>
                  <Text style={Styles.chatListItemTime}>
                    {formatDate(
                      item.lastMessage.createdAt,
                      translation.yesterday
                    )}
                  </Text>
                </View>
              </View>
              <View style={Styles.chatListIteminfoBtm}>
                <>
                  {item.lastMessage.user._id == USER_ID &&
                    item.lastMessage.contentType !== CONTENT_TYPE.notification ? (
                    <View style={{ ...Styles.icon, ...Styles.icon18 }}>
                      <MessageStatus status={item.lastMessage.message_status} />
                    </View>
                  ) : null}
                  <MessageContentType message={item.lastMessage} />
                </>
              </View>
              {/* </View>
              </View> */}
            </View>
          </View>
        ) : null}
        <View style={Styles.optionsmodaloptions}>
          <MenuOption
            onSelect={() => {
              handleNavigate(
                item.chat._id,
                item.chat.chatType == CHAT_TYPE.user
                  ? SCREEN.profile
                  : SCREEN.groupProfile
              );
              onClose && onClose();
            }}
            style={Styles.optionsmodalitem}
          >
            <View style={Styles.optionsmodalitemicon}>{profile}</View>
            <Text style={Styles.optionsmodalitemtext}>
              {translation.chatInfo}
            </Text>
          </MenuOption>
          {archive ? (
            <MenuOption
              onSelect={() => {
                chatUnarchive([item.chat._id]);
                onClose && onClose();
              }}
              style={Styles.optionsmodalitem}
            >
              <View style={Styles.optionsmodalitemicon}>{unarchive}</View>
              <Text style={Styles.optionsmodalitemtext}>
                {translation.unArchive}
              </Text>
            </MenuOption>
          ) : (
            <MenuOption
              onSelect={() => {
                chatArchive([item.chat._id]);
                onClose && onClose();
              }}
              style={Styles.optionsmodalitem}
            >
              <View style={Styles.optionsmodalitemicon}>{archiveIcon}</View>
              <Text style={Styles.optionsmodalitemtext}>
                {translation.archive}
              </Text>
            </MenuOption>
          )}
          {!archive ? (
            <>
              {pinChat ? (
                <MenuOption
                  onSelect={() => {
                    chatUnpin(item.chat._id);
                    onClose && onClose();
                  }}
                  style={Styles.optionsmodalitem}
                >
                  <View style={Styles.optionsmodalitemicon}>{pindefault}</View>
                  <Text style={Styles.optionsmodalitemtext}>
                    {translation.unpin}
                  </Text>
                </MenuOption>
              ) : (
                <MenuOption
                  onSelect={() => {
                    handleChatPin(item.chat._id);
                    onClose && onClose();
                  }}
                  style={Styles.optionsmodalitem}
                >
                  <View style={Styles.optionsmodalitemicon}>{pindefault}</View>
                  <Text style={Styles.optionsmodalitemtext}>
                    {translation.pin}
                  </Text>
                </MenuOption>
              )}
              {mute ? (
                <MenuOption
                  onSelect={() => {
                    chatUnmute({ chat: [item.chat._id] });
                    onClose && onClose();
                  }}
                  style={Styles.optionsmodalitem}
                >
                  <View style={Styles.optionsmodalitemicon}>{mutedefault}</View>
                  <Text style={Styles.optionsmodalitemtext}>
                    {translation.unmute}
                  </Text>
                </MenuOption>
              ) : (
                <MenuOption
                  onSelect={() => {
                    setMuteOpen(item.chat._id);
                    onClose && onClose();
                  }}
                  style={Styles.optionsmodalitem}
                >
                  <View style={Styles.optionsmodalitemicon}>
                    {unmutedefault}
                  </View>
                  <Text style={Styles.optionsmodalitemtext}>
                    {translation.mute}
                  </Text>
                </MenuOption>
              )}
            </>
          ) : null}
          {unread !== 0 ? (
            <MenuOption
              onSelect={() => {
                {
                  chatMarkRead([
                    { chat: item.chat._id, chatType: item.chat.chatType },
                  ]);
                  onClose && onClose();
                }
              }}
              style={Styles.optionsmodalitem}
            >
              <View style={Styles.optionsmodalitemicon}>{markReaddefault}</View>
              <Text style={Styles.optionsmodalitemtext}>
                {translation.markRead}
              </Text>
            </MenuOption>
          ) : !opens.includes(`${item.chat._id}_${SCREEN.message}`) &&
            context !== "message" ? (
            <MenuOption
              onSelect={() => {
                chatMarkUnRead([
                  { chat: item.chat._id, chatType: item.chat.chatType },
                ]);
                onClose && onClose();
              }}
              style={Styles.optionsmodalitem}
            >
              <View style={Styles.optionsmodalitemicon}>
                {markUnreaddefault}
              </View>
              <Text style={Styles.optionsmodalitemtext}>
                {translation.markUnread}
              </Text>
            </MenuOption>
          ) : null}
          {item.chat.chatType == CHAT_TYPE.user &&
            permissions.includes(PERMISSION.block_users) ? (
            blocked ? (
              <MenuOption
                onSelect={() => {
                  setConfimationDialog({
                    heading: translation.unblockChat,
                    message: translation.unblockDescription,
                    callback: unblockFriend,
                    chat: item,
                  });
                  onClose && onClose();
                }}
                style={Styles.optionsmodalitem}
              >
                <View style={Styles.optionsmodalitemicon}>{blockIcon}</View>
                <Text
                  style={{
                    ...Styles.optionsmodalitemtext,
                    ...Styles.fontdanger,
                  }}
                >
                  {translation.unblock}
                </Text>
              </MenuOption>
            ) : (
              <MenuOption
                onSelect={() => {
                  setConfimationDialog({
                    heading: translation.blockChat,
                    message: translation.blockMessage,
                    callback: blockFriend,
                    chat: item,
                  });
                  onClose && onClose();
                }}
                style={Styles.optionsmodalitem}
              >
                <View style={Styles.optionsmodalitemicon}>{blockIcon}</View>
                <Text
                  style={{
                    ...Styles.optionsmodalitemtext,
                    ...Styles.fontdanger,
                  }}
                >
                  {translation.block}
                </Text>
              </MenuOption>
            )
          ) : null}
          {item.chat.chatType == CHAT_TYPE.group &&
            permissions.includes(PERMISSION.leave_group) &&
            group &&
            group.member.status == USER_STATUS.active ? (
            <MenuOption
              onSelect={() => {
                setConfimationDialog({
                  heading: translation.exitGroup,
                  message: translation.exitDescription,
                  callback: exitGroup,
                  chat: { group: item.chat._id },
                });
                onClose && onClose();
              }}
              style={Styles.optionsmodalitem}
            >
              <View style={Styles.optionsmodalitemicon}>{blockIcon}</View>
              <Text
                style={{
                  ...Styles.optionsmodalitemtext,
                  ...Styles.fontdanger,
                }}
              >
                {translation.exitGroup}
              </Text>
            </MenuOption>
          ) : null}
          <MenuOption
            onSelect={() => {
              setConfimationDialog({
                heading: translation.deleteChat,
                message: translation.deleteDescription,
                callback: chatDelete,
                chat: item,
              });
              onClose && onClose();
            }}
            style={Styles.optionsmodalitem}
          >
            <View style={Styles.optionsmodalitemicon}>{deletedanger}</View>
            <Text
              style={{ ...Styles.optionsmodalitemtext, ...Styles.fontdanger }}
            >
              {translation.delete}
            </Text>
          </MenuOption>
          <MenuOption
            onSelect={() => {
              setConfimationDialog({
                heading: translation.report,
                message: translation.reportDescription,
                callback: report,
                chat: item,
              });
              onClose && onClose();
            }}
            style={Styles.optionsmodalitem}
          >
            <View
              style={{ ...Styles.optionsmodalitemicon, ...Styles.itemCenter }}
            >
              {reportFlag}
            </View>
            <Text
              style={{ ...Styles.optionsmodalitemtext, ...Styles.fontdanger }}
            >
              {translation.report}
            </Text>
          </MenuOption>
        </View>
        <Pressable onPress={onClose} style={{ ...Styles.cancelButton }}>
          <Text style={{ ...Styles.cancelButtonText, ...Styles.textcenter }}>{translation.cancel}</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};
