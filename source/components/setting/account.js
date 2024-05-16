import { useContext } from "react";
import { ScrollView, Text, View } from "react-native";
import { rightArrowIcon } from "../../constant/icons";
import { AppContext } from "../../context/app";
import { appStyle } from "../../styles";

const AccountSetting = () => {
    const { Styles } = useContext(AppContext)
    return (
        <View style={{ ...Styles.userinfo, flex: 1 }}>
            <ScrollView style={{ width: "100%" }}>
                <View style={{ flex: 1, ...appStyle, ...Styles.userinfowrap }}>
                    <View style={{ ...Styles.userinfolinks, ...Styles.block }}>
                        <View style={{ ...Styles.userinfolinkitem, borderTopWidth: 0, ...Styles.cursor }}>
                            <Text style={{ ...Styles.userinfolinktext }}>Security Notifications</Text>
                            <View style={{ ...Styles.userinfolinkiconright }}>
                                {rightArrowIcon({ ...Styles.icondefault, ...Styles.icon20 })}
                            </View>
                        </View>
                        <View style={{ ...Styles.userinfolinkitem, ...Styles.cursor }}>
                            <Text style={{ ...Styles.userinfolinktext }}>Two Step Verification</Text>
                            <View style={{ ...Styles.userinfolinkiconright }}>
                                {rightArrowIcon({ ...Styles.icondefault, ...Styles.icon20 })}
                            </View>
                        </View>
                    </View>

                    <View style={{ ...Styles.userinfolinks, ...Styles.block }}>
                        <View style={{ ...Styles.userinfolinkitem, borderTopWidth: 0, ...Styles.cursor }}>
                            <Text style={{ ...Styles.userinfolinktext }}>Request Account Info</Text>
                            <View style={{ ...Styles.userinfolinkiconright }}>
                                {rightArrowIcon({ ...Styles.icondefault, ...Styles.icon20 })}
                            </View>
                        </View>
                        <View style={{ ...Styles.userinfolinkitem, ...Styles.cursor }}>
                            <Text style={{ ...Styles.userinfolinktext }}>Delete My Account</Text>
                            <View style={{ ...Styles.userinfolinkiconright }}>
                                {rightArrowIcon({ ...Styles.icondefault, ...Styles.icon20 })}
                            </View>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </View>
    )
}

export default AccountSetting