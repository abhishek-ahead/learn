import React, { useContext } from "react";
import { NativeModules, Platform, Pressable, Text, View } from "react-native";
import { NAV_TABS } from "../constant";
import {
  backIcon,
  closeIcon,
  downArrowIcon,
  search,
  upArrowIcon,
} from "../constant/icons";
import { AppContext } from "../context/app";
import { ChatContext } from "../context/chat";
import { SettingContext } from "../context/setting";
const { CircuitChat } = NativeModules;

const Header = ({ name }) => {
  const chatContext = useContext(ChatContext);
  const {
    minimize,
    setMinimize,
    handleSearchNav,
    appNavigation,
    tabNav,
    mobileView,
    Styles
  } = useContext(AppContext);
  const settingContext = useContext(SettingContext);
  const handleWebBack = () => {
    if (chatContext?.archive) chatContext.setArchive(false);
    else if (settingContext?.optionPage) settingContext.setOptionPage(null);
  };
  const handleAppBack = () => {
    if (chatContext?.archive || settingContext?.optionPage) {
      appNavigation.current.goBack();
    } else CircuitChat?.callFunction({ type: "back" });
  };
  const handleBack = () =>
    Platform.OS !== "web" ? handleAppBack() : handleWebBack();

  return (
    <>
      {Platform.OS !== "web" ||
        chatContext?.archive ||
        settingContext?.optionPage ? (
        <Pressable
          onPress={handleBack}
          style={Styles.chatBubbleHeaderOptionIcon}
        >
          <View style={{ ...Styles.icon, ...Styles.icon24 }}>{backIcon(Styles.icondefault)}</View>
        </Pressable>
      ) : null}
      <Pressable
        onPress={() =>
          Platform.OS == "web" && !mobileView
            ? setMinimize((prev) => !prev)
            : null
        }
        style={Styles.chatBubbleHeaderInfo}
      >
        <Text
          style={{
            ...Styles.chatBubbleHeaderTitle,
            ...Styles.chatBubbleHeaderHeading,
          }}
        >
          {name}
        </Text>
      </Pressable>
      <View style={Styles.chatBubbleHeaderOption}>
        {tabNav !== NAV_TABS.setting ? (
          <View style={Styles.chatBubbleHeaderOptionIcon}>
            <Pressable
              onPress={handleSearchNav}
              style={{ ...Styles.icon, ...Styles.icon24 }}
            >
              {search(Styles.icondefault)}
            </Pressable>
          </View>
        ) : null}
        {/* {(!archive && !newChat) ? <Pressable onPress={() => handlePageNav(SCREEN.newChat, { newChat: true })} style={Styles.chatBubbleHeaderOptionIcon}>
                    <View style={{ ...Styles.icon, ...Styles.icon24 }}>
                        {addIcon(Styles.icondefault)}
                    </View>
                </Pressable> : null} */}
        {Platform.OS == "web" && !mobileView ? (
          <Pressable
            onPress={() => setMinimize((prev) => !prev)}
            style={Styles.chatBubbleHeaderOptionIcon}
          >
            <View style={{ ...Styles.icon, ...Styles.icon24 }}>
              {minimize ? upArrowIcon(Styles.icondefault) : downArrowIcon(Styles.icondefault)}
            </View>
          </Pressable>
        ) : null}
        {Platform.OS == "web" && mobileView ? (
          <Pressable
            onPress={() => { }}
            style={Styles.chatBubbleHeaderOptionIcon}
          >
            <View style={{ ...Styles.icon, ...Styles.icon24 }}>
              {closeIcon(Styles.icondefault)}
            </View>
          </Pressable>
        ) : null}
      </View>
    </>
  );
};
export default Header;
