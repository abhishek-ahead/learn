
/* eslint-disable react-hooks/exhaustive-deps */
import { View } from "react-native";
import Styles from "../../styles";

const LoadingShimmer = () => (<View key={`message_loading_shimmer_head`} style={{ ...Styles.shimmermessages }}>
    {
        Array(10).fill(null).map((e, i) => <View key={`message_loading_shimmer_${i}`}>
            <View key={`message_loading_shimmer_in_${i}`} style={{ ...Styles.shimmermessagesitem, ...Styles.shimmermessagesitemout }}>
                <View style={{ ...Styles.shimmermessagesitemmsg, ...Styles.shimmerbox }}></View>
            </View>
            <View key={`message_loading_shimmer_out_${i}`} style={{ ...Styles.shimmermessagesitem }}>
                <View style={{ ...Styles.shimmermessagesitemthumb, ...Styles.shimmerbox }}></View>
                <View style={{ ...Styles.shimmermessagesitemmsg, ...Styles.shimmerbox }}></View>
            </View>
        </View>)
    }
</View>);

export default LoadingShimmer