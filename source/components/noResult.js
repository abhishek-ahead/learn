import { default as React, useContext } from 'react';
import { Text, View } from 'react-native';
import Styles, { appStyle } from '../styles';
import { noResult } from '../constant/icons';
import { AppContext } from '../context/app';


const NoResult = ({ revertinvert }) => {
    const { translation } = useContext(AppContext);
    return <View style={{
        flex: 1, ...appStyle, ...Styles.searchresultcontainer, ...Styles.itemCenter, height: "100%",
    }}>
        <View style={{ ...Styles.searchnoresult, transform: revertinvert ? [{ scaleY: -1 }] : [], }}>
            <View style={Styles.searchnoresulticon}>
                {noResult}
            </View>
            <Text style={{ ...Styles.searchnoresultText, ...Styles.textcenter}}>{translation.noResult}</Text>
        </View>
    </View>

}

export default NoResult;