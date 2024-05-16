import SettingMain from "../components/setting/index"
import { SettingProvider } from "../context/setting";

const Setting = ({ navigation, route }) => {
    return (
        <SettingProvider navigation={navigation}>
            <SettingMain />
        </SettingProvider>
    )
};

export default Setting;