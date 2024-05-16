import moment from "moment";
import React, { useContext, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import NoResult from "../../components/noResult";
import { backIcon, closeIcon, optionButton } from "../../constant/icons";
import { CHAT_TYPE, SCREEN, USER_STATUS } from "../../constant/index";
import { AppContext } from "../../context/app";
import { MessageContext } from "../../context/message";
import Styles, { appStyle, mainStyle } from "../../styles";
import DeleteDialog from "../deleteDialog";
import Options from "../options";
import ChatComposer from "./composer";
import LoadingShimmer from "./loadingShimmer";
import MessageItem, { MessageReaction } from "./messageItem";
import { MessagePopupOptions } from "./options";
import ProfileHeader from "./profileHeader";
import MessageReactionPreview from "./reactionPreview";

const MessageMain = () => {
  const {
    chat,
    user,
    statusBarHeight,
    messages,
    chatData,
    loadingMessages,
    handleBackNavigation,
    handleNavigate,
    handleScroll,
    handleChatClose,
    messageFlatlist,
    setReply,
    handleMessageReaction,
    handleFlatlistScroll,
    index,
    setIndex,
    openOption,
    setOpenOption,
    selectedMessage,
    group,
    emojiPicker,
  } = useContext(MessageContext);
  const {
    focusedChat,
    setFocusChat,
    openMenuOption,
    setOpenMenuOption,
    openReactionOption,
    setOpenReactionOption,
    setForwardOpen,
    openReaction,
    setOpenReaction,
    deleteOpen,
    setDeleteOpen,
    minimize,
    setMinimize,
    mobileView,
  } = useContext(AppContext);
  const componentRef = useRef();
  const { translation } = useContext(AppContext);

  useEffect(() => {
    if (Platform.OS == "web") {
      const focus = (status) => {
        if (status) setFocusChat(chat?._id);
        else if (!status && focusedChat == chat?._id) setFocusChat(null);
      };

      if (componentRef.current) {
        componentRef.current.addEventListener("focusin", () => focus(true));
        componentRef.current.addEventListener("focusout", () => focus(false));
      }
      focus(true);
      return () => {
        if (componentRef.current) {
          componentRef.current.removeEventListener("focusin", focus(false));
          componentRef.current.removeEventListener("focusout", focus(false));
        }
      };
    }
  }, [focusedChat]);

  // useEffect(() => {
  //     if (message) handleFlatlistScroll(message)
  // }, [message])

  // Callback function for onViewableItemsChanged
  useEffect(() => {
    if (messageFlatlist.current && Platform.OS !== "web") {
      const onViewableItemsChanged = ({ viewableItems }) => {
        // Check if the desired index is in the viewableItems array
        const isScrolledToIndex = viewableItems.some(
          (item) => item.index === index
        );
        if (isScrolledToIndex) {
          setIndex(-1);
          setTimeout(() => {
            handleFlatlistScroll(null);
          }, 1000);
        }
      };
      messageFlatlist.current.onViewableItemsChanged = {
        onViewableItemsChanged,
      };
    }
  }, [messageFlatlist.current]);

  useEffect(() => {
    if (Platform.OS == "web" && !emojiPicker) {
      const handleScroll = (e) => {
        // e.preventDefault();
      };
      window.addEventListener("wheel", handleScroll, { passive: false });
      return () =>
        window.removeEventListener("wheel", handleScroll, {
          passive: false,
        });
    }
  }, [emojiPicker]);

  useEffect(() => {
    return () => {
      if (openMenuOption) setOpenMenuOption(null);
      if (openReactionOption) setOpenReactionOption(null);
      if (openReaction) setOpenReaction(null);
    };
  }, [openMenuOption, openReactionOption, openReaction]);

  const minStyle = {};
  if (minimize) minStyle.height = 50;
  return (
    <>
      {chat &&
        openMenuOption?.chat?._id == chat._id &&
        createPortal(
          <View
            style={{
              ...Styles.dropdownMenu,
              position: "fixed",
              top: openMenuOption.e.target.getBoundingClientRect().top,
              left: openMenuOption.e.target.getBoundingClientRect().left,
              right: "auto",
              minWidth: 100,
            }}
          >
            <MessagePopupOptions
              message={openMenuOption.message}
              setForwardOpen={setForwardOpen}
              setReply={setReply}
              setDeleteOpen={setDeleteOpen}
            />
          </View>,
          document.body
        )}
      {chat &&
        openReactionOption?.chat?._id == chat._id &&
        createPortal(
          <View
            style={{
              ...Styles.reactionOption,
              top: openReactionOption.e.target.getBoundingClientRect().top - 30,
              left:
                openReactionOption.e.target.getBoundingClientRect().left - 50,
            }}
          >
            <MessageReaction
              handleMessageReaction={handleMessageReaction}
              message={openReactionOption.message}
            />
          </View>,
          document.body
        )}
      {chat &&
        openReaction?.chat?._id == chat._id &&
        openReaction.message.reactions &&
        createPortal(
          <View
            style={{
              ...Styles.dropdownMenu,
              position: "fixed",
              top: openReaction.e.target.getBoundingClientRect().top,
              left: openReaction.e.target.getBoundingClientRect().left,
              right: "auto",
              padding: 0,
              flexDirection: "column",
            }}
          >
            <MessageReactionPreview
              chat={openReaction.chat}
              messageReactions={openReaction.message.reactions}
            />
          </View>,
          document.body
        )}

      <View ref={componentRef} style={mainStyle}>
        <View style={{ ...Styles.chatBubble, ...appStyle, ...minStyle }}>
          <View style={Styles.chatBubbleHeader}>
            {Platform.OS !== "web" || mobileView ? (
              <Pressable
                onPress={
                  !mobileView ? () => handleBackNavigation() : handleChatClose()
                }
                style={{
                  ...Styles.chatBubbleHeaderOptionIcon,
                  ...Styles.chatBubbleHeaderOptionIconBack,
                }}
              >
                <View style={{ ...Styles.icon, ...Styles.icon24 }}>
                  {backIcon}
                </View>
              </Pressable>
            ) : null}
            <Pressable
              onPress={() =>
                !minimize
                  ? handleNavigate(
                    chat._id,
                    chat.chatType == CHAT_TYPE.user
                      ? SCREEN.profile
                      : SCREEN.groupProfile
                  )
                  : setMinimize((prev) => !prev)
              }
              style={{ ...Styles.chatBubbleHeaderUserInfo }}
            >
              <View style={{ ...Styles.chatBubbleHeaderUserIcon }}>
                <Image
                  style={{ ...Styles.thumbImg, ...Styles.chatBubbleHeaderUserImg }}
                  source={{ uri: chat?.avatar }}
                />
              </View>
              <View style={{ ...Styles.chatBubbleHeaderInfo }}>
                <Text
                  style={{ ...Styles.chatBubbleHeaderTitle }}
                  numberOfLines={1}
                >
                  {chat?.name}
                </Text>
                <Text
                  style={{
                    ...Styles.chatBubbleHeaderStatus,
                    ...(user?.active ? Styles.fontsuccess : Styles.fontlight),
                  }}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  {chatData?.chat?.chatType == CHAT_TYPE.user
                    ? chatData?.action?.typing
                      ? ` ${translation.typing}...`
                      : user?.active
                        ? translation.online
                        : user?.lastActive || chat?.lastActive
                          ? `${translation.active} ${moment(
                            user?.lastActive || chat?.lastActive
                          ).fromNow()}`
                          : null
                    : chatData?.action?.typing
                      ? `${chatData?.action?.user.name.split(" ")[0]} ${translation.typing
                      }...`
                      : group?.members
                        ?.map((ele) => ele.user.name.split(" ")[0])
                        .join(", ")}
                </Text>
              </View>
            </Pressable>
            <View style={Styles.chatBubbleHeaderOption}>
              {/* <View style={Styles.chatBubbleHeaderOptionIcon}>
                                <View style={{ ...Styles.icon, ...Styles.icon24 }}>
                                    {headercallIcon}
                                </View>
                            </View> */}
              {!minimize ? (
                <View style={Styles.chatBubbleHeaderOptionIcon}>
                  {/* <Menu> */}
                  <Pressable
                    onPress={() =>
                      openOption ? setOpenOption(null) : setOpenOption(chatData)
                    }
                    style={{ ...Styles.icon, ...Styles.icon24 }}
                  >
                    {optionButton}
                  </Pressable>
                  {/* <MenuOptions style={Styles.dropdownMenu}>
                      <PopupOption
                        item={chatData}
                        handleNavigate={handleNavigate}
                        setConfimationDialog={setConfimationDialog}
                      />
                    </MenuOptions> */}
                  {/* </Menu> */}
                </View>
              ) : null}
              {Platform.OS == "web" && !mobileView ? (
                <Pressable
                  onPress={handleChatClose}
                  style={Styles.chatBubbleHeaderOptionIcon}
                >
                  <View style={{ ...Styles.icon, ...Styles.icon24 }}>
                    {closeIcon}
                  </View>
                </Pressable>
              ) : null}
            </View>
          </View>
          {!minimize ? (
            <KeyboardAvoidingView
              style={{ flex: 1, ...appStyle }}
              keyboardVerticalOffset={
                Platform.OS == "ios" ? statusBarHeight : 0
              }
              behavior="padding"
            >
              <FlatList
                ref={messageFlatlist}
                data={messages}
                scrollEventThrottle={10}
                renderItem={({ item }) => <MessageItem message={item} />}
                keyExtractor={(item) => `message_${item._id}`}
                inverted
                onEndReached={handleScroll}
                onScroll={() => {
                  openMenuOption && setOpenMenuOption(false);
                  openReactionOption && setOpenReactionOption(null);
                  openReaction && setOpenReaction(null);
                }}
                onEndReachedThreshold={1}
                removeClippedSubviews
                ListFooterComponent={
                  loadingMessages ? (
                    <View style={{ marginVertical: 10 }}><ActivityIndicator size="small" color="#6a6f75" /></View>
                  ) : chatData?.messages?.more == false ||
                    !chatData?.messages?.length ? (
                    <ProfileHeader handleNavigate={handleNavigate} />
                  ) : null
                }
                ListEmptyComponent={
                  !loadingMessages && !messages.length ? (
                    <NoResult revertinvert={true} />
                  ) : loadingMessages ? (
                    <LoadingShimmer />
                  ) : null
                }
                onScrollToIndexFailed={(info) => {
                  const wait = new Promise((resolve) =>
                    setTimeout(resolve, 1000)
                  );
                  wait.then(() => {
                    if (info.highestMeasuredFrameIndex < info.index) {
                      messageFlatlist.current?.scrollToIndex({
                        index: info.highestMeasuredFrameIndex,
                        animated: true,
                      });
                    } else {
                      messageFlatlist.current?.scrollToIndex({
                        index: info.index,
                        animated: true,
                      });
                    }
                  });
                }}
                viewabilityConfig={(info) => {
                  console.log("Viewablitiy config", info);
                }}
              />
              {chat?.chatType == CHAT_TYPE.user ||
                (group &&
                  (group.superAdmin ||
                    group.admin ||
                    (group.member.status == USER_STATUS.active &&
                      group.settings.member.sendMessage))) ? (
                <ChatComposer />
              ) :
                (group &&
                  (group.member.status == USER_STATUS.active &&
                    !group.settings.member.sendMessage)) ? (
                  <View style={{ ...Styles.composermain, height: 40 }}>
                    <Text style={{ flex: 1, ...Styles.textcenter, ...Styles.fontdefault }}>
                      You Can't send message to this group.
                    </Text>
                  </View>
                ) : null}
            </KeyboardAvoidingView>
          ) : null}
          <Options
            item={openOption}
            setOpenOption={setOpenOption}
            handleNavigate={handleNavigate}
            context={"message"}
          />
          {selectedMessage ? <MessagePopupOptions /> : null}
        </View>
      </View>
      {deleteOpen ? <DeleteDialog /> : null}
    </>
  );
};

export default MessageMain;
