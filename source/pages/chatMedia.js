import { ResizeMode, Video } from "expo-av";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import NoResult from "../components/noResult";
import { CONTENT_TYPE, MEDIA_TYPE, SCREEN } from "../constant";
import {
  backIcon,
  checkcircleIcon,
  playIconWhite,
  fileIcon,
} from "../constant/icons";
import { AppContext } from "../context/app";
import { deleteMessage, markStarred, messageMedia } from "../services/message";
import { chatNavigation, chatOption } from "../store/reducer";
import Styles, { appStyle, mainStyle } from "../styles";

const ChatMedia = ({ navigation, route, id }) => {
  const dispatch = useDispatch();
  id = route?.params?.id || id;
  const { setForwardOpen, setConfimationDialog, setShowImage, translation, fetchChatDetails } = useContext(AppContext);
  const [mediaData, setMediaData] = useState({
    [MEDIA_TYPE.media]: { data: [], more: true },
    [MEDIA_TYPE.link]: { data: [], more: true },
    [MEDIA_TYPE.docs]: { data: [], more: true },
  });
  const [mediaType, setMediaType] = useState("media");
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [enableSelect, setEnableSelect] = useState(false);
  const [selected, setSelected] = useState([]);
  const chat = useSelector((state) => state.chats.data[id]?.chat);

  const handleSelected = (id) =>
    setSelected((selected) => {
      const prev = [...selected];
      const index = prev.indexOf(id);
      if (index == -1) {
        prev.push(id);
        return prev;
      } else {
        prev.splice(index, 1);
        return prev;
      }
    });

  const handleNavigate = (id, screen) => {
    Platform.OS !== "web"
      ? navigation.navigate(screen, { id: id })
      : dispatch(chatNavigation({ id, screen }));
  };

  const handleMessageNavigate = (chat, message) => {
    handleNavigate(chat, SCREEN.message);
    dispatch(chatOption({ chat, option: { scrollMessage: message } }));
  };

  useEffect(() => {
    enableSelect && setEnableSelect(false);
  }, [mediaType]);

  useEffect(() => {
    if (!enableSelect) setSelected([]);
  }, [enableSelect]);

  const getMedia = async () => {
    setLoadingMedia(true);
    const response = await messageMedia({
      chat: id,
      chatType: chat.chatType,
      mediaType,
      lastMessage: mediaData[mediaType].data.length
        ? mediaData[mediaType].data[mediaData[mediaType].data.length - 1]._id
        : null,
    });
    if (response.success) {
      // const data = response.data.sort(a, b => new Date(b.createdAt) - new Date(a.createdAt));

      setMediaData((prev) => ({
        ...prev,
        [mediaType]: {
          data: [...prev[mediaType].data, ...response.data],
          more: response.more,
        },
      }));
    }
    setLoadingMedia(false);
  };

  useEffect(() => {
    if (chat)
      mediaData[mediaType].more && getMedia();
    else fetchChatDetails(id);
  }, [chat, mediaType]);

  const groupedData = mediaData[mediaType].data.reduce((result, item) => {
    const date = new Date(item.createdAt);
    date.setHours(0, 0, 0, 0);
    const day = date.toISOString();
    if (!result[day]) {
      result[day] = [];
    }
    result[day].push(item);
    return result;
  }, {});

  const groupedArray = Object.keys(groupedData)
    .sort((a, b) => new Date(b) - new Date(a))
    .map((day) => ({
      title: day,
      data: groupedData[day],
    }));

  const mediaContainer = (data) => {
    switch (mediaType) {
      case MEDIA_TYPE.media:
        return (
          <View style={{ ...Styles.mediacontainer }}>
            {data.map((message) => (
              <Pressable
                onPress={() =>
                  enableSelect
                    ? handleSelected(message._id)
                    : setShowImage({ ...message, chat })
                }
                key={`media_item_${message._id}`}
                style={{ ...Styles.mediacontaineritem }}
              >
                {message.contentType == CONTENT_TYPE.image ? (
                  <Image
                    style={Styles.mediacontaineritemimg}
                    source={{ uri: message.media }}
                  />
                ) : (
                  <View style={Styles.mediacontaineritemimg}>
                    <Video
                      style={Styles.mediacontaineritemvideo}
                      videoStyle={{
                        ...Styles.messageitemattachmentvideoplayer,
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
                      {playIconWhite}
                    </View>
                  </View>
                )}
                {enableSelect ? (
                  <View style={Styles.checkcircle}>
                    {/* <View style={{ ...Styles.radio, ...Styles.itemCenter }}>
                                    </View> */}
                  </View>
                ) : null}
                {selected.includes(message._id) ? (
                  <View
                    style={{
                      ...Styles.checkcircle,
                      ...Styles.checkcircleactive,
                      ...Styles.itemCenter,
                    }}
                  >
                    {checkcircleIcon}
                  </View>
                ) : null}
              </Pressable>
            ))}
          </View>
        );
      case MEDIA_TYPE.docs:
        return data.map((message) => (
          <Pressable
            onPress={() =>
              enableSelect
                ? handleSelected(message._id)
                : Linking.openURL(message.media)
            }
            key={`media_item_${message._id}`}
            style={{ ...Styles.mediafileitem }}
          >
            <View style={{ ...Styles.mediafileitemimg, ...Styles.itemCenter }}>
              {fileIcon}
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
                {`${Math.trunc(message.mediaDetails.mediaSize / 1024)}Kb . ${message.mediaDetails.mimetype.split("/")[1]
                  }`}{" "}
              </Text>
            </View>
            {enableSelect && !selected.includes(message._id) ? (
              <View style={Styles.mediafileitemoption}>
                <View style={Styles.radio}></View>
              </View>
            ) : null}
            {selected.includes(message._id) ? (
              <View style={Styles.mediafileitemoption}>
                <View style={{ ...Styles.radioactive, ...Styles.itemCenter }}>
                  {checkcircleIcon}
                </View>
              </View>
            ) : null}
          </Pressable>
        ));
      case MEDIA_TYPE.link:
        return data.map((message) => (
          <Pressable
            key={`media_item_${message._id}`}
            onPress={() =>
              enableSelect
                ? handleSelected(message._id)
                : Linking.openURL(message.link.url)
            }
            style={{ ...Styles.medialinkitem }}
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
                  style={{ ...Styles.fontsizesmall, ...Styles.fontdefault, ...Styles.mtop2 }}
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
              {enableSelect && !selected.includes(message._id) ? (
                <View style={Styles.medialinkitemoption}>
                  <View style={Styles.radio}></View>
                </View>
              ) : null}
              {selected.includes(message._id) ? (
                <View style={Styles.medialinkitemoption}>
                  <View style={{ ...Styles.radioactive, ...Styles.itemCenter }}>
                    {checkcircleIcon}
                  </View>
                </View>
              ) : null}
            </View>
            <Pressable
              onPress={() => handleMessageNavigate(chat._id)}
              style={{ ...Styles.medialinkitemmsg }}
            >
              <Text
                style={{ ...Styles.medialinkitemmsgtxt, ...Styles.fontprimary }}
                numberOfLines={1}
              >
                {translation.viewMessage}
              </Text>
              <View style={{ ...Styles.icon20 }}>
                <Svg viewBox="0 0 24 24" style={{ ...Styles.iconprimary }}>
                  <Path d="M0 0h24v24H0V0z" fill="none" />
                  <Path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
                </Svg>
              </View>
            </Pressable>
          </Pressable>
        ));
    }
  };

  const handleChatClose = () => dispatch(chatClose(id));
  const handleBackNavigation = () => {
    Platform.OS !== "web"
      ? navigation.goBack()
      : dispatch(chatNavigation({ id, screen: SCREEN.profile }));
  };
  return (
    <View style={mainStyle}>
      <View style={{ ...Styles.chatBubble, ...appStyle, ...Styles.chatmedia }}>
        <View style={{ ...Styles.chatBubbleHeader, ...Styles.noshadow }}>
          <Pressable
            onPress={handleBackNavigation}
            style={Styles.chatBubbleHeaderOption}
          >
            <View style={Styles.chatBubbleHeaderOptionIcon}>
              <View style={{ ...Styles.icon, ...Styles.icon24 }}>
                {backIcon}
              </View>
            </View>
          </Pressable>
          <View style={Styles.chatBubbleHeaderInfo}></View>
          {mediaData[mediaType].length ? (
            <Pressable
              onPress={() => setEnableSelect((prev) => !prev)}
              style={Styles.chatBubbleHeaderOption}
            >
              <Text style={{ ...Styles.fontprimary, ...Styles.cursor }}>
                {enableSelect ? translation.done : translation.sele}
              </Text>
              <Text style={{ ...Styles.fontprimary, ...Styles.cursor }}>
                {enableSelect ? translation.done : translation.select}
              </Text>
            </Pressable>
          ) : null}
        </View>
        <ScrollView
          scrollEventThrottle={10}
          onScroll={({ nativeEvent }) => {
            const paddingToBottom = 20;
            const { layoutMeasurement, contentOffset, contentSize } =
              nativeEvent;
            const reachEnd =
              layoutMeasurement.height + contentOffset.y >=
              contentSize.height - paddingToBottom;
            if (reachEnd && mediaData[mediaType].more && !loadingMedia) getMedia();
          }}
        >
          <View style={{ flex: 1, ...appStyle, ...Styles.chatmediawrap }}>
            <View style={{ ...Styles.alttabs }}>
              <Pressable
                onPress={() => setMediaType(MEDIA_TYPE.media)}
                style={
                  mediaType == MEDIA_TYPE.media
                    ? { ...Styles.alttabsitem, ...Styles.alttabsitemactive }
                    : Styles.alttabsitem
                }
              >
                <Text
                  style={
                    mediaType == MEDIA_TYPE.media
                      ? {
                        ...Styles.alttabsitemtext,
                        ...Styles.alttabsitemtextactive,
                      }
                      : Styles.alttabsitemtext
                  }
                >
                  {translation.media}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setMediaType(MEDIA_TYPE.link)}
                style={
                  mediaType == MEDIA_TYPE.link
                    ? { ...Styles.alttabsitem, ...Styles.alttabsitemactive }
                    : Styles.alttabsitem
                }
              >
                <Text
                  style={
                    mediaType == MEDIA_TYPE.link
                      ? {
                        ...Styles.alttabsitemtext,
                        ...Styles.alttabsitemtextactive,
                      }
                      : Styles.alttabsitemtext
                  }
                >
                  {translation.links}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setMediaType(MEDIA_TYPE.docs)}
                style={
                  mediaType == MEDIA_TYPE.docs
                    ? { ...Styles.alttabsitem, ...Styles.alttabsitemactive }
                    : Styles.alttabsitem
                }
              >
                <Text
                  style={
                    mediaType == MEDIA_TYPE.docs
                      ? {
                        ...Styles.alttabsitemtext,
                        ...Styles.alttabsitemtextactive,
                      }
                      : Styles.alttabsitemtext
                  }
                >
                  {translation.documents}
                </Text>
              </Pressable>
            </View>
            {mediaData[mediaType].data.length ? (
              groupedArray.map((media) => (
                <View key={`media_item_container_${media.title}`}>
                  <View
                    key={`media_section_${media.title}`}
                    style={{ ...Styles.mediacontainerhead }}
                  >
                    <Text
                      style={{ ...Styles.fontlight, ...Styles.fontsizenormal }}
                    >
                      {moment(media.title).format("MMM D, YYYY")}
                    </Text>
                    <Text style={{ ...Styles.fontprimary, ...Styles.fontsize }}>
                      {media.data.length}
                    </Text>
                  </View>
                  {mediaContainer(media.data)}
                </View>
              ))
            ) : !loadingMedia ? (
              <NoResult />
            ) : null}
          </View>
          {loadingMedia ? (
            <View style={{ marginTop: 100 }}>
              <ActivityIndicator size={mediaData[mediaType].data.length ? "small" : "large"} color="#6a6f75" />
            </View>
          ) : null}
        </ScrollView>
        {/* Options : Apprear after click on select text */}
        {selected.length ? (
          <View style={{ ...Styles.optionbar }}>
            <View style={{ ...Styles.optionbarinner }}>
              <Pressable
                onPress={() => {
                  setForwardOpen(selected);
                  setEnableSelect(false);
                }}
                style={{ ...Styles.optionbaricon, ...Styles.itemCenter }}
              >
                <Svg
                  viewBox="0 -960 960 960"
                  style={{ ...Styles.iconlight, ...Styles.icon20 }}
                >
                  <Path d="m640-280-57-56 184-184-184-184 57-56 240 240-240 240ZM80-200v-160q0-83 58.5-141.5T280-560h247L383-704l57-56 240 240-240 240-57-56 144-144H280q-50 0-85 35t-35 85v160H80Z" />
                </Svg>
              </Pressable>
              {/* <View style={{ ...Styles.optionbaricon, ...Styles.optionbariconactive, ...Styles.itemCenter }}>
                            <Svg viewBox="0 0 24 24" style={{ ...Styles.iconprimary, ...Styles.icon20 }}><Path d="M19.333,14.667a4.66,4.66,0,0,0-3.839,2.024L8.985,13.752a4.574,4.574,0,0,0,.005-3.488l6.5-2.954a4.66,4.66,0,1,0-.827-2.643,4.633,4.633,0,0,0,.08.786L7.833,8.593a4.668,4.668,0,1,0-.015,6.827l6.928,3.128a4.736,4.736,0,0,0-.079.785,4.667,4.667,0,1,0,4.666-4.666ZM19.333,2a2.667,2.667,0,1,1-2.666,2.667A2.669,2.669,0,0,1,19.333,2ZM4.667,14.667A2.667,2.667,0,1,1,7.333,12,2.67,2.67,0,0,1,4.667,14.667ZM19.333,22A2.667,2.667,0,1,1,22,19.333,2.669,2.669,0,0,1,19.333,22Z" /></Svg>
                        </View> */}
              <Pressable
                onPress={() => {
                  markStarred({ messages: selected });
                  setEnableSelect(false);
                }}
                style={{ ...Styles.optionbaricon, ...Styles.itemCenter }}
              >
                <Svg
                  viewBox="0 0 24 24"
                  style={{ ...Styles.iconlight, ...Styles.icon20 }}
                >
                  <Path d="M23.836,8.794a3.179,3.179,0,0,0-3.067-2.226H16.4L15.073,2.432a3.227,3.227,0,0,0-6.146,0L7.6,6.568H3.231a3.227,3.227,0,0,0-1.9,5.832L4.887,15,3.535,19.187A3.178,3.178,0,0,0,4.719,22.8a3.177,3.177,0,0,0,3.8-.019L12,20.219l3.482,2.559a3.227,3.227,0,0,0,4.983-3.591L19.113,15l3.56-2.6A3.177,3.177,0,0,0,23.836,8.794Zm-2.343,1.991-4.144,3.029a1,1,0,0,0-.362,1.116L18.562,19.8a1.227,1.227,0,0,1-1.895,1.365l-4.075-3a1,1,0,0,0-1.184,0l-4.075,3a1.227,1.227,0,0,1-1.9-1.365L7.013,14.93a1,1,0,0,0-.362-1.116L2.507,10.785a1.227,1.227,0,0,1,.724-2.217h5.1a1,1,0,0,0,.952-.694l1.55-4.831a1.227,1.227,0,0,1,2.336,0l1.55,4.831a1,1,0,0,0,.952.694h5.1a1.227,1.227,0,0,1,.724,2.217Z" />
                </Svg>
              </Pressable>
              <Pressable
                onPress={() => {
                  setConfimationDialog({
                    heading: "Delete Message",
                    message: "Are you sure want to Delete these Message?",
                    callback: deleteMessage,
                    chat: { chat: id, messages: selected },
                  });
                  setEnableSelect(false);
                }}
                style={{ ...Styles.optionbaricon, ...Styles.itemCenter }}
              >
                <Svg
                  viewBox="0 -960 960 960"
                  style={{ ...Styles.iconlight, ...Styles.icon20 }}
                >
                  <Path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"></Path>
                </Svg>
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default ChatMedia;

/*
<View style={mainStyle}>
            <View style={{ ...Styles.chatBubble, ...appStyle, ...Styles.chatmedia }}>
                <View style={{ ...Styles.chatBubbleHeader, ...Styles.noshadow }}>
                    <Pressable onPress={handleBackNavigation} style={Styles.chatBubbleHeaderOption}>
                        <View style={Styles.chatBubbleHeaderOptionIcon}>
                            <View style={{ ...Styles.icon, ...Styles.icon24 }}>
                                {backIcon}
                            </View>
                        </View>
                    </Pressable>
                    <View style={Styles.chatBubbleHeaderInfo}></View>
                    <View style={Styles.chatBubbleHeaderOption}>
                        <View>
                            <Text style={{ ...Styles.fontprimary, cursor: "pointer" }}>Select</Text>
                        </View>
                    </View>
                </View>
                <ScrollView>
                    <View style={{ flex: 1, ...appStyle, ...Styles.chatmediawrap }}>
                        <View style={{ ...Styles.alttabs }}>
                            <View style={{ ...Styles.alttabsitem, ...Styles.alttabsitemactive }}>
                                <Text style={{ ...Styles.alttabsitemtext, ...Styles.alttabsitemtextactive }}>Media</Text>
                            </View>
                            <View style={{ ...Styles.alttabsitem }}>
                                <Text style={{ ...Styles.alttabsitemtext }}>Links</Text>
                            </View>
                            <View style={{ ...Styles.alttabsitem }}>
                                <Text style={{ ...Styles.alttabsitemtext }}>Docs</Text>
                            </View>
                        </View>
                        <View style={{ ...Styles.mediacontainerhead }}>
                            <Text style={{ ...Styles.fontlight, ...Styles.fontsizenormal }}>February 2024</Text>
                            <Text style={{ ...Styles.fontprimary, ...Styles.fontsize }}>6</Text>
                        </View>
                        <View style={{ ...Styles.mediacontainer }}>
                            <View style={{ ...Styles.mediacontaineritem }}>
                                <Image style={Styles.mediacontaineritemimg} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                                <View style={{ ...Styles.checkcircle, ...Styles.itemCenter }}>
                                    {checkcircleIcon}
                                </View>
                            </View>
                            <View style={{ ...Styles.mediacontaineritem }}>
                                <Image style={Styles.mediacontaineritemimg} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                                <View style={{ ...Styles.checkcircle, ...Styles.itemCenter }}>
                                    {checkcircleIcon}
                                </View>
                            </View>
                            <View style={{ ...Styles.mediacontaineritem }}>
                                <Image style={Styles.mediacontaineritemimg} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                                <View style={{ ...Styles.checkcircle, ...Styles.itemCenter }}>
                                    {checkcircleIcon}
                                </View>
                            </View>
                            <View style={{ ...Styles.mediacontaineritem }}>
                                <Image style={Styles.mediacontaineritemimg} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                            </View>
                            <View style={{ ...Styles.mediacontaineritem }}>
                                <Image style={Styles.mediacontaineritemimg} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                            </View>
                            <View style={{ ...Styles.mediacontaineritem }}>
                                <Image style={Styles.mediacontaineritemimg} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                            </View>
                        </View>

                        <View style={{ ...Styles.mediacontainerhead }}>
                            <Text style={{ ...Styles.fontlight, ...Styles.fontsizenormal }}>January 2024</Text>
                            <Text style={{ ...Styles.fontprimary, ...Styles.fontsize }}>6</Text>
                        </View>
                        <View style={{ ...Styles.mediacontainer }}>
                            <View style={{ ...Styles.mediacontaineritem }}>
                                <Image style={Styles.mediacontaineritemimg} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                            </View>
                            <View style={{ ...Styles.mediacontaineritem }}>
                                <Image style={Styles.mediacontaineritemimg} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                            </View>
                            <View style={{ ...Styles.mediacontaineritem }}>
                                <Image style={Styles.mediacontaineritemimg} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                            </View>
                            <View style={{ ...Styles.mediacontaineritem }}>
                                <Image style={Styles.mediacontaineritemimg} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                            </View>
                            <View style={{ ...Styles.mediacontaineritem }}>
                                <Image style={Styles.mediacontaineritemimg} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                            </View>
                            <View style={{ ...Styles.mediacontaineritem }}>
                                <Image style={Styles.mediacontaineritemimg} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                            </View>
                            <View style={{ ...Styles.mediacontaineritem }}>
                                <Image style={Styles.mediacontaineritemimg} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                            </View>
                            <View style={{ ...Styles.mediacontaineritem }}>
                                <Image style={Styles.mediacontaineritemimg} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                            </View>
                            <View style={{ ...Styles.mediacontaineritem }}>
                                <Image style={Styles.mediacontaineritemimg} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                            </View>
                            <View style={{ ...Styles.mediacontaineritem }}>
                                <Image style={Styles.mediacontaineritemimg} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                            </View>
                        </View>

                        Links   --------------------
                        <View style={{ ...Styles.mediacontainerhead }}>
                            <Text style={{ ...Styles.fontlight, ...Styles.fontsizenormal }}>January 2024</Text>
                        </View>
                        <View style={{ ...Styles.medialinkitem }}>
                            <View style={{ ...Styles.medialinkitemtop }}>
                                <Image style={Styles.medialinkitemimg} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                                <View style={{ ...Styles.medialinkiteminfo }}>
                                    <Text style={{ ...Styles.fontBold }} numberOfLines={2} ellipsizeMode="tail">Lorem Ipsum is simply dummy text of the printing and typesetting industry</Text>
                                    <Text style={{ ...Styles.fontsizesmall, ...Styles.mtop2 }} numberOfLines={1} ellipsizeMode="tail">Lorem Ipsum is simply dummy text of the printing and typesetting industry</Text>
                                    <Text style={{ ...Styles.fontsizesmall, ...Styles.fontlight, ...Styles.mtop2 }} numberOfLines={1} ellipsizeMode="tail">www.youtube.com</Text>
                                </View>
                            </View>
                            <View style={{ ...Styles.medialinkitemmsg }}>
                                <Text style={{ ...Styles.medialinkitemmsgtxt, ...Styles.fontprimary }} numberOfLines={1}>View Message</Text>
                                <View style={{ ...Styles.icon20 }}>
                                    <Svg viewBox="0 0 24 24" style={{ ...Styles.iconprimary }}><Path d="M0 0h24v24H0V0z" fill="none" /><Path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" /></Svg>
                                </View>
                            </View>
                        </View>
                        <View style={{ ...Styles.medialinkitem }}>
                            <View style={{ ...Styles.medialinkitemtop }}>
                                <Image style={Styles.medialinkitemimg} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                                <View style={{ ...Styles.medialinkiteminfo }}>
                                    <Text style={{ ...Styles.fontBold }} numberOfLines={2} ellipsizeMode="tail">Lorem Ipsum is simply dummy text of the printing and typesetting industry</Text>
                                    <Text style={{ ...Styles.fontsizesmall, ...Styles.mtop2 }} numberOfLines={1} ellipsizeMode="tail">Lorem Ipsum is simply dummy text of the printing and typesetting industry</Text>
                                    <Text style={{ ...Styles.fontsizesmall, ...Styles.fontlight, ...Styles.mtop2 }} numberOfLines={1} ellipsizeMode="tail">www.youtube.com</Text>
                                </View>
                            </View>
                            <View style={{ ...Styles.medialinkitemmsg }}>
                                <Text style={{ ...Styles.medialinkitemmsgtxt, ...Styles.fontprimary }} numberOfLines={1}>View Message</Text>
                                <View style={{ ...Styles.icon20 }}>
                                    <Svg viewBox="0 0 24 24" style={{ ...Styles.iconprimary }}><Path d="M0 0h24v24H0V0z" fill="none" /><Path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" /></Svg>
                                </View>
                            </View>
                        </View>
                        <View style={{ ...Styles.mediacontainerhead }}>
                            <Text style={{ ...Styles.fontlight, ...Styles.fontsizenormal }}>December 2023</Text>
                        </View>
                        <View style={{ ...Styles.medialinkitem }}>
                            <View style={{ ...Styles.medialinkitemtop }}>
                                <Image style={Styles.medialinkitemimg} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                                <View style={{ ...Styles.medialinkiteminfo }}>
                                    <Text style={{ ...Styles.fontBold }} numberOfLines={2} ellipsizeMode="tail">Lorem Ipsum is simply dummy text of the printing and typesetting industry</Text>
                                    <Text style={{ ...Styles.fontsizesmall, ...Styles.mtop2 }} numberOfLines={1} ellipsizeMode="tail">Lorem Ipsum is simply dummy text of the printing and typesetting industry</Text>
                                    <Text style={{ ...Styles.fontsizesmall, ...Styles.fontlight, ...Styles.mtop2 }} numberOfLines={1} ellipsizeMode="tail">www.youtube.com</Text>
                                </View>
                                <View style={{ ...Styles.medialinkitemoption }}>
                                    <View style={{ ...Styles.radio, ...Styles.itemCenter }}></View>
                                </View>
                            </View>
                            <View style={{ ...Styles.medialinkitemmsg }}>
                                <Text style={{ ...Styles.medialinkitemmsgtxt, ...Styles.fontprimary }} numberOfLines={1}>View Message</Text>
                                <View style={{ ...Styles.icon20 }}>
                                    <Svg viewBox="0 0 24 24" style={{ ...Styles.iconprimary }}><Path d="M0 0h24v24H0V0z" fill="none" /><Path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" /></Svg>
                                </View>
                            </View>
                        </View>
                        <View style={{ ...Styles.medialinkitem }}>
                            <View style={{ ...Styles.medialinkitemtop }}>
                                <Image style={Styles.medialinkitemimg} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                                <View style={{ ...Styles.medialinkiteminfo }}>
                                    <Text style={{ ...Styles.fontBold }} numberOfLines={2} ellipsizeMode="tail">Lorem Ipsum is simply dummy text of the printing and typesetting industry</Text>
                                    <Text style={{ ...Styles.fontsizesmall, ...Styles.mtop2 }} numberOfLines={1} ellipsizeMode="tail">Lorem Ipsum is simply dummy text of the printing and typesetting industry</Text>
                                    <Text style={{ ...Styles.fontsizesmall, ...Styles.fontlight, ...Styles.mtop2 }} numberOfLines={1} ellipsizeMode="tail">www.youtube.com</Text>
                                </View>
                                <View style={{ ...Styles.medialinkitemoption }}>
                                    <View style={{ ...Styles.radioactive, ...Styles.itemCenter }}>{checkcircleIcon}</View>
                                </View>
                            </View>
                            <View style={{ ...Styles.medialinkitemmsg }}>
                                <Text style={{ ...Styles.medialinkitemmsgtxt, ...Styles.fontprimary }} numberOfLines={1}>View Message</Text>
                                <View style={{ ...Styles.icon20 }}>
                                    <Svg viewBox="0 0 24 24" style={{ ...Styles.iconprimary }}><Path d="M0 0h24v24H0V0z" fill="none" /><Path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" /></Svg>
                                </View>
                            </View>
                        </View>


                         Files -------------------
                        <View style={{ ...Styles.mediacontainerhead }}>
                            <Text style={{ ...Styles.fontlight, ...Styles.fontsizenormal }}>January 2024</Text>
                        </View>
                        <View style={{ ...Styles.mediafileitem }}>
                            <View style={{ ...Styles.mediafileitemimg, ...Styles.itemCenter }} >
                                <Image style={{ ...Styles.mediafileitemicon }} source={{ uri: '../assets/images/pdf.png' }} />
                            </View>
                            <View style={{ ...Styles.mediafileiteminfo }}>
                                <Text style={{ ...Styles.fontBold }} numberOfLines={2} ellipsizeMode="tail">Lorem Ipsum is simply dummy text of the printing and typesetting industry</Text>
                                <Text style={{ ...Styles.fontsizesmall, ...Styles.fontlight, ...Styles.mtop5 }}>09 Page &#x2022; 104 Kb Page &#x2022; Pdf  </Text>
                            </View>
                        </View>
                        <View style={{ ...Styles.mediafileitem }}>
                            <View style={{ ...Styles.mediafileitemimg, ...Styles.itemCenter }} >
                                <Image style={{ ...Styles.mediafileitemicon }} source={{ uri: '../assets/images/pdf.png' }} />
                            </View>
                            <View style={{ ...Styles.mediafileiteminfo }}>
                                <Text style={{ ...Styles.fontBold }} numberOfLines={2} ellipsizeMode="tail">Lorem Ipsum is simply dummy text of the printing and typesetting industry</Text>
                                <Text style={{ ...Styles.fontsizesmall, ...Styles.fontlight, ...Styles.mtop5 }}>09 Page &#x2022; 104 Kb Page &#x2022; Pdf  </Text>
                            </View>
                            <View style={{ ...Styles.mediafileitemoption }}>
                                <View style={{ ...Styles.radio, ...Styles.itemCenter }}></View>
                            </View>
                        </View>
                        <View style={{ ...Styles.mediafileitem }}>
                            <View style={{ ...Styles.mediafileitemimg, ...Styles.itemCenter }} >
                                <Image style={{ ...Styles.mediafileitemicon }} source={{ uri: '../assets/images/pdf.png' }} />
                            </View>
                            <View style={{ ...Styles.mediafileiteminfo }}>
                                <Text style={{ ...Styles.fontBold }} numberOfLines={2} ellipsizeMode="tail">Lorem Ipsum is simply dummy text of the printing and typesetting industry</Text>
                                <Text style={{ ...Styles.fontsizesmall, ...Styles.fontlight, ...Styles.mtop5 }}>09 Page &#x2022; 104 Kb Page &#x2022; Pdf  </Text>
                            </View>
                            <View style={{ ...Styles.mediafileitemoption }}>
                                <View style={{ ...Styles.radioactive, ...Styles.itemCenter }}>{checkcircleIcon}</View>
                            </View>
                        </View>
                    </View>
                </ScrollView>



                 Options : Apprear after click on select text -------------------
                <View style={{ ...Styles.optionbar }}>
                    <View style={{ ...Styles.optionbarinner }}>
                        <View style={{ ...Styles.optionbaricon, ...Styles.itemCenter }}>
                            <Svg viewBox="0 -960 960 960" style={{ ...Styles.iconlight, ...Styles.icon20 }}><Path d="m640-280-57-56 184-184-184-184 57-56 240 240-240 240ZM80-200v-160q0-83 58.5-141.5T280-560h247L383-704l57-56 240 240-240 240-57-56 144-144H280q-50 0-85 35t-35 85v160H80Z" /></Svg>
                        </View>
                        <View style={{ ...Styles.optionbaricon, ...Styles.optionbariconactive, ...Styles.itemCenter }}>
                            <Svg viewBox="0 0 24 24" style={{ ...Styles.iconprimary, ...Styles.icon20 }}><Path d="M19.333,14.667a4.66,4.66,0,0,0-3.839,2.024L8.985,13.752a4.574,4.574,0,0,0,.005-3.488l6.5-2.954a4.66,4.66,0,1,0-.827-2.643,4.633,4.633,0,0,0,.08.786L7.833,8.593a4.668,4.668,0,1,0-.015,6.827l6.928,3.128a4.736,4.736,0,0,0-.079.785,4.667,4.667,0,1,0,4.666-4.666ZM19.333,2a2.667,2.667,0,1,1-2.666,2.667A2.669,2.669,0,0,1,19.333,2ZM4.667,14.667A2.667,2.667,0,1,1,7.333,12,2.67,2.67,0,0,1,4.667,14.667ZM19.333,22A2.667,2.667,0,1,1,22,19.333,2.669,2.669,0,0,1,19.333,22Z" /></Svg>
                        </View>
                        <View style={{ ...Styles.optionbaricon, ...Styles.itemCenter }}>
                            <Svg viewBox="0 0 24 24" style={{ ...Styles.iconlight, ...Styles.icon20 }}><Path d="M23.836,8.794a3.179,3.179,0,0,0-3.067-2.226H16.4L15.073,2.432a3.227,3.227,0,0,0-6.146,0L7.6,6.568H3.231a3.227,3.227,0,0,0-1.9,5.832L4.887,15,3.535,19.187A3.178,3.178,0,0,0,4.719,22.8a3.177,3.177,0,0,0,3.8-.019L12,20.219l3.482,2.559a3.227,3.227,0,0,0,4.983-3.591L19.113,15l3.56-2.6A3.177,3.177,0,0,0,23.836,8.794Zm-2.343,1.991-4.144,3.029a1,1,0,0,0-.362,1.116L18.562,19.8a1.227,1.227,0,0,1-1.895,1.365l-4.075-3a1,1,0,0,0-1.184,0l-4.075,3a1.227,1.227,0,0,1-1.9-1.365L7.013,14.93a1,1,0,0,0-.362-1.116L2.507,10.785a1.227,1.227,0,0,1,.724-2.217h5.1a1,1,0,0,0,.952-.694l1.55-4.831a1.227,1.227,0,0,1,2.336,0l1.55,4.831a1,1,0,0,0,.952.694h5.1a1.227,1.227,0,0,1,.724,2.217Z" /></Svg>
                        </View>
                        <View style={{ ...Styles.optionbaricon, ...Styles.itemCenter }}>
                            <Svg viewBox="0 -960 960 960" style={{ ...Styles.iconlight, ...Styles.icon20 }}><Path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"></Path></Svg>
                        </View>
                    </View>
                </View>


            </View>
        </View>

        */
