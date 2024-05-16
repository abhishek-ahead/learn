import { Audio } from "expo-av";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { pauseIcon, playIcon } from "../../constant/icons";
import { AppContext } from "../../context/app";

const Recording = ({ enableRecording, setRecording }) => {
  const onRecord = useRef();
  const { Styles } = useContext(AppContext)
  const [permissionResponse, setPermissionResponse] = useState();
  const [duration, setDuration] = useState(0);
  const [recordingStarted, setRecordingStarted] = useState(false);

  async function startRecording() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const sound = new Audio.Recording();
      await sound.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await sound.startAsync();
      setRecordingStarted(true);
      onRecord.current = sound;
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    await onRecord.current.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = onRecord.current.getURI();
    setRecording({ uri: uri, duration: onRecord.current._finalDurationMillis });
  }

  async function toggleRecording() {
    if (recordingStarted) {
      await onRecord.current.startAsync();
    } else await onRecord.current.pauseAsync();
    setRecordingStarted((prev) => !prev);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      recordingStarted && setDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [recordingStarted]);

  useEffect(() => {
    // Simply get recording permission upon first render
    async function getPermission() {
      await Audio.requestPermissionsAsync()
        .then((permission) => {
          setPermissionResponse(permission.granted);
        })
        .catch((error) => {
          console.log(error);
        });
      startRecording();
    }
    // Call function to get permission
    getPermission();
    // Cleanup upon first render
    return () => stopRecording();
  }, []);

  return useMemo(
    () => (
      <View style={Styles.audiorecordwrap}>
        <Pressable
          onPress={() => toggleRecording()}
          style={{ ...Styles.composermainoption, ...Styles.itemCenter }}
        >
          <View style={Styles.icon24}>
            {recordingStarted ? pauseIcon({ ...Styles.icondefault }) : playIcon(Styles.icondefault)}
          </View>
        </Pressable>
        <View style={{ ...Styles.audiorecordmain, gap: 5 }}>
          <View style={Styles.audiorecorddot}></View>
          <Text>
            {String(Math.floor(duration / 60)).padStart(2, "0")}:
            {String(duration % 60).padStart(2, "0")}
          </Text>
        </View>
      </View>
    ),
    [enableRecording, duration, recordingStarted]
  );
};

export default Recording;
