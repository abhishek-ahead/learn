import { default as React, useContext, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View
} from "react-native";
import { useDispatch } from "react-redux";
import { eyeIcon, eyeIconcrossed, lockIcon } from "../../constant/icons";
import { AppContext } from "../../context/app";
import { ChatContext } from "../../context/chat";
import { validatePassword } from "../../services/group";
import { chatPassword } from "../../store/reducer";
import { webStyle } from "../../styles";

const PasswordConfirmation = () => {
  const dispatch = useDispatch();
  const { passwordDialog, setPassowordDialog, handleNavigate, Styles } =
    useContext(AppContext);
  const { setOpenOption } = useContext(ChatContext)
  const onClose = () => setPassowordDialog(null);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(false);
  const [showPassword, setShowPassword] = useState(true)
  // const { setOpenOption } = useContext(ChatContext);

  const handleValidated = () => {
    onClose();
    if (passwordDialog.screen == "options") {
      setOpenOption(passwordDialog.item);
    } else {
      handleNavigate(passwordDialog.item.chat._id, passwordDialog.screen);
    }
  }

  const handleSubmit = async () => {
    setProgress(true);
    const response = await validatePassword({
      group: passwordDialog.item.chat._id,
      password: text,
    });
    if (response.success) {
      if (Platform.OS == "web") {
        const localPasswords = JSON.parse(localStorage.getItem("passwords")) || {};
        localPasswords[passwordDialog.item.chat._id] = text;
        localStorage.setItem("passwords", JSON.stringify(localPasswords))
      } else
        dispatch(
          chatPassword({ chat: passwordDialog.item.chat._id, password: text })
        );
      handleValidated();
    }
    setText("");
    setProgress(false);
  };

  return passwordDialog ? (
    <Modal
      animationType="fade"
      transparent={true}
      visible={passwordDialog ? true : false}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View
        // onPress={onClose}
        style={{ ...Styles.centermodalcontainer }}
      >
        <View style={{ ...Styles.centermodalcontent }}>
          <KeyboardAvoidingView behavior="padding">
            <View style={{ alignItems: "center" }}>
              <View style={{ ...Styles.centermodalIcon, ...Styles.itemCenter }}>
                <View style={{ ...Styles.icon30 }}>{lockIcon(Styles.iconwhite)}</View>
              </View>
            </View>
            <Text
              style={{
                ...Styles.centermodalTitle,
                ...Styles.textcenter,
                ...Styles.font500,
                ...Styles.fontdefault,
              }}
            >
              Please enter password to access this group.
            </Text>

            <View style={{ ...Styles.forminput, alignItems: "center" }}>
              <TextInput
                secureTextEntry={showPassword}
                style={{
                  ...Styles.forminputText,
                  ...webStyle,
                  flex: 1,
                  width: "100%",
                }}
                onChangeText={(text) => setText(text)}
                onKeyPress={(e) => {
                  if (
                    Platform.OS == "web" &&
                    e.nativeEvent.key == "Enter" &&
                    !e.nativeEvent.shiftKey
                  ) {
                    e.preventDefault();
                    handleSubmit();
                    return false;
                  }
                  return true;
                }}
                // style={{ ...Styles.fontlight }}
                placeholder="Enter the password"
                placeholderTextColor={Styles.fontlight.color}
                autoFocus
              ></TextInput>
              <Pressable onPress={() => setShowPassword(prev => !prev)} style={{ ...Styles.forminputIcon, ...Styles.icon18, }}>
                {!showPassword ? eyeIcon(Styles.iconlight) : eyeIconcrossed(Styles.iconlight)}
              </Pressable>
            </View>
            <Text style={{ ...Styles.mtop5, ...Styles.fontlink }}>
              Forgot Password ?
            </Text>
            {progress ? (
              <View
                style={{
                  ...Styles.centermodalBtn,
                  ...Styles.btnPrimary,
                }}
              >
                <ActivityIndicator size="small" color="#fff" />
              </View>
            ) : (
              <Pressable
                style={{
                  ...Styles.centermodalBtn,
                  ...Styles.btnPrimary,
                }}
                onPress={handleSubmit}
              >
                <Text
                  style={{
                    ...Styles.fontwhite,
                    ...Styles.textcenter,
                    ...Styles.fontsizenormal,
                  }}
                >
                  Submit
                </Text>
              </Pressable>
            )}
            <Pressable
              style={{
                ...Styles.btn,
                ...Styles.centermodalBtn,
                ...Styles.btnOutline,
                marginTop: 10,
              }}
              onPress={onClose}
            >
              <Text
                style={{
                  ...Styles.fontdefault,
                  ...Styles.textcenter,
                  ...Styles.fontsizenormal,
                }}
              >
                Cancel
              </Text>
            </Pressable>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  ) : (
    <></>
  );
};

export default PasswordConfirmation;
