import { default as React } from 'react';
import { View } from 'react-native';
import Styles from '../../styles';

const LoadingShimmer = () => <View style={Styles.chatListItem}>
    {
        Array(10).fill(null).map((v, i) => <View key={`shimmer_${i}`} style={{ ...Styles.shimmerRecentmessagesitem, marginTop: 15 }}>
            <View style={{ ...Styles.shimmerRecentmessagesitemthumb, ...Styles.shimmerbox }}>
            </View>
            <View style={{ ...Styles.shimmerRecentmessagesiteminfo }}>
                <View style={{ ...Styles.shimmerRecentmessagesitemrow }}>
                    <View style={{ ...Styles.shimmerRecentmessagesitemline, ...Styles.shimmerbox, width: "35%" }}></View>
                    <View style={{ ...Styles.shimmerRecentmessagesitemline, ...Styles.shimmerbox, width: "15%" }}></View>
                </View>
                <View style={{ ...Styles.shimmerRecentmessagesitemrow, marginTop: 10 }}>
                    <View style={{ ...Styles.shimmerRecentmessagesitemline, ...Styles.shimmerbox, width: "15%" }}></View>
                    <View style={{ ...Styles.shimmerRecentmessagesitemline, ...Styles.shimmerbox, width: "10%" }}></View>
                </View>
            </View>
        </View>)
    }
</View>

export default LoadingShimmer