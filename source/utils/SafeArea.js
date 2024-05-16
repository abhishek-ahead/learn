import { useContext } from "react";
import { AppContext } from "../context/app";
import { setStatusBarStyle } from "expo-status-bar";
import { MODE } from "../constant";

export default (props) => {
  let { SafeAreaView, Platform, StatusBar, } = require("react-native");
  const { Styles, mode } = useContext(AppContext)
  setStatusBarStyle(mode == MODE.dark ? "inverted" : "auto")
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: Styles.bg.backgroundColor,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    }
    }>
      {props.children}
    </SafeAreaView>
  )
}