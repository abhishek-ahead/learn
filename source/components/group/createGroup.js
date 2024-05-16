import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { Path, Svg } from "react-native-svg";
import { useSelector } from "react-redux";
import { GROUP_TYPE } from "../../constant";
import {
  checkcircleIcon,
  closeIcon,
  eyeIcon,
  eyeIconcrossed,
  rightArrowIcon,
  search,
} from "../../constant/icons";
import { AppContext } from "../../context/app";
import { createGroup } from "../../services/group";
import { webStyle } from "../../styles/index";
import NoResult from "../noResult";
const statusBarHeight = Constants.statusBarHeight;

const CreateNewGroup = ({ visible, onClose }) => {
  const { chats, translation, Styles } = useContext(AppContext);
  const users = useSelector((state) => state.chats.users);
  const [selected, setSelected] = useState({});
  const [text, setText] = useState("");
  const [page, setPage] = useState(0);
  const [required, setRequired] = useState(true);
  const [process, setProcess] = useState(false);
  const [inputData, setInputData] = useState({
    name: "",
    metadata: "",
    type: GROUP_TYPE.public,
    password: "",
  });

  const [showPassword, setShowPassword] = useState(true)
  const [image, setImage] = useState();

  const handleSelected = (item) => {
    setSelected((prev) => ({ ...prev, ...{ [item._id]: item } }));
  };

  const handleRemove = (id) => {
    setSelected((prev) => {
      const store = { ...prev };
      delete store[id];
      return store;
    });
  };

  const handleAvatarSelection = async () => {
    const images = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: false,
    });
    if (images.canceled) return;
    setImage(images.assets[0]);
  };

  const handleCreateGroup = async () => {
    setProcess(true);
    const data = new FormData();
    data.append("name", inputData.name);
    data.append("metadata", inputData.metadata);
    Object.keys(selected).forEach((ele) => data.append("users", ele));
    data.append("type", inputData.type);
    inputData.type == GROUP_TYPE.password_protected &&
      inputData.password &&
      data.append("password", inputData.password);
    if (image) {
      if (Platform.OS == "web") {
        const fileBlob = await fetch(image.uri).then((response) =>
          response.blob()
        );
        data.append("avatar", fileBlob, image.name);
      } else {
        data.append("avatar", {
          uri: image.uri,
          type: image.mimeType,
          name: image.name || image.fileName,
        });
      }
    }
    const response = await createGroup(data);
    response.success && onClose();
    setProcess(false);
  };

  useEffect(() => {
    let requiredValue = true;
    if (
      inputData.name &&
      inputData.metadata &&
      [
        GROUP_TYPE.public,
        GROUP_TYPE.private,
        GROUP_TYPE.password_protected,
      ].includes(inputData.type)
    ) {
      if (inputData.type == GROUP_TYPE.password_protected)
        if (inputData.password) {
          requiredValue = false;
        } else {
          requiredValue = true;
        }
      else requiredValue = false;
    }
    setRequired(requiredValue);
  }, [inputData]);

  const regex = new RegExp(text, "i");
  const filterChat = text
    ? chats.filter((chat) => regex.test(chat.name))
    : chats;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={Styles.modalContainer}>
        <KeyboardAvoidingView
          style={Styles.modalmain}
          keyboardVerticalOffset={Platform.OS == "ios" ? statusBarHeight : 0}
          behavior="padding"
        >
          <View style={Styles.modalheader}>
            <Pressable onPress={onClose} style={Styles.modalheaderOption}>
              <View style={Styles.modalheaderOptionicon}>
                <View style={{ ...Styles.icon, ...Styles.icon24 }}>
                  {closeIcon(Styles.icondefault)}
                </View>
              </View>
            </Pressable>
            <View style={Styles.modalheaderinfo}>
              <Text style={Styles.modalheadertitle}>
                {translation.createNewGroup}
              </Text>
            </View>
            <Pressable
              style={Styles.modalheaderOption}
              onPress={() =>
                page == 0
                  ? Object.values(selected).length && setPage(1)
                  : !required && handleCreateGroup()
              }
            >
              <View>
                {process ? (
                  <ActivityIndicator size={"small"} color="#6a6f75" />
                ) : (
                  <Text
                    style={
                      (page == 1 && !required) ||
                        (page == 0 && Object.values(selected).length)
                        ? Styles.fontprimary
                        : Styles.fontlight
                    }
                  >
                    {page == 0 ? translation.next : translation.done}
                  </Text>
                )}
                {/* <Text style={Styles.fontprimary}>Next</Text> */}
              </View>
            </Pressable>
          </View>
          {/* Step : 1 */}
          {page == 0 ? (
            <View style={{ ...Styles.appStyle, flex: 1 }}>
              {/* Search */}
              <View style={{ ...Styles.modalsearch }}>
                <View style={{ ...Styles.icon, ...Styles.icon24 }}>
                  {search(Styles.icondefault)}
                </View>
                <View style={{ ...Styles.searchboxtextbox }}>
                  <View style={{ ...Styles.searchboxtext }} />
                  <TextInput
                    autoFocus={Platform.OS == "web"}
                    style={{
                      ...Styles.forminputText,
                      ...webStyle,
                    }}
                    onChangeText={(text) => setText(text)}
                    value={text}
                    placeholder="Search"
                    placeholderTextColor={Styles.fontlight.color}
                  />
                </View>
                {text ? (
                  <Pressable
                    onPress={() => setText("")}
                    style={{ ...Styles.icon, ...Styles.icon24 }}
                  >
                    {closeIcon(Styles.icondefault)}
                  </Pressable>
                ) : null}
              </View>
              <ScrollView
                style={{
                  ...Styles.appStyle,
                  ...Styles.modalcontent,
                  // ...Styles.apprightspace,
                }}
              >
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
                        onPress={() =>
                          selected[item._id]
                            ? handleRemove(item._id)
                            : handleSelected(item)
                        }
                        style={Styles.chatListItem}
                      >
                        <View
                          style={{
                            ...Styles.chatListItemInner,
                            borderTopWidth: 0,
                          }}
                        >
                          <View style={Styles.chatListItemthumb}>
                            <Image
                              style={{
                                ...Styles.thumbImg,
                                ...Styles.chatListItemthumbImg,
                              }}
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
                          {selected[item._id] ? (
                            <View style={Styles.chatListItemRighticon}>
                              <View
                                style={{
                                  ...Styles.radioactive,
                                  ...Styles.itemCenter,
                                }}
                              >
                                {checkcircleIcon({ fill: "#fff", ...Styles.icon16 })}
                              </View>
                            </View>
                          ) : (
                            <View style={Styles.chatListItemRighticon}>
                              <View
                                style={{
                                  ...Styles.radio,
                                  ...Styles.itemCenter,
                                }}
                              ></View>
                            </View>
                          )}
                        </View>
                      </Pressable>
                    </View>
                  );
                })}
                {!filterChat.length ? <NoResult /> : null}
              </ScrollView>
              {/* Selected Users */}
              {Object.values(selected).length ? (
                <ScrollView
                  style={{
                    ...Styles.onlineUsers,
                    ...Styles.bordertop,
                    borderBottomWidth: 0,
                  }}
                  horizontal={true}
                >
                  {Object.values(selected).map((item) => (
                    <View
                      key={`selected_${item._id}`}
                      style={Styles.onlineUserItem}
                    >
                      <View style={Styles.onlineUserIteminner}>
                        <Image
                          style={{ ...Styles.onlineUserItemimg, ...Styles.thumbImg }}
                          source={{
                            uri: item.avatar,
                          }}
                        />
                        <Pressable
                          onPress={() => handleRemove(item._id)}
                          style={{
                            ...Styles.onlineUserItemClose,
                            ...Styles.icon20,
                          }}
                        >
                          {closeIcon(Styles.icondefault)}
                        </Pressable>
                      </View>
                      <Text style={Styles.onlineUserItemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              ) : null}
              {/* {Platform.OS !== "web" && (
                <View style={Styles.alphabeticalFilters}>
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
                </View>
              )} */}
            </View>
          ) : null}
          {page == 1 ? (
            <View>
              <ScrollView
                style={{
                  ...Styles.appStyle,
                  // ...Styles.modalcontent
                }}
              >
                {/* Group Info */}
                <View style={Styles.groupcreateInfo}>
                  <View style={Styles.groupcreateInfotop}>
                    <Pressable
                      style={{
                        ...Styles.groupcreateInfoimg,
                        ...Styles.itemCenter,
                      }}
                      onPress={handleAvatarSelection}
                    >
                      {image ? (
                        <Image
                          source={{ uri: image.uri }}
                          style={{ height: 70, width: 70 }}
                        />
                      ) : (
                        <View
                          style={{
                            ...Styles.groupcreateInfoIcon,
                            ...Styles.bgprimary,
                          }}
                        >
                          <Svg
                            viewBox="0 -960 960 960"
                            fill="#fff"
                            style={Styles.icon16}
                          >
                            <Path d="M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l50-54q11-12 26.5-19t32.5-7h170q17 0 32.5 7t26.5 19l50 54h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Z"></Path>
                          </Svg>
                        </View>
                      )}
                    </Pressable>
                    <View
                      style={{
                        ...Styles.groupcreateInfotitle,
                        ...Styles.forminput,
                      }}
                    >
                      <TextInput
                        autoFocus={Platform.OS == "web"}
                        style={{
                          ...Styles.forminputText,
                          ...webStyle,
                          width: "100%",
                        }}
                        placeholder={translation.title}
                        placeholderTextColor={Styles.fontlight.color}
                        onChangeText={(text) =>
                          setInputData((prev) => ({ ...prev, name: text }))
                        }
                        value={inputData.name}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      ...Styles.forminput,
                    }}
                  >
                    <TextInput
                      style={{
                        ...Styles.forminputText,
                        ...webStyle,
                        width: "100%",
                      }}
                      placeholder={translation.groupDescription}
                      placeholderTextColor={Styles.fontlight.color}
                      onChangeText={(text) =>
                        setInputData((prev) => ({ ...prev, metadata: text }))
                      }
                      value={inputData.metadata}
                      numberOfLines={2}
                      multiline={true}
                    />
                  </View>
                  <View
                    style={{
                      ...Styles.groupcreateInfoprivacy,
                      ...Styles.forminput,
                    }}
                  >
                    <Text style={Styles.forminputText}>Group Privacy</Text>
                    <SelectDropdown
                      data={[
                        {
                          title: translation.private,
                          value: GROUP_TYPE.private,
                        },
                        { title: translation.public, value: GROUP_TYPE.public },
                        {
                          title: translation.protected,
                          value: GROUP_TYPE.password_protected,
                        },
                      ]}
                      renderButton={(selectedItem, isOpen) => {
                        return (
                          <View style={{ ...Styles.formdropdownButtonStyle }}>
                            <Text
                              style={{
                                ...Styles.formdropdownButtonTxtStyle,
                                ...Styles.fontlight,
                              }}
                            >
                              {selectedItem?.title || translation.public}
                            </Text>
                            {rightArrowIcon({ ...Styles.icondefault, ...Styles.icon20 })}
                          </View>
                        );
                      }}
                      onSelect={(selectedItem) =>
                        setInputData((prev) => ({
                          ...prev,
                          type: selectedItem.value,
                        }))
                      }
                      renderItem={(item, index, isSelected) => {
                        return (
                          <View
                            style={{
                              ...Styles.formdropdownItemStyle,
                              ...(isSelected && {
                                ...Styles.formdropdownItemStyleseleted,
                              }),
                            }}
                          >
                            <Text
                              style={{ ...Styles.formdropdownItemTxtStyle }}
                            >
                              {item.title}
                            </Text>
                          </View>
                        );
                      }}
                    />
                  </View>
                  {inputData?.type == GROUP_TYPE.password_protected ? (
                    <View
                      style={{
                        ...Styles.groupcreateInfodes,
                        ...Styles.forminput,
                        alignItems: "center",
                      }}
                    >
                      <TextInput
                        secureTextEntry={showPassword}
                        style={{
                          ...Styles.forminputText,
                          ...webStyle,
                          width: "100%",
                        }}
                        placeholder={translation.groupPassword}
                        placeholderTextColor={Styles.fontlight.color}
                        onChangeText={(text) =>
                          setInputData((prev) => ({
                            ...prev,
                            password: text,
                          }))
                        }
                        value={inputData?.password}
                      />
                      <Pressable onPress={() => setShowPassword(prev => !prev)} style={{ ...Styles.forminputIcon, ...Styles.icon18, }}>
                        {!showPassword ? eyeIcon(Styles.iconlight) : eyeIconcrossed(Styles.iconlight)}
                      </Pressable>
                    </View>
                  ) : null}
                </View>

                {/* Selected Users */}
                <View style={{ ...Styles.searchresultsep }}>
                  <Text
                    style={{
                      ...Styles.searchresultseptext,
                      ...Styles.fontBold,
                    }}
                  >
                    Members
                  </Text>
                </View>
                <View
                  style={{ ...Styles.onlineUsers, flexWrap: "wrap", gap: 2 }}
                >
                  {Object.values(selected).map((item) => (
                    <View
                      key={`selected_${item._id}`}
                      style={Styles.onlineUserItem}
                    >
                      <View style={Styles.onlineUserIteminner}>
                        <Image
                          style={{ ...Styles.onlineUserItemimg, ...Styles.thumbImg }}
                          source={{
                            uri: item.avatar,
                          }}
                        />
                        {Object.values(selected).length > 1 ? (
                          <Pressable
                            onPress={() => handleRemove(item._id)}
                            style={{
                              ...Styles.onlineUserItemClose,
                              ...Styles.icon20,
                            }}
                          >
                            {closeIcon(Styles.icondefault)}
                          </Pressable>
                        ) : null}
                      </View>
                      <Text style={Styles.onlineUserItemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          ) : null}
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default CreateNewGroup;
