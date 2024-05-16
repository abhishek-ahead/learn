import { default as React, useContext } from "react";
import { Modal, Platform, Pressable, Text, View } from "react-native";
import { closeIcon, lockIconWhite } from "../constant/icons";
import { AppContext } from "../context/app";
import Styles from "../styles";

const ConfirmationDialog = () => {
  const { confirmationDialog, setConfimationDialog } = useContext(AppContext);
  const onClose = () => setConfimationDialog(null);

  return confirmationDialog ? (
    <Modal
      animationType="fade"
      transparent={true}
      visible={confirmationDialog ? true : false}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        onPress={onClose}
        style={{ ...Styles.modalContainer, margin: 0 }}
      >
        {Platform.OS !== "web" ? (
          <View style={{ ...Styles.optionsmodalContainer }}>
            <View style={{ ...Styles.optionsmodaloptions }}>
              <View style={Styles.optionsmodalheader}>
                <Text style={{ ...Styles.optionsmodalTitle }}>
                  {confirmationDialog.heading}
                </Text>
              </View>
              <View
                style={{ ...Styles.confirmmodalcontent, paddingVertical: 0 }}
              >
                <Text
                  style={{ ...Styles.optionsmodaldes, ...Styles.textcenter }}
                >
                  {confirmationDialog.message}
                </Text>
                <Pressable
                  onPress={() => {
                    confirmationDialog.callback(confirmationDialog.chat);
                    onClose();
                  }}
                  style={{ ...Styles.optionsmodalitem, ...Styles.btnalt }}
                >
                  <Text
                    style={{
                      ...Styles.optionsmodalitemtext,
                      ...Styles.fontprimary,
                      ...Styles.textcenter,
                    }}
                  >
                    Confirm
                  </Text>
                </Pressable>
              </View>
            </View>
            <Pressable onPress={onClose} style={{ ...Styles.cancelButton }}>
              <Text style={{ ...Styles.cancelButtonText, ...Styles.textcenter }}>Cancel</Text>
            </Pressable>
          </View>
        ) : (
          <View style={{ ...Styles.modalmain, ...Styles.confirmmodalmain }}>
            <View style={Styles.modalheader}>
              <View style={Styles.modalheaderinfo}>
                <Text style={Styles.modalheadertitle}>
                  {confirmationDialog.heading}
                </Text>
              </View>
              <View
                style={{ ...Styles.modalheaderOption, ...Styles.itemCenter }}
              >
                <Pressable
                  onPress={onClose}
                  style={{
                    ...Styles.modalheaderOptionicon,
                    ...Styles.itemCenter,
                  }}
                >
                  <View style={Styles.icon18}>{closeIcon}</View>
                </Pressable>
              </View>
            </View>
            <View style={{ ...Styles.confirmmodalcontent }}>
              <Text style={{ ...Styles.optionsmodaldes, ...Styles.textcenter }}>
                {confirmationDialog.message}
              </Text>

              <Pressable
                onPress={() => {
                  confirmationDialog.callback(confirmationDialog.chat);
                  onClose();
                }}
                style={{ ...Styles.optionsmodalitem, ...Styles.btnalt }}
              >
                <Text
                  style={{
                    ...Styles.optionsmodalitemtext,
                    ...Styles.fontprimary,
                    ...Styles.textcenter,
                  }}
                >
                  Confirm
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </Pressable>
    </Modal>
  ) : (
    <></>
  );
};

export default ConfirmationDialog;
