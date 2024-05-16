import { useContext } from "react";
import ChatMain from "../components/chat";
import { AppContext } from "../context/app";
import { ChatProvider } from "../context/chat";
import PasswordConfirmation from "../components/group/password";

const Chat = ({ navigation, route }) => {
  const { appNavigation } = useContext(AppContext);
  appNavigation.current = navigation;
  return (
    <ChatProvider
      navigation={navigation}
      archivePage={route?.params?.archive || false}
      newChatPage={route?.params?.newChat || false}
    >
      <ChatMain />
      <PasswordConfirmation />
    </ChatProvider>
  );
};

export default Chat;
