import Constants from "expo-constants";
import { Dimensions, Platform, StatusBar, StyleSheet } from "react-native";

const mobileView =
  Platform.OS == "web" && Dimensions.get("screen").width < 767 ? true : false;

import { fontSize } from "../utils/helper";
// const primaryColor = "#1877f2";
export let appStyle = {};
if (Platform.OS != "web") {
  appStyle = {
    flex: 1,
    flexGrow: 1,
  };
}
export const mainStyle = {
  marginLeft: Platform.OS == "web" && !mobileView ? 10 : 0,
  ...appStyle,
};

export let webStyle = {};
if (Platform.OS == "web") {
  webStyle = { outline: "none" };
}

export var variables = {
  "primary-color": "#1877f2",
  "primary-color-soft": "#e7f0fd",
  "background-color": "#ffffff",
  "background-alt-color": "#f7f7f7",
  "background-alt-active-color": "#E1E1E1",
  "background-color-dark": "#111111",
  "search-background-color": "#f0f0f0",
  "chat-bubble-color": "#e4e6eb",
  "chat-bubble-color-alt": "#EBF9FF",
  "chat-item-border-radius": 10,
  "border-radius": 10,
  "border-color": "#f0f0f0",
  //  "main-shadow": "0 0 20px -5px rgba(0, 0, 0, .3)",
  "tabbar-background-color": "#f9f9f9",
  "font-color": "#050505",
  "font-light-color": "#8a8d91",
  "icon-color": "#6a6f75",
  "icon-color-light": "#8a8d91",
  "status-online": "#0ed00e",
  "danger-color": "#f00",
  "success-color": "#0ed00e",
  "primary-btn-color": "#1877f2",
  "primary-btn-color-hover": "#136de2",
  "primary-button-font-color": "#fff",
  "danger-btn-color": "#f44336",
  "danger-btn-color-hover": "#da3024",
  "composer-input-background": "#fff",
  "composer-input-border-color": "#e4e6eb",
  "side-spacing": 10,
  "item-spacing": 10,
  "font-size-small": fontSize(12),
  "link-color": "#057EFC",
  //  "composer-shadow": "0 0 10px -5px rgba(0, 0, 0, .3)"
};
if (0) {
  variables = {
    "primary-color": "#1877f2",
    "primary-color-soft": "#2d3034",
    "background-color": "#18191a",
    "background-alt-color": "#242526",
    "background-alt-active-color": "#E1E1E1",
    "background-color-dark": "#111111",
    "search-background-color": "#f0f0f0",
    "chat-bubble-color": "#242526",
    "chat-bubble-color-alt": "#242526",
    "chat-item-border-radius": 10,
    "border-radius": 10,
    "border-color": "#2d2f30",
    //  "main-shadow": "0 0 20px -5px rgba(0, 0, 0, .3)",
    "tabbar-background-color": "#242526",
    "font-color": "#e4e6eb",
    "font-light-color": "#b0b3b8",
    "icon-color": "#e4e6eb",
    "icon-color-light": "#b0b3b8",
    "status-online": "#0ed00e",
    "danger-color": "#f00",
    "success-color": "#0ed00e",
    "primary-btn-color": "#1877f2",
    "primary-btn-color-hover": "#136de2",
    "primary-button-font-color": "#fff",
    "danger-btn-color": "#f44336",
    "danger-btn-color-hover": "#da3024",
    "composer-input-background": "#18191a",
    "composer-input-border-color": "#2d2f30",
    "side-spacing": 10,
    "item-spacing": 10,
    "font-size-small": fontSize(12),
    "link-color": "#057EFC",
    //  "composer-shadow": "0 0 10px -5px rgba(0, 0, 0, .3)"
  };
}

const style = {
  body: {
    color: variables["font-color"],
    fontSize: fontSize(15),
    lineHeight: 1.5,
  },
  // Global CLasses
  font: {
    fontFamily: "Roboto",
  },
  fontBold: {
    fontFamily: "Roboto-Bold",
  },
  font500: {
    fontWeight: 500,
  },
  fontsizeheading: {
    fontSize: fontSize(17),
  },
  fontsizetitle: {
    fontSize: fontSize(15),
  },
  fontsizenormal: {
    fontSize: fontSize(14),
  },
  fontsizesmall: {
    fontSize: fontSize(12),
  },
  icon30: {
    height: 30,
    width: 30,
  },
  icon24: {
    height: 24,
    width: 24,
  },
  icon20: {
    height: 20,
    width: 20,
  },
  icon18: {
    height: 18,
    width: 18,
  },
  icon16: {
    height: 16,
    width: 16,
  },
  icon14: {
    height: 14,
    width: 14,
  },
  icon12: {
    height: 12,
    width: 12,
  },
  cursor: {
    ...Platform.select({ web: { cursor: "pointer" } }),
  },

  bgprimary: {
    backgroundColor: variables["primary-color"],
  },
  bg: {
    backgroundColor: variables["background-color"],
  },
  bgalt: {
    backgroundColor: variables["background-alt-color"],
  },
  bgprimarySoft: {
    backgroundColor: variables["primary-color-soft"],
  },
  bgdark: {
    backgroundColor: variables["background-color-dark"],
  },
  iconwhite: {
    fill: "#ffffff",
    height: "100%",
    width: "100%",
  },
  iconlight: {
    fill: variables["icon-color-light"],
    height: "100%",
    width: "100%",
  },
  icondefault: {
    fill: variables["icon-color"],
    height: "100%",
    width: "100%",
  },
  iconprimary: {
    fill: variables["primary-color"],
    height: "100%",
    width: "100%",
  },
  icondanger: {
    fill: variables["danger-color"],
    height: "100%",
    width: "100%",
  },
  iconsuccess: {
    fill: variables["success-color"],
    height: "100%",
    width: "100%",
  },
  fontdefault: {
    color: variables["font-color"],
  },
  fontlight: {
    color: variables["font-light-color"],
  },
  fontprimary: {
    color: variables["primary-color"],
  },
  fontlink: {
    color: variables["link-color"],
  },
  fontdanger: {
    color: variables["danger-color"],
  },
  fontsuccess: {
    color: variables["success-color"],
  },
  fontwhite: {
    color: "#fff",
  },
  textcenter: {
    textAlign: "center",
  },
  mr_3: {
    marginRight: -3,
  },
  mtop2: {
    marginTop: 2,
  },
  mtop5: {
    marginTop: 5,
  },
  mbot2: {
    marginBottom: 2,
  },
  mbot5: {
    marginBottom: 5,
  },
  mh10: {
    marginHorizontal: 10,
  },
  p10: {
    padding: 10,
  },
  badge: {
    backgroundColor: variables["primary-color"],
    display: "flex",
    justifyContent: "center",
    width: 18,
    height: 18,
    borderRadius: 50,
  },
  countbadge: {
    backgroundColor: variables["primary-color"],
    color: "#fff",
    minWidth: 20,
    height: 20,
    lineHeight: 18,
    borderRadius: 50,
    textAlign: "center",
    fontSize: variables["font-size-small"],
  },
  itemCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  fdrow: {
    flexDirection: "row",
  },
  alignItemsStart: {
    alignItems: "flex-start",
  },
  noshadow: {
    shadowOpacity: 0,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  nobg: {
    backgroundColor: "transprant",
  },
  noborder: {
    borderWidth: 0,
    borderColor: "transprant",
  },
  borderbottom: {
    borderBottomWidth: 1,
    borderColor: variables["border-color"],
  },
  apprightspace: {
    paddingRight: Platform.OS == "web" ? "auto" : 20,
  },
  // Buttons
  btn: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  btnOutline: {
    borderColor: variables["border-color"],
  },
  btnOutlineTxt: {
    borderColor: variables["font-color"],
  },
  btnPrimary: {
    backgroundColor: variables["primary-color"],
    borderColor: variables["border-color"],
  },
  btnPrimaryTxt: {
    color: "#fff",
  },
  btnalt: {
    backgroundColor: variables["background-alt-color"],
    borderRadius: variables["border-radius"],
  },
  btnrounded: {
    borderRadius: 50,
    height: 35,
    width: 35,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimarySoft: {
    backgroundColor: variables["primary-color-soft"],
  },
  /*Borders*/
  bordertop: {
    borderTopColor: variables["border-color"],
    borderTopWidth: 1,
    borderTopStyle: "solid",
  },
  thumbImg: {
    borderWidth: 1,
    borderColor: variables["border-color"],
    borderRadius: 50,
  },
  // Dropdown Menu
  dropdownMenu: {
    backgroundColor: variables["background-color"],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    position: "absolute",
    borderRadius: 5,
    paddingBottom: 10,
    paddingTop: 10,
    right: 0,
    minWidth: 200,
    zIndex: 1000,
  },

  // Modalbox
  modalContainer: {
    flex: 1,
    justifyContent: Platform.OS == "web" ? "center" : "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    cursor: Platform.OS == "web" ? "default" : undefined
    // padding: Platform.OS == "web" ? 15 : 0,
  },
  modalmain: {
    backgroundColor: variables["background-color"],
    borderRadius: Platform.OS == "web" ? 10 : 0,
    paddingVertical: 0,
    height:
      Platform.OS == "web"
        ? "auto"
        : Dimensions.get("window").height -
        (Platform.OS == "ios" ? Constants.statusBarHeight : 0),
    width:
      Platform.OS == "web" && !mobileView
        ? 500
        : Dimensions.get("window").width,
    marginLeft: "auto",
    marginRight: "auto",
    minHeight: 400,
    maxHeight:
      Platform.OS == "web"
        ? "80vh"
        : Dimensions.get("window").height -
        (Platform.OS == "ios" ? Constants.statusBarHeight : 0),
    maxWidth: Platform.OS == "web" ? "95%" : "100%",
  },
  modalheader: {
    borderBottomWidth: 1,
    borderBottomColor: variables["border-color"],
    height: 50,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: variables["side-spacing"],
    paddingRight: variables["side-spacing"],
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  modalheaderinfo: {
    flex: 1,
    flexGrow: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  modalheadertitle: {
    color: variables["font-color"],
    fontFamily: "Roboto-Bold",
    fontSize: fontSize(16),
    textAlign: "center",
    flex: 1,
  },
  modalheaderOption: {
    display: "flex",
    flexDirection: "row",
  },
  modalheaderOptionicon: {
    height: 32,
    width: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    // cursor: "pointer"
  },
  modalcontent: {
    // maxHeight: Platform.OS == "web" ? 500 : "auto",
    flex: 1,
  },
  modalsearch: {
    backgroundColor: variables["background-alt-color"],
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: variables["side-spacing"],
    marginVertical: variables["item-spacing"],
  },
  modalfooter: {
    paddingHorizontal: variables["side-spacing"],
    paddingVertical: variables["item-spacing"],
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  forwardMsgselectedusers: {
    borderTopWidth: 1,
    borderTopColor: variables["border-color"],
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: variables["side-spacing"],
    paddingVertical: 5,
    gap: 10,
  },
  forwardMsgbtn: {
    color: variables["link-color"],
  },

  // Comfirmation Modelbox
  confirmmodalmain: {
    minHeight: "inherit",
  },
  confirmmodalcontent: {
    paddingHorizontal: variables["side-spacing"],
    paddingVertical: variables["item-spacing"],
  },
  // Options Modal
  optionsmodalWrap: {
    borderRadius: variables["border-radius"],
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  optionsmodalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    boxShadow: 5,
    padding: 15,
  },
  optionsmodaloptions: {
    backgroundColor: variables["background-color"],
    borderRadius: 10,
    paddingVertical: 10,
  },
  optionsmodalheader: {
    marginBottom: variables["item-spacing"],
  },
  optionsmodalTitle: {
    color: variables["font-color"],
    fontFamily: "Roboto-Bold",
    fontSize: fontSize(16),
    textAlign: "center",
  },
  optionsmodaldes: {
    color: variables["font-color"],
    marginBottom: variables["item-spacing"],
  },
  optionsmodalitem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  optionsmodalitemicon: {
    marginRight: 10,
    height: 20,
    width: 20,
  },
  optionsmodalitemtext: {
    color: variables["font-color"],
    flex: 1,
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: variables["background-color"],
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 10,
    padding: 10,
  },
  cancelButtonText: {
    color: variables["font-color"],
  },
  // Option Header
  optionheader: {
    backgroundColor: variables["background-color"],
    borderRadius: 10,
    marginBottom: 10,
    paddingVertical: variables["item-spacing"],
    paddingHorizontal: variables["side-spacing"],
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  optionheaderowner: {
    borderRadius: 50,
    width: 40,
    height: 40,
  },
  optionheadermedia: {
    borderRadius: 5,
    width: 40,
    height: 40,
  },
  optionheaderInfo: {
    flex: 1,
    gap: 2,
  },
  optionheaderinfotitle: {
    flexDirection: "row",
    gap: 2,
  },
  optionheaderinfoname: {
    color: variables["font-color"],
    fontFamily: "Roboto-Bold",
  },
  optionheaderinfofooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  // Mute Modal
  mutemodalContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mutemodalContant: {
    borderRadius: variables["border-radius"],
    backgroundColor: variables["background-color"],
    padding: 20,
    width: "80%",
    ...Platform.select({ web: { maxWidth: 400 } }),
  },
  mutemodalHeading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  mutemodalDes: {
    marginBottom: 20,
  },
  muteoptionitem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 10,
    gap: 10,
  },

  // Tabs
  alttabs: {
    backgroundColor: variables["background-alt-color"],
    borderRadius: 10,
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
  },
  alttabsitem: {
    borderRadius: 10,
    flexGrow: 1,
    flexBasis: 0,
    alignItems: "center",
    justifyContent: "center",
    // cursor: "pointer",
    paddingTop: 10,
    paddingBottom: 10,
  },
  alttabsitemactive: {
    backgroundColor: variables["primary-color"],
  },
  alttabsitemtext: {
    color: variables["font-color"]
  },
  alttabsitemtextactive: {
    color: variables["primary-button-font-color"],
  },
  tabswrap: {
    paddingLeft: variables["side-spacing"],
    paddingRight: variables["side-spacing"],
    marginVertical: variables["item-spacing"],
  },
  tabs: {
    flexDirection: "row",
    gap: 10,
  },
  tabsitem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  tabsitemicon: {
    height: 16,
    width: 16,
  },
  tabsitemactive: {
    borderBottomColor: variables["primary-color"],
    borderBottomWidth: 2,
  },
  tabsitemactivetext: {
    color: variables["primary-color"],
  },
  // block
  block: {
    borderRadius: variables["border-radius"],
    backgroundColor: variables["background-color"],
    borderWidth: 1,
    borderColor: variables["border-color"],
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 0 },
    // shadowOpacity: 0.2,
    // shadowRadius: 2,
    // elevation: 5
  },
  blockheader: {
    borderBottomWidth: 1,
    borderBottomColor: variables["border-color"],
    paddingVertical: variables["item-spacing"],
    paddingHorizontal: 10,
  },
  // Shimmer Effect
  shimmerbox: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: variables["background-alt-color"],
  },
  // shimmerRecentmessages:{
  //   padding:variables["side-spacing"]
  // },
  shimmerRecentmessagesitem: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  shimmerRecentmessagesitemthumb: {
    borderRadius: 100,
    height: 45,
    width: 45,
    marginRight: 10,
  },
  shimmerRecentmessagesiteminfo: {
    flex: 1,
  },
  shimmerRecentmessagesitemrow: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  shimmerRecentmessagesitemline: {
    borderRadius: 10,
    height: 10,
  },
  shimmermessagesitem: {
    paddingLeft: variables["side-spacing"],
    paddingRight: variables["side-spacing"],
    paddingBottom: variables["item-spacing"],
    paddingTop: variables["item-spacing"],
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  shimmermessagesitemout: {
    justifyContent: "flex-end",
  },
  shimmermessagesitemthumb: {
    borderRadius: 50,
    height: 45,
    width: 45,
  },
  shimmermessagesitemmsg: {
    borderRadius: 20,
    height: 35,
    width: "50%",
  },
  // NAVBAR
  navbar: {
    backgroundColor: variables["tabbar-background-color"],
    borderTopColor: variables["border-color"],
    borderTopWidth: 1,
  },
  navbarInneer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navbarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 9,
    gap: 4,
  },
  // Chat Bubble
  chatBubbleMain: {
    // height: 0,
    bottom: 0,
    right: 0,
    overflow: "visible",
    display: "flex",
    flexDirection: "row-reverse",
    // flexWrap: "nowrap",
    alignItems: "flex-end",
    position: "fixed",
    zIndex: 999,
    flex: 1,
    width: Platform.OS == "web" ? 300 : Dimensions.get("window").width,
  },
  chatBubble: {
    backgroundColor: variables["background-color"],
    borderTopLeftRadius: Platform.OS == "web" ? 10 : 0,
    borderTopRightRadius: Platform.OS == "web" ? 10 : 0,
    display: "flex",
    height:
      Platform.OS == "web" && !mobileView
        ? 500
        : Dimensions.get("window").height,
    width:
      Platform.OS == "web" && !mobileView
        ? 300
        : Dimensions.get("window").width,
    maxWidth:
      Platform.OS == "web" && !mobileView
        ? 300
        : Dimensions.get("window").width,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  chatBubblemin: {
    backgroundColor: variables["background-color"],
    borderTopLeftRadius: Platform.OS == "web" ? 10 : 0,
    borderTopRightRadius: Platform.OS == "web" ? 10 : 0,
    display: "flex",
    height: Platform.OS == "web" ? 50 : Dimensions.get("window").height,
    width: Platform.OS == "web" ? 300 : Dimensions.get("window").width,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  // HEADER STYLE
  chatBubbleHeader: {
    //height: 50,
    paddingVertical: 5,
    paddingLeft: variables["side-spacing"],
    paddingRight: variables["side-spacing"],
    width: "100%",
    backgroundColor: variables["background-color"],
    borderTopLeftRadius: Platform.OS == "web" ? 10 : 0,
    borderTopRightRadius: Platform.OS == "web" ? 10 : 0,
    display: "flex",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
    flexDirection: "row",
    zIndex: 11,
    position: "relative",
  },
  chatBubbleHeaderUserInfo: {
    flex: 1,
    flexGrow: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  chatBubbleHeaderUserIcon: {
    marginRight: 10,
  },
  chatBubbleHeaderUserImg: {
    height: 40,
    width: 40
  },
  chatBubbleHeaderInfo: {
    flex: 1,
    height: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    overflow: "hidden",
    flexGrow: 1,
    minHeight: 40,
  },
  chatBubbleHeaderTitle: {
    fontFamily: "Roboto-Bold",
    fontSize: fontSize(16),
    color: variables["font-color"]
  },
  chatBubbleHeaderHeading: {
    fontFamily: "Roboto-Bold",
    fontSize: fontSize(20),
    color: variables["font-color"]
  },
  chatBubbleHeaderStatus: {
    color: variables["font-light-color"],
    fontSize: variables["font-size-small"],
  },
  chatBubbleHeaderOption: {
    display: "flex",
    flexDirection: "row",
  },
  chatBubbleHeaderOptionIcon: {
    height: 32,
    width: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    // cursor: "pointer"
  },
  chatBubbleHeaderOptionIconBack: {
    marginRight: 5,
  },
  // User List Horrizontal
  onlineUsers: {
    borderBottomColor: variables["border-color"],
    borderbottomWidth: 1,
    borderBottomStyle: "solid",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: "row",
    flexGrow: 0,
  },
  onlineUserItem: {
    textAlign: "center",
    paddingRight: 5,
    paddingLeft: 5,
    width: 60,
    gap: 5,
    marginVertical: 3,
  },
  onlineUserItemimg: {
    height: 50,
    width: 50,
  },
  onlineUserItemName: {
    color: variables["font-color"],
    fontSize: fontSize(12),
    textAlign: "center",
  },
  onlineUserItemClose: {
    backgroundColor: variables["background-color"],
    borderWidth: 1,
    borderColor: variables["border-color"],
    borderRadius: 100,
    padding: 3,
    position: "absolute",
    top: -3,
    right: -3,
  },
  // Chat List
  chatListItem: {
    backgroundColor: variables["background-color"],
    // height: Platform.OS == "web" ? "auto" : 80,
    paddingRight: variables["side-spacing"],
    paddingLeft: variables["side-spacing"],
    // cursor: 'pointer'
  },
  chatListItemInner: {
    borderTopColor: variables["border-color"],
    borderTopWidth: 1,
    paddingVertical: variables["item-spacing"],
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  chatListItemthumb: {
    position: "relative",
    height: 45,
    width: 45,
  },
  chatListItemthumbImg: {
    width: "100%",
    height: "100%"
  },
  chatListItemicon: {
    borderWidth: 1,
    borderColor: variables["border-color"],
    backgroundColor: variables["background-alt-color"],
    borderRadius: 50,
    height: 45,
    width: 45,
  },
  chatListItemStatus: {
    backgroundColor: variables["status-online"],
    position: "absolute",
    height: 12,
    width: 12,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    bottom: 0,
    right: 0,
    borderWidth: 1,
    borderColor: "#fff",
  },
  chatListIteminfo: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    gap: 1,
  },
  chatListIteminfoTop: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chatListIteminfoTitle: {
    flexGrow: 1,
    fontFamily: "Roboto-Bold",
    maxWidth: 150,
    fontSize: fontSize(15),
    color: variables["font-color"]
  },
  chatListItemOptions: {
    flexDirection: "row",
  },
  chatListItemTime: {
    color: variables["font-light-color"],
    fontSize: fontSize(12),
  },
  chatListIteminfoBtm: {
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    alignItems: "center",
    gap: 5,
  },
  chatListIteminfoBtmLeft: {
    flexDirection: "row",
    flexGrow: 1,
    alignItems: "center",
    gap: 5,
    flex: 1,
  },
  chatListIteminfoMsg: {
    fontSize: fontSize(14),
    color: variables["font-light-color"],
    width: 100,
    flex: 1,
    flexGrow: 1,
  },
  chatListItemswipoption: {
    backgroundColor: "#A9A9A9",
    flexDirection: "row",
  },
  chatListItemswipoptionItem: {
    width: 80,
  },
  chatListItemswipoptionItemicon: {
    height: 24,
    width: 24,
    marginBottom: 5,
  },
  chatListItemswipoptionItemtext: {
    color: "#fff",
    fontSize: 12,
  },
  chatListItemRighticon: {},
  chatListItemsbtns: {
    flexDirection: "row",
    gap: 10,
  },
  // User Info
  userinfo: {
    backgroundColor: variables["background-alt-color"],
  },
  userinfowrap: {
    gap: 5,
    paddingHorizontal: variables["side-spacing"],
    paddingVertical: variables["item-spacing"],
    overflow: "auto",
    width: "100%",
  },
  userinfotop: {
    alignItems: "center",
    marginBottom: 15,
  },
  userinfoname: {
    color: variables["font-color"],
    fontSize: fontSize(20),
    paddingTop: 15,
  },
  userinfotoplinks: {
    flexDirection: "row",
    gap: 20,
  },
  userinfotoplinksitem: {
    flexGrow: 1,
    flexBasis: 0,
    alignItems: "center",
    justifyContent: "center",
    // : "pointer",
    gap: 2,
    paddingVertical: 10,
  },
  userinfolinks: {
    marginBottom: 15,
  },
  userinfolinkitem: {
    borderTopColor: variables["border-color"],
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    // cursor: "pointer"
  },
  userinfolinkicon: {
    backgroundColor: variables["background-alt-color"],
    borderRadius: 50,
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  userinfolinkthumb: {
    borderRadius: 50,
    width: 40,
    height: 40,
    marginRight: 10,
  },
  userinfolinkcont: {
    flex: 1,
  },
  userinfolinktext: {
    color: variables["font-color"],
    flex: 1,
    fontSize: fontSize(14),
  },
  userinfolinkcount: {
    maxWidth: 150,
    fontSize: variables["font-size-small"]
  },

  // Chat Media Screen
  image150: {
    height: 150,
    width: 150,
    borderRadius: 100,
  },
  image80: {
    height: 80,
    width: 80,
    borderRadius: 100,
  },

  // Chat Media Screen
  chatmediawrap: {
    paddingLeft: variables["side-spacing"],
    paddingRight: variables["side-spacing"],
  },
  mediacontainerhead: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  mediacontainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginRight: -3,
    marginLeft: -3,
    marginBottom: 15,
    overflow: "auto",
  },
  mediacontaineritem: {
    width: "33.33%",
    paddingBottom: 3,
    paddingTop: 3,
    paddingRight: 3,
    paddingLeft: 3,
  },
  mediacontaineritemimg: {
    borderRadius: 5,
    aspectRatio: 1 / 1,
    width: "100%",
    position: "relative",
  },
  mediacontaineritemvideo: {
    borderRadius: 5,
    height: "100%",
    width: "100%",
  },
  mediacontaineritemvideoplay: {
    position: "absolute",
    height: "100%",
    width: "100%",
    zIndex: 1,
  },
  checkcircle: {
    backgroundColor: "#fff",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: variables["border-color"],
    position: "absolute",
    bottom: 10,
    right: 10,
    height: 20,
    width: 20,
  },
  checkcircleactive: {
    backgroundColor: variables["primary-color"],
    borderColor: variables["primary-color"],
  },
  radio: {
    backgroundColor: variables["background-color"],
    borderRadius: 50,
    borderWidth: 1,
    borderColor: variables["border-color"],
    height: 20,
    width: 20,
  },
  radioactive: {
    backgroundColor: variables["primary-color"],
    borderWidth: 1,
    borderColor: variables["primary-color"],
    borderRadius: 50,
    height: 20,
    width: 20,
    // cursor:"pointer"
  },
  medialinkitem: {
    borderRadius: variables["border-radius"],
    borderWidth: 1,
    borderColor: variables["border-color"],
    marginBottom: 10,
    overflow: "hidden",
  },
  medialinkitemtop: {
    backgroundColor: variables["background-alt-color"],
    flexDirection: "row",
  },
  medialinkitemimg: {
    aspectRatio: 1 / 1,
    width: 80,
  },
  medialinkiteminfo: {
    flex: 1,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  medialinkitemmsg: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    // cursor:"pointer",
  },
  medialinkitemmsgtxt: {
    flex: 1,
  },
  medialinkitemoption: {
    marginRight: 10,
    justifyContent: "center",
  },

  mediafileitem: {
    backgroundColor: variables["background-alt-color"],
    borderRadius: variables["border-radius"],
    padding: 10,
    overflow: "hidden",
    flexDirection: "row",
    marginBottom:10
  },
  mediafileitemimg: {
    borderRadius: variables["border-radius"],
    backgroundColor: "#da7775",
    aspectRatio: 1 / 1,
    width: 50,
    marginRight: 10,
    padding: 10,
  },
  mediafileitemicon: {
    height: 60,
    width: 60,
  },
  mediafileiteminfo: {
    flex: 1,
  },
  mediafileitemoption: {
    marginLeft: 10,
    justifyContent: "center",
  },

  // Bottom Option Menu
  optionbar: {
    backgroundColor: "#fff",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },
  optionbarinner: {
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionbaricon: {
    backgroundColor: variables["background-alt-color"],
    borderRadius: 100,
    height: 40,
    width: 40,
  },
  optionbariconactive: {
    backgroundColor: variables["background-alt-active-color"],
  },

  // Search Screen
  searchboxhead: {
    flex: 1,
  },
  searchbox: {
    backgroundColor: variables["background-alt-color"],
    borderRadius: 10,
    padding: 10,
    // marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  searchboxback: {
    marginRight: 5,
  },
  searchtype: {
    backgroundColor: variables["background-alt-active-color"],
    borderRadius: 3,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginRight: 5,
    padding: 5,
  },
  searchtypeicon: {
    marginRight: 2,
  },
  searchboxtextbox: {
    flex: 1,
  },
  searchboxtext: {
    borderWidth: 0,
  },
  searchtypecontainer: {
    // display:"block",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  selectsearchtypewrap: {
    padding: "1%",
    ...Platform.select({
      web: {
        width: "auto",
      },
      default: {
        width: "32%",
      },
    }),
  },
  selectsearchtype: {
    borderRadius: 15,
    backgroundColor: variables["background-alt-color"],
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    whiteSpace: "nowrap",
  },
  selectsearchtypeicon: {
    alignItems: "center",
    justifyContent: "center",
    width: 16,
    height: 16,
  },
  selectsearchtypetext: {
    flex: 1,
    fontSize: 12,
  },
  searchresulthead: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: variables["side-spacing"],
    marginRight: variables["side-spacing"],
  },
  searchresultsep: {
    backgroundColor: variables["background-alt-color"],
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: variables["side-spacing"],
    paddingRight: variables["side-spacing"],
  },
  searchresultseptext: {
    fontSize: variables["font-size-small"],
    color: variables["font-color"]
  },
  searchmediacontainer: {
    paddingLeft: variables["side-spacing"],
    paddingRight: variables["side-spacing"],
  },
  searchnoresult: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 50,
    paddingBottom: 50,
  },
  searchnoresulticon: {
    marginHorizontal: "auto",
    marginBottom: 20,
    opacity: 0.5,
    ...Platform.select({
      web: {
        height: 60,
        width: 60,
      },
      default: {
        height: 70,
        width: 70,
      },
    }),
  },
  searchnoresultText: {
    color: variables["font-light-color"],
    fontWeight: "bold",
    fontSize: fontSize(16),
    opacity: 0.5,
  },
  searchitem: {
    borderTopWidth: 1,
    borderTopColor: variables["border-color"],
    marginLeft: variables["side-spacing"],
    marginRight: variables["side-spacing"],
    paddingTop: 10,
  },
  searchitemhead: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 5,
    flexWrap: "wrap",
  },
  searchitemtitle: {
    flex: 1,
    flexDirection: "row",
    gap: 5,
  },
  searchitemdes: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "center",
  },
  searchitemdesicon: {
    marginLeft: 3,
    marginRight: 3,
  },
  searchitemattachment: {
    backgroundColor: variables["background-alt-color"],
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
  },
  searchitemattachmentimg: {
    backgroundColor: variables["background-color"],
    borderRadius: variables["border-radius"],
    borderWidth: 1,
    borderColor: variables["border-color"],
    aspectRatio: 1 / 1,
    width: 60,
    marginRight: 10,
    padding: 20,
  },
  searchitemattachmenticon: {
    height: 40,
    width: 40,
  },
  searchitemattachmentinfo: {
    flex: 1,
  },
  searchitemwrap: {
    marginBottom: 10,
  },
  searchitemaudio: {
    borderRadius: variables["border-radius"],
    backgroundColor: variables["background-alt-color"],
    padding: variables["item-spacing"],
  },
  // Auto Suggest
  composerAutosuggest: {
    // padding: 10,
    position: "absolute",
    left: -1,
    right: -1,
  },
  composerAutosuggestinner: {
    backgroundColor: variables["composer-input-background"],
    borderColor: variables["composer-input-border-color"],
    borderWidth: 1,
    borderBottomWidth: 0,
    borderTopLeftRadius: variables["border-radius"],
    borderTopRightRadius: variables["border-radius"],
    maxHeight: 250,
    // overflow:"auto",
    paddingVertical: 5,
  },
  composerAutosuggesItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  composerAutosuggesItemActive: {
    backgroundColor: variables["primary-color-soft"],
    // padding: 5,
  },
  // Composer
  composermain: {
    borderTopWidth: 1,
    borderTopColor: variables["border-color"],
    backgroundColor: variables["tabbar-background-color"],
    // paddingVertical: 8,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingVertical: 10,
    paddingHorizontal: 5
    // maxHeight: 150,
    // height: height + 20,
  },
  composermainoption: {
    height: 40,
    width: 40,
  },
  composerinputwrap: {
    backgroundColor: variables["composer-input-background"],
    borderColor: variables["composer-input-border-color"],
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
    flexGrow: 1,
    borderRadius: 30,
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 10,
    gap: 5,
  },
  composerinputautosuggest: {
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  composerinput: {
    color: variables["font-color"],
    width: "100%",
  },
  composeroptions: {
    backgroundColor: variables["background-color"],
    borderTopWidth: 1,
    borderTopColor: variables["border-color"],
    paddingLeft: variables["side-spacing"],
    paddingRight: variables["side-spacing"],
    paddingTop: variables["item-spacing"],
    paddingBottom: variables["item-spacing"],
    flexDirection: "row",
    gap: 10,
  },
  composeroptionsitem:{
    alignItems:"center",
    width: 60,
    gap:3,
  },
  composeroptionsitemicon: {
    backgroundColor: variables["background-alt-color"],
    borderRadius: 50,
    height: 40,
    width: 40,
  },
  composeroptionsitemtext:{
    fontSize:variables["font-size-small"],
    color:variables["font-light-color"],
    textAlign:"center",
  },
  composerattachmentcontainer: {
    borderTopWidth: 1,
    borderTopColor: variables["border-color"],
    paddingLeft: variables["side-spacing"],
    paddingRight: variables["side-spacing"],
    flexDirection: "row",
  },
  composerattachmentitem: {
    position: "relative",
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10,
    width: 40,
  },
  composerattachmentitemimg: {
    backgroundColor: variables["background-alt-color"],
    borderWidth: 1,
    borderColor: variables["border-color"],
    borderRadius: 5,
    height: 40,
    width: 40,
  },
  composerattachmentitemicon: {
    backgroundColor: variables["background-color"],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 100,
    padding: 2,
    position: "absolute",
    top: -5,
    right: -5,
  },

  // Audio Recored
  audiorecordwrap: {
    flex: 1,
    flexDirection: "row",
  },
  audiorecordmain: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    // gap:5,
  },
  audiorecorddot: {
    backgroundColor: "#f00",
    borderRadius: 50,
    height: 8,
    width: 8,
  },
  audiorecorded: {
    flex: 1,
    gap: 2,
    top: 8,
    // paddingHorizontal:variables["side-spacing"],
  },
  audiorecordedtrackwrap: {
    flexDirection: "row",
    marginBottom: 10,
  },
  audiotrackimg: {
    borderRadius: 50,
    height: 25,
    width: 25,
  },
  audiorecordedtrack: {
    borderRadius: 3,
    backgroundColor: variables["font-color"],
    height: 6,
    width: "100%",
  },
  audiorecordedtrackprocess: {
    backgroundColor: variables["primary-color"],
    borderRadius: 3,
    height: 6,
    minWidth: 10,
  },
  audiorecordedtrackprocesshandle: {
    backgroundColor: variables["primary-color"],
    borderRadius: 10,
    height: 10,
    width: 10,
    right: 0,
    // left:0,
    position: "absolute",
    top: -2,
  },
  audiorecordedtime: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  composerReply: {
    borderTopColor: variables["border-color"],
    borderTopWidth: 1,
    paddingVertical: variables["item-spacing"],
    paddingHorizontal: variables["side-spacing"],
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  composerReplyinfo: {
    flex: 1,
    gap: 2,
  },
  composerReplyinfotitle: {
    color:variables["font-light-color"],
    flexDirection: "row",
    gap: 2,
  },
  composerReplyinfoname: {
    color:variables["font-color"]
  },
  composerReplyinfofooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  // User Chat
  messagenotification: {
    marginVertical: variables["item-spacing"],
    alignItems: "center",
  },
  messagenotificationInner: {
    borderRadius: 5,
    backgroundColor: variables["background-alt-color"],
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  messagenotificationsub: {
    color: variables["link-color"],
  },
  messagedate: {
    borderBottomColor: variables["border-color"],
    borderBottomWidth: 1,
    height: 1,
    marginVertical: variables["item-spacing"],
    justifyContent: "center",
    flexDirection: "row",
    width: "100%",
  },
  messagedatetext: {
    backgroundColor: variables["background-color"],
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: -8,
    height: 16,
  },
  messageitem: {
    paddingVertical: variables["item-spacing"],
    paddingHorizontal: variables["side-spacing"],
  },
  messageiteminner: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  messageitemthumb: {
    height: 30,
    width: 30,
    ...Platform.select({
      web: {
        height: 30,
        width: 30,
      },
    }),
  },
  messageitemthumbicon: {
    borderRadius: 50,
    height: "100%",
    width: "100%",
  },
  messageiteminnerhl: {
    backgroundColor: "#000",
  },
  messageitemdetails: {
    flex: 1,
  },
  messageitemtop: {
    alignItems: "center",
  },
  messageitembody: {
    alignItems: "center",
    maxWidth: "85%",
    ...Platform.select({
      web: {
        maxWidth: 220,
      },
    }),
  },
  messageitembodyin: {
    alignItems: "flex-start",
    // paddingRight: 45,
  },
  messageitembodyout: {
    alignItems: "flex-end",
    // paddingLeft: 45,
  },
  msgforwarded: {
    flexDirection: "row",
    gap: 2,
    marginBottom: 5,
    marginTop: -5,
  },
  msgforwardedicon: {
    marginTop: 2,
  },
  messageitembodyinner: {
    borderRadius: variables["chat-item-border-radius"],
    padding: 10,
  },
  messageitembodyinnerin: {
    justifyContent: "flex-start",
    backgroundColor: variables["chat-bubble-color"],
  },
  messageitembodyinnerout: {
    justifyContent: "flex-end",
    backgroundColor: variables["chat-bubble-color-alt"],
  },
  messageitemname: {
    color: variables["link-color"],
    marginBottom: 2,
    marginTop: -7,
  },
  messageitembodytext: {
    ...Platform.select({
      web: {
        wordBreak: "break-word",
        maxWidth: 160,
      },
    }),
  },
  messageitembodytextmore: {
    color: variables["link-color"],
  },
  messageitemfooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    height: 18,
    gap: 3,
    marginBottom: -5,
  },
  messageitemfootertime:{
    fontSize:11,
  },
  messageitemOptions: {
    flexDirection: "row",
    gap: 5,
  },
  messageitemOptionsout: {
    flexDirection: "row-reverse",
    left: 0,
  },
  messageitemOptionsin: {
    flexDirection: "row",
    right: 0,
  },
  messageitemOptionicon: {
    height: 16,
    width: 16,
  },
  messageitembodyreactions: {
    borderWidth: 1,
    borderColor: variables["border-color"],
    backgroundColor: variables["background-color"],
    padding: 2,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    position: "absolute",
    bottom: -13,
  },
  messageitembodyreactionsin: {
    left: 5,
  },
  messageitembodyreactionsout: {
    right: 5,
  },
  messageitembodyreactionsitem: {
    height: 16,
    width: 16,
  },
  messageitembodyreactionsitemimg: {
    height: "100%",
    width: "100%",
  },
  reactionOption: {
    backgroundColor: variables["background-color"],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    position: "fixed",
    borderRadius: 20,
    flexDirection: "row",
    padding: 5,
    gap: 5,
    zIndex: 1000,
  },
  /*Message Item Attachments*/
  messageitemattachment: {
    alignItems: "center",
    flexWrap: "wrap",
    flexDirection: "row",
    gap: 5,
  },
  messageitemattachmentimg: {
    backgroundColor: "#da7775",
    borderRadius: 100,
    aspectRatio: 1 / 1,
    width: 40,
    padding: 10,
  },
  messageitemattachmenticon: {
    height: 20,
    width: 20,
  },
  messageitemattachmentinfo: {
    marginRight: 10,
    maxWidth: Platform.OS == "web" ? 90 : 200,
  },
  messageitemattachmentfooter: {
    borderTopWidth: 1,
    marginTop: 5,
    paddingTop: 5,
    marginBottom: 10,
  },
  messagemapitemattachment: {
    overflow: "hidden",
  },
  messagemapitemattachmentimg: {
    borderRadius: variables["chat-item-border-radius"],
    backgroundColor: variables["background-color"],
    aspectRatio: 10 / 5,
    width: "100%",
    maxWidth: 250,
    minWidth: 200,
    overflow: "hidden",
  },
  messagemapitemattachmenticon: {
    height: "100%",
    width: "100%",
  },
  messagemapitemattachmentinfo: {
    marginVertical: 5,
    maxWidth: 220,
  },
  messagedeleted: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 5,
  },
  messagedeletedicon: {
    opacity: 0.8,
  },
  // Photo
  messageitemattachmentphoto: {
    borderRadius: variables["chat-item-border-radius"],
    height: 200,
    minWidth: 150,
    // marginTop:-5,
    // marginHorizontal:-5
  },
  // Video
  messageitemattachmentvideoitem: {
    borderRadius: variables["chat-item-border-radius"],
    height: 300,
    width: 200,
    ...Platform.select({
      web: {
        height: 250,
        width: 150,
      },
    }),
    // marginTop:-5,
    // marginHorizontal:-5
  },
  messageitemattachmentvideoplayer: {
    width: "100%",
    height: "100%",
  },
  // Link
  messageitemattachmentlink: {
    borderRadius: variables["chat-item-border-radius"],
    backgroundColor: variables["background-alt-color"],
    maxWidth: 220,
    overflow: "hidden",
    ...Platform.select({
      web: {
        maxWidth: 150,
      },
    }),
  },
  messageitemattachmentlinkimg: {
    aspectRatio: 16 / 9,
    width: "100%",
  },
  messageitemattachmentlinkinfo: {
    paddingTop: 5,
    paddingBottom: 8,
    paddingHorizontal: 10,
  },

  // Message Reply
  messageReply: {},
  messageReplyitem: {
    backgroundColor: "#0000000a",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderLeftWidth: 2,
    borderColor: variables["primary-color"],
    marginBottom: 5,
    paddingLeft: 5,
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    width: 170,
  },
  messageReplyiteminfo: {
    paddingVertical: 5,
    flex: 1,
    gap: 2,
  },
  messageReplyitemname: {
    fontWeight: "bold",
  },
  messageReplyitemfooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  messageReplyitemfootertxt: {
    flex: 1,
  },

  // Reactions
  messageitemreactions: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    backgroundColor: variables["background-color"],
    borderRadius: 50,
    padding: 5,
    position: "absolute",
    flexDirection: "row",
    zIndex: 100,
    gap: 5,
  },
  messageitemreactionsitem: {
    height: 30,
    width: 30,
  },
  messageitemreactionsitemadd: {
    borderWidth: 1,
    borderColor: variables["icon-color"],
    borderRadius: 50,
  },
  messageitemreactionsitemicon: {
    height: 30,
    width: 30,
  },

  // Star Messages
  starmessages: {
    paddingVertical: variables["item-spacing"],
  },
  starmessagesitem: {
    paddingLeft: variables["side-spacing"],
    paddingRight: variables["side-spacing"],
    marginBottom: variables["item-spacing"],
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  starmessagesitemleft: {
    marginTop: 10,
  },
  starmessagesitemmain: {
    flex: 1,
  },
  starmessagesitemhead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  starmessagesitemheadimg: {
    borderRadius: 50,
    height: 35,
    width: 35,
  },
  starmessagesitemheadinfo: {
    flex: 1,
    gap: 5,
  },

  // Alphabetical Filters
  alphabeticalFilters: {
    height:
      Platform.OS == "web" ? "auto" : Dimensions.get("window").height - 100,
    position: "absolute",
    right: 5,
    justifyContent: "center",
    alttabsItem: "center",
  },
  alphabeticalFiltersInner: {
    alignItems: "center",
    gap: 2,
  },
  alphabeticalFiltersitem: {
    // textcenter: "center",  // this won't work in mobile screen
    color: variables["primary-color"],
    fontSize: variables["font-size-small"],
  },

  // Form Elements
  forminput: {
    borderColor: variables["composer-input-border-color"],
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    flexDirection: "row",
    gap: 5,
  },
  forminputText: {
    color: variables["font-color"],
    flex: 1,
    borderWidth: 0,
  },
  formdropdownButtonStyle: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  formdropdownButtonTxtStyle: {
    textAlign: "right",
  },
  formdropdownItemStyle: {
    backgroundColor: variables["background-color"],
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    width: "100%",
  },
  formdropdownItemStyleseleted: {
    backgroundColor: variables["primary-color-soft"],
  },
  formdropdownItemTxtStyle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: variables["font-color"],
  },
  // Group Create
  groupcreateInfo: {
    marginHorizontal: variables["side-spacing"],
    marginVertical: variables["item-spacing"],
    gap: 20,
  },
  groupcreateInfotop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  groupcreateInfoimg: {
    backgroundColor: variables["background-alt-color"],
    borderRadius: 50,
    height: 70,
    width: 70,
  },
  groupcreateInfoIcon: {
    borderRadius: 50,
    padding: 10,
  },
  groupcreateInfotitle: {
    flex: 1,
  },

  // Media Viewer
  mediaModel: {
    // flex: 1,
    // justifyContent: Platform.OS == "web" ? "center" : "flex-end",
    backgroundColor: "#000",
    // backgroundColor: "#000",
    height: "100%",
    width: "100%",
  },
  mediaModelheader: {
    backgroundColor: "#000000c2",
    height: 50,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    position: "absolute",
    zIndex: 1,
  },
  mediaModelheaderInfo: {
    flex: 1,
  },
  mediaModelheadertitle: {
    fontFamily: "Roboto-Bold",
    fontSize: fontSize(16),
    flex: 1,
    color: "#fff",
  },
  mediaModelheaderstatus: {
    fontSize: fontSize(12),
    color: "#fff",
  },
  mediaModelheaderOption: {
    display: "flex",
    flexDirection: "row",
  },
  mediaModelheaderOptionicon: {
    height: 32,
    width: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  mediaModelcontainer: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  mediaModelimg: {
    height: "100%",
    width: "100%",
    resizeMode: "contain",
  },
  mediaModelNav: {
    height: 40,
    width: 40,
    position: "absolute",
    zIndex: 1,
    backgroundColor: "#ffffffe3",
    top: "50%",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  mediaModelNavprev: {
    left: 10,
  },
  mediaModelNavnxt: {
    right: 10,
  },
  // App Media Viewer
  appmediaModel: {
    backgroundColor: "#000",
    height: "100%",
    width: "100%",
  },
  appmediaModelheader: {
    backgroundColor: "#000000c2",
    marginTop: Platform.OS == "ios" ? Constants.statusBarHeight : 0,
    ...Platform.select({ android: { marginTop: StatusBar.currentHeight } }),
    height: 50,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  appmediaModelheaderInfo: {
    flex: 1,
  },
  appmediaModelheadertitle: {
    fontFamily: "Roboto-Bold",
    fontSize: fontSize(16),
    flex: 1,
  },
  appmediaModelheaderstatus: {
    fontSize: fontSize(12),
  },
  appmediaModelheaderOption: {
    display: "flex",
    flexDirection: "row",
  },
  appmediaModelheaderOptionicon: {
    height: 24,
    width: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  appmediaModelcontainer: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  appmediaModelimg: {
    height: "100%",
    width: "100%",
    resizeMode: "contain",
  },
  appmediaModelvideo: {
    height: "100%",
    width: "100%",
  },
  appmediaModelvideoplayer: {
    height: "100%",
    width: "100%",
    resizeMode: "contain",
  },

  // User Settings
  userselfinfotop: {
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    gap: 10,
    marginBottom: 10,
  },
  userselfinfotopthumb: {
    height: 60,
    width: 60,
  },
  userselfinfotopthumbimg: {
    borderRadius: 100,
    height: "100%",
    width: "100%",
  },
  userselfinfotopiediticon: {
    backgroundColor: variables["primary-color"],
    height: 20,
    width: 20,
    position: "absolute",
    borderRadius: 50,
    right: 0,
    bottom: 0,
  },
  userselfinfotopinfo: {
    flex: 1,
  },
  userselfinfotopname: {
    color: variables["font-color"],
    fontSize: fontSize(20),
  },

  // Group Password
  centermodalcontainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centermodalcontent: {
    borderRadius: variables["border-radius"],
    backgroundColor: variables["background-color"],
    padding: 15,
    width: "90%",
    ...Platform.select({ web: { maxWidth: 450 } }),
  },
  centermodalIcon: {
    backgroundColor: variables["primary-color"],
    borderRadius: 100,
    height: 60,
    width: 60,
    marginBottom: 15,
  },
  centermodalTitle: {
    fontSize: fontSize(15),
    marginBottom: 15,
  },
  centermodalBtn: {
    marginTop: 20,
    borderRadius: variables["border-radius"],
    padding: 10,
  },

  // Toast
  toastwrap: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    justifyContent: "center",
    left: 0,
    width: "100%",
  },
  toast: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#000000d4",
    color: "#fff",
    flexDirection: "row",
    gap: 8,
    alignItems: "center"
  },
  toastText: {
    color: "#fff",
  }
};

const Styles = StyleSheet.create(style);

export default Styles;
