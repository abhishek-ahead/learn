import { ResizeMode, Video } from "expo-av";
import moment from "moment";
import React, { useContext } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Path, Svg } from "react-native-svg";
import { useSelector } from "react-redux";
import { CONTENT_TYPE, SCREEN, VIEW_MORE } from "../../constant";
import { fileIcon, playIcon, singleTick } from "../../constant/icons";
import { AppContext } from "../../context/app";
import { AuthContext } from "../../context/auth";
import { ChatContext } from "../../context/chat";
import { appStyle } from "../../styles";
import TrackPlayer from "../message/trackPlayer";
import MessageStatus from "../messageStatus";
import NoResult from "../noResult";
import MessageContentType from "./../messageContentType";
import LoadingShimmer from "./loadingShimmer";

const MessageView = () => {
  const { selectFilter, Styles } = useContext(AppContext);
  const { USER_ID } = useContext(AuthContext);
  const { handleNavigate, searchResult, searchLoading, handleMessageNavigate } =
    useContext(ChatContext);
  const { translation, searchText } = useContext(AppContext);

  if (selectFilter)
    switch (selectFilter) {
      case CONTENT_TYPE.image:
        return (
          <View
            style={{ ...Styles.mediacontainer, ...Styles.searchmediacontainer }}
          >
            {searchResult.messages.data.map((message) => (
              <Pressable
                onPress={() =>
                  handleMessageNavigate(
                    message.sender == USER_ID
                      ? message.receiver
                      : message.sender,
                    message._id
                  )
                }
                key={`media_item_${message._id}`}
                style={{ ...Styles.mediacontaineritem }}
              >
                <Image
                  style={Styles.mediacontaineritemimg}
                  source={{ uri: message.media }}
                />
              </Pressable>
            ))}
          </View>
        );
      case CONTENT_TYPE.video:
        return (
          <View
            style={{ ...Styles.mediacontainer, ...Styles.searchmediacontainer }}
          >
            {searchResult.messages.data.map((message) => (
              <Pressable
                onPress={() =>
                  handleMessageNavigate(
                    message.sender == USER_ID
                      ? message.receiver
                      : message.sender,
                    message._id
                  )
                }
                key={`media_item_${message._id}`}
                style={{ ...Styles.mediacontaineritem }}
              >
                <View style={Styles.mediacontaineritemimg}>
                  <Video
                    style={Styles.mediacontaineritemvideo}
                    videoStyle={{
                      ...Styles.messageitemattachmentvideoplayer, ...Styles.bgdark
                    }}
                    source={{ uri: message.media }}
                    useNativeControls={false}
                    resizeMode={ResizeMode.COVER}
                    isLooping={false}
                    usePoster
                  />
                  <View
                    style={{
                      ...Styles.mediacontaineritemvideoplay,
                      ...Styles.itemCenter,
                    }}
                  >
                    {playIcon({ fill: "#fff", height: 30, width: 30 })}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        );
      case CONTENT_TYPE.application:
        return (
          <View style={{ ...Styles.searchmediacontainer }}>
            {searchResult.messages.data.map((message) => (
              <View
                key={`media_item_${message._id}`}
                style={Styles.searchitemwrap}
              >
                <View style={{ ...Styles.searchitemhead }}>
                  <View style={{ ...Styles.searchitemtitle }}>
                    <Text
                      style={{ ...Styles.fontBold, ...Styles.fontsizetitle, ...Styles.fontdefault }}
                    >
                      {message.sender == USER_ID
                        ? translation.you
                        : message.user.name.split(" ")[0]}
                    </Text>
                    <Text style={{ ...Styles.fontlight }}>&#x2022;</Text>
                    <Text style={Styles.fontdefault}>
                      {message.receiver == USER_ID
                        ? translation.you
                        : message.chat.name.split(" ")[0]}
                    </Text>
                  </View>
                  <Text
                    style={{ ...Styles.fontlight, ...Styles.fontsizesmall }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {moment(message.createdAt).format("DD/MM/YYYY")}
                  </Text>
                </View>
                <Pressable
                  onPress={() =>
                    handleMessageNavigate(
                      message.sender == USER_ID
                        ? message.receiver
                        : message.sender,
                      message._id
                    )
                  }
                  style={{ ...Styles.mediafileitem, marginBottom: 0, }}
                >
                  <View
                    style={{ ...Styles.mediafileitemimg, ...Styles.itemCenter }}
                  >
                    {fileIcon(Styles.iconwhite)}
                  </View>
                  <View style={{ ...Styles.mediafileiteminfo }}>
                    <Text
                      style={{ ...Styles.fontBold, ...Styles.fontdefault }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {message.mediaDetails.originalname}
                    </Text>
                    <Text
                      style={{
                        ...Styles.fontsizesmall,
                        ...Styles.fontlight,
                        ...Styles.mtop5,
                      }}
                    >
                      {`${Math.trunc(
                        message.mediaDetails.mediaSize / 1024
                      )}Kb . ${message.mediaDetails.mimetype.split("/")[1]
                        }`}{" "}
                    </Text>
                  </View>
                </Pressable>
              </View>
            ))}
          </View>
        );
      case CONTENT_TYPE.link:
        return (
          <View style={{ ...Styles.searchmediacontainer }}>
            {searchResult.messages.data.map((message) => (
              <View
                key={`media_item_${message._id}`}
                style={Styles.searchitemwrap}
              >
                <View style={{ ...Styles.searchitemhead }}>
                  <View style={{ ...Styles.searchitemtitle }}>
                    <Text
                      style={{ ...Styles.fontBold, ...Styles.fontsizetitle, ...Styles.fontdefault }}
                    >
                      {message.sender == USER_ID
                        ? translation.you
                        : message.user.name.split(" ")[0]}
                    </Text>
                    <Text style={{ ...Styles.fontlight }}>&#x2022;</Text>
                    <Text style={{ ...Styles.fontdefault }}>
                      {message.receiver == USER_ID
                        ? translation.you
                        : message.chat.name.split(" ")[0]}
                    </Text>
                  </View>
                  <Text
                    style={{ ...Styles.fontlight, ...Styles.fontsizesmall }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {moment(message.createdAt).format("DD/MM/YYYY")}
                  </Text>
                </View>
                <Pressable
                  onPress={() => Linking.openURL(message.link.url)}
                  style={{ ...Styles.medialinkitem, marginBottom: 0 }}
                >
                  <View style={{ ...Styles.medialinkitemtop }}>
                    <Image
                      style={Styles.medialinkitemimg}
                      source={{ uri: message.link.image }}
                    />
                    <View style={{ ...Styles.medialinkiteminfo }}>
                      <Text
                        style={{ ...Styles.fontBold, ...Styles.fontdefault }}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {message.link.title}
                      </Text>
                      <Text
                        style={{ ...Styles.fontsizesmall, ...Styles.mtop2, ...Styles.fontdefault }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {message.link.description}
                      </Text>
                      <Text
                        style={{
                          ...Styles.fontsizesmall,
                          ...Styles.fontlight,
                          ...Styles.mtop2,
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {message.link.url}
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    onPress={() =>
                      handleMessageNavigate(message.chat._id, message._id)
                    }
                    style={{ ...Styles.medialinkitemmsg }}
                  >
                    <Text
                      style={{
                        ...Styles.medialinkitemmsgtxt,
                        ...Styles.fontprimary,
                      }}
                      numberOfLines={1}
                    >
                      {translation.viewMessage}
                    </Text>
                    <View style={{ ...Styles.icon20 }}>
                      <Svg
                        viewBox="0 0 24 24"
                        style={{ ...Styles.iconprimary }}
                      >
                        <Path d="M0 0h24v24H0V0z" fill="none" />
                        <Path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
                      </Svg>
                    </View>
                  </Pressable>
                </Pressable>
              </View>
            ))}
          </View>
        );
      case CONTENT_TYPE.audio:
        return (
          <View style={{ ...Styles.searchmediacontainer }}>
            {searchResult.messages.data.map((message) => (
              <View
                key={`media_item_${message._id}`}
                style={Styles.searchitemwrap}
              >
                <View style={{ ...Styles.searchitemhead }}>
                  <View style={{ ...Styles.searchitemtitle }}>
                    <Text
                      style={{ ...Styles.fontBold, ...Styles.fontsizetitle, ...Styles.fontdefault }}
                    >
                      {message.sender == USER_ID
                        ? translation.you
                        : message.user.name.split(" ")[0]}
                    </Text>
                    <Text style={{ ...Styles.fontlight }}>&#x2022;</Text>
                    <Text style={Styles.fontdefault}>
                      {message.receiver == USER_ID
                        ? translation.you
                        : message.chat.name.split(" ")[0]}
                    </Text>
                  </View>
                  <Text
                    style={{ ...Styles.fontlight, ...Styles.fontsizesmall }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {moment(message.createdAt).format("DD/MM/YYYY")}
                  </Text>
                </View>
                <View
                  key={`media_item_${message._id}`}
                  style={{
                    ...Styles.audiorecordedtrackwrap,
                    ...Styles.searchitemaudio,
                    width: "100%",
                    marginBottom: 0,
                  }}
                >
                  <Image
                    style={{ ...Styles.audiotrackimg }}
                    source={{ uri: message.user.avatar }}
                  />
                  <TrackPlayer trackUri={message.media} playerOnly={true} />
                </View>
              </View>
            ))}
          </View>
        );
    }
  else if (searchText)
    return searchResult.messages.data.map((message) => (
      <Pressable
        onPress={() => handleMessageNavigate(message.chat._id, message._id)}
        key={`search_message_${message._id}`}
        style={Styles.chatListItem}
      >
        <View style={Styles.chatListItemInner}>
          <View style={Styles.chatListIteminfo}>
            <View style={Styles.chatListIteminfoTop}>
              <Text style={Styles.chatListIteminfoTitle} numberOfLines={1}>
                {message.chat.name}
              </Text>
              <View style={Styles.chatListItemOptions}>
                <Text style={Styles.chatListItemTime}>
                  {moment(message.createdAt).fromNow()}
                </Text>
              </View>
            </View>
            <View style={Styles.chatListIteminfoBtm}>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={Styles.chatListIteminfoMsg}
              >
                {message.text}
              </Text>
              <View style={{ ...Styles.icon, ...Styles.icon18 }}>
                {singleTick}
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    ));
};

const SearchChatList = () => {
  const { USER_ID } = useContext(AuthContext);
  const { translation, Styles } = useContext(AppContext);
  const {
    handleNavigate,
    searchResult,
    searchLoading,
    handleMessageNavigate,
    viewMore,
    setViewMore,
  } = useContext(ChatContext);
  const users = useSelector((state) => state.chats.users);
  return searchResult.chats?.data?.length ||
    searchResult.messages?.data?.length ||
    searchResult.starred?.data?.length ? (
    <ScrollView>
      <View style={{ flex: 1, ...appStyle, ...Styles.searchresultcontainer }}>
        {searchResult.chats.data.length ? (
          <>
            <View style={{ ...Styles.searchresulthead }}>
              <Text style={{ ...Styles.fontBold, ...Styles.fontlight }}>
                {translation.chats}
              </Text>
            </View>
            {searchResult.chats.data.map((chatItem) => (
              <Pressable
                onPress={() =>
                  handleNavigate(chatItem.chat._id, SCREEN.message)
                }
                key={`search_chat_${chatItem.chat._id}`}
                style={Styles.chatListItem}
              >
                <View style={Styles.chatListItemInner}>
                  <View style={Styles.chatListItemthumb}>
                    <Image
                      style={{ height: 45, width: 45, borderRadius: 50 }}
                      source={{
                        uri: chatItem.chat.avatar,
                      }}
                    />
                    {users[chatItem.chat._id]?.active && (
                      <View style={Styles.chatListItemStatus}></View>
                    )}
                  </View>
                  <View style={Styles.chatListIteminfo}>
                    <View style={Styles.chatListIteminfoTop}>
                      <Text
                        style={Styles.chatListIteminfoTitle}
                        numberOfLines={1}
                      >
                        {chatItem.chat.name}
                      </Text>
                      <View style={Styles.chatListItemOptions}>
                        <Text style={Styles.chatListItemTime}>
                          {moment(chatItem.lastMessage.createdAt).from()}
                        </Text>
                      </View>
                    </View>
                    <View style={Styles.chatListIteminfoBtm}>
                      <MessageContentType message={chatItem.lastMessage} />
                      {/* <Text numberOfLines={2} ellipsizeMode="tail" style={Styles.chatListIteminfoMsg}>
                                                            {chatItem.lastMessage.text}
                                                        </Text> */}
                      {chatItem.lastMessage?.user?._id == USER_ID && (
                        <View style={{ ...Styles.icon, ...Styles.icon18 }}>
                          <MessageStatus
                            status={chatItem.lastMessage.message_status}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
            {viewMore == VIEW_MORE.chats && searchLoading ? (
              <ActivityIndicator size="small" color="#6a6f75" />
            ) : searchResult.chats.more ? (
              <Pressable onPress={() => setViewMore(VIEW_MORE.chats)}>
                <Text
                  style={{
                    ...Styles.messageitembodytextmore,
                    ...Styles.fontsizesmall,
                  }}
                >{`${translation.viewMore}...`}</Text>
              </Pressable>
            ) : null}
          </>
        ) : null}

        {searchResult.starred.data.length ? (
          <>
            <View style={{ ...Styles.searchresulthead }}>
              <Text style={{ ...Styles.fontBold, ...Styles.fontlight }}>
                {translation.starredMessage}
              </Text>
            </View>
            {searchResult.starred.data.map((message) => (
              <Pressable
                onPress={() =>
                  handleMessageNavigate(message.chat._id, message._id)
                }
                key={`search_starred_${message._id}`}
                style={Styles.chatListItem}
              >
                <View style={Styles.chatListItemInner}>
                  <View style={Styles.chatListIteminfo}>
                    <View style={Styles.chatListIteminfoTop}>
                      <Text
                        style={Styles.chatListIteminfoTitle}
                        numberOfLines={1}
                      >
                        {message.chat.name}
                      </Text>
                      <View style={Styles.chatListItemOptions}>
                        <Text style={Styles.chatListItemTime}>
                          {moment(message.createdAt).fromNow()}
                        </Text>
                      </View>
                    </View>
                    <View style={Styles.chatListIteminfoBtm}>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={Styles.chatListIteminfoMsg}
                      >
                        {message.text}
                      </Text>
                      <View style={{ ...Styles.icon, ...Styles.icon18 }}>
                        {singleTick}
                      </View>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
            {viewMore == VIEW_MORE.starred && searchLoading ? (
              <ActivityIndicator size="small" color="#6a6f75" />
            ) : searchResult.starred.more ? (
              <Pressable onPress={() => setViewMore(VIEW_MORE.starred)}>
                <Text
                  style={{
                    ...Styles.messageitembodytextmore,
                    ...Styles.fontsizesmall,
                  }}
                >{`${translation.viewMore}...`}</Text>
              </Pressable>
            ) : null}
          </>
        ) : null}

        {searchResult.messages.data.length ? (
          <>
            <View style={{ ...Styles.searchresulthead }}>
              <Text style={{ ...Styles.fontBold, ...Styles.fontlight }}>
                {translation.message}
              </Text>
            </View>
            <MessageView />
            {viewMore == VIEW_MORE.messages && searchLoading ? (
              <View style={{ marginVertical: 10 }}><ActivityIndicator size="small" color="#6a6f75" /></View>
            ) : searchResult.messages.more ? (
              <Pressable onPress={() => setViewMore(VIEW_MORE.messages)}>
                <Text
                  style={{
                    ...Styles.messageitembodytextmore,
                    ...Styles.fontsizesmall,
                    ...Styles.textcenter,
                    marginVertical: 10,
                  }}
                >{`${translation.viewMore}...`}</Text>
              </Pressable>
            ) : null}
          </>
        ) : null}
      </View>
    </ScrollView>
  ) : searchLoading ? (
    <LoadingShimmer />
  ) : (
    <NoResult />
  );
};

export default SearchChatList;
