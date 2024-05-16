import { createContext, useRef } from "react";
/* eslint-disable react-hooks/exhaustive-deps */
import Constants from "expo-constants";
import { useContext, useEffect, useState } from "react";
import { NativeModules, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CHAT_TYPE, SCREEN, SOCKET_EVENTS } from "../constant/index";
import { AppContext } from "../context/app";
import { fetchMessages, sendReaction } from "../services/message";
import {
  addMessage,
  chatClose,
  chatNavigation,
  chatOption,
  messageSeenEventUpdate,
  newChatOpen,
  newMessage,
} from "../store/reducer";
import { AuthContext } from "./auth";
import { useSocket } from "./socket";
const { CircuitChat } = NativeModules;

export const MessageContext = createContext();

export const MessageProvider = ({ children, navigation, id, redirected }) => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const {
    fetchChatDetails,
    focusedChat,
    setOpenReactionOption,
    mobileView,
    getGroupDetails,
  } = useContext(AppContext);
  const { USER_ID } = useContext(AuthContext);
  const chatData = useSelector((state) => state.chats.data[id]);
  const user = useSelector((state) => state.chats.users?.[id]);
  const group = useSelector((state) => state.group.groups?.[id]);
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState(chatData?.chat);
  const [loadingMessages, setLoadingMessage] = useState(false);
  const [attach, setAttach] = useState([]);
  const [height, setHeight] = useState(50);
  const [inputText, setInputText] = useState("");
  const [selectAttachType, setSelectAttachType] = useState(false);
  const [openReaction, setOpenReaction] = useState(null);
  const [openReactionPreview, setOpenReactionPreview] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [reply, setReply] = useState(null);
  const messageFlatlist = useRef();
  const [scrollId, setScrollId] = useState(null);
  const [index, setIndex] = useState(-1);
  const [openOption, setOpenOption] = useState();
  const [selectedMessage, setSelectedMessage] = useState();
  const mentions = useRef([]);
  const lastMessageRef = useRef();
  const messageSeenRef = useRef(false);
  const [emojiPicker, setEmojiPicker] = useState(false);

  const statusBarHeight = Constants.statusBarHeight;

  const handleScroll = async () => {
    if (chatData?.messages?.more && !loadingMessages) await getMessages();
  };

  const handlePostMessage = () => {
    window.top.postMessage(
      {
        type: "closeMobileView",
      },
      "*"
    );
  };

  const handleChatClose = () =>
    !mobileView
      ? dispatch(chatClose(chat._id))
      : Platform.OS == "web" && handlePostMessage();

  // emiting event for message seen
  const handleMessageSeen = () => {
    socket.emit(SOCKET_EVENTS.message_seen, {
      chat: chat._id,
      receiverType: chat.chatType,
    });
  };

  // Fetching user messages
  const getMessages = async () => {
    if (chatData && chatData.messages?.more == false) return;
    setLoadingMessage(true);
    const password = Platform.OS == "web" ? JSON.parse(localStorage.getItem("passwords"))?.[chat._id] : chatData.chat?.password
    const response = await fetchMessages({
      chatId: chat._id,
      chatType: chat.chatType,
      lastMessage: lastMessageRef.current,
      password,
    });
    if (response.success) {
      dispatch(
        addMessage({
          chatId: chat._id,
          more: response.more,
          messages: response.messages,
          USER_ID,
        })
      );
      response.messages.length &&
        (lastMessageRef.current =
          response.messages[response.messages.length - 1]._id);
    }
    setLoadingMessage(false);
  };

  const handleBackNavigation = () => {
    if (redirected) {
      CircuitChat?.callFunction({ type: "back" });
    }
    navigation.navigate(SCREEN.chat, { archive: false });
  };

  const handleNavigate = (id, screen) => {
    Platform.OS !== "web"
      ? navigation.navigate(screen, { id: id })
      : dispatch(chatNavigation({ id, screen }));
  };

  const handleFlatlistScroll = async (id) => setScrollId(id);

  const handleMessageReaction = ({ reaction, message }) => {
    sendReaction({ message: message, reaction });
    setOpenReactionOption(null);
  };

  const handleNewMsgDispatch = (newMsg) => {
    dispatch(newMessage({ ...newMsg, fromMe: true }));
  };

  useEffect(() => {
    if (scrollId && messages.length) {
      const index = messages.findIndex((message) => message._id == scrollId);
      if (index == -1 && chatData.messages.more) {
        getMessages();
      } else {
        try {
          setIndex(index);
          messageFlatlist.current.scrollToIndex({
            index: index,
            viewPosition: 0.5,
          });
        } catch (error) {
          console.log("error while scroll", error);
        }
      }
    }
  }, [messages, scrollId]);

  useEffect(() => {
    if (index > -1) {
      setTimeout(() => {
        handleFlatlistScroll(null);
        setIndex(-1);
        dispatch(chatOption({ chat: chat._id, option: { scrollMessage: "" } }));
      }, 10000);
    }
  }, [index]);

  useEffect(() => {
    if (!chatData) return;
    const messages = Object.values(chatData?.messages?.data || {});
    messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setMessages(messages);
    setChat(chatData.chat);
    if (chatData?.options?.scrollMessage)
      handleFlatlistScroll(chatData.options.scrollMessage);
  }, [chatData]);

  // Fetching messgae on first render
  useEffect(() => {
    if (!chat) {
      setLoadingMessage(true);
      fetchChatDetails(id);
    } else {
      if (chat.chatType == CHAT_TYPE.group && !group) getGroupDetails(chat._id);
      getMessages();
    }
  }, [chat]);

  useEffect(() => {
    if (messageSeenRef.current) return;
    if (
      chatData &&
      chatData.messages &&
      (chatData.unread == -1 || chatData.unread > 0) &&
      !Object.values(chatData.messages.data).some((message) => message.new)
    ) {
      handleMessageSeen();
      messageSeenRef.current = true;
    }
  }, [chatData]);

  useEffect(() => {
    if (Platform.OS == "web" && !messageSeenRef.current) return;
    if (
      (chat && Platform.OS == "web" && focusedChat == id) ||
      Platform.OS !== "web"
    ) {
      const newMessage = messages.filter((message) => message.new);
      if (newMessage.length) {
        handleMessageSeen();
        dispatch(
          messageSeenEventUpdate({ chat: chat._id, messages: newMessage })
        );
      }
    }
  }, [messages, focusedChat, chat]);

  return (
    <MessageContext.Provider
      value={{
        user,
        chatData,
        messages,
        chat,
        loadingMessages,
        attach,
        setAttach,
        height,
        setHeight,
        inputText,
        setInputText,
        selectAttachType,
        setSelectAttachType,
        openReaction,
        setOpenReaction,
        openReactionPreview,
        setOpenReactionPreview,
        openMenu,
        setOpenMenu,
        reply,
        setReply,
        statusBarHeight,
        handleScroll,
        handleChatClose,
        handleBackNavigation,
        handleNavigate,
        handleFlatlistScroll,
        messageFlatlist,
        scrollId,
        handleMessageReaction,
        index,
        setIndex,
        handleNewMsgDispatch,
        openOption,
        setOpenOption,
        selectedMessage,
        setSelectedMessage,
        group,
        mentions,
        emojiPicker,
        setEmojiPicker,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
