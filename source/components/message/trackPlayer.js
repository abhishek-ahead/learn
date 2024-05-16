import { Audio } from "expo-av";
import { useContext, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { deleteIcon, pauseIcon, playIcon } from "../../constant/icons";
import { AppContext } from "../../context/app";

const TrackPlayer = ({ trackUri, playerOnly, setRecording, trackDuration }) => {
  const { Styles } = useContext(AppContext)
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(null);
  const [position, setPosition] = useState(null);

  const loadSound = async () => {
    const { sound, status } = await Audio.Sound.createAsync({ uri: trackUri });
    setSound(sound);
    setDuration(status.durationMillis || trackDuration);
  };

  useEffect(() => {
    if (trackUri) {
      loadSound();
    }
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [trackUri]);

  const togglePlayback = async () => {
    if (!sound) {
      return;
    }
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      if (position == duration) await sound.playFromPositionAsync(0);
      else await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const updatePosition = async () => {
    const { positionMillis, durationMillis } = await sound.getStatusAsync();
    setPosition(positionMillis);
    !duration && setDuration(durationMillis);
    if (positionMillis == durationMillis) setIsPlaying(false);
  };

  useEffect(() => {
    if (sound && isPlaying) {
      const interval = setInterval(() => {
        updatePosition();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [sound, isPlaying, duration]);

  const formatTime = (milliseconds) => {
    const totalSeconds = milliseconds / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <>
      <Pressable
        onPress={togglePlayback}
        style={{ ...Styles.composermainoption, ...Styles.itemCenter }}
      >
        <View style={Styles.icon24}>{isPlaying ? pauseIcon({ ...Styles.icondefault }) : playIcon(Styles.icondefault)}</View>
      </Pressable>
      <View style={Styles.audiorecorded}>
        <View style={Styles.audiorecordedtrack}>
          <View
            style={{
              ...Styles.audiorecordedtrackprocess,
              width: `${(position / duration) * 100}%`,
            }}
          >
            <View style={Styles.audiorecordedtrackprocesshandle}></View>
          </View>
        </View>
        <View style={Styles.audiorecordedtime}>
          <Text style={{ ...Styles.fontlight, ...Styles.fontsizesmall }}>
            {formatTime(position)}
          </Text>
          {duration ? <Text style={{ ...Styles.fontlight, ...Styles.fontsizesmall }}>
            {formatTime(duration)}
          </Text> : null}
        </View>
      </View>
      {!playerOnly ? (
        <Pressable
          onPress={() => setRecording(null)}
          style={{ ...Styles.composermainoption, ...Styles.itemCenter }}
        >
          <View style={Styles.icon24}>{deleteIcon(Styles.icondanger)}</View>
        </Pressable>
      ) : null}
    </>
  );
};

export default TrackPlayer;
