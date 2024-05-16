export default (props) => {
  let { SafeAreaView, Platform, StatusBar, } = require("react-native")
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: "white",
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    }}>
      {props.children}
    </SafeAreaView>
  )
}