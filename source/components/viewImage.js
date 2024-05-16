import { ResizeMode, Video } from "expo-av";
import moment from "moment";
import { useContext } from "react";
import { Image, Modal, Platform, Pressable, Text, View } from "react-native";
import { CONTENT_TYPE } from "../constant";
import { backIconWhite, closeIconWhite } from "../constant/icons";
import { AppContext } from "../context/app";
import { AuthContext } from "../context/auth";
import Styles from "../styles";

const ViewImage = () => {
  const { showImage, setShowImage, translation } = useContext(AppContext);
  const onClose = () => setShowImage(null);
  const { USER_ID } = useContext(AuthContext);
  if (showImage)
    return (
      <Modal
        animationType="fade"
        visible={showImage ? true : false}
        onRequestClose={onClose}
        statusBarTranslucent
      >
        {Platform.OS !== "web" ? (
          <View style={Styles.mediaModel}>
            <View style={{ ...Styles.appmediaModelheader }}>
              <Pressable
                onPress={onClose}
                style={Styles.appmediaModelheaderOption}
              >
                <View style={Styles.mediaModelheaderOptionicon}>
                  {backIconWhite}
                </View>
              </Pressable>
              <View style={Styles.appmediaModelheaderInfo}>
                {showImage.sender ||
                  (showImage.receiver && showImage.createdAt) ? (
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        ...Styles.mediaModelheadertitle,
                        ...Styles.textcenter,
                      }}
                      numberOfLines={1}
                    >
                      {showImage.sender == USER_ID
                        ? translation.you
                        : showImage.chat.name}
                    </Text>
                    <Text
                      style={{
                        ...Styles.mediaModelheaderstatus,
                        ...Styles.textcenter,
                      }}
                      numberOfLines={1}
                    >
                      {moment(showImage.createdAt).format("MMM D, YYYY")}
                    </Text>
                  </View>
                ) : null}
              </View>
              <View style={Styles.appmediaModelheaderOption}>
                <View
                  style={{ ...Styles.appmediaModelheaderOptionicon }}
                ></View>
                {/* <View style={{ ...Styles.appmediaModelheaderOptionicon, width: "auto" }}>
                                <Text style={{ ...Styles.textcenter, ...Styles.fontprimary }} numberOfLines={1}>All Media</Text>
                            </View> */}
              </View>
            </View>
            <View style={Styles.appmediaModelcontainer}>
              {showImage.contentType == CONTENT_TYPE.video ? (
                <Video
                  style={Styles.appmediaModelvideo}
                  videoStyle={{ ...Styles.appmediaModelvideoplayer }}
                  source={{ uri: showImage.media }}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  isLooping={false}
                  shouldPlay
                // usePoster
                // onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
              ) : (
                <Image
                  style={{ ...Styles.appmediaModelimg }}
                  source={{ uri: showImage.media }}
                  alt="No Image"
                />
              )}
            </View>
            {/* <View style={{ ...Styles.optionbar }}>
                    <View style={{ ...Styles.optionbarinner }}>
                        <View style={{ ...Styles.optionbaricon, ...Styles.optionbariconactive, ...Styles.itemCenter }}>
                            <Svg viewBox="0 -960 960 960" style={{ ...Styles.iconprimary, ...Styles.icon20 }}><Path d="m640-280-57-56 184-184-184-184 57-56 240 240-240 240ZM80-200v-160q0-83 58.5-141.5T280-560h247L383-704l57-56 240 240-240 240-57-56 144-144H280q-50 0-85 35t-35 85v160H80Z" /></Svg>
                        </View>
                        <View style={{ ...Styles.optionbaricon, ...Styles.optionbariconactive, ...Styles.itemCenter }}>
                            <Svg viewBox="0 0 24 24" style={{ ...Styles.iconprimary, ...Styles.icon20 }}><Path d="M19.333,14.667a4.66,4.66,0,0,0-3.839,2.024L8.985,13.752a4.574,4.574,0,0,0,.005-3.488l6.5-2.954a4.66,4.66,0,1,0-.827-2.643,4.633,4.633,0,0,0,.08.786L7.833,8.593a4.668,4.668,0,1,0-.015,6.827l6.928,3.128a4.736,4.736,0,0,0-.079.785,4.667,4.667,0,1,0,4.666-4.666ZM19.333,2a2.667,2.667,0,1,1-2.666,2.667A2.669,2.669,0,0,1,19.333,2ZM4.667,14.667A2.667,2.667,0,1,1,7.333,12,2.67,2.67,0,0,1,4.667,14.667ZM19.333,22A2.667,2.667,0,1,1,22,19.333,2.669,2.669,0,0,1,19.333,22Z" /></Svg>
                        </View>
                        <View style={{ ...Styles.optionbaricon, ...Styles.optionbariconactive, ...Styles.itemCenter }}>
                            <Svg viewBox="0 0 24 24" style={{ ...Styles.iconprimary, ...Styles.icon20 }}><Path d="M23.836,8.794a3.179,3.179,0,0,0-3.067-2.226H16.4L15.073,2.432a3.227,3.227,0,0,0-6.146,0L7.6,6.568H3.231a3.227,3.227,0,0,0-1.9,5.832L4.887,15,3.535,19.187A3.178,3.178,0,0,0,4.719,22.8a3.177,3.177,0,0,0,3.8-.019L12,20.219l3.482,2.559a3.227,3.227,0,0,0,4.983-3.591L19.113,15l3.56-2.6A3.177,3.177,0,0,0,23.836,8.794Zm-2.343,1.991-4.144,3.029a1,1,0,0,0-.362,1.116L18.562,19.8a1.227,1.227,0,0,1-1.895,1.365l-4.075-3a1,1,0,0,0-1.184,0l-4.075,3a1.227,1.227,0,0,1-1.9-1.365L7.013,14.93a1,1,0,0,0-.362-1.116L2.507,10.785a1.227,1.227,0,0,1,.724-2.217h5.1a1,1,0,0,0,.952-.694l1.55-4.831a1.227,1.227,0,0,1,2.336,0l1.55,4.831a1,1,0,0,0,.952.694h5.1a1.227,1.227,0,0,1,.724,2.217Z" /></Svg>
                        </View>
                        <View style={{ ...Styles.optionbaricon, ...Styles.optionbariconactive, ...Styles.itemCenter }}>
                            <Svg viewBox="0 -960 960 960" style={{ ...Styles.iconprimary, ...Styles.icon20 }}><Path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"></Path></Svg>
                        </View>
                    </View>
                </View> */}
          </View>
        ) : (
          <View style={Styles.mediaModel}>
            <View style={Styles.mediaModelheader}>
              <Pressable
                onPress={onClose}
                style={Styles.mediaModelheaderOption}
              >
                <View
                  style={{
                    ...Styles.mediaModelheaderOptionicon,
                    ...Styles.icon24,
                  }}
                >
                  {closeIconWhite}
                </View>
              </Pressable>
              {showImage.sender ||
                (showImage.receiver && showImage.createdAt) ? (
                <View style={Styles.mediaModelheaderInfo}>
                  <Text
                    style={{ ...Styles.mediaModelheadertitle }}
                    numberOfLines={1}
                  >
                    {showImage.sender == USER_ID
                      ? translation.you
                      : showImage.chat.name}
                  </Text>
                  <Text
                    style={{ ...Styles.mediaModelheaderstatus }}
                    numberOfLines={1}
                  >
                    {moment(showImage.createdAt).format("MMM D, YYYY")}
                  </Text>
                </View>
              ) : null}
              {/* <View style={{ ...Styles.mediaModelheaderOption }}>
                            <View style={{ ...Styles.mediaModelheaderOptionicon }}>
                                <Svg viewBox="0 -960 960 960" style={{ ...Styles.icon24, fill: "#fff" }}><Path d="m640-280-57-56 184-184-184-184 57-56 240 240-240 240ZM80-200v-160q0-83 58.5-141.5T280-560h247L383-704l57-56 240 240-240 240-57-56 144-144H280q-50 0-85 35t-35 85v160H80Z" /></Svg>
                            </View>
                        </View>
                        <View style={{ ...Styles.mediaModelheaderOption }}>
                            <View style={{ ...Styles.mediaModelheaderOptionicon }}>
                                <Svg viewBox="0 0 24 24" style={{ ...Styles.icon20, fill: "#fff" }}><Path d="M19.333,14.667a4.66,4.66,0,0,0-3.839,2.024L8.985,13.752a4.574,4.574,0,0,0,.005-3.488l6.5-2.954a4.66,4.66,0,1,0-.827-2.643,4.633,4.633,0,0,0,.08.786L7.833,8.593a4.668,4.668,0,1,0-.015,6.827l6.928,3.128a4.736,4.736,0,0,0-.079.785,4.667,4.667,0,1,0,4.666-4.666ZM19.333,2a2.667,2.667,0,1,1-2.666,2.667A2.669,2.669,0,0,1,19.333,2ZM4.667,14.667A2.667,2.667,0,1,1,7.333,12,2.67,2.67,0,0,1,4.667,14.667ZM19.333,22A2.667,2.667,0,1,1,22,19.333,2.669,2.669,0,0,1,19.333,22Z" /></Svg>
                            </View>
                        </View>
                        <View style={{ ...Styles.mediaModelheaderOption }}>
                            <View style={{ ...Styles.mediaModelheaderOptionicon }}>
                                <Svg viewBox="0 0 24 24" style={{ ...Styles.icon20, fill: "#fff" }}><Path d="M23.836,8.794a3.179,3.179,0,0,0-3.067-2.226H16.4L15.073,2.432a3.227,3.227,0,0,0-6.146,0L7.6,6.568H3.231a3.227,3.227,0,0,0-1.9,5.832L4.887,15,3.535,19.187A3.178,3.178,0,0,0,4.719,22.8a3.177,3.177,0,0,0,3.8-.019L12,20.219l3.482,2.559a3.227,3.227,0,0,0,4.983-3.591L19.113,15l3.56-2.6A3.177,3.177,0,0,0,23.836,8.794Zm-2.343,1.991-4.144,3.029a1,1,0,0,0-.362,1.116L18.562,19.8a1.227,1.227,0,0,1-1.895,1.365l-4.075-3a1,1,0,0,0-1.184,0l-4.075,3a1.227,1.227,0,0,1-1.9-1.365L7.013,14.93a1,1,0,0,0-.362-1.116L2.507,10.785a1.227,1.227,0,0,1,.724-2.217h5.1a1,1,0,0,0,.952-.694l1.55-4.831a1.227,1.227,0,0,1,2.336,0l1.55,4.831a1,1,0,0,0,.952.694h5.1a1.227,1.227,0,0,1,.724,2.217Z" /></Svg>
                            </View>
                        </View>
                        <View style={{ ...Styles.mediaModelheaderOption }}>
                            <View style={{ ...Styles.mediaModelheaderOptionicon }}>
                                <Svg viewBox="0 -960 960 960" style={{ ...Styles.icon20, fill: "#fff" }}><Path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"></Path></Svg>
                            </View>
                        </View> */}
            </View>
            <View style={Styles.mediaModelcontainer}>
              {showImage.contentType == CONTENT_TYPE.video ? (
                <Video
                  style={Styles.appmediaModelvideo}
                  videoStyle={{ ...Styles.appmediaModelvideoplayer }}
                  source={{ uri: showImage.media }}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  isLooping={false}
                  shouldPlay
                />
              ) : (
                <Image
                  style={{ ...Styles.mediaModelimg }}
                  source={{ uri: showImage.media }}
                  alt="No Image"
                />
              )}
            </View>
            {/* <View style={{ ...Styles.mediaModelNav, ...Styles.mediaModelNavprev, }}>
                        <Svg viewBox="0 -960 960 960" style={{ ...Styles.icon24 }}><Path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" /></Svg>
                    </View>
                    <View style={{ ...Styles.mediaModelNav, ...Styles.mediaModelNavnxt, }}>
                        <Svg viewBox="0 -960 960 960" style={{ ...Styles.icon24 }}><Path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" /></Svg>
                    </View> */}
          </View>
        )}
      </Modal>
    );
  return null;
};

export default ViewImage;
