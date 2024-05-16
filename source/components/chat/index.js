import React, { useContext } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SCREEN } from "../../constant";
import { AppContext } from "../../context/app";
import { ChatContext } from "../../context/chat";
import Styles, { appStyle, mainStyle } from "../../styles";
import Header from "../header";
import NavBar from "../navbar";
import Options from "../options";
import ChatList from "./chatList";
import SearchChat from "./searchChat";
import SearchChatList from "./searchChatView";
import { checkcircleSuccess, crosscircleDanger } from "../../constant/icons";

const ChatMain = () => {
  const {
    archive,
    searchResult,
    searchLoading,
    activeUsers,
    handleNavigate,
    openOption,
    setOpenOption,
  } = useContext(ChatContext);
  const { tabNav, enableSearch, translation } = useContext(AppContext);
  return (
    <View style={{ ...mainStyle, marginRight: 10 }}>
      <View style={{ ...Styles.chatBubble, ...appStyle }}>
        <View style={Styles.chatBubbleHeader}>
          {enableSearch ? (
            <SearchChat />
          ) : (
            <Header name={archive ? "Archived" : translation[tabNav]} />
          )}
        </View>
        {enableSearch && (Object.keys(searchResult).length || searchLoading) ? (
          <SearchChatList />
        ) : (
          <>
            {!enableSearch && !archive && activeUsers.length ? (
              <ScrollView style={Styles.onlineUsers} horizontal={true}>
                {activeUsers.map((user) => (
                  <Pressable
                    onPress={() => handleNavigate(user._id, SCREEN.message)}
                    key={user._id}
                    style={Styles.onlineUserItem}
                  >
                    <View key={user._id} style={Styles.onlineUserIteminner}>
                      <Image
                        style={{ ...Styles.onlineUserItemimg, ...Styles.thumbImg }}
                        source={{ uri: user.avatar }}
                      />
                      <View style={Styles.chatListItemStatus}></View>
                    </View>
                    <Text style={Styles.onlineUserItemName} numberOfLines={1}>
                      {user.name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            ) : null}
            <View style={{ flex: 1, ...appStyle }}>
              <ChatList />
            </View>
          </>
        )}
        <NavBar />
        <Options
          item={openOption}
          setOpenOption={setOpenOption}
          handleNavigate={handleNavigate}
        />
      </View>
    </View>
  );
};

export default ChatMain;
