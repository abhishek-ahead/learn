import { Platform } from "react-native";
import MessageMain from "../components/message";
import { MessageProvider } from "../context/message";

const Message = ({ navigation, route, id }) => {
  id = id || route.params.id;
  return (
    <MessageProvider
      navigation={navigation}
      id={id}
      redirected={Platform.OS !== "web" && route.params.redirect}
    >
      <MessageMain />
    </MessageProvider>
  );
};

export default Message;
