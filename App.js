/* eslint-disable react-hooks/exhaustive-deps */
import { useFonts } from "expo-font";
import { lazy, useCallback } from "react";
import { Dimensions, Platform, View } from "react-native";
import { MenuProvider } from "react-native-popup-menu";
import { Provider } from "react-redux";
import ConfirmationDialog from "./source/components/confirmDialog";
import ForwardModel from "./source/components/forward";
import MuteDialog from "./source/components/muteDialog";
import ViewImage from "./source/components/viewImage";
import { AppProvider } from "./source/context/app";
import { AuthProvider } from "./source/context/auth";
import { SocketProvider } from "./source/context/socket";
import Screen from "./source/pages/screen";
import store from "./source/store";
import Styles from "./source/styles";
import Socket from "./source/utils/socket";
import ToastNotification from "./source/components/toast";

const MainLazy = lazy(() => import("./source/pages/index"));
const ChatOpenLazy = lazy(() => import("./source/pages/chatOpen"));

const App = (props) => {
  const { token, user, chat_id } = props;
  console.log(
    " -------------------------------- WELCOME TO CIRCUIT CHAT --------------------------------"
  );

  const mobileView =
    Platform.OS == "web" && Dimensions.get("screen").width < 767 ? true : false;

  const [fontsLoaded, fontError] = useFonts({
    Roboto: require("./assets/fonts/Roboto/Roboto-Regular.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto/Roboto-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      // await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded || fontError) {
    console.log("Font error", fontError);
    return null;
  }

  return (
    <Provider store={store} onLayout={onLayoutRootView}>
      <AuthProvider clientToken={token} client={user}>
        <SocketProvider>
          <AppProvider mobileView={mobileView}>
            <MenuProvider>
              <Socket>
                {Platform.OS != "web" ? (
                  <Screen chat_id={chat_id} />
                ) : mobileView ? (
                  <ChatOpenLazy />
                ) : (
                  <View style={Styles.chatBubbleMain}>
                    {/* <Chat /> */}
                    <MainLazy />
                    <ChatOpenLazy />
                  </View>
                )}
                <ConfirmationDialog />
                <MuteDialog />
                <ViewImage />
                <ForwardModel />
              </Socket>
            </MenuProvider>
            <ToastNotification />
          </AppProvider>
        </SocketProvider>
      </AuthProvider>
    </Provider>
  );
};

export default App;
