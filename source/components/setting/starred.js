import moment from "moment";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useDispatch } from "react-redux";
import MessageContent from "../../components/message/content";
import LoadingShimmer from "../../components/message/loadingShimmer";
import NoResult from "../../components/noResult";
import { CHAT_TYPE } from "../../constant";
import {
  backIcon,
  checkcircleIcon,
  starIcon,
  unstarredIcon,
  unstarredMessage,
} from "../../constant/icons";
import { AppContext } from "../../context/app";
import { AuthContext } from "../../context/auth";
import { SettingContext } from "../../context/setting";
import { deleteMessage, markUnstarred } from "../../services/message";
import { allStarredMessage } from "../../services/setting";
import { appStyle } from "../../styles";

const SettingStarred = ({ }) => {
  const dispatch = useDispatch();
  const [messages, setMessage] = useState([]);
  const { USER_ID } = useContext(AuthContext);
  const [enableEdit, setEnableEdit] = useState(false);
  const [selected, setSelected] = useState([]);
  const { setForwardOpen, setConfimationDialog, appNavigation, translation, Styles } =
    useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const settingContext = useContext(SettingContext);
  const moreRef = useRef(true);

  const handleSelected = (message) =>
    setSelected((selected) => {
      const prev = [...selected];
      const index = prev.findIndex(
        (ele) => String(ele._id) == String(message._id)
      );
      if (index == -1) {
        prev.push(message);
        return prev;
      } else {
        prev.splice(index, 1);
        return prev;
      }
    });

  const handleClearMessage = () => {
    setMessage((messages) =>
      messages.filter(
        (message) => !selected.some((ele) => message._id == ele._id)
      )
    );
  };

  const getGroupedData = () => {
    const unstarredMessage = {};
    selected.forEach((message) => {
      const chatId =
        message.receiverType == CHAT_TYPE.group
          ? message.receiver
          : message.sender == USER_ID
            ? message.receiver
            : message.sender;
      if (!unstarredMessage[chatId]) {
        unstarredMessage[chatId] = { chat: chatId, messages: [message._id] };
      } else {
        unstarredMessage[chatId].messages.push(message._id);
      }
    });
    return Object.values(unstarredMessage);
  };

  const handleStarredMessageDelete = (messages) => {
    getGroupedData().forEach((ele) => deleteMessage(ele));
    handleClearMessage();
    setEnableEdit(false);
  };

  const handleUnstarred = () => {
    getGroupedData().forEach((ele) => markUnstarred(ele));
    handleClearMessage();
    setEnableEdit(false);
  };

  const getMessages = async () => {
    setLoading(true);
    const lastMessage = messages.length
      ? messages[messages.length - 1]._id
      : null;
    const response = await allStarredMessage(lastMessage);
    if (response.success) {
      setMessage((prev) => [...prev, ...response.data]);
      moreRef.current = response.more;
    }
    setLoading(false);
  };

  useEffect(() => {
    getMessages();
  }, []);

  useEffect(() => {
    if (!enableEdit) setSelected([]);
  }, [enableEdit]);

  const handleChatClose = () => dispatch(chatClose(id));

  const handleBackNavigation = () =>
    Platform.OS !== "web"
      ? appNavigation.current.goBack()
      : settingContext.setOptionPage(null);

  return (
    <View style={appStyle}>
      <View style={{ ...Styles.chatBubble, ...appStyle }}>
        <View style={{ ...Styles.chatBubbleHeader }}>
          <Pressable
            onPress={handleBackNavigation}
            style={Styles.chatBubbleHeaderOption}
          >
            <View style={Styles.chatBubbleHeaderOptionIcon}>
              <View style={{ ...Styles.icon, ...Styles.icon24 }}>
                {backIcon(Styles.icondefault)}
              </View>
            </View>
          </Pressable>
          <View style={Styles.chatBubbleHeaderInfo}>
            <Text style={{ ...Styles.chatBubbleHeaderTitle }}>
              {translation.starredMessage}
            </Text>
          </View>
          {messages.length ? (
            <Pressable
              onPress={() => setEnableEdit((prev) => !prev)}
              style={Styles.chatBubbleHeaderOption}
            >
              <View>
                <Text style={{ ...Styles.fontprimary, ...Styles.cursor }}>
                  {enableEdit ? translation.done : translation.edit}
                </Text>
              </View>
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
            if (reachEnd && moreRef.current && !loading) getMessages();
          }}
        >
          {messages.length ? (
            <View style={{ flex: 1, ...appStyle, ...Styles.starmessages }}>
              {messages.map((message) => (
                <Pressable
                  onPress={() => enableEdit && handleSelected(message)}
                  key={`starred_${message._id}`}
                  style={{ ...Styles.starmessagesitem, ...Styles.borderbottom }}
                >
                  <View style={Styles.starmessagesitemmain}>
                    <View style={Styles.starmessagesitemhead}>
                      <Image
                        style={Styles.starmessagesitemheadimg}
                        source={{ uri: message.user.avatar }}
                      />
                      <View
                        style={{
                          ...Styles.starmessagesitemheadinfo,
                          ...Styles.fdrow,
                        }}
                      >
                        <Text style={{ ...Styles.font500, ...Styles.fontdefault }}>
                          {message.sender == USER_ID
                            ? "You"
                            : message.user.name.split(" ")[0]}
                        </Text>
                        <Text style={{ ...Styles.fontlight }}>&#x2022;</Text>
                        <Text style={{ ...Styles.fontdefault }}>
                          {message.receiver == USER_ID
                            ? "You"
                            : message.chat.name.split(" ")[0]}
                        </Text>
                      </View>
                      <Text
                        style={{
                          ...Styles.starmessagesitemheaddate,
                          ...Styles.fontsizesmall,
                          ...Styles.fontlight,
                        }}
                      >
                        {moment(message.createdAt).format("MMM D, YYYY")}
                      </Text>
                    </View>
                    <View
                      style={{ ...Styles.messageitemdetails, marginTop: 10 }}
                    >
                      <View
                        style={{
                          ...Styles.messageitemtop,
                          alignItems: "flex-start",
                        }}
                      >
                        <View style={Styles.messageitembody}>
                          <View
                            style={{
                              ...Styles.messageitembodyinner,
                              ...Styles.messageitembodyin,
                            }}
                          >
                            <MessageContent message={message} color={Styles.fontdefault.color} />
                            {/* <View style={{ ...Styles.messageitembodytext }}>
                                                            <Text style={{ padding: 0 }}>Hello, how are you?</Text>
                                                        </View> */}
                          </View>
                        </View>
                      </View>
                      <View style={{ ...Styles.messageitemfooter }}>
                        <View
                          style={{
                            ...Styles.messageitemfootericon,
                            ...Styles.icon12,
                          }}
                        >
                          {starIcon(Styles.iconlight)}
                        </View>
                        <Text
                          style={{
                            ...Styles.messageitemfootertime,
                            ...Styles.fontlight,
                            ...Styles.fontsizesmall,
                          }}
                        >
                          {moment(message.starredAt).format("MMM D, YYYY")}
                        </Text>
                      </View>
                    </View>
                    {enableEdit ? (
                      <View style={Styles.checkcircle}></View>
                    ) : null}
                    {selected.some((ele) => ele._id == message._id) ? (
                      <View
                        style={{
                          ...Styles.checkcircle,
                          ...Styles.checkcircleactive,
                          ...Styles.itemCenter,
                        }}
                      >
                        {checkcircleIcon({ fill: "#fff", ...Styles.icon16 })}
                      </View>
                    ) : null}
                  </View>
                </Pressable>
              ))}

              {/* <View style={Styles.starmessagesitem}>
                            <View style={Styles.starmessagesitemmain}>
                                <View style={Styles.starmessagesitemhead}>
                                    <Image style={Styles.starmessagesitemheadimg} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                                    <View style={{ ...Styles.starmessagesitemheadinfo, ...Styles.fdrow }}>
                                        <Text style={{ ...Styles.font500 }}>Beth Mooney</Text>
                                        <Text style={{ ...Styles.fontlight }}>&#x2022;</Text>
                                        <Text>You</Text>
                                    </View>
                                    <Text style={{ ...Styles.starmessagesitemheaddate, ...Styles.fontlight }}>
                                        09/08/2023
                                    </Text>
                                </View>
                                <View style={{ ...Styles.messageitemdetails, marginTop: 10 }}>
                                    <View style={{ ...Styles.messageitemtop, alignItems: "flex-start" }}>
                                        <View style={Styles.messageitembody}>
                                            <View style={{ ...Styles.messageitembodyinner, ...Styles.messageitembodyin }}>
                                                <View style={{ ...Styles.messageitembodytext }}>
                                                    <Text style={{ padding: 0 }}>Hello, how are you?</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ ...Styles.messageitemfooter }}>
                                        <View style={{ ...Styles.messageitemfootericon, ...Styles.icon12 }}>
                                            <Svg viewBox="0 -960 960 960" style={Styles.iconlight}><Path d="m233-80 65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Z" /></Svg>
                                        </View>
                                        <Text style={{ ...Styles.messageitemfootertime, ...Styles.fontlight, ...Styles.fontsizesmall }}>
                                            09/08/2023
                                        </Text>

                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={Styles.starmessagesitem}>
                            <View style={Styles.starmessagesitemleft}>
                                <View style={{ ...Styles.radioactive, ...Styles.itemCenter }}>{checkcircleIcon({ fill: "#fff", ...Styles.icon16 })}</View>
                            </View>
                            <View style={Styles.starmessagesitemmain}>
                                <View style={Styles.starmessagesitemhead}>
                                    <Image style={Styles.starmessagesitemheadimg} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                                    <View style={{ ...Styles.starmessagesitemheadinfo, ...Styles.fdrow }}>
                                        <Text style={{ ...Styles.font500 }}>You</Text>
                                        <Text style={{ ...Styles.fontlight }}>&#x2022;</Text>
                                        <Text>Beth Mooney</Text>
                                    </View>
                                    <Text style={{ ...Styles.starmessagesitemheaddate, ...Styles.fontlight }}>
                                        09/08/2023
                                    </Text>
                                </View>
                                <View style={{ ...Styles.messageitemdetails, marginTop: 10 }}>
                                    <View style={{ ...Styles.messageitemtop, alignItems: "flex-start" }}>
                                        <View style={Styles.messageitembody}>
                                            <View style={{ ...Styles.messageitembodyinner, ...Styles.messageitembodyin }}>
                                                <View style={Styles.messageitembodytext}>
                                                    <Text style={{ padding: 0 }}>Hello, how are you?</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ ...Styles.messageitemfooter }}>
                                        <View style={{ ...Styles.messageitemfootericon, ...Styles.icon12 }}>
                                            <Svg viewBox="0 -960 960 960" style={Styles.iconlight}><Path d="m233-80 65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Z" /></Svg>
                                        </View>
                                        <Text style={{ ...Styles.messageitemfootertime, ...Styles.fontlight, ...Styles.fontsizesmall }}>
                                            09/08/2023
                                        </Text>

                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={Styles.starmessagesitem}>
                            <View style={Styles.starmessagesitemleft}>
                                <View style={{ ...Styles.radio, ...Styles.itemCenter }}></View>
                            </View>
                            <View style={Styles.starmessagesitemmain}>
                                <View style={Styles.starmessagesitemhead}>
                                    <Image style={Styles.starmessagesitemheadimg} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                                    <View style={{ ...Styles.starmessagesitemheadinfo, ...Styles.fdrow }}>
                                        <Text style={{ ...Styles.font500 }}>Beth Mooney</Text>
                                        <Text style={{ ...Styles.fontlight }}>&#x2022;</Text>
                                        <Text>My Friends</Text>
                                    </View>
                                    <Text style={{ ...Styles.starmessagesitemheaddate, ...Styles.fontlight }}>
                                        09/08/2023
                                    </Text>
                                </View>
                                <View style={{ ...Styles.messageitemdetails, marginTop: 10 }}>
                                    <View style={{ ...Styles.messageitemtop, alignItems: "flex-start" }}>
                                        <View style={Styles.messageitembody}>
                                            <View style={{ ...Styles.messageitembodyinner, ...Styles.messageitembodyin }}>
                                                <View style={Styles.messageitembodytext}>
                                                    <Text style={{ padding: 0 }}>
                                                        Hello, how are you?
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ ...Styles.messageitemfooter }}>
                                        <View style={{ ...Styles.messageitemfootericon, ...Styles.icon12 }}>
                                            <Svg viewBox="0 -960 960 960" style={Styles.iconlight}><Path d="m233-80 65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Z" /></Svg>
                                        </View>
                                        <Text style={{ ...Styles.messageitemfootertime, ...Styles.fontlight, ...Styles.fontsizesmall }}>
                                            09/08/2023
                                        </Text>

                                    </View>
                                </View>
                            </View>
                        </View> */}
            </View>
          ) : null}
          {loading ? (
            <LoadingShimmer />
          ) : !messages.length ? (
            <NoResult />
          ) : null}
        </ScrollView>

        {/* Options : Apprear after click on select text */}
        {selected.length ? (
          <View style={{ ...Styles.optionbar }}>
            <View style={{ ...Styles.optionbarinner }}>
              <Pressable
                onPress={() => {
                  setForwardOpen(selected.map((sel) => sel._id));
                  setEnableEdit(false);
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
                onPress={handleUnstarred}
                style={{ ...Styles.optionbaricon, ...Styles.itemCenter }}
              >
                {unstarredIcon(Styles.icon20)}
              </Pressable>
              <Pressable
                onPress={() => {
                  setConfimationDialog({
                    heading: "Delete Message",
                    message: "Are you sure want to Delete these Message?",
                    callback: handleStarredMessageDelete,
                    chat: selected,
                  });
                  setEnableEdit(false);
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

export default SettingStarred;
