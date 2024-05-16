import { useContext, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SCREEN } from "../constant";
import {
    backIcon
} from "../constant/icons";
import { AppContext } from "../context/app";
import { updateSetting } from "../services/group";
import { chatNavigation } from "../store/reducer";
import { appStyle, mainStyle } from "../styles";

const GroupQrCode = ({ navigation, route, id }) => {
    const dispatch = useDispatch();
    id = route?.params?.id || id;
    const group = useSelector((state) => state.group.groups[id]);
    const { translation, getGroupDetails, Styles } = useContext(AppContext);

    const handleBackNavigation = () => {
        Platform.OS !== "web"
            ? navigation.goBack()
            : dispatch(chatNavigation({ id, screen: SCREEN.groupProfile }));
    };

    const [setting, setSetting] = useState(group?.settings);
    const toggle = useRef(false);

    useEffect(() => {
        if (toggle.current) updateSetting({ group: id, settings: setting });
    }, [setting]);

    useEffect(() => {
        if (!group) getGroupDetails(id);
    }, []);

    useEffect(() => {
        if (group && JSON.stringify(group.settings) != JSON.stringify(setting)) {
            toggle.current = false;
            setSetting(group.settings);
        }
    }, [group?.settings]);

    return (
        <View style={mainStyle}>
            <View style={{ ...Styles.chatBubble, ...appStyle, ...Styles.userinfo }}>
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
                            {translation.groupQr}
                        </Text>
                    </View>
                </View>
                {!setting ? (
                    <View style={{ ...Styles.itemCenter, flex: 1 }}><ActivityIndicator size={"large"} color="#6a6f75" /></View>
                ) : (
                    <ScrollView style={{ width: "100%" }}>
                        <View style={{ flex: 1, ...appStyle, ...Styles.userinfowrap }}>
                            {/* QR Code Start */}
                            <View style={{ ...Styles.qrcodeblock, ...Styles.block }}>
                                <View style={{ ...Styles.qrcodeblockthumb }}>
                                    <Image style={{ ...Styles.qrcodeblockthumbimg, ...Styles.thumbImg, ...Styles.noborder }} source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }} />
                                </View>
                                <View>
                                    <Text style={{ ...Styles.fontsizetitle, ...Styles.fontBold, ...Styles.fontdefault, ...Styles.textcenter }}>Best Friends Groups</Text>
                                    <Text style={{ ...Styles.fontlight, ...Styles.textcenter, ...Styles.mtop2 }}>Circuit Chat Group </Text>
                                </View>
                                <View style={{}}>
                                    <Image style={{ ...Styles.qrcodeimg }} source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/5/5e/QR_Code_example.png" }} />
                                </View>
                            </View>
                            <View style={{ ...Styles.mtop0 }}><Text style={{ ...Styles.fontsizesmall, ...Styles.fontlight, ...Styles.textcenter }}>This group QR code is private. if it is share with someone, they can scan it with their Circuit Chat Camera to join this group.</Text></View>

                            <View style={{ ...Styles.userinfolinkitem, borderTopWidth: 0, marginTop: 10 }}>
                                <Text style={{ ...Styles.userinfolinktext, ...Styles.fontlink, ...Styles.textcenter }}>Reset QR Code</Text>
                            </View>
                            {/* QR Code End */}
                        </View>
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

export default GroupQrCode;
