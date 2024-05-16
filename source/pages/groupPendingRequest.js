import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Image, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import NoResult from "../components/noResult";
import { SCREEN } from "../constant";
import { backIcon, checkIcon, crossIcon } from "../constant/icons";
import { AppContext } from "../context/app";
import { changePendingStatus, pendingMembers } from "../services/group";
import { chatNavigation } from "../store/reducer";
import { appStyle, mainStyle } from "../styles";

const GroupPendingRequest = ({ navigation, route, id }) => {
  const dispatch = useDispatch();
  id = route?.params?.id || id;
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const { translations, Styles } = useContext(AppContext)

  useEffect(() => {
    pendingMembers(id).then(res => res.success && setMembers(res.data)).finally(() => setLoading(false))
  }, []);

  const handleChatClose = () => dispatch(chatClose(id));
  const handleBackNavigation = () => {
    Platform.OS !== "web"
      ? navigation.goBack()
      : dispatch(chatNavigation({ id, screen: SCREEN.profile }));

  };

  const handleNavigate = (id, screen) => {
    Platform.OS !== "web"
      ? navigation.navigate(screen, { id: id })
      : dispatch(chatNavigation({ id, screen }));
  };

  const handlePendingRequest = async (data) => {
    const response = await changePendingStatus({ group: id, ...data });
    if (response.success) {
      setMembers((members) => {
        const index = members.findIndex(member => member.user._id == data.user);
        if (index !== -1) {
          const prevMembers = [...members];
          prevMembers.splice(index, 1);
          return prevMembers
        }
      })
    }
  };

  return (
    <View style={mainStyle}>
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
            <Text style={{ ...Styles.chatBubbleHeaderTitle, ...Styles.textcenter }}>
              {translations.pendingRequests}
            </Text>
          </View>
          <View style={Styles.chatBubbleHeaderOptionIcon}>
          </View>
        </View>
        <View style={{ flex: 1, ...appStyle, ...Styles.bgalt }}>
          <View style={{ padding: 0, margin: 0, lineHeight: 1, }}>
            <Text style={{ ...Styles.fontdefault, ...Styles.textcenter, ...Styles.p10 }}>{translations.pendingRequestDescription}<Text onPress={() => handleNavigate(id, SCREEN.groupSetting)} style={Styles.fontlink}>{translations.groupSettings}</Text>.</Text>
          </View>
          <View style={{ ...Styles.block, ...Styles.mh10, flex: 1, marginBottom: 10 }}>
            <ScrollView>
              {
                loading ? <View style={{ ...Styles.itemCenter, flex: 1 }}>
                  <ActivityIndicator size={"large"} color="#6a6f75" />
                </View>
                  : members.length ? members.map(member => <View style={{ ...Styles.chatListItem, ...Styles.nobg }}>
                    <View style={{ ...Styles.chatListItemInner, borderTopWidth: 0 }}>
                      <View style={Styles.chatListItemthumb}>
                        <Image style={{ ...Styles.thumbImg, ...Styles.chatListItemthumbImg }} source={{ uri: member.avatar }} />
                        <View style={Styles.chatListItemStatus}></View>
                      </View>
                      <View style={Styles.chatListIteminfo}>
                        <View style={Styles.chatListIteminfoTop}>
                          <Text style={Styles.chatListIteminfoTitle} numberOfLines={1}>{member.user.name}</Text>
                        </View>
                        {/* <View style={Styles.chatListIteminfoBtm}>
                      <Text numberOfLines={1} ellipsizeMode="tail" style={Styles.chatListIteminfoMsg}>
                        2 Groups in Common
                      </Text>
                    </View> */}
                      </View>
                      <View style={{ ...Styles.chatListItemsbtns }}>
                        <Pressable onPress={() => handlePendingRequest({ user: member.user._id, accept: false })} style={{ ...Styles.btnrounded, ...Styles.btnPrimarySoft }}>
                          <View style={{ ...Styles.icon12 }}>{crossIcon(Styles.iconprimary)}</View>
                        </Pressable>
                        <Pressable onPress={() => handlePendingRequest({ user: member.user._id, accept: true })} style={{ ...Styles.btnrounded, ...Styles.btnPrimarySoft }}>
                          <View style={{ ...Styles.icon16 }}>{checkIcon(Styles.iconprimary)}</View>
                        </Pressable>
                      </View>
                    </View>
                  </View>)
                    : <NoResult />
              }
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
};

export default GroupPendingRequest;
