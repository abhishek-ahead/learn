import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { PERMISSION, SCREEN } from "../../constant";
import { group } from "../../constant/icons";
import { AppContext } from "../../context/app";
import { newChatOpen } from "../../store/reducer";
import Styles from "../../styles/index";
import CreateNewGroup from "../group/createGroup";
import LoadingShimmer from "./loadingShimmer";
import NoResult from "../noResult";

// const inputAccessoryViewID = '123';
// const initialText = 'Stoke |';
// const [text, setText] = useState(initialText);

const NewChat = () => {
  const {
    chats,
    getNewChat,
    appNavigation,
    filter,
    translation,
    newCreateGroup,
    setNewCreateOpen,
    permissions,
  } = useContext(AppContext);
  const users = useSelector((state) => state.chats.users);
  const chatData = useSelector((state) => state.chats.data);
  const [frequentlyContacted, setFrequuentlyContacted] = useState([]);
  const [loadingNewChat, setLoadingNewChat] = useState(false);
  const dispatch = useDispatch();

  const handleNavigate = (id, screen) => {
    Platform.OS !== "web"
      ? appNavigation.current.navigate(screen, { id: id })
      : dispatch(newChatOpen({ id, screen }));
  };

  useEffect(() => {
    const chats = Object.values(chatData)
      .filter((chat) =>
        moment(chat.lastMessage?.createdAt)
          .startOf("D")
          .isSame(moment().startOf("D"))
      )
      .sort(
        (a, b) =>
          new Date(b?.lastMessage?.createdAt) -
          new Date(a?.lastMessage?.createdAt)
      )
      .slice(0, 2)
      .map((ele) => ele.chat);
    setFrequuentlyContacted(chats);
  }, [chatData]);

  useEffect(() => {
    if (!Object.keys(chatData).length) {
      setLoadingNewChat(true);
      getNewChat().finally(() => setLoadingNewChat(false));
    }
  }, []);

  const regex = new RegExp(filter, "i");
  const filterChat = filter
    ? chats.filter((chat) => regex.test(chat.name))
    : chats;

  return (
    <>
      <ScrollView>
        {/* {permissions.includes(PERMISSION.create_groups) ? (
          <Pressable
            onPress={() => setNewCreateOpen(true)}
            style={Styles.chatListItem}
          >
            <View
              style={{ ...Styles.chatListItemInner, ...Styles.borderbottom }}
            >
              <View
                style={{ ...Styles.chatListItemicon, ...Styles.itemCenter }}
              >
                {group}
              </View>
              <View style={Styles.chatListIteminfo}>
                <View style={Styles.chatListIteminfoTop}>
                  <Text style={Styles.chatListIteminfoTitle} numberOfLines={1}>
                    {translation.createNewGroup}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        ) : null} */}
        {!filter && frequentlyContacted.length ? (
          <>
            <View style={{ ...Styles.searchresultcontainer }}>
              <View style={{ ...Styles.searchresulthead }}>
                <Text style={{ ...Styles.fontBold, ...Styles.fontlight, ...Styles.fontdefault }}>
                  {translation.frequentlyContacted}
                </Text>
              </View>
            </View>
            {frequentlyContacted.map((chat) => (
              <Pressable
                onPress={() => handleNavigate(chat._id, SCREEN.message)}
                key={`frequent_contact_${chat._id}`}
                style={Styles.chatListItem}
              >
                <View style={Styles.chatListItemInner}>
                  <View style={Styles.chatListItemthumb}>
                    <Image
                      style={{ ...Styles.thumbImg, ...Styles.chatListItemthumbImg }}
                      source={{ uri: chat.avatar }}
                    />
                    {/* {users[chat._id]?.active && <View style={Styles.chatListItemStatus}></View>} */}
                  </View>
                  <View style={Styles.chatListIteminfo}>
                    <View style={Styles.chatListIteminfoTop}>
                      <Text
                        style={Styles.chatListIteminfoTitle}
                        numberOfLines={1}
                      >
                        {chat.name}
                      </Text>
                    </View>
                    {chat.about ? (
                      <View style={Styles.chatListIteminfoBtm}>
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={Styles.chatListIteminfoMsg}
                        >
                          {chat.about.about}{" "}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </Pressable>
            ))}
          </>
        ) : null}

        <View style={{ ...Styles.searchresultcontainer }}>
          <View style={{ ...Styles.searchresulthead }}>
            <Text style={{ ...Styles.fontBold, ...Styles.fontlight, ...Styles.fontdefault }}>
              {translation.chats}
            </Text>
          </View>
        </View>
        {filterChat.map((item, index) => {
          return (
            <View key={`new_chat_${item._id}`}>
              {(index == 0 ||
                chats[index].name[0].toLowerCase() !==
                  chats[index - 1].name[0].toLowerCase()) && (
                <View style={{ ...Styles.searchresultsep }}>
                  <Text
                    style={{
                      ...Styles.searchresultseptext,
                      ...Styles.fontBold,
                    }}
                  >
                    {item.name[0].toUpperCase()}
                  </Text>
                </View>
              )}
              <Pressable
                onPress={() => handleNavigate(item._id, SCREEN.message)}
                style={Styles.chatListItem}
              >
                <View
                  style={{ ...Styles.chatListItemInner, borderTopWidth: 0 }}
                >
                  <View style={Styles.chatListItemthumb}>
                    <Image
                      style={{ ...Styles.thumbImg, ...Styles.chatListItemthumbImg }}
                      source={{ uri: item.avatar }}
                    />
                    {users[item._id]?.active && (
                      <View style={Styles.chatListItemStatus}></View>
                    )}
                  </View>
                  <View style={Styles.chatListIteminfo}>
                    <View style={Styles.chatListIteminfoTop}>
                      <Text
                        style={Styles.chatListIteminfoTitle}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                    </View>
                    {item.about ? (
                      <View style={Styles.chatListIteminfoBtm}>
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={Styles.chatListIteminfoMsg}
                        >
                          {item.about.about}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </Pressable>
            </View>
          );
        })}
        {loadingNewChat ? <LoadingShimmer /> : null}
        {!loadingNewChat && !filterChat.length ? <NoResult /> : null}
        {/* <View style={{ ...Styles.searchresultsep }}>
                <Text style={{ ...Styles.fontsizeheading, ...Styles.fontBold }}>A</Text>
            </View>
            <View style={Styles.chatListItem}>
                <View style={{ ...Styles.chatListItemInner, borderTopWidth: 0 }}>
                    <View style={Styles.chatListItemthumb}>
                        <Image style={{ height: 45, width: 45, borderRadius: 50 }} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                        <View style={Styles.chatListItemStatus}></View>
                    </View>
                    <View style={Styles.chatListIteminfo}>
                        <View style={Styles.chatListIteminfoTop}>
                            <Text style={Styles.chatListIteminfoTitle} numberOfLines={1}>Aaron Burke</Text>
                        </View>
                        <View style={Styles.chatListIteminfoBtm}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={Styles.chatListIteminfoMsg}>
                                You can now call each other and view of the lake.
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={Styles.chatListItem}>
                <View style={Styles.chatListItemInner}>
                    <View style={Styles.chatListItemthumb}>
                        <Image style={{ height: 45, width: 45, borderRadius: 50 }} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                        <View style={Styles.chatListItemStatus}></View>
                    </View>
                    <View style={Styles.chatListIteminfo}>
                        <View style={Styles.chatListIteminfoTop}>
                            <Text style={Styles.chatListIteminfoTitle} numberOfLines={1}>Adam Kightney</Text>
                        </View>
                        <View style={Styles.chatListIteminfoBtm}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={Styles.chatListIteminfoMsg}>
                                You can now call each other and view of the lake.
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ ...Styles.searchresultsep }}>
                <Text style={{ ...Styles.fontsizeheading, ...Styles.fontBold }}>B</Text>
            </View>
            <View style={Styles.chatListItem}>
                <View style={{ ...Styles.chatListItemInner, borderTopWidth: 0 }}>
                    <View style={Styles.chatListItemthumb}>
                        <Image style={{ height: 45, width: 45, borderRadius: 50 }} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                        <View style={Styles.chatListItemStatus}></View>
                    </View>
                    <View style={Styles.chatListIteminfo}>
                        <View style={Styles.chatListIteminfoTop}>
                            <Text style={Styles.chatListIteminfoTitle} numberOfLines={1}>Bertha Phillips</Text>
                        </View>
                        <View style={Styles.chatListIteminfoBtm}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={Styles.chatListIteminfoMsg}>
                                You can now call each other and view of the lake.
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={Styles.chatListItem}>
                <View style={Styles.chatListItemInner}>
                    <View style={Styles.chatListItemthumb}>
                        <Image style={{ height: 45, width: 45, borderRadius: 50 }} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                        <View style={Styles.chatListItemStatus}></View>
                    </View>
                    <View style={Styles.chatListIteminfo}>
                        <View style={Styles.chatListIteminfoTop}>
                            <Text style={Styles.chatListIteminfoTitle} numberOfLines={1}>Blake Harrison</Text>
                        </View>
                        <View style={Styles.chatListIteminfoBtm}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={Styles.chatListIteminfoMsg}>
                                You can now call each other and view of the lake.
                            </Text>
                        </View>
                    </View>
                </View>
            </View> */}
      </ScrollView>
      {/* {Platform.OS !== "web" && <View style={Styles.alphabeticalFilters}>
                <View style={Styles.alphabeticalFiltersInner}>
                    <Text style={Styles.alphabeticalFiltersitem}>A</Text>
                    <Text style={Styles.alphabeticalFiltersitem}>B</Text>
                    <Text style={Styles.alphabeticalFiltersitem}>C</Text>
                    <Text style={Styles.alphabeticalFiltersitem}>D</Text>
                    <Text style={Styles.alphabeticalFiltersitem}>E</Text>
                    <Text style={Styles.alphabeticalFiltersitem}>F</Text>
                    <Text style={Styles.alphabeticalFiltersitem}>G</Text>
                    <Text style={Styles.alphabeticalFiltersitem}>H</Text>
                    <Text style={Styles.alphabeticalFiltersitem}>I</Text>
                    <Text style={Styles.alphabeticalFiltersitem}>J</Text>
                    <Text style={Styles.alphabeticalFiltersitem}>K</Text>
                    <Text style={Styles.alphabeticalFiltersitem}>L</Text>
                    <Text style={Styles.alphabeticalFiltersitem}>M</Text>
                    <Text style={Styles.alphabeticalFiltersitem}>N</Text>
                    <Text style={Styles.alphabeticalFiltersitem}>O</Text>
                    <Text style={Styles.alphabeticalFiltersitem}>P</Text>
                    <Text style={Styles.alphabeticalFiltersitem}>Q</Text>
                    <Text style={Styles.alphabeticalFiltersitem}>R</Text>
                    <Text style={Styles.alphabeticalFiltersitem}>S</Text>
                    <Text style={Styles.alphabeticalFiltersitem}>T</Text>
                    <Text style={Styles.alphabeticalFiltersitem}>U</Text>
                    <Text style={Styles.alphabeticalFiltersitem}>V</Text>
                    <Text style={Styles.alphabeticalFiltersitem}>W</Text>
                    <Text style={Styles.alphabeticalFiltersitem}>X</Text>
                    <Text style={Styles.alphabeticalFiltersitem}>Y</Text>
                    <Text style={Styles.alphabeticalFiltersitem}>Z</Text>
                </View>
            </View>} */}

      {newCreateGroup && (
        <CreateNewGroup
          visible={newCreateGroup}
          onClose={() => setNewCreateOpen(false)}
        />
      )}
    </>
  );
};

export default NewChat;
