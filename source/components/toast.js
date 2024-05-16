import { useContext, useEffect } from "react";
import { Platform, Text, View } from "react-native";
import { TOAST_TYPE } from "../constant";
import { checkcircleSuccessIcon, crosscircleDangerIcon } from "../constant/icons";
import { AppContext } from "../context/app";

const ToastNotification = () => {
    const { toastNotification, setToastNotification, Styles } = useContext(AppContext);

    useEffect(() => {
        if (toastNotification) {
            if (Platform.OS == "web") {
                console.log("toastNotification.message", toastNotification.message)
                window.top.postMessage(
                    {
                        "type": "toast",
                        "method": toastNotification.type,
                        "message": toastNotification.message
                    },
                    "*"
                );
            } else {
                let timeout;
                clearTimeout(timeout)
                timeout = setTimeout(() => setToastNotification(null), 2000);
            }
        }
    }, [toastNotification]);

    const getIcon = () => {
        switch (toastNotification.type) {
            case TOAST_TYPE.success:
                return checkcircleSuccessIcon(Styles.iconsuccess);
            case TOAST_TYPE.error:
                return crosscircleDangerIcon(Styles.icondanger);
        }
    }

    if (toastNotification && Platform.OS !== "web")
        return <View style={{ ...Styles.toastwrap, bottom: 75 }}>
            <View style={{ ...Styles.toast }}>
                <View style={{ ...Styles.toastIcon, ...Styles.icon16 }}>
                    {getIcon()}
                </View>
                {/* <View style={{ ...Styles.toastIcon, ...Styles.icon16 }}>
                    {crosscircleDangerIcon(Styles.icondanger)}
                </View> */}
                <Text style={Styles.toastText}>{toastNotification.message}</Text>
            </View>
        </View>
    else return null

};

export default ToastNotification;