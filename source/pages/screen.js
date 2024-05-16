/* eslint-disable react-hooks/exhaustive-deps */
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext, useEffect, useRef } from "react";
import { NativeEventEmitter, NativeModules, Platform } from "react-native";
import People from "../components/people";
import AccountSetting from "../components/setting/account";
import NotificationSetting from "../components/setting/notification";
import PrivacySetting from "../components/setting/privacy";
import PrivacySettingOption from "../components/setting/privacyOptions";
import { SCREEN } from "../constant";
import { AppContext } from "../context/app";
import SafeArea from "../utils/SafeArea";
import Main, {
  Chat,
  ChatMedia,
  ChatProfile,
  ChatStarred,
  GroupMembers,
  GroupPendingRequest,
  GroupSetting,
  Message,
  SettingStarred,
} from "./index";
import { useDispatch } from "react-redux";
import { chatPassword } from "../store/reducer";

const Stack = createNativeStackNavigator();

export default ({ chat_id }) => {
  const { fetchChatDetails, getChatId } = useContext(AppContext);
  const navigationRef = useNavigationContainerRef();
  const previousRouteRef = useRef();
  const dispatch = useDispatch()

  // const [id, setId] = useState(null);
  // const [uid, setUid] = useState(null);

  const getId = async (uid) => {
    const data = getChatId(uid);
    if (data) {
      return data;
    } else {
      const response = await fetchChatDetails(uid);
      if (response.success) {
        return response.data;
      } else {
        return;
      }
    }
  };

  // useEffect(() => {
  //   console.log("use effect uid", uid);
  //   if (uid) getId();
  //   else {
  //     navigationRef.current.navigate(SCREEN.chat);
  //   }
  // }, [uid]);

  const handleRedirect = async (id, uid) => {
    if (!id && !uid) {
      navigationRef.current.navigate(SCREEN.chat);
      return;
    }
    let newID = id;
    if (uid && !id) {
      const data = await getId(uid);
      console.log(data, " ----- DATA ---");
      if (data) {
        newID = data.chat._id;
      }
    }
    if (newID)
      navigationRef.current.navigate(SCREEN.message, {
        id: newID,
        redirect: id ? false : true,
      });
    if (!newID) navigationRef.current.navigate(SCREEN.chat);
  };

  useEffect(() => {
    if (chat_id) {
      handleRedirect(chat_id, null);
    }

    if (Platform.OS != "web" && NativeModules?.CircuitChat) {
      const eventEmitter = new NativeEventEmitter(NativeModules?.CircuitChat);
      eventEmitter.addListener("CircuitChatEvents", (body) => {
        console.log("notification data", body);
        // setId(body.chat._id);
        handleRedirect(body.chat._id, null);
      });
      // response of above api
      // {"archived": false, "chat": {"_id": "65f175900114598c994c83d9", "active": true, "avatar": "https://demo.circuitchat.io/public/user/eb/02/b61f62eacb9f047e4d32bb12f486a3ba.png", "chatType": "user", "email": "vashist.mani@aheadsofttech.com", "lastActive": "2024-04-17T07:07:52.149Z", "name": "Vashist K Mani", "uid": 23, "verified": false}, "mute": false, "type": "CircuitChat"}
      eventEmitter.addListener("OpenUserChatScreen", (body) => {
        console.log("open user chat screen", body);
        handleRedirect(null, body.uid);
      });
      // response of above api
      // {"uid": 19}
    }
  }, []);

  return (
    <SafeArea>
      <NavigationContainer ref={navigationRef}
        onStateChange={() => {
          const current = navigationRef.getCurrentRoute();
          if (current.name == SCREEN.chat && [SCREEN.message, SCREEN.groupProfile].includes(previousRouteRef.current.name) && previousRouteRef.current.params?.id) {
            dispatch(chatPassword({ chat: previousRouteRef.current.params.id }))
          };
          previousRouteRef.current = current;
        }}>
        <Stack.Navigator initialRouteName={SCREEN.chat}>
          <Stack.Screen
            name={SCREEN.chat}
            component={Main}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={SCREEN.message}
            component={Message}
            options={{ headerShown: false }}
          // initialParams={{ id: id, redirect: id ? true : false }}
          />
          <Stack.Screen
            name={SCREEN.archive}
            component={Chat}
            initialParams={{ archive: true }}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={SCREEN.profile}
            component={ChatProfile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={SCREEN.groupProfile}
            component={ChatProfile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={SCREEN.media}
            component={ChatMedia}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={SCREEN.starred}
            component={ChatStarred}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={SCREEN.newChat}
            component={People}
            options={{ headerShown: false }}
            initialParams={{ newChat: true }}
          />
          <Stack.Screen
            name={SCREEN.account}
            component={AccountSetting}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={SCREEN.privacy}
            component={PrivacySetting}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={SCREEN.notification}
            component={NotificationSetting}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={SCREEN.settingStarred}
            component={SettingStarred}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={SCREEN.groupSetting}
            component={GroupSetting}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={SCREEN.groupMembers}
            component={GroupMembers}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={SCREEN.groupPendingRequest}
            component={GroupPendingRequest}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={SCREEN.privacyOption}
            component={PrivacySettingOption}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeArea >
  );
};
