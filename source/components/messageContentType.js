import { Text, View } from "react-native";
import { CONTENT_TYPE } from "../constant";
import { audiooutlinelight, cameraoutlinelight, deletedmsgicon, documentoutlinelight, videooutlinelight } from "../constant/icons";
import Styles from "../styles/index";
import { useContext } from "react";
import { AppContext } from "../context/app";

const MessageContentType = ({ message }) => {
  const { translation } = useContext(AppContext);
  switch (message.contentType) {
    case CONTENT_TYPE.image:
      return (
        <View style={Styles.chatListIteminfoBtmLeft}>
          <View style={{ ...Styles.icon, ...Styles.icon16 }}>{cameraoutlinelight}</View>
          <Text style={Styles.chatListIteminfoMsg}>
            {message.text || translation.photo}
          </Text>
        </View>
      );
    case CONTENT_TYPE.text:
      let text = message?.text;
      if (message.mentions && message.mentions.length) {
        message.mentions.forEach(
          (mention) =>
            (text = text.replace(`@${mention._id}`, `@${mention.name}`))
        );
      }
      return (
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={Styles.chatListIteminfoMsg}
        >
          {text}
        </Text>
      );
    case CONTENT_TYPE.application:
      return (
        <View style={Styles.chatListIteminfoBtmLeft}>
          <View style={{ ...Styles.icon, ...Styles.icon16 }}>{documentoutlinelight}</View>
          <Text style={Styles.chatListIteminfoMsg}>
            {message.text || translation.document}
          </Text>
        </View>
      );
      case CONTENT_TYPE.audio:
        return (
          <View style={Styles.chatListIteminfoBtmLeft}>
            <View style={{ ...Styles.icon, ...Styles.icon16 }}>{audiooutlinelight}</View>
            <Text style={Styles.chatListIteminfoMsg}>
              {message.text || translation.audio}
            </Text>
          </View>
        );
    case CONTENT_TYPE.video:
      return (
        <View style={Styles.chatListIteminfoBtmLeft}>
          <View style={{ ...Styles.icon, ...Styles.icon16 }}>
            {videooutlinelight}
          </View>
          <Text style={Styles.chatListIteminfoMsg}>
            {message.text || translation.video}
          </Text>
        </View>
      );
      case CONTENT_TYPE.deleted:
        return (
          <View style={Styles.chatListIteminfoBtmLeft}>
            <View style={{ ...Styles.icon, ...Styles.icon16 }}>
              {deletedmsgicon}
            </View>
            <Text style={Styles.chatListIteminfoMsg}>
              {message.text || translation.deleted}
            </Text>
          </View>
        );
    case CONTENT_TYPE.hidden:
      return <View style={Styles.chatListIteminfoMsg}></View>;
    default:
      return (
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={Styles.chatListIteminfoMsg}
        >
          {message.contentType}
        </Text>
      );
  }
};

export default MessageContentType;
