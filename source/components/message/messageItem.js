import moment from "moment";
import { useContext, useState } from "react";
import { Image, Platform, Pressable, Text, View } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu";
import { useSelector } from "react-redux";
import MessageContent from "../../components/message/content";
import MessageStatus from "../../components/messageStatus";
import { CHAT_TYPE, CONTENT_TYPE, MESSAGE_STATUS } from "../../constant";
import {
  forwardlightIcon,
  optionButton,
  reactionIcon,
  starIconfill,
} from "../../constant/icons";
import { AppContext } from "../../context/app";
import { AuthContext } from "../../context/auth";
import { MessageContext } from "../../context/message";
import Styles, { variables } from "../../styles";
import MessageReactionPreview from "./reactionPreview";

export const MessageView = ({ message, chat }) => {
  const { translation } = useContext(AppContext);
  return (
    <View
      style={
        message.fromMe
          ? {
            ...Styles.messageitembodyinner,
            ...Styles.messageitembodyinnerout,
          }
          : {
            ...Styles.messageitembodyinner,
            ...Styles.messageitembodyinnerin,
          }
      }
    >
      {message.forward ? (
        <View style={{ ...Styles.msgforwarded }}>
          <View
            style={{
              ...Styles.icon16,
              ...Styles.msgforwardedicon,
            }}
          >
            {forwardlightIcon}
          </View>
          <Text
            style={{
              ...Styles.fontlight,
              ...Styles.fontsizesmall,
            }}
          >
            {/* {message.user.name}  */}
            {translation.forwarded}
            {/* {message.contentType} */}
          </Text>
        </View>
      ) : null}
      {chat.chatType == CHAT_TYPE.group && !message.fromMe ? (
        <Text style={{ ...Styles.messageitemname }}>
          {message.user.name.split(" ")[0]}
        </Text>
      ) : null}
      <MessageContent
        message={message}
        color={message.fromMe ? variables["font-color"] : variables["font-color"]}
        chat={chat}
      />
      <View
        style={{
          ...Styles.messageitemfooter,
          justifyContent: message.fromMe ? "flex-end" : "flex-start",
        }}
      >
        {message.starred ? (
          <View
            style={{
              ...Styles.messageitemfootericon,
              ...Styles.icon12,
              marginTop: 1,
            }}
          >
            {starIconfill}
          </View>
        ) : null}
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            ...Styles.messageitemfootertime,
            ...Styles.fontlight,
          }}
        >
          {moment(message.createdAt).format("hh:mm A")}
        </Text>
        {message.fromMe ? (
          <View
            style={{
              ...Styles.messageitemfootericon,
              ...Styles.icon16,
            }}
          >
            <MessageStatus status={message.message_status} />
          </View>
        ) : null}
      </View>
    </View>
  );
};

export const GroupAction = ({ message }) => {
  const group = useSelector((state) => state.group.groups[message.receiver]);
  const { USER_ID } = useContext(AuthContext);
  const { translation } = useContext(AppContext);
  if (group)
    return (
      <>
        <Text style={Styles.messagenotificationsub}>
          {message.sender == USER_ID
            ? translation.you
            : message.user.name.split(" ")[0]}
        </Text>
        <Text style={Styles.fontlight}>
          {` ${message.action} ${message.actionUsers
              ? message.actionUsers.length > 1
                ? `${group.members
                  .find(
                    (member) => member.user._id == message.actionUsers[0]
                  )
                  ?.user.name.split(" ")[0]
                } & ${message.actionUsers.length - 1} others`
                : group.members
                  .find((member) => member.user._id == message.actionUsers[0])
                  ?.user.name.split(" ")[0]
              : ""
            }`}
        </Text>
      </>
    );
};

export const MessageReaction = ({ handleMessageReaction, message }) => {
  const { reactions } = useContext(AppContext);
  return (
    <>
      {Object.values(reactions).map((reaction) => (
        <MenuOption
          key={`reaction_popup_${reaction._id}`}
          onSelect={() =>
            handleMessageReaction({
              reaction: reaction._id,
              message: message?._id,
            })
          }
          style={Styles.messageitemreactionsitem}
        >
          <Image
            style={Styles.messageitemreactionsitemicon}
            source={{ uri: reaction.url }}
          />
        </MenuOption>
      ))}
      {/* <View style={{ ...Styles.messageitemreactionsitem, ...Styles.messageitemreactionsitemadd, ...Styles.itemCenter }}>
                <View style={Styles.icon24}>
                    {addIcon}
                </View>
            </View> */}
    </>
  );
};

const MessageItem = ({ message }) => {
  const {
    chat,
    messages,
    scrollId,
    handleMessageReaction,
    setSelectedMessage,
  } = useContext(MessageContext);
  const { USER_ID } = useContext(AuthContext);
  const [hoverOpen, setHoverOpen] = useState(false);
  const index = messages.findIndex((e) => e._id == message._id);
  const {
    reactions,
    openReactionOption,
    setOpenReactionOption,
    setOpenReaction,
    translation,
  } = useContext(AppContext);
  const diff =
    index == 0
      ? false
      : !moment(messages[index].createdAt)
        .startOf("D")
        .isSame(moment(messages[index - 1]?.createdAt).startOf("D"));

  return (
    <>
      {diff ? (
        <View style={Styles.messagedate}>
          <Text
            style={{
              ...Styles.messagedatetext,
              ...Styles.fontlight,
              ...Styles.fontsizesmall,
              ...Styles.textcenter,
            }}
          >
            {moment(messages[index - 1].createdAt).format("MMM D, YYYY")}
          </Text>
        </View>
      ) : null}
      {message.contentType == CONTENT_TYPE.notification ? (
        <View style={Styles.messagenotification}>
          <View style={Styles.messagenotificationInner}>
            {message.receiverType == CHAT_TYPE.user ? (
              <>
                <Text style={Styles.messagenotificationsub}>
                  {message.sender == USER_ID
                    ? translation.you
                    : message.user.name}
                </Text>
                <Text style={Styles.fontlight}>
                  {` ${message.action} ${message.receiver == USER_ID ? translation.you : chat.name
                    }`}
                </Text>
              </>
            ) : (
              <GroupAction message={message} />
            )}
          </View>
        </View>
      ) : (
        <View
          onPointerEnter={() => {
            Platform.OS == "web" && setHoverOpen(true);
          }}
          onPointerLeave={() => {
            Platform.OS == "web" && setHoverOpen(false);
          }}
          key={`message_item_${message._id}`}
          style={{
            ...Styles.messageitem,
            backgroundColor: message._id == scrollId ? variables["primary-color-soft"] : variables["background-color"],
            alignItems: message.fromMe ? "flex-end" : "flex-start",
          }}
        >
          <View style={{ ...Styles.messageiteminner }}>
            {chat.chatType == CHAT_TYPE.group && !message.fromMe ? (
              <View style={{ ...Styles.messageitemthumb }}>
                <Image
                  style={{ ...Styles.messageitemthumbicon }}
                  source={{ uri: message.user.avatar }}
                  alt="No image"
                />
              </View>
            ) : null}

            <View style={{ ...Styles.messageitemdetails }}>
              <View
                style={{
                  ...Styles.messageitemtop,
                  flexDirection: message.fromMe ? "row-reverse" : "row",
                }}
              >
                <View
                  style={
                    message.fromMe
                      ? {
                        ...Styles.messageitembody,
                        ...Styles.messageitembodyout,
                      }
                      : {
                        ...Styles.messageitembody,
                        ...Styles.messageitembodyin,
                      }
                  }
                >
                  {!message.deleted &&
                    Platform.OS !== "web" &&
                    !message.fromMe &&
                    Object.keys(reactions).length ? (
                    <Menu>
                      <MenuTrigger triggerOnLongPress>
                        <MessageView message={message} chat={chat} />
                      </MenuTrigger>
                      <MenuOptions
                        style={{
                          ...Styles.reactionOption,
                          borderRadius: 0,
                          gap: 10,
                        }}
                      >
                        <MessageReaction
                          handleMessageReaction={handleMessageReaction}
                          message={message}
                        />
                      </MenuOptions>
                    </Menu>
                  ) : (
                    <View style={{ ...Styles.fdrow }}>
                      <MessageView chat={chat} message={message} />
                    </View>
                  )}
                  {Object.keys(reactions).length &&
                    message.reactions?.length &&
                    !message.deleted ? (
                    Platform.OS !== "web" ? (
                      <Menu renderer={renderers.Popover}>
                        <MenuTrigger
                          style={
                            message.fromMe
                              ? {
                                ...Styles.messageitembodyreactions,
                                ...Styles.messageitembodyreactionsout,
                              }
                              : {
                                ...Styles.messageitembodyreactions,
                                ...Styles.messageitembodyreactionsin,
                              }
                          }
                        >
                          {message.reactions.map((ele) => (
                            <View
                              key={`message_reaction_data_${ele._id}`}
                              style={Styles.messageitembodyreactionsitem}
                            >
                              <Image
                                style={Styles.messageitembodyreactionsitemimg}
                                source={{ uri: reactions[ele.reaction]?.url }}
                              />
                            </View>
                          ))}
                          {message.reactions.length > 1 ? (
                            <View
                              style={{
                                ...Styles.messageitembodyreactionsitem,
                                ...Styles.itemCenter,
                              }}
                            >
                              <Text
                                style={{
                                  ...Styles.messageitembodyreactionsitemtxt,
                                  ...Styles.fontlight,
                                }}
                              >
                                {message.reactions.length}
                              </Text>
                            </View>
                          ) : null}
                        </MenuTrigger>
                        <MenuOptions
                        // style={{
                        //   ...Styles.dropdownMenu,
                        //   right: "auto",
                        //   paddingBottom: 0,
                        //   paddingTop: 0,
                        //   minWidth: 200,
                        // }}
                        >
                          <MessageReactionPreview
                            chat={chat}
                            messageReactions={message.reactions}
                          />
                        </MenuOptions>
                      </Menu>
                    ) : (
                      //Handle for web opening with createportal
                      <a
                        className="reation-view"
                        // style={{ ...Styles.messageitemOptionicon, ...Styles.icon, ...Styles.icon18, cursor: "pointer" }}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setOpenReaction({ e, chat, message });
                        }}
                      >
                        <View
                          style={
                            message.fromMe
                              ? {
                                ...Styles.messageitembodyreactions,
                                ...Styles.messageitembodyreactionsout,
                              }
                              : {
                                ...Styles.messageitembodyreactions,
                                ...Styles.messageitembodyreactionsin,
                              }
                          }
                        >
                          {message.reactions.map((ele) => (
                            <View
                              key={`message_reaction_data_${ele._id}`}
                              style={Styles.messageitembodyreactionsitem}
                            >
                              <Image
                                style={Styles.messageitembodyreactionsitemimg}
                                source={{ uri: reactions[ele.reaction].url }}
                              />
                            </View>
                          ))}
                          {message.reactions.length > 1 ? (
                            <View
                              style={{
                                ...Styles.messageitembodyreactionsitem,
                                ...Styles.itemCenter,
                              }}
                            >
                              <Text
                                style={{
                                  ...Styles.messageitembodyreactionsitemtxt,
                                  ...Styles.fontlight,
                                }}
                              >
                                {message.reactions.length}
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      </a>
                    )
                  ) : null}
                </View>
                {!message.deleted ? (
                  <View
                    style={
                      message.fromMe
                        ? {
                          ...Styles.messageitemOptions,
                          ...Styles.messageitemOptionsout,
                        }
                        : {
                          ...Styles.messageitemOptions,
                          ...Styles.messageitemOptionsin,
                        }
                    }
                  >
                    {message.message_status != MESSAGE_STATUS.pending ? (
                      <Pressable
                        onPress={() => setSelectedMessage(message)}
                        style={{
                          ...Styles.messageitemOptionicon,
                          ...Styles.icon,
                          ...Styles.icon18,
                        }}
                      >
                        {optionButton}
                      </Pressable>
                    ) : null}
                    {Platform.OS == "web" && !message.fromMe ? (
                      <a
                        className="reaction-menu-optn"
                        style={{
                          ...Styles.messageitemOptionicon,
                          ...Styles.icon,
                          ...Styles.icon18,
                          cursor: "pointer",
                        }}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setOpenReactionOption({ e, chat, message });
                        }}
                      >
                        {(hoverOpen && Object.keys(reactions).length) ||
                          openReactionOption?.message?._id == message._id
                          ? reactionIcon
                          : null}
                      </a>
                    ) : null}
                    {/* <Menu>
                                                <MenuTrigger>
                                                    <View
                                                        style={{ ...Styles.messageitemOptionicon, ...Styles.icon, ...Styles.icon18 }}>
                                                        {hoverOpen ? emoji : null}
                                                    </View>
                                                </MenuTrigger>
                                                <MenuOptions customStyles={{
                                                    optionsWrapper: {
                                                        flex: 1,
                                                        flexDirection: "row",
                                                        justifyContent: "space-between",
                                                        padding: 5,
                                                    },
                                                }} >
                                                    <MessageReaction handleMessageReaction={handleMessageReaction} />
                                                </MenuOptions>
                                            </Menu> */}
                    {/* <Pressable
                                            onPress={() => setOpenReaction(prev => !prev ? message._id : null)}
                                            style={{ ...Styles.messageitemOptionicon, ...Styles.icon, ...Styles.icon18 }}>
                                            {hoverOpen ? emoji : null}
                                        </Pressable> */}
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      )}
      {index == messages.length - 1 ? (
        <View style={Styles.messagedate}>
          <Text
            style={{
              ...Styles.messagedatetext,
              ...Styles.fontlight,
              ...Styles.fontsizesmall,
              ...Styles.textcenter,
            }}
          >
            {moment(messages[index]?.createdAt).format("MMM D, YYYY")}
          </Text>
        </View>
      ) : null}
    </>
  );
};

export default MessageItem;
