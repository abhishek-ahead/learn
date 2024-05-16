import { default as React, useContext } from "react";
import { Modal, Platform, Pressable, Text, View } from "react-native";
import { closeIcon } from "../constant/icons";
import { AppContext } from "../context/app";
import { MessageContext } from "../context/message";
import { deleteMessage, deleteMessageEveryone } from "../services/message";

const DeleteDialog = () => {
  const { chat } = useContext(MessageContext);
  const {
    deleteOpen: message,
    setDeleteOpen,
    translation,
    Styles
  } = useContext(AppContext);
  const onClose = () => setDeleteOpen(null);
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={message ? true : false}
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
                  {translation.deleteMessage}
                </Text>
              </View>
              <View
                style={{ ...Styles.confirmmodalcontent, paddingVertical: 0 }}
              >
                <Pressable
                  onPress={() => {
                    deleteMessage({ chat: chat._id, messages: [message._id] });
                    onClose();
                  }}
                >
                  <View
                    style={{
                      ...Styles.optionsmodalitem,
                      ...Styles.btnalt,
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        ...Styles.optionsmodalitemtext,
                        ...Styles.textcenter,
                        ...Styles.fontdanger,
                      }}
                    >
                      {translation.deleteForMe}
                    </Text>
                  </View>
                </Pressable>
                {message?.fromMe && !message.deleted ? (
                  <Pressable
                    onPress={() => {
                      deleteMessageEveryone({ messages: [message._id] });
                      onClose();
                    }}
                  >
                    <View
                      style={{ ...Styles.optionsmodalitem, ...Styles.btnalt }}
                    >
                      <Text
                        style={{
                          ...Styles.optionsmodalitemtext,
                          ...Styles.textcenter,
                          ...Styles.fontdanger,
                        }}
                      >
                        {translation.deleteForEveryOne}
                      </Text>
                    </View>
                  </Pressable>
                ) : null}
              </View>
            </View>
            <Pressable onPress={onClose} style={{ ...Styles.cancelButton }}>
              <Text style={{ ...Styles.cancelButtonText, ...Styles.textcenter }}>{translation.cancel}</Text>
            </Pressable>
          </View>
        ) : (
          <View style={{ ...Styles.modalmain, ...Styles.confirmmodalmain }}>
            <View style={Styles.modalheader}>
              <View style={Styles.modalheaderinfo}>
                <Text style={Styles.modalheadertitle}>
                  {translation.deleteMessage}
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
                  <View style={Styles.icon18}>{closeIcon(Styles.icondefault)}</View>
                </Pressable>
              </View>
            </View>
            <View style={{ ...Styles.confirmmodalcontent }}>
              <Pressable
                onPress={() => {
                  deleteMessage({ chat: chat._id, messages: [message._id] });
                  onClose();
                }}
              >
                <View
                  style={{
                    ...Styles.optionsmodalitem,
                    ...Styles.btnalt,
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      ...Styles.optionsmodalitemtext,
                      ...Styles.textcenter,
                      ...Styles.fontdanger,
                    }}
                  >
                    {translation.deleteForMe}
                  </Text>
                </View>
              </Pressable>
              {message?.fromMe && !message.deleted ? (
                <Pressable
                  onPress={() => {
                    deleteMessageEveryone({ messages: [message._id] });
                    onClose();
                  }}
                >
                  <View
                    style={{ ...Styles.optionsmodalitem, ...Styles.btnalt }}
                  >
                    <Text
                      style={{
                        ...Styles.optionsmodalitemtext,
                        ...Styles.textcenter,
                        ...Styles.fontdanger,
                      }}
                    >
                      {translation.deleteForEveryOne}
                    </Text>
                  </View>
                </Pressable>
              ) : null}
            </View>
          </View>
        )}
      </Pressable>
    </Modal>
  );
};

export default DeleteDialog;
