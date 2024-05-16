import { lazy, useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { SCREEN } from "../constant";
import { AppContext } from "../context/app";

const ChatMain = lazy(() => import("./index"));
const ChatMedia = lazy(() => import("./chatMedia"));
const ChatProfile = lazy(() => import("./chatProfile"));
const ChatStarred = lazy(() => import("./chatStarred"));
const Message = lazy(() => import("./message"));
const GroupSetting = lazy(() => import("./groupSetting"));
const GroupMembers = lazy(() => import("./groupMembers"));
const GroupPendingRequest = lazy(() => import("./groupPendingRequest"));
const GroupInvite = lazy(() => import("./groupInvite"));

const ChatOpens = () => {
  const {
    confirmationDialog,
    forwardOpen,
    muteOpen,
    deleteOpen,
    minimize,
    showImage,
    mobileView,
    fetched,
    newCreateGroup,
    addMemberGroup,
    passwordDialog,
    setPassowordDialog
  } = useContext(AppContext);
  const tabOpenSize = () => Math.floor(window.innerWidth / 310) - 1;
  const openMessages = useSelector((state) => state.chats.opens);
  const [chatWindow, setChatWindow] = useState([]);
  const [maxTabOpen, setMaxTabOpen] = useState(1);

  useEffect(() => {
    if (
      muteOpen ||
      showImage ||
      forwardOpen ||
      confirmationDialog ||
      deleteOpen ||
      newCreateGroup ||
      addMemberGroup ||
      passwordDialog
    ) {
      window.top.postMessage(
        {
          type: "iframeFullSize",
        },
        "*"
      );

      return () => {
        window.top.postMessage(
          {
            type: "iframeSize",
            // count: openMessages.length + 1,
            // minimize: minimize,
            height: minimize ? 51 : 501,
            width: (openMessages.length + 1) * 310 + 1,
          },
          "*"
        );
      };
    }
  }, [
    openMessages,
    muteOpen,
    showImage,
    forwardOpen,
    confirmationDialog,
    deleteOpen,
    minimize,
    newCreateGroup,
    addMemberGroup,
    passwordDialog,
  ]);

  useEffect(() => {
    const handleResize = () => {
      if (
        !confirmationDialog &&
        !forwardOpen &&
        !muteOpen &&
        !deleteOpen &&
        !showImage &&
        !newCreateGroup &&
        !addMemberGroup &&
        !passwordDialog
      ) {
        // window.top.postMessage(
        //   {
        //     type: "iframeSize",
        //     // count: openMessages.length + 1,
        //     height: 500,
        //     width: maxTabOpen + 1 * 500,
        //     // minimize: minimize,
        //   },
        //   "*"
        // );
        setMaxTabOpen(mobileView ? 1 : tabOpenSize());
      }
    };

    // Add event listener to handle window resize
    window.addEventListener("resize", handleResize);
    // Cleanup the event listener when the component unmounts
    return () => window.removeEventListener("resize", handleResize);
  }, [
    maxTabOpen,
    confirmationDialog,
    forwardOpen,
    muteOpen,
    deleteOpen,
    minimize,
    showImage,
    newCreateGroup,
    addMemberGroup,
    passwordDialog,
  ]);

  useEffect(() => {
    if (!fetched.current && !minimize) return;
    const opentabs = openMessages.length
      ? openMessages.slice(0, maxTabOpen)
      : [];
    setChatWindow(opentabs);

    window.top.postMessage(
      {
        type: "iframeSize",
        // count: openMessages.length + 1,
        height: minimize ? 51 : 501,
        width: (openMessages.length + 1) * 310 + 1,
      },
      "*"
    );
  }, [openMessages, maxTabOpen, fetched.current, minimize]);

  if (chatWindow.length) {
    return (
      <>
        {chatWindow.map((ele) => {
          const [id, screen, add] = ele.split("_");
          switch (screen) {
            case SCREEN.message:
              return <Message key={`chat_tab_${id}_${screen}`} id={id} />;
            case SCREEN.groupProfile:
            case SCREEN.profile:
              return <ChatProfile key={`chat_tab_${id}_${screen}`} id={id} />;
            case SCREEN.media:
              return <ChatMedia key={`chat_tab_${id}_${screen}`} id={id} />;
            case SCREEN.starred:
              return <ChatStarred key={`chat_tab_${id}_${screen}`} id={id} />;
            case SCREEN.groupSetting:
              return <GroupSetting key={`chat_tab_${id}_${screen}`} id={id} />;
            case SCREEN.groupMembers:
              return <GroupMembers
                key={`chat_tab_${id}_${screen}`}
                id={id}
                add={add}
              />
                ;
            case SCREEN.groupPendingRequest:
              return (
                <GroupPendingRequest key={`chat_tab_${id}_${screen}`} id={id} />
              );
            case SCREEN.groupInvite:
              return <GroupInvite key={`chat_tab_${id}_${screen}`} id={id} />
            default:
              return <View key={`chat_tab_${id}_${screen}`}></View>;
          }
        })}
      </>
    );
  } else if (mobileView) return <ChatMain />;
  else return <></>;
};

export default ChatOpens;
