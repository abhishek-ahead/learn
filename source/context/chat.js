import { createContext, useContext, useEffect, useRef, useState } from "react";
import { BackHandler, NativeModules, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SCREEN } from "../constant";
import { archiveChatCount, fetchChats } from "../services/chat";
import { activeFriends } from "../services/friend";
import {
  add,
  addUser,
  archiveCount,
  chatOption,
  newChatOpen
} from "../store/reducer";
import { AppContext } from "./app";
export const ChatContext = createContext();
const { CircuitChat } = NativeModules;

export const ChatProvider = ({
  children,
  navigation,
  archivePage,
  newChatPage,
}) => {
  const dispatch = useDispatch();
  const [archive, setArchive] = useState(archivePage);
  const [newChat, setNewChat] = useState(newChatPage);
  const chats = useSelector((state) => state.chats);
  const [chatsData, setchatsData] = useState([]);
  const [users, setUsers] = useState(chats.users);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [openOptionId, setOpenOptionId] = useState(false);
  const [searchResult, setSearchResult] = useState({});
  const [viewMore, setViewMore] = useState("");
  const [openOption, setOpenOption] = useState(false);
  const lastMessageRef = useRef();

  const {
    enableSearch,
    setEnableSearch,
    appNavigation,
    fetched,
    fetchUnreadCount,
  } = useContext(AppContext);
  appNavigation.current = navigation;
  // Fetching Chats for next page
  const handleScroll = () => chats.more && !chatsLoading && getChats(true);

  // Function for get chats
  const getChats = async (onScroll = false) => {
    setChatsLoading(true);
    const response = await fetchChats({
      archive,
      lastMessage: onScroll ? lastMessageRef.current : undefined,
    });
    if (response.success) {
      fetched.current = true;
      dispatch(
        add({
          chats: response.chats,
          more: archive ? undefined : response.more,
        })
      );
      response.chats.length &&
        (lastMessageRef.current =
          response.chats[response.chats.length - 1].lastMessage._id);
    }
    setChatsLoading(false);
  };

  const getArchiveCount = async () => {
    const response = await archiveChatCount();
    if (response.success) dispatch(archiveCount(response.count));
  };

  const getActiveFriends = async () => {
    const response = await activeFriends();
    response.success && dispatch(addUser({ users: response.users }));
  };

  const handleBack = () =>
    Platform.OS == "web"
      ? (archive && setArchive(false)) || (newChat && setNewChat(false))
      : navigation.goBack();

  const handleNavigate = (id, screen) => {
    Platform.OS !== "web"
      ? navigation.navigate(screen, { id: id })
      : dispatch(newChatOpen({ id, screen }));
  };

  const handleMessageNavigate = (chat, message) => {
    handleNavigate(chat, SCREEN.message);
    dispatch(chatOption({ chat, option: { scrollMessage: message } }));
  };

  const handlePageNav = (screen, params) => {
    if (Platform.OS == "web")
      switch (screen) {
        case SCREEN.archive:
          setArchive((prev) => !prev);
          break;
        case SCREEN.newChat:
          setNewChat((prev) => !prev);
      }
    else navigation.navigate(screen, params);
  };

  // Filtering Active users...
  const activeUsers = Object.values(users).filter((user) => user.active);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (enableSearch) {
          setEnableSearch(false);
          return true;
        }
      }
    );
    return () => backHandler.remove();
  }, [enableSearch]);

  // Handling state of chats data
  useEffect(() => {
    const chatsData = Object.values(chats.data)
      .filter((chat) => chat.archive === archive && chat.lastMessage)
      .sort((a, b) => {
        if (b.pin && a.pin) {
          return new Date(b.pinAt) - new Date(a.pinAt);
        } else if (b.pin) {
          return 1;
        } else if (a.pin) {
          return -1;
        } else {
          return (
            new Date(b.lastMessage.createdAt) -
            new Date(a.lastMessage.createdAt)
          );
        }
      });
    setchatsData(chatsData);
    setChatsLoading(false);
  }, [chats.data, archive]);

  useEffect(() => {
    setUsers(chats.users);
  }, [chats.users]);

  useEffect(() => {
    archive && getChats();
  }, [archive]);

  useEffect(() => {
    Platform.OS == "web"
      ? window.top.postMessage(
        { type: "chatUnreads", count: chats.unread },
        "*"
      )
      : CircuitChat?.callFunction({ type: "count", count: chats.unread });
  }, [chats.unread]);

  useEffect(() => {
    !Object.keys(users).length && getActiveFriends();
    (!Object.keys(chats.data).length || !fetched.current) && getChats();
    if (!fetched.current) {
      getArchiveCount();
      fetchUnreadCount();
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        archive,
        setArchive,
        newChat,
        setNewChat,
        chatsData,
        setchatsData,
        users,
        setUsers,
        chatsLoading,
        setChatsLoading,
        openOptionId,
        setOpenOptionId,
        searchResult,
        setSearchResult,
        handleScroll,
        handleBack,
        handleNavigate,
        handlePageNav,
        activeUsers,
        archivedCount: chats.archive,
        searchLoading,
        setSearchLoading,
        handleMessageNavigate,
        openOption,
        setOpenOption,
        viewMore,
        setViewMore,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
