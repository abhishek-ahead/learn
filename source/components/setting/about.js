import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { TOAST_TYPE } from "../../constant";
import { backIcon, checkIcon, deleteIcon, editIcon } from "../../constant/icons";
import { AppContext } from "../../context/app";
import { AuthContext } from "../../context/auth";
import { SettingContext } from "../../context/setting";
import { about, deleteAbout, updateAbout } from "../../services/user";
import { appStyle, webStyle } from "../../styles";

const About = ({ navigation }) => {
  const settingContext = useContext(SettingContext);
  const { translation, setToastNotification, Styles } = useContext(AppContext);
  const { setUser } = useContext(AuthContext)
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [edit, setEdit] = useState(false);
  const [addAbout, setAddAbout] = useState(false);
  const [text, setText] = useState("")

  const handleBackNavigation = () =>
    Platform.OS !== "web"
      ? navigation.goBack()
      : settingContext.setOptionPage(null);

  useEffect(() => {
    about().then((response) => { if (response.success) { setData(response.data); setText(response.data.about) } }).finally(() => setLoading(false))
  }, [])

  const handleDelete = async (about) => {
    const response = await deleteAbout({ about });
    console.log(response)
    if (response.success)
      setData(prev => {
        const data = [...prev.aboutOptions]
        about = about.trim();
        const index = data.findIndex(ele => ele == about);
        if (index !== -1) {
          data.splice(index, 1);
          return { ...prev, aboutOptions: data }
        }
      })
  };

  const handleChange = async (about) => {
    about = about.trim();
    const response = await updateAbout({ about });
    if (response.success) {
      if (addAbout) {
        setAddAbout(false);
        if (!data.aboutOptions.includes(about)) {
          setData(prev => ({ ...prev, aboutOptions: [...prev.aboutOptions, about] }))
        }
      }
      setData(prev => ({ ...prev, about }));
      setUser(prev => ({ ...prev, about }))
      setToastNotification({ type: TOAST_TYPE.success, message: "about updated successfully" })
    }
    else setToastNotification({ type: TOAST_TYPE.error, message: "Error while updating about." })
  }

  return (
    <View style={{ ...Styles.chatBubble, ...Styles.userinfo, flex: 1 }}>
      <View style={{ ...Styles.chatBubbleHeader }}>
        <View
          style={Styles.chatBubbleHeaderOption}
        >
          <Pressable onPress={handleBackNavigation} style={Styles.chatBubbleHeaderOptionIcon}>
            <View style={{ ...Styles.icon, ...Styles.icon24 }}>{backIcon(Styles.icondefault)}</View>
          </Pressable>
        </View>
        <View style={Styles.chatBubbleHeaderInfo}>
          <Text style={{ ...Styles.chatBubbleHeaderTitle }}>{translation.about}</Text>
        </View>
        {data.aboutOptions?.length ? <Pressable onPress={() => setEdit(prev => !prev)} style={Styles.chatBubbleHeaderOption}>
          <Text style={Styles.fontlink}>{edit ? translation.done : translation.edit}</Text>
        </Pressable> : null}
      </View>
      {loading ? (
        <View style={{ ...Styles.itemCenter, flex: 1 }}><ActivityIndicator size={"large"} color="#6a6f75" /></View>
      ) :
        <ScrollView style={{ width: "100%" }}>
          <View style={{ flex: 1, ...appStyle, ...Styles.userinfowrap }}>
            <View>
              <Text style={{ ...Styles.fontlight }}>
                {translation.currentlySetTO}
              </Text>
            </View>
            <View style={{ ...Styles.userinfolinks, ...Styles.block }}>
              <View style={{ ...Styles.userinfolinkitem, borderTopWidth: 0, ...Styles.cursor }}>
                {addAbout ? <>
                  <TextInput
                    autoFocus={Platform.OS == "web"}
                    style={{ ...Styles.forminputText, ...webStyle }}
                    onChangeText={(text) => setText(text)}
                    value={text}
                    placeholderTextColor={Styles.fontlight.color}
                  />
                  <Pressable onPress={() => handleChange(text)} style={{ ...Styles.userinfolinkiconright }}>
                    <View style={Styles.icon16}>{checkIcon(Styles.iconprimary)}</View>
                  </Pressable>
                </> : <>
                  <Text style={{ ...Styles.userinfolinktext }} numberOfLines={1}>
                    {data.about}
                  </Text>
                  <Pressable onPress={() => setAddAbout(true)} style={{ ...Styles.userinfolinkiconright }}>
                    <View style={Styles.icon16}>{editIcon(Styles.icondefault)}</View>
                  </Pressable>
                </>}
              </View>
            </View>
            {data.aboutOptions?.length ?
              <>
                <View>
                  <Text style={{ ...Styles.fontlight }}>
                    {translation.selectAbout}
                  </Text>
                </View>
                <View style={{ ...Styles.userinfolinks, ...Styles.block }}>
                  {
                    data.aboutOptions.map((option, index) => <Pressable onPress={() => handleChange(option)} key={index} style={{ ...Styles.userinfolinkitem, borderTopWidth: 0, ...Styles.cursor }}>
                      <Text style={{ ...Styles.userinfolinktext }} numberOfLines={1}>
                        {translation[option] || option}
                      </Text>
                      {!edit && option == data.about ? <View style={{ ...Styles.userinfolinkiconright }}>
                        <View style={Styles.icon16}>{checkIcon(Styles.iconprimary)}</View>
                      </View> : null}
                      {
                        edit ? <Pressable onPress={() => handleDelete(option)} style={{ ...Styles.userinfolinkiconright }}>
                          <View style={Styles.icon16}>{deleteIcon({ ...Styles.icondanger, ...Styles.icon16 })}</View>
                        </Pressable> : null
                      }
                    </Pressable>
                    )
                  }
                </View>
              </> : null}
          </View>
        </ScrollView>}
    </View>
  )
}

export default About;
