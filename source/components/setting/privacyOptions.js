import { useContext } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { PRIVACY_KEYS, PRIVACY_STATUS } from "../../constant";
import { backIcon, checkIconprimary } from "../../constant/icons";
import { SettingContext } from "../../context/setting";
import Styles, { appStyle } from "../../styles";


const Options = ({ value }) =>
    <>
        <View>
            <Text style={{ ...Styles.fontlight }}>
                Who Can See My Last Seen
            </Text>
        </View>
        <View style={{ ...Styles.userinfolinks, ...Styles.block }}>
            {
                Object.keys(PRIVACY_STATUS).sort((a, b) => b - a).map(privacy =>
                    <Pressable key={privacy} onPress={() => { }} style={{ ...Styles.userinfolinkitem, borderTopWidth: 0, ...Styles.cursor }}>
                        <Text style={{ ...Styles.userinfolinktext }}>
                            {PRIVACY_STATUS[privacy]}
                        </Text>
                        {value == privacy ?
                            <View style={{ ...Styles.userinfolinkiconright }}>
                                <View style={{ ...Styles.icon16, ...Styles.itemCenter }}>{checkIconprimary}</View>
                            </View> : null}
                    </Pressable>
                )
            }

            {/* <Pressable onPress={() => handleNavigate({ privacy: PRIVACY_KEYS.lastSeenOnline, value: { lastSeen: data.privacy.lastSeen, online: data.privacy.online } })} style={{ ...Styles.userinfolinkitem, ...Styles.cursor }}>
                <Text style={{ ...Styles.userinfolinktext }}>
                    {PRIVACY_STATUS[1]}
                </Text>
            </Pressable>
            <Pressable onPress={() => handleNavigate({ privacy: PRIVACY_KEYS.lastSeenOnline, value: { lastSeen: data.privacy.lastSeen, online: data.privacy.online } })} style={{ ...Styles.userinfolinkitem, ...Styles.cursor }}>
                <Text style={{ ...Styles.userinfolinktext }}>
                    {PRIVACY_STATUS[0]}
                </Text>
                <View style={{ ...Styles.userinfolinkiconright }}>
                    <View style={{ ...Styles.icon16, ...Styles.itemCenter }}>{checkIconprimary}</View>
                </View>
            </Pressable> */}
        </View>
    </>


const OnlineOptions = ({ value }) =>
    <>
        <View>
            <Text style={{ ...Styles.fontlight }}>
                Who Can See When I’m online
            </Text>
        </View>
        <View style={{ ...Styles.userinfolinks, ...Styles.block }}>
            <Pressable onPress={() => handleNavigate({ privacy: PRIVACY_KEYS.lastSeenOnline, value: { lastSeen: data.privacy.lastSeen, online: data.privacy.online } })} style={{ ...Styles.userinfolinkitem, borderTopWidth: 0, ...Styles.cursor }}>
                <Text style={{ ...Styles.userinfolinktext }}>
                    {PRIVACY_STATUS[3]}
                </Text>
                {value == 0 ? <View style={{ ...Styles.userinfolinkiconright }}>
                    <View style={{ ...Styles.icon16, ...Styles.itemCenter }}>{checkIconprimary}</View>
                </View> : null}
            </Pressable>
            <Pressable onPress={() => handleNavigate({ privacy: PRIVACY_KEYS.lastSeenOnline, value: { lastSeen: data.privacy.lastSeen, online: data.privacy.online } })} style={{ ...Styles.userinfolinkitem, ...Styles.cursor }}>
                <Text style={{ ...Styles.userinfolinktext }}>
                    Same as Last Seen
                </Text>
                {value == 1 ? <View style={{ ...Styles.userinfolinkiconright }}>
                    <View style={{ ...Styles.icon16, ...Styles.itemCenter }}>{checkIconprimary}</View>
                </View> : null}
            </Pressable>
        </View>
    </>


const OptionSwitch = ({ data }) => {
    switch (data.privacy) {
        case PRIVACY_KEYS.lastSeenOnline:
            return <>
                <Options value={data.value.lastSeen} />
                <OnlineOptions value={data.value.online} />
            </>
        default:
            return <Options value={data.value} />
    }
}

const PrivacySettingOption = ({ navigation, route }) => {
    // const [loading, setLoading] = useState(true);
    const settingContext = useContext(SettingContext)
    const statedata = settingContext?.selectOption || route?.params;
    console.log("state data", statedata)

    const handleBackNavigation = () =>
        Platform.OS !== "web"
            ? navigation.goBack()
            : settingContext.setSelectOption(null);

    // useEffect(() => {
    //     getPrivacySetting().then(response => setData(response.data)).finally(() => setLoading(false))
    // }, [])

    return (
        <View style={{ ...Styles.chatBubble, ...Styles.userinfo, flex: 1 }}>
            <View style={{ ...Styles.chatBubbleHeader }}>
                <Pressable
                    onPress={handleBackNavigation}
                    style={Styles.chatBubbleHeaderOption}
                >
                    <View style={Styles.chatBubbleHeaderOptionIcon}>
                        <View style={{ ...Styles.icon, ...Styles.icon24 }}>{backIcon}</View>
                    </View>
                </Pressable>
                <View style={Styles.chatBubbleHeaderInfo}>
                    <Text style={{ ...Styles.chatBubbleHeaderTitle }}>{statedata.privacy}</Text>
                </View>
            </View>
            <ScrollView style={{ width: "100%" }}>
                <View style={{ flex: 1, ...appStyle, ...Styles.userinfowrap }}>
                    <OptionSwitch data={statedata} />
                </View>
            </ScrollView>
            {/* {loading ? (
                <View style={{ ...Styles.itemCenter, flex: 1 }}>
                    <ActivityIndicator size={"large"} color="#6a6f75" />
                </View>
            ) : */}
            {/* <ScrollView style={{ width: "100%" }}>
                <View style={{ flex: 1, ...appStyle, ...Styles.userinfowrap }}>
                    <View style={{ ...Styles.userinfolinks, ...Styles.block }}>
                        <View style={{ ...Styles.userinfolinkitem, borderTopWidth: 0, ...Styles.cursor }}>
                            <Text style={{ ...Styles.userinfolinktext }}>
                                Last Seen & Online
                            </Text>
                            <Text style={{ ...Styles.userinfolinkcount, ...Styles.fontlight }} numberOfLines={1}>
                                {`${PRIVACY_STATUS[data.privacy.lastSeen]}, ${PRIVACY_STATUS[data.privacy.online]}`}
                            </Text>
                            <View style={{ ...Styles.userinfolinkiconright }}>
                                {rightArrow}
                            </View>
                        </View>
                        <View style={{ ...Styles.userinfolinkitem, ...Styles.cursor }}>
                            <Text style={{ ...Styles.userinfolinktext }}>Profile Photo</Text>
                            <Text style={{ ...Styles.userinfolinkcount, ...Styles.fontlight }} numberOfLines={1}>
                                {PRIVACY_STATUS[data.privacy.profilePhoto]}
                            </Text>
                            <View style={{ ...Styles.userinfolinkiconright }}>
                                {rightArrow}
                            </View>
                        </View>
                        <View style={{ ...Styles.userinfolinkitem, ...Styles.cursor }}>
                            <Text style={{ ...Styles.userinfolinktext }}>About</Text>
                            <Text style={{ ...Styles.userinfolinkcount, ...Styles.fontlight }} numberOfLines={1}>
                                {PRIVACY_STATUS[data.privacy.about]}
                            </Text>
                            <View style={{ ...Styles.userinfolinkiconright }}>
                                {rightArrow}
                            </View>
                        </View>
                        <View style={{ ...Styles.userinfolinkitem, ...Styles.cursor }}>
                            <Text style={{ ...Styles.userinfolinktext }}>Groups</Text>
                            <Text style={{ ...Styles.userinfolinkcount, ...Styles.fontlight }} numberOfLines={1}>
                                {PRIVACY_STATUS[data.privacy.group]}
                            </Text>
                            <View style={{ ...Styles.userinfolinkiconright }}>
                                {rightArrow}
                            </View>
                        </View>
                        <View style={{ ...Styles.userinfolinkitem, ...Styles.cursor }}>
                            <Text style={{ ...Styles.userinfolinktext }}>Status</Text>
                            <Text style={{ ...Styles.userinfolinkcount, ...Styles.fontlight }} numberOfLines={1}>
                                {PRIVACY_STATUS[data.privacy.status]}
                            </Text>
                            <View style={{ ...Styles.userinfolinkiconright }}>
                                {rightArrow}
                            </View>
                        </View>
                    </View>
                    <View style={{ ...Styles.userinfolinks, ...Styles.block, marginBottom: 0, }}>
                        <View style={{ ...Styles.userinfolinkitem, borderTopWidth: 0, ...Styles.cursor }}>
                            <Text style={{ ...Styles.userinfolinktext }}>
                                Live Location
                            </Text>
                            <Text style={{ ...Styles.userinfolinkcount, ...Styles.fontlight }} numberOfLines={1}>
                                None
                            </Text>
                            <View style={{ ...Styles.userinfolinkiconright }}>
                                {rightArrow}
                            </View>
                        </View>
                    </View>
                    <View>
                        <Text style={{ ...Styles.fontlight, ...Styles.fontsizesmall }}>
                            List of chats where you are sharing your live location.
                        </Text>
                    </View>
                    <View style={{ ...Styles.userinfolinks, ...Styles.block, marginTop: 15, marginBottom: 5, }}>
                        <View style={{ ...Styles.userinfolinkitem, borderTopWidth: 0, ...Styles.cursor }}>
                            <Text style={{ ...Styles.userinfolinktext }}>
                                Calls
                            </Text>
                            <View style={{ ...Styles.userinfolinkiconright }}>
                                {rightArrow}
                            </View>
                        </View>
                    </View>
                    <View style={{ ...Styles.userinfolinks, ...Styles.block, marginBottom: 0, }}>
                        <View style={{ ...Styles.userinfolinkitem, borderTopWidth: 0, ...Styles.cursor }}>
                            <Text style={{ ...Styles.userinfolinktext }}>
                                Block
                            </Text>
                            <Text style={{ ...Styles.userinfolinkcount, ...Styles.fontlight }} numberOfLines={1}>
                                None
                            </Text>
                            <View style={{ ...Styles.userinfolinkiconright }}>
                                {rightArrow}
                            </View>
                        </View>
                    </View>
                    <View>
                        <Text style={{ ...Styles.fontlight, ...Styles.fontsizesmall }}>
                            List of contacts you have blocked.
                        </Text>
                    </View>
                    <View style={{ ...Styles.userinfolinks, ...Styles.block, marginTop: 15, }}>
                        <View style={{ ...Styles.userinfolinkitem, borderTopWidth: 0, ...Styles.cursor }}>
                            <Text style={{ ...Styles.userinfolinktext }}>
                                Read Receipts
                            </Text>
                            <View style={{ ...Styles.userinfolinkiconright }}>
                                <Switch
                                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                                    // thumbColor={
                                    //   notificationSettings.group.showNotification
                                    //     ? "#057EFC"
                                    //     : "#f4f3f4"
                                    // }
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={(value) =>
                                        handleToggle({
                                            setting: "group",
                                            notification: "showNotification",
                                            value,
                                        })
                                    }
                                    value={data.privacy.readRecipts}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{ ...Styles.userinfolinks, ...Styles.block, marginBottom: 0, }}>
                        <View style={{ ...Styles.userinfolinkitem, borderTopWidth: 0, ...Styles.cursor }}>
                            <Text style={{ ...Styles.userinfolinktext }}>
                                Screen Lock
                            </Text>
                            <Text style={{ ...Styles.userinfolinkcount, ...Styles.fontlight }} numberOfLines={1}>
                                None
                            </Text>
                            <View style={{ ...Styles.userinfolinkiconright }}>
                                {rightArrow}
                            </View>
                        </View>
                    </View>
                    <View>
                        <Text style={{ ...Styles.fontlight, ...Styles.fontsizesmall }}>
                            Required Touch ID to unlock Circuit Chat
                        </Text>
                    </View>
                </View>
            </ScrollView> */}

        </View>
    );
};

export default PrivacySettingOption;
