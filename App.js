/* eslint-disable react-hooks/exhaustive-deps */
import { useFonts } from "expo-font";
import { lazy, useCallback } from "react";
import { Dimensions, Platform } from "react-native";
import { MenuProvider } from "react-native-popup-menu";
import { Provider } from "react-redux";
import ConfirmationDialog from "./source/components/confirmDialog";
import ForwardModel from "./source/components/forward";
import MuteDialog from "./source/components/muteDialog";
import ToastNotification from "./source/components/toast";
import ViewImage from "./source/components/viewImage";
import { AppProvider } from "./source/context/app";
import { AuthProvider } from "./source/context/auth";
import { SocketProvider } from "./source/context/socket";
import Screen from "./source/pages/screen";
import WebView from "./source/pages/web";
import store from "./source/store";
import Socket from "./source/utils/socket";

const MainLazy = lazy(() => import("./source/pages/index"));
const ChatOpenLazy = lazy(() => import("./source/pages/chatOpen"));

const App = (props) => {
  const { token, user, chat_id } = props;
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
                ) : <WebView />}
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
