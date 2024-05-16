import { createContext, useEffect, useRef, useState } from "react";
import { Alert, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { NAV_TABS, SCREEN } from "../constant";
import {
  chatPin,
  fetchChat,
  newChats,
  reaction,
  unreadChats,
} from "../services/chat";
import { getGroupInfo } from "../services/group";
import { getPermission, getTranslations } from "../services/user";
import {
  add,
  chatClose,
  chatNavigation,
  chatUnread,
  newChatOpen,
} from "../store/reducer";
import { actions } from "../store/reducer/group";

export const AppContext = createContext();

export const AppProvider = ({ children, mobileView }) => {
  const dispatch = useDispatch();
  const StoreChat = useSelector((state) => state.chats.data);
  const [reactions, setReaction] = useState({});
  const [chats, setChats] = useState([]);
  const [muteOpen, setMuteOpen] = useState(null);
  const [forwardOpen, setForwardOpen] = useState(null);
  const [focusedChat, setFocusChat] = useState(null);
  const [tabNav, setTabNav] = useState(NAV_TABS.chat);
  const [confirmationDialog, setConfimationDialog] = useState(null);
  const [showImage, setShowImage] = useState(null);
  const [openMenuOption, setOpenMenuOption] = useState(false);
  const [openReactionOption, setOpenReactionOption] = useState(null);
  const [openReaction, setOpenReaction] = useState(null);
  const openMessages = useSelector((state) => state.chats.opens);
  const [deleteOpen, setDeleteOpen] = useState(null);
  const [minimize, setMinimize] = useState(false);
  const [enableSearch, setEnableSearch] = useState(false);
  const [filter, setFilter] = useState("");
  const navigation = useRef();
  const [selectFilter, setSelectFilter] = useState("");
  const [translation, setTranslation] = useState();
  const [permissions, setPermissions] = useState([]);
  const fetched = useRef(false);
  const [searchText, setText] = useState("");
  const [newCreateGroup, setNewCreateOpen] = useState(false);
  const [addMemberGroup, setAddMemberGroup] = useState(null);
  const [passwordDialog, setPassowordDialog] = useState(null);
  const [toastNotification, setToastNotification] = useState(null);

  const fetchTranslation = async () => {
    const response = await getTranslations();
    if (response.success) setTranslation(response.data);
  };

  const fetchPermissions = async () => {
    const response = await getPermission();
    if (response.success) setPermissions(response.data);
  };

  const fetchReaction = async () => {
    const response = await reaction();
    if (response.success) {
      response.data.forEach((element) => {
        setReaction((prev) => ({ ...prev, [element._id]: element }));
      });
    }
  };

  const handleNavigate = (id, screen) => {
    Platform.OS !== "web"
      ? navigation.current.navigate(screen, { id: id })
      : dispatch(newChatOpen({ id, screen }));
  };

  const getNewChat = async () => {
    const response = await newChats();
    if (response.success) {
      setChats(
        response.chats.sort((a, b) =>
          a.name.localeCompare(b.name, "en", { sensitivity: "accent" })
        )
      );
      // setFrequuentlyContacted(response.data.frequentlyContacted)
    }
  };

  const handleChatPin = (id) => {
    if (Object.values(StoreChat).filter((chat) => chat.pin).length < 3)
      chatPin(id);
    else {
      Platform.OS == "web"
        ? alert("You can only pin up to 3 Chats")
        : Alert.alert("Pin Chat", "You can only pin up to 3 Chats", [
          { text: "OK" },
        ]);
    }
  };

  const fetchChatDetails = async (id) => {
    if (!id) return;
    if (!StoreChat[id]) {
      const response = await fetchChat(id);
      if (response.success) {
        dispatch(add({ chats: [response.data] }));
      } else if (!response.success) {
        dispatch(chatClose(id));
      }
      return response;
    }
  };

  const fetchUnreadCount = () => {
    unreadChats().then(
      (response) => response.unreads && dispatch(chatUnread(response.unreads))
    );
  };

  const handleSearchNav = () => setEnableSearch((prev) => !prev);

  const getChatId = (uid) =>
    Object.values(StoreChat).find((chat) => chat.chat.uid == uid);

  const getGroupDetails = async (id) => {
    const response = await getGroupInfo(id);
    if (response.success) {
      dispatch(actions.addGroup(response.data));
    }
  };

  const handleOpenNavigate = (id, screen) => {
    Platform.OS !== "web"
      ? navigation.current.navigate(screen, { id: id })
      : dispatch(newChatOpen({ id, screen }));
  };

  const handleMinimize = () => {
    window.top.postMessage(
      {
        type: "iframeSize",
        // count: openMessages.length + 1,
        height: !minimize ? 50 : 500,
        width: (openMessages.length + 1) * 310 + 1,
      },
      "*"
    );
    setMinimize((prev) => !prev);
  };

  useEffect(() => {
    if (
      Platform.OS == "web" &&
      (openMenuOption || openReactionOption || openReaction)
    ) {
      const click = (e) => {
        if (
          (!e.target.closest("a") ||
            !e.target.closest("a").classList.contains("message-menu-optn")) &&
          !e.target.classList.contains("message-menu-optn")
        )
          setOpenMenuOption(false);
        if (
          (!e.target.closest("a") ||
            !e.target.closest("a").classList.contains("reaction-menu-optn")) &&
          !e.target.classList.contains("reaction-menu-optn")
        )
          setOpenReactionOption(null);
        if (
          (!e.target.closest("a") ||
            !e.target.closest("a").classList.contains("reation-view")) &&
          !e.target.classList.contains("reation-view")
        )
          setOpenReaction(null);
      };
      document.body.addEventListener("click", click);
      return () => {
        document.body.removeEventListener("click", click);
      };
    }
  }, [openMenuOption, openReactionOption, openReaction]);

  useEffect(() => {
    fetchTranslation();
    fetchPermissions();
    fetchReaction();
    if (Platform.OS == "web") {
      const value = JSON.parse(localStorage.getItem("minimize"));
      if (value?.value) setMinimize(value.value);
    }
  }, []);

  useEffect(() => {
    if (Platform.OS == "web") {
      localStorage.setItem("minimize", JSON.stringify({ value: minimize }));
      if (minimize) {
        openMessages.forEach((open) => {
          const [id, screen] = open.split("_");
          if (screen !== SCREEN.message)
            dispatch(chatNavigation({ id, screen: SCREEN.message }));
        });
      }
    }
  }, [minimize]);

  useEffect(() => {
    const handleCommunication = async (event) => {
      if (event.data.type == "maximizeChat") {
        handleMinimize();
      }
      if (event.data.type == "newChat") {
        const { uid } = event.data;
        let chat = getChatId(uid);
        if (!chat) {
          const response = await fetchChatDetails(uid);
          if (response.success) chat = response.data;
          else return;
        }
        dispatch(newChatOpen({ id: chat.chat._id, screen: SCREEN.message }));
      }
    };
    if (Platform.OS == "web") {
      window.addEventListener("message", handleCommunication);
      return () => window.removeEventListener("message", handleCommunication);
    }
  }, [minimize, StoreChat, openMessages]);

  if (translation)
    return (
      <AppContext.Provider
        value={{
          reactions,
          chats,
          setChats,
          getNewChat,
          handleChatPin,
          fetchChatDetails,
          muteOpen,
          setMuteOpen,
          forwardOpen,
          setForwardOpen,
          focusedChat,
          setFocusChat,
          tabNav,
          setTabNav,
          openMenuOption,
          setOpenMenuOption,
          openReactionOption,
          setOpenReactionOption,
          openReaction,
          setOpenReaction,
          confirmationDialog,
          setConfimationDialog,
          showImage,
          setShowImage,
          deleteOpen,
          setDeleteOpen,
          minimize,
          setMinimize,
          enableSearch,
          setEnableSearch,
          handleSearchNav,
          appNavigation: navigation,
          filter,
          setFilter,
          mobileView,
          selectFilter,
          setSelectFilter,
          handleNavigate,
          translation,
          permissions,
          setPermissions,
          fetched,
          searchText,
          setText,
          newCreateGroup,
          setNewCreateOpen,
          getChatId,
          getGroupDetails,
          addMemberGroup,
          setAddMemberGroup,
          handleOpenNavigate,
          handleMinimize,
          passwordDialog,
          setPassowordDialog,
          fetchUnreadCount,
          toastNotification, setToastNotification
        }}
      >
        {children}
      </AppContext.Provider>
    );
  return null;
};
