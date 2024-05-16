import { ScrollView, Text, View } from "react-native"
import Styles, { appStyle } from "../../styles";
import { rightArrow } from "../../constant/icons";

const AccountSetting = () => {

    return (
        <View style={{ ...Styles.userinfo, flex:1 }}>
            <ScrollView style={{ width: "100%" }}>
                <View style={{ flex: 1, ...appStyle, ...Styles.userinfowrap }}>
                    <View style={{ ...Styles.userinfolinks, ...Styles.block }}>
                        <View style={{ ...Styles.userinfolinkitem, borderTopWidth: 0, ...Styles.cursor }}>
                            <Text style={{ ...Styles.userinfolinktext }}>Security Notifications</Text>
                            <View style={{ ...Styles.userinfolinkiconright }}>
                                {rightArrow}
                            </View>
                        </View>
                        <View style={{ ...Styles.userinfolinkitem, ...Styles.cursor }}>
                            <Text style={{ ...Styles.userinfolinktext }}>Two Step Verification</Text>
                            <View style={{ ...Styles.userinfolinkiconright }}>
                                {rightArrow}
                            </View>
                        </View>
                    </View>

                    <View style={{ ...Styles.userinfolinks, ...Styles.block }}>
                        <View style={{ ...Styles.userinfolinkitem, borderTopWidth: 0, ...Styles.cursor }}>
                            <Text style={{ ...Styles.userinfolinktext }}>Request Account Info</Text>
                            <View style={{ ...Styles.userinfolinkiconright }}>
                                {rightArrow}
                            </View>
                        </View>
                        <View style={{ ...Styles.userinfolinkitem, ...Styles.cursor }}>
                            <Text style={{ ...Styles.userinfolinktext }}>Delete My Account</Text>
                            <View style={{ ...Styles.userinfolinkiconright }}>
                                {rightArrow}
                            </View>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </View>
    )
}

export default AccountSetting