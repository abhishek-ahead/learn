import React, { useContext } from 'react';
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { NAV_TABS, SCREEN } from "../../constant";
import { AppContext } from "../../context/app";
import { ChatContext } from "../../context/chat";
import UnderDevelopmentScreen from "../../pages/development";
import Styles, { appStyle } from "../../styles";
import SettingBody from '../setting/body';
import ChatList from "./chatList";
import NewChat from './newChat';

export const ChatBody = () => {
    const { tabNav } = useContext(AppContext);
    const { enableSearch, archive, activeUsers, handleNavigate } = useContext(ChatContext)

    switch (tabNav) {
        case NAV_TABS.chat:
            return <>
                {!enableSearch && !archive && activeUsers.length ?
                    <ScrollView style={Styles.onlineUsers} horizontal={true}>
                        {activeUsers.map(user =>
                            <Pressable
                                onPress={() => handleNavigate(user._id, SCREEN.message)}
                                key={user._id}
                                style={Styles.onlineUserItem}
                            >
                                <View key={user._id} style={Styles.onlineUserIteminner}>
                                    <Image style={{ ...Styles.onlineUserItemimg, ...Styles.thumbImg }}
                                        source={{ uri: user.avatar }} />
                                    <View style={Styles.chatListItemStatus}></View>
                                </View>
                                <Text style={Styles.onlineUserItemName} numberOfLines={1}>{user.name}</Text>
                            </Pressable>
                        )}
                    </ScrollView>
                    : null}
                <View style={{ flex: 1, ...appStyle }}>
                    <ChatList />
                </View>
            </>
        case NAV_TABS.people:
            return <NewChat />
        case NAV_TABS.setting:
            return <SettingBody />
        default:
            return <UnderDevelopmentScreen />
    }

}