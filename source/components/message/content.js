import { ResizeMode, Video } from "expo-av";
import { useContext, useState } from "react";
import { ActivityIndicator, Image, Linking, Pressable, Text, View } from "react-native";
import { Path, Svg } from "react-native-svg";
import { CONTENT_TYPE, SCREEN } from "../../constant";
import { contactIcon, fileIcon, playIcon } from "../../constant/icons";
import { AppContext } from "../../context/app";
import { AuthContext } from "../../context/auth";
import { MessageContext } from "../../context/message";
import MessageContentType from "../messageContentType";
import TrackPlayer from "./trackPlayer";

const MessageContent = ({ message, color, chat }) => {
  const { setShowImage, translation, handleOpenNavigate, Styles } =
    useContext(AppContext);
  const { USER_ID } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(
    message?.text?.length > 350 ? false : true
  );
  const messageContext = useContext(MessageContext);
  const toggleExpanded = () => setExpanded((prev) => !prev);

  const getContentType = (message) => {
    let text = message?.text;
    if (message.mentions && message.mentions.length) {
      text = message.text.split(" ").map((word, index) => {
        const mention = message.mentions.find(
          (mention) => `@${mention._id}` === word
        );
        if (mention) {
          return (
            <Text
              onPress={() =>
                USER_ID != mention._id &&
                handleOpenNavigate(mention._id, SCREEN.profile)
              }
              key={index}
              style={{ ...Styles.fontlink }}
            >
              {" "}
              @{mention.name}
            </Text>
          );
        } else {
          return <Text key={index}> {word}</Text>;
        }
      });
    }
    switch (message.contentType) {
      case CONTENT_TYPE.text:
        return (
          <>
            {message.link ? (
              <Pressable
                onPress={() => Linking.openURL(message.link.url)}
                style={{ ...Styles.messageitemattachmentlink }}
              >
                <View style={Styles.messageitemattachmentlinkimg}>
                  <Image
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                    }}
                    source={{ uri: message.link.image }}
                  />
                </View>
                <View style={{ ...Styles.messageitemattachmentlinkinfo }}>
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
              </Pressable>
            ) : expanded ? (
              <Text style={{ ...Styles.messageitembodytext, color: color }}>
                {text}
              </Text>
            ) : (
              <>
                <Text
                  numberOfLines={10}
                  ellipsizeMode={"tail"}
                  style={{ ...Styles.messageitembodytext, color: color }}
                >
                  {text}
                </Text>
                <Pressable onPress={toggleExpanded}>
                  <Text
                    style={{
                      ...Styles.messageitembodytextmore,
                      ...Styles.fontsizesmall,
                    }}
                  >{`${translation.viewMore}...`}</Text>
                </Pressable>
              </>
            )}
          </>
        );
      case CONTENT_TYPE.image:
        return (
          <>
            <Pressable onPress={() => setShowImage({ ...message, chat })}>
              <Image
                style={{ ...Styles.messageitemattachmentphoto }}
                source={{ uri: message.media }}
                alt="No image"
              />
            </Pressable>
            {message.text ? (
              <Text
                style={{
                  ...Styles.messageitembodytext,
                  ...Styles.mtop5,
                  color: color,
                }}
              >
                {message.text}
              </Text>
            ) : null}
          </>
        );
      case CONTENT_TYPE.video:
        return (
          <>
            <Pressable onPress={() => setShowImage({ ...message, chat })}>
              <Video
                style={{ ...Styles.messageitemattachmentvideoitem }}
                videoStyle={{
                  ...Styles.messageitemattachmentvideoplayer,
                  ...Styles.bgdark
                }}
                source={{ uri: message.media }}
                useNativeControls={false}
                resizeMode={ResizeMode.COVER}
                isLooping={false}
                usePoster
              />
              {
                message.media ?
                  <View
                    style={{
                      ...Styles.mediacontaineritemvideoplay,
                      ...Styles.itemCenter,
                    }}
                  >
                    {playIcon({ fill: "#fff", height: 30, width: 30 })}
                  </View> :
                  <View
                    style={{
                      ...Styles.mediacontaineritemvideoplay,
                      ...Styles.itemCenter,
                    }}
                  >
                    <ActivityIndicator size="large" color="#fff" />
                  </View>
              }
            </Pressable>
            {/* <Video
              style={{ ...Styles.messageitemattachmentvideoitem }}
              videoStyle={{ ...Styles.messageitemattachmentvideoplayer }}
              source={{ uri: message.media }}
              useNativeControls
              resizeMode={ResizeMode.COVER}
              isLooping
              // onPlaybackStatusUpdate={status => setStatus(() => status)}
            /> */}
            {message.text ? (
              <Text style={{ color: color }}>{message.text}</Text>
            ) : null}
          </>
        );
      case CONTENT_TYPE.application:
        return (
          <Pressable onPress={() => Linking.openURL(message.media)}>
            <View style={{ ...Styles.messageitemattachment, ...Styles.fdrow }}>
              <View
                style={{
                  ...Styles.messageitemattachmentimg,
                  ...Styles.itemCenter,
                }}
              >
                <View style={{ ...Styles.messageitemattachmenticon }}>{fileIcon(Styles.iconwhite)}</View>
              </View>
              <View style={{ ...Styles.messageitemattachmentinfo }}>
                <Text style={{ ...Styles.fontBold, color: color }} numberOfLines={1} ellipsizeMode="tail">
                  {message.mediaDetails.originalname}
                </Text>
                <Text
                  style={{
                    ...Styles.fontsizesmall,
                    ...Styles.fontlight,
                    ...Styles.mtop2,
                  }}
                >
                  {Math.floor(message.mediaDetails.mediaSize / 1024)} Kb
                  &#x2022; {message.mediaDetails.mimetype.split("/")[1]}{" "}
                </Text>
              </View>
            </View>
            {message.text ? (
              <Text style={{ color: color, ...Styles.mtop5 }}>{message.text}</Text>
            ) : null}
          </Pressable>
        );
      case CONTENT_TYPE.location:
        return (
          <View style={{ ...Styles.messagemapitemattachment }}>
            <View style={{ ...Styles.messagemapitemattachmentimg }}>
              <Image
                style={{ ...Styles.messagemapitemattachmenticon }}
                source={{
                  uri: "https://i0.wp.com/www.cssscript.com/wp-content/uploads/2018/03/Simple-Location-Picker.png",
                }}
              />
            </View>
            <View style={{ ...Styles.messagemapitemattachmentinfo }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ ...Styles.fontBold, color: color }}
              >
                Villa Princesa
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ ...Styles.fontsizesmall, color: color }}
              >
                London, Uk
              </Text>
            </View>
          </View>
        );
      case CONTENT_TYPE.contact:
        return (
          <View style={Styles.messageitemattachmentcontact}>
            <View style={{ ...Styles.messageitemattachment }}>
              <View
                style={{
                  ...Styles.messageitemattachmentimg,
                  ...Styles.itemCenter,
                }}
              >
                <View style={{ ...Styles.messageitemattachmenticon }}>
                  {contactIcon(Styles.icondefault)}
                </View>
              </View>
              <View style={{ ...Styles.messageitemattachmentinfo }}>
                <Text style={{ ...Styles.fontBold, color: color }}>
                  Aaron Burke & 1 other
                </Text>
              </View>
            </View>
            <View style={{ ...Styles.messageitemattachmentfooter, borderColor: color, }}>
              <Text
                style={{
                  ...Styles.textcenter,
                  ...Styles.fontsizesmall,
                  color: color,
                }}
              >
                View All
              </Text>
            </View>
          </View>
        );
      case CONTENT_TYPE.deleted:
        return (
          <View
            style={{ ...Styles.messageitembodytext, ...Styles.messagedeleted }}
          >
            <Svg
              viewBox="0 0 24 24"
              style={{
                ...Styles.messagedeletedicon,
                ...Styles.iconlight,
                ...Styles.icon16,
                marginTop: 3,
              }}
            >
              <Path d="M0 0h24v24H0V0z" fill="none"></Path>
              <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"></Path>
            </Svg>
            <Text style={{ ...Styles.fontlight, fontStyle: "italic" }}>
              {translation.messageDeleted}
            </Text>
          </View>
        );
      case CONTENT_TYPE.audio:
        return (
          <>
            <View style={{ ...Styles.audiorecordedtrackwrap, width: 150 }}>
              <Image
                style={{ ...Styles.audiotrackimg }}
                source={{ uri: message.user.avatar }}
              />
              <TrackPlayer trackUri={message.media} playerOnly={true} />
            </View>
          </>
        );
      default:
    }
    return (
      <View style={Styles.messageitembodytext}>
        <Text style={{ fontStyle: "italic" }}>
          Content Type is {message.contentType}
        </Text>
      </View>
    );
  };

  const { reply } = message;

  return (
    <>
      {reply && !message.deleted ? (
        <Pressable
          onPress={() =>
            !reply.delete &&
            !reply.message_deleted &&
            messageContext?.handleFlatlistScroll(reply._id)
          }
          style={Styles.messageReply}
        >
          <View style={{ ...Styles.messageReplyitem }}>
            <View style={Styles.messageReplyiteminfo}>
              <Text style={{ ...Styles.messageReplyitemname, color: color }}>
                {reply.user._id == USER_ID ? translation.you : reply.user.name}
              </Text>
              <View style={Styles.messageReplyitemfooter}>
                <MessageContentType message={reply} />
              </View>
            </View>
            {reply.media ? (
              <View
                style={{
                  ...Styles.messageReplyitemimg,
                  ...{ height: 50, width: 50, borderRadius: 5 },
                }}
              >
                <Image
                  style={{ height: 50, width: 50, borderRadius: 5 }}
                  source={{ uri: reply.media }}
                />
              </View>
            ) : null}
          </View>
        </Pressable>
      ) : null}
      {getContentType(message)}
    </>
  );
};

export default MessageContent;
