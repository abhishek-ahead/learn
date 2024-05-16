import { useContext } from "react";
import { Pressable, Text, View } from "react-native";
import { Path, Svg } from "react-native-svg";
import { NAV_TABS } from "../constant";
import { AppContext } from "../context/app";
import Styles from "../styles";
import { fontSize } from "../utils/helper";

const iconSize = { width: fontSize(24, 20), height: fontSize(24, 20) };

const NavBar = () => {
    const { tabNav, setTabNav } = useContext(AppContext)
    return (
        <View style={Styles.navbar}>
            <View style={Styles.navbarInneer}>
                <Pressable onPress={() => setTabNav(NAV_TABS.chat)} style={Styles.navbarItem}>
                    <Svg viewBox="0 0 24 24" style={{ ...tabNav == NAV_TABS.chat ? Styles.iconprimary : Styles.icondefault, ...iconSize }}><Path d="M24,11.247A12.012,12.012,0,1,0,12.017,24H19a5.005,5.005,0,0,0,5-5V11.247ZM22,19a3,3,0,0,1-3,3H12.017a10.041,10.041,0,0,1-7.476-3.343,9.917,9.917,0,0,1-2.476-7.814,10.043,10.043,0,0,1,8.656-8.761A10.564,10.564,0,0,1,12.021,2,9.921,9.921,0,0,1,18.4,4.3,10.041,10.041,0,0,1,22,11.342Z"/><Path d="M8,9h4a1,1,0,0,0,0-2H8A1,1,0,0,0,8,9Z"/><Path d="M16,11H8a1,1,0,0,0,0,2h8a1,1,0,0,0,0-2Z"/><Path d="M16,15H8a1,1,0,0,0,0,2h8a1,1,0,0,0,0-2Z"/></Svg>
                    <Text style={{...Styles.fontsizesmall, ...tabNav == NAV_TABS.chat ? Styles.fontprimary : Styles.fontdefault,}}>Chats</Text>
                </Pressable>
                {/* <Pressable onPress={() => setTabNav(NAV_TABS.call)} style={Styles.navbarItem}>
                    <Svg preserveAspectRatio="xMinYMin slice" viewBox="0 0 24 24" style={{ ...tabNav == NAV_TABS.call ? Styles.iconprimary : Styles.icondefault, ...iconSize }}>
                        <Path d="M0 0h24v24H0V0z" fill="none" />
                        <Path d="M6.54 5c.06.89.21 1.76.45 2.59l-1.2 1.2c-.41-1.2-.67-2.47-.76-3.79h1.51m9.86 12.02c.85.24 1.72.39 2.6.45v1.49c-1.32-.09-2.59-.35-3.8-.75l1.2-1.19M7.5 3H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.49c0-.55-.45-1-1-1-1.24 0-2.45-.2-3.57-.57a.84.84 0 00-.31-.05c-.26 0-.51.1-.71.29l-2.2 2.2a15.149 15.149 0 01-6.59-6.59l2.2-2.2c.28-.28.36-.67.25-1.02A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1z" />
                    </Svg>
                </Pressable> */}
                <Pressable onPress={() => setTabNav(NAV_TABS.people)} style={Styles.navbarItem}>
                    <Svg viewBox="0 0 24 24" style={{ ...tabNav == NAV_TABS.people ? Styles.iconprimary : Styles.icondefault, ...iconSize }}><Path d="M12,12A6,6,0,1,0,6,6,6.006,6.006,0,0,0,12,12ZM12,2A4,4,0,1,1,8,6,4,4,0,0,1,12,2Z"/><Path d="M12,14a9.01,9.01,0,0,0-9,9,1,1,0,0,0,2,0,7,7,0,0,1,14,0,1,1,0,0,0,2,0A9.01,9.01,0,0,0,12,14Z"/></Svg>
                    <Text style={{...Styles.fontsizesmall, ...tabNav == NAV_TABS.people ? Styles.fontprimary : Styles.fontdefault,}}>Users</Text>
                </Pressable>
                <Pressable onPress={() => setTabNav(NAV_TABS.setting)} style={Styles.navbarItem}>
                    <Svg viewBox="0 0 24 24" style={{ ...tabNav == NAV_TABS.setting ? Styles.iconprimary : Styles.icondefault, ...iconSize }}><Path d="M12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14Z"/><Path d="M21.294,13.9l-.444-.256a9.1,9.1,0,0,0,0-3.29l.444-.256a3,3,0,1,0-3-5.2l-.445.257A8.977,8.977,0,0,0,15,3.513V3A3,3,0,0,0,9,3v.513A8.977,8.977,0,0,0,6.152,5.159L5.705,4.9a3,3,0,0,0-3,5.2l.444.256a9.1,9.1,0,0,0,0,3.29l-.444.256a3,3,0,1,0,3,5.2l.445-.257A8.977,8.977,0,0,0,9,20.487V21a3,3,0,0,0,6,0v-.513a8.977,8.977,0,0,0,2.848-1.646l.447.258a3,3,0,0,0,3-5.2Zm-2.548-3.776a7.048,7.048,0,0,1,0,3.75,1,1,0,0,0,.464,1.133l1.084.626a1,1,0,0,1-1,1.733l-1.086-.628a1,1,0,0,0-1.215.165,6.984,6.984,0,0,1-3.243,1.875,1,1,0,0,0-.751.969V21a1,1,0,0,1-2,0V19.748a1,1,0,0,0-.751-.969A6.984,6.984,0,0,1,7.006,16.9a1,1,0,0,0-1.215-.165l-1.084.627a1,1,0,1,1-1-1.732l1.084-.626a1,1,0,0,0,.464-1.133,7.048,7.048,0,0,1,0-3.75A1,1,0,0,0,4.79,8.992L3.706,8.366a1,1,0,0,1,1-1.733l1.086.628A1,1,0,0,0,7.006,7.1a6.984,6.984,0,0,1,3.243-1.875A1,1,0,0,0,11,4.252V3a1,1,0,0,1,2,0V4.252a1,1,0,0,0,.751.969A6.984,6.984,0,0,1,16.994,7.1a1,1,0,0,0,1.215.165l1.084-.627a1,1,0,1,1,1,1.732l-1.084.626A1,1,0,0,0,18.746,10.125Z"/></Svg>
                    <Text style={{...Styles.fontsizesmall, ...tabNav == NAV_TABS.setting ? Styles.fontprimary : Styles.fontdefault,}}>Settings</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default NavBar;