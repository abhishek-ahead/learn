import { useContext } from "react";
import { View } from "react-native";
import { NAV_TABS } from "../../constant";
import { AppContext } from "../../context/app";
import Styles, { appStyle, mainStyle } from "../../styles";
import NewChat from "../chat/newChat";
import SearchChat from "../chat/searchChat";
import Header from "../header";
import NavBar from "../navbar";

const People = ({ navigation, route }) => {
  const { appNavigation, enableSearch, translation } = useContext(AppContext);
  appNavigation.current = navigation;
  return (
    // <ChatProvider navigation={navigation} archivePage={route?.params?.archive || false} newChatPage={route?.params?.newChat || false}>
    <View style={{ ...mainStyle, marginRight: 10 }}>
      <View style={{ ...Styles.chatBubble, ...appStyle }}>
        <View style={Styles.chatBubbleHeader}>
          {enableSearch ? (
            <SearchChat />
          ) : (
            <Header name={translation[NAV_TABS.people]} />
          )}
        </View>
        {/* Rendering active user  */}
        <NewChat />
        <NavBar />
      </View>
    </View>
    // </ChatProvider>
  );
};

export default People;
