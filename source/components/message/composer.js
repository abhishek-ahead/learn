/* eslint-disable react-hooks/exhaustive-deps */
import EmojiPicker from "emoji-picker-react";
import { ResizeMode, Video } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React, { memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  ATTACHMENT_TYPES,
  CHAT_TYPE,
  CONTENT_TYPE,
  MESSAGE_STATUS,
  PERMISSION,
  SOCKET_EVENTS,
  TOAST_TYPE,
  USER_STATUS,
  regexMentionSuggestion,
} from "../../constant";
import {
  addIcon,
  addcirclaicon,
  closeIcon,
  crosscirclaicon,
  disableSend,
  documentoutlinewhite,
  emojiIcon,
  emojiIconPrimary,
  mic,
  micprimary,
  playIconWhite,
  selectImagewhite,
  send,
  fileIcon
} from "../../constant/icons";
import { AppContext } from "../../context/app";
import { AuthContext } from "../../context/auth";
import { MessageContext } from "../../context/message";
import { useSocket } from "../../context/socket";
import { sendMessage } from "../../services/message";
import { deleteRefMessage } from "../../store/reducer";
import Styles, { webStyle } from "../../styles";
import CameraScreen from "../camera";
import MessageContentType from "../messageContentType";
import Recording from "./recording";
import TrackPlayer from "./trackPlayer";

const HandleAttachementType = memo(({ attach }) => {
  const fileType = attach.mimeType.split("/")[0];

  // const [fileType, setFileType] = useState()
  // useEffect(() => {
  //   try {
  //     if (Platform.OS == "web") {
  //       fetch(attach.uri).then((response) =>
  //         response.blob()
  //       ).then((fileBlob) => {
  //         const fileType = fileBlob.type.split("/")[0];
  //         setFileType(fileType)
  //       });
  //     } else {
  //       const fileType = attach.mimeType.split("/")[0];
  //       setFileType(fileType)
  //     }

  //   } catch (error) {
  //     console.log("error", error);
  //     return null;
  //   }
  // }, [])

  if (fileType)
    switch (fileType) {
      case CONTENT_TYPE.image:
        return (
          <Image
            style={{ ...Styles.composerattachmentitemimg, ...Styles.bgdark }}
            source={{ uri: attach.uri }}
          />
        );
      case CONTENT_TYPE.video:
        return (
          <View>
            <Video
              style={{ ...Styles.composerattachmentitemimg, ...Styles.bgdark }}
              videoStyle={{
                ...Styles.messageitemattachmentvideoplayer,
              }}
              source={{ uri: attach.uri }}
              useNativeControls={false}
              resizeMode={ResizeMode.COVER}
              isLooping={false}
              usePoster
            />
            <View
              style={{
                ...Styles.mediacontaineritemvideoplay,
                ...Styles.itemCenter,
              }}
            >
              {playIconWhite}
            </View>
          </View>
        );
      default:
        return (
          <View
            style={{
              ...Styles.composerattachmentitemimg,
              ...Styles.itemCenter,
              ...Styles.bgdark
            }}
          >
            {fileIcon}
          </View>
        );
    }
  return null
})

const Attachment = ({ attach, handleRemoveAttachment, handleAttachements, type }) => {
  const { reply } = useContext(MessageContext);
  return useMemo(() => <View style={{ ...Styles.composerattachmentcontainer, height: 60 }}>
    <ScrollView horizontal>
      {attach.map((ele, index) => (
        <View key={index} style={{ ...Styles.composerattachmentitem }}>
          <HandleAttachementType attach={ele} />
          <Pressable
            onPress={() => handleRemoveAttachment(index)}
            style={{ ...Styles.composerattachmentitemicon, ...Styles.icon18 }}
          >
            {closeIcon}
          </Pressable>
        </View>
      ))}
      {!reply ? <Pressable
        onPress={() => handleAttachements(type)}
        style={{ ...Styles.composerattachmentitem }}
      >
        <View
          style={{ ...Styles.composerattachmentitemimg, ...Styles.itemCenter }}
        >
          <View style={{ ...Styles.icon24 }}>{addIcon}</View>
        </View>
      </Pressable> : null}
    </ScrollView>
  </View>
    , [attach, reply])
};

const SelectAttachmentType = ({ handleSelectAttachType }) => {
  const { permissions } = useContext(AppContext);
  return (
    <View style={Styles.composeroptions}>
      {/* <Pressable
        onPress={() => handleSelectAttachType(ATTACHMENT_TYPES.camera)}
        style={{ ...Styles.composeroptionsitem, ...Styles.itemCenter }}
      >
        <View style={Styles.icon18}>{cameraoutlinedefault}</View>
      </Pressable> */}
      {permissions.includes(PERMISSION.share_photos_and_videos) ? (
        <Pressable onPress={() => handleSelectAttachType(ATTACHMENT_TYPES.image)} style={Styles.composeroptionsitem}>
          <View 
            style={{
              ...Styles.composeroptionsitemicon,
              ...Styles.itemCenter,
              backgroundColor: "#d64e2c",
            }}
          >
            <View style={Styles.icon18}>{selectImagewhite}</View>
          </View>
          <Text style={Styles.composeroptionsitemtext}>Photos</Text>
        </Pressable>
      ) : null}
      {permissions.includes(PERMISSION.share_document) ? (
        <Pressable onPress={() => handleSelectAttachType(ATTACHMENT_TYPES.document)} style={Styles.composeroptionsitem}>
          <View style={{
            ...Styles.composeroptionsitemicon,
            ...Styles.itemCenter,
            backgroundColor: "#6084f4",
          }}>
            <View style={Styles.icon18}>{documentoutlinewhite}</View>
          </View>
          <Text style={Styles.composeroptionsitemtext}>Document</Text>
        </Pressable>
      ) : null}
      {/* <View
        onPress={() => handleSelectAttachType(ATTACHMENT_TYPES.map)}
        style={{ ...Styles.composeroptionsitem, ...Styles.itemCenter }}
      >
        <View style={Styles.icon18}>{selectMap}</View>
      </View>
      <Pressable
        onPress={() => handleSelectAttachType(ATTACHMENT_TYPES.gif)}
        style={{ ...Styles.composeroptionsitem, ...Styles.itemCenter }}
      >
        <View style={{ width: 32 }}>{selectGif}</View>
      </Pressable>
      <Pressable
        onPress={() => handleSelectAttachType(ATTACHMENT_TYPES.sticker)}
        style={{ ...Styles.composeroptionsitem, ...Styles.itemCenter }}
      >
        <View style={Styles.icon18}>{selectSticker}</View>
      </Pressable> */}
    </View>
  );
};

const Reply = ({ message, setReply }) => {
  const { USER_ID } = useContext(AuthContext);
  const { translation } = useContext(AppContext);
  return (
    <View style={Styles.composerReply}>
      {message.contentType == CONTENT_TYPE.image ? (
        <View style={Styles.composerReplyimg}>
          <Image
            style={{ height: 45, width: 45, borderRadius: 5 }}
            source={{ uri: message.media }}
          />
        </View>
      ) : null}
      <View style={Styles.composerReplyinfo}>
        <View style={Styles.composerReplyinfotitle}>
          {message.sender == USER_ID ? (
            <Text style={Styles.fontlight}>{translation.you}</Text>
          ) : (
            <>
              <Text style={Styles.fontlight}>{translation.replyingTo}</Text>
              <Text style={Styles.composerReplyinfoname}>
                {message.user.name}
              </Text>
            </>
          )}
        </View>
        <View style={Styles.composerReplyinfofooter}>
          <MessageContentType message={message} />
          {/* <View style={Styles.icon16}>{cameraoutlinedefault}</View>
          <Text
            style={{ ...Styles.fontlight, ...Styles.fontsizesmall }}
            numberOfLines={1}
          >
            {message?.text || message.contentType}
          </Text> */}
        </View>
      </View>
      <Pressable
        onPress={() => setReply(null)}
        style={Styles.modalheaderOption}
      >
        <View style={Styles.modalheaderOptionicon}>
          <View style={{ ...Styles.icon, ...Styles.icon18 }}>{closeIcon}</View>
        </View>
      </Pressable>
    </View>
  );
};

const MentionSuggestion = ({ inputRef }) => {
  const { height, chat, inputText, setInputText, mentions } =
    useContext(MessageContext);
  const { USER_ID } = useContext(AuthContext);
  const groups = useSelector((state) => state.group.groups);
  const [members, setMembers] = useState([]);
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef();
  const membersRef = useRef(members);
  const currentRef = useRef(current);
  // const [scrollViewFocused, setScrollViewFocused] = useState(false);
  // const [layout, setLayout] = useState();

  useEffect(() => {
    membersRef.current = members;
    currentRef.current = 0;
    setCurrent(0);
  }, [members]);

  useEffect(() => {
    const handleMention = (text) => {
      const result = text.match(regexMentionSuggestion);
      if (result) {
        const input = result[1];
        const group = groups[chat._id];
        if (input) {
          const regex = new RegExp(input, "i");
          setMembers(
            group.members.filter(
              (member) =>
                regex.test(member.user.name) &&
                member.status == USER_STATUS.active &&
                member.user._id !== USER_ID
            )
          );
        } else {
          const members = group.members.filter(
            (member) =>
              member.status == USER_STATUS.active && member.user._id !== USER_ID
          );
          setMembers(members);
        }
      }
    };
    if (inputText && chat && groups) handleMention(inputText);
  }, [inputText, chat, groups]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        x: 0,
        y: current > 5 ? (current - 5) * 40 : 0,
        animated: true,
      });
    }
  }, [current, scrollRef]);

  useEffect(() => {
    const handleEvent = (e) => {
      switch (e.key) {
        case "ArrowUp": {
          e.preventDefault();
          currentRef.current =
            currentRef.current > 0 &&
            (currentRef.current = currentRef.current - 1);
          setCurrent((prev) => prev > 0 && (prev = prev - 1));
          break;
        }
        case "ArrowDown": {
          e.preventDefault();
          currentRef.current =
            membersRef.current.length - 1 > currentRef.current
              ? (currentRef.current = currentRef.current + 1)
              : (currentRef.current = currentRef.current);
          setCurrent((prev) =>
            membersRef.current.length - 1 > prev
              ? (prev = prev + 1)
              : (prev = prev)
          );
          break;
        }
        case "Enter":
          e.preventDefault();
          const member = membersRef.current[currentRef.current];
          mentions.current.push({
            _id: member.user._id,
            name: member.user.name,
          });
          setInputText((prev) =>
            prev.replace(regexMentionSuggestion, `@${member.user.name} `)
          );
          break;
      }
    };
    if (Platform.OS == "web") {
      document.addEventListener("keyup", handleEvent);
      return () => document.removeEventListener("keyup", handleEvent);
    }
  }, []);

  // useEffect(() => {
  //   if (layout) {
  //     console.log("layout>>", layout);
  //     scrollRef.current.measure((value) => console.log("measure value", value));
  //   }
  // }, [layout]);

  if (members.length)
    return (
      <View style={{ ...Styles.composerAutosuggest, bottom: height + 20 }}>
        <ScrollView
          ref={scrollRef}
          // onPointerEnter={() => setScrollViewFocused(true)}
          // onPointerLeave={() => {
          //   setScrollViewFocused(false);
          // }}
          keyboardShouldPersistTaps={"always"}
          style={Styles.composerAutosuggestinner}
        >
          {members.map((member, index) => (
            <Pressable
              // onLayout={(event) => index == current && setLayout(event)}
              // onPointerEnter={() => {
              //   setCurrent(index);
              //   currentRef.current = index;
              // }}
              onPress={() => {
                inputRef.current.focus();
                mentions.current.push({
                  _id: member.user._id,
                  name: member.user.name,
                });
                setInputText((prev) =>
                  prev.replace(regexMentionSuggestion, `@${member.user.name} `)
                );
              }}
              key={`member_${member._id}`}
              style={
                Platform.OS == "web" && index == current
                  ? {
                    ...Styles.composerAutosuggesItem,
                    ...Styles.composerAutosuggesItemActive,
                  }
                  : {
                    ...Styles.composerAutosuggesItem,
                  }
              }
            >
              <Image
                style={{ height: 30, width: 30, borderRadius: 50 }}
                source={{
                  uri: member.user.avatar,
                }}
              />
              <Text
                style={{ ...Styles.font500 }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {member.user.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
};

const ChatComposer = () => {
  const {
    chat,
    attach,
    setAttach,
    height,
    setHeight,
    inputText,
    setInputText,
    selectAttachType,
    setSelectAttachType,
    reply,
    setReply,
    handleNewMsgDispatch,
    mentions,
    emojiPicker,
    setEmojiPicker,
  } = useContext(MessageContext);
  const socket = useSocket();
  const dispatch = useDispatch();
  const [recording, setRecording] = useState();
  const [enableRecording, setEnableRecording] = useState(false);
  const { USER_ID, user } = useContext(AuthContext);
  const { permissions, setToastNotification } = useContext(AppContext);
  const [enableMentionSuggestion, setEnableMentionSuggestion] = useState(false);
  const selectedType = useRef();

  const updateSize = (e, height) => {
    if (!inputText) {
      return;
    }
    if (inputText == "") {
      setHeight(22);
    }
    if (height > 22 && height <= 150) setHeight(height);
  };

  useEffect(() => {
    if (!inputText) {
      setHeight(22);
    }
    if (inputText.length) {
      const result = inputText.match(regexMentionSuggestion);
      if (result) setEnableMentionSuggestion(true);
      else setEnableMentionSuggestion(false);
    } else setEnableMentionSuggestion(false);
    if (chat && inputText) {
      let timeout;
      timeout = setTimeout(() => {
        socket.emit(SOCKET_EVENTS.user_action, {
          chat: chat._id,
          receiverType: chat.chatType,
          action: "typing",
        });
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [inputText, chat]);

  const handleSendMessage = async () => {
    try {
      let text = inputText.trim();
      mentions.current.forEach(
        (mention) =>
          (text = text.replace(`@${mention.name}`, `@${mention._id}`))
      );
      emojiPicker && setEmojiPicker((prev) => !prev);
      if (attach.length) {
        attach.forEach(async (file, index) => {
          const type = file.mimeType.split("/")[0];
          const data = new FormData();
          data.append("to", chat._id);
          data.append("receiverType", chat.chatType);
          const refId = `${USER_ID}_${String(Date.now())}`;
          data.append("refId", refId);
          data.append("type", type);
          const tempMsg = {
            _id: refId,
            sender: USER_ID,
            receiver: chat._id,
            receiverType: chat.chatType,
            contentType: type,
            media: file.uri,
            forward: false,
            edited: false,
            deleted: false,
            fromMe: true,
            createdAt: new Date(),
            message_status: MESSAGE_STATUS.pending,
            mediaDetails: {
              originalname: file.name || file.fileName,
              mimetype: file.mimeType,
              mediaSize: file.fileSize,
            },
            user: user,
            mentions: mentions.current,
          };

          if (index == 0 && (inputText || reply)) {
            if (inputText) {
              data.append("text", inputText);
              tempMsg.text = text;
              tempMsg.mentions = mentions.current;
              // mentions.current.forEach((mention) =>
              //   data.append("mentions[]", mention._id)
              // );
              mentions.current.forEach((mention, index) =>
                Object.keys(mention).forEach((key) => {
                  data.append(`mentions[${index}][${key}]`, mention[key]);
                })
              );
            }
            if (reply) {
              data.append("reply", reply._id);
              tempMsg.reply = reply;
            }
          }
          if (Platform.OS == "web") {
            // const fileBlob = await fetch(file.uri).then((response) =>
            //   response.blob()
            // );
            // const type = fileBlob.type.split("/")[0];
            // data.append("type", type);
            // console.log("file >", file, "blob", fileBlob)
            // tempMsg.contentType = type;
            // tempMsg.mediaDetails.mimetype = fileBlob.type;
            // tempMsg.mediaDetails.mediaSize = fileBlob.size;
            data.append("file", file.blob, file.name || file.fileName);
          } else {
            // const type = file.mimeType.split("/")[0];
            // data.append("type", type);
            // tempMsg.contentType = type;
            // tempMsg.mediaDetails.mimetype = file.mimeType;
            // tempMsg.mediaDetails.mediaSize = file.fileSize;
            data.append("file", {
              uri: file.uri,
              type: file.mimeType,
              name: file.name || file.fileName,
            });
          }
          if (tempMsg.contentType == CONTENT_TYPE.video && tempMsg.mediaDetails.mimetype !== "video/mp4") {
            tempMsg.media = ""
          }
          handleNewMsgDispatch({ chatId: chat._id, message: tempMsg });
          sendMessage(data).then((response) => {
            if (!response.success) {
              dispatch(deleteRefMessage({ chat: chat._id, refId: refId }))
              setToastNotification({ type: TOAST_TYPE.error, message: "Errow while sending Message" })
            }
          });
        });
        setInputText("");
        setHeight(22);
        setAttach([]);
        reply && setReply(null)
      } else if (recording) {
        const data = new FormData();
        data.append("to", chat._id);
        data.append("receiverType", chat.chatType);
        data.append("type", CONTENT_TYPE.audio);
        const date = Date.now();
        const refId = `${USER_ID}_${String(Date.now())}`;
        data.append("refId", refId);
        const tempMsg = {
          _id: refId,
          sender: USER_ID,
          receiver: chat._id,
          receiverType: chat.chatType,
          contentType: "audio",
          media: recording.uri,
          message_status: MESSAGE_STATUS.pending,
          forward: false,
          edited: false,
          deleted: false,
          createdAt: new Date(),
          fromMe: true,
          mediaDetails: {
            originalname: `${date}.webm`,
            mimetype: "audio/webm",
            mediaSize: 0,
          },
          user: user,
        };
        if (reply) {
          data.append("reply", reply._id);
          tempMsg.reply = reply;
        }
        if (Platform.OS == "web") {
          const fileBlob = await fetch(recording.uri).then((response) =>
            response.blob()
          );
          tempMsg.mediaDetails.mediaSize = fileBlob.size;
          data.append("file", fileBlob, `${date}.webm`);
        } else {
          data.append("file", {
            uri: recording.uri,
            type: "audio/x-m4a",
            name: `${date}.m4a`,
          });
        }
        handleNewMsgDispatch({ chatId: chat._id, message: tempMsg });
        sendMessage(data).then((response) => {
          if (!response.success) {
            dispatch(deleteRefMessage({ chat: chat._id, refId: refId }))
            setToastNotification({ type: TOAST_TYPE.error, message: "Errow while sending Message" })
          }
        });
        reply && setReply(null);
        setRecording(null);
        setHeight(22);
      } else {
        const data = new FormData();
        data.append("to", chat._id);
        data.append("receiverType", chat.chatType);
        data.append("type", "text");
        data.append("text", text);
        const refId = `${USER_ID}_${String(Date.now())}`;
        data.append("refId", refId);
        // mentions.current.forEach((mention) =>
        //   data.append("mentions[]", mention._id)
        // );
        mentions.current.forEach((mention, index) =>
          Object.keys(mention).forEach((key) => {
            data.append(`mentions[${index}][${key}]`, mention[key]);
          })
        );
        const tempMsg = {
          _id: refId,
          sender: USER_ID,
          receiver: chat._id,
          receiverType: chat.chatType,
          edited: false,
          deleted: false,
          createdAt: new Date(),
          user: user,
          message_status: 0,
          mediaDetails: {},
          contentType: "text",
          text: text,
          forward: false,
          fromMe: true,
          starred: false,
          reactions: [],
          mentions: mentions.current,
        };
        if (reply) {
          data.append("reply", reply._id);
          tempMsg.reply = reply;
        }
        handleNewMsgDispatch({ chatId: chat._id, message: tempMsg });
        sendMessage(data).then((response) => {
          if (!response.success) {
            dispatch(deleteRefMessage({ chat: chat._id, refId: refId }))
            setToastNotification({ type: TOAST_TYPE.error, message: "Errow while sending Message" })
          }
        });
        reply && setReply(null);
        setInputText("");
        setHeight(22);
        mentions.current = [];
      }
    } catch (error) {
      console.log("error while sending message", error);
    }
  };

  const handleAttachements = async (type) => {
    const handleSelected = (attachments) => {
      attachments.forEach(async attachment => {
        if (Platform.OS == "web") {
          fetch(attachment.uri).then((response) =>
            response.blob()
          ).then((fileBlob) => {
            if (fileBlob.size > 52428800) {
              setToastNotification({ type: TOAST_TYPE.error, message: "File you are uploading is more than 50 mb" });
            } else
              setAttach(prev => [...prev, { uri: attachment.uri, mimeType: fileBlob.type, fileSize: fileBlob.size, blob: fileBlob, ...attachment }])
          });
        } else
          if (attachment.fileSize > 52428800) {
            setToastNotification({ type: TOAST_TYPE.error, message: "File you are uploading is more than 50 mb" });
          } else
            setAttach((prev) => [...prev, attachment])
      })
    }

    switch (type) {
      case ATTACHMENT_TYPES.camera:
        <iframe src="..." allow="microphone; camera;">
          <CameraScreen />;
        </iframe>;
        break;
      case ATTACHMENT_TYPES.image:
        const images = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          quality: 1,
          allowsMultipleSelection: reply ? false : true,
          selectionLimit: 10,
        });
        if (images.canceled) return;
        handleSelected(images.assets)
        // setAttach((prev) => [...prev, ...images.assets]);
        break;
      case ATTACHMENT_TYPES.document:
        const documents = await DocumentPicker.getDocumentAsync({
          type: "application/*",
          multiple: reply ? false : true,
        });
        if (documents.canceled) return;
        // setAttach((prev) => [...prev, ...documents.assets]);
        handleSelected(documents.assets)
        break;
      case ATTACHMENT_TYPES.map:
      case ATTACHMENT_TYPES.sticker:
        break;
      default:
        break;
    }
  };

  const handleRemoveAttachment = (index) =>
    setAttach((prev) => {
      const newAttach = [...prev];
      newAttach.splice(index, 1);
      return newAttach;
    });

  const handleSelectAttachType = (type) => {
    selectedType.current = type;
    setSelectAttachType(false);
    handleAttachements(type);
  };

  const handleBackspace = () => {
    const mention = mentions.current[mentions.current.length - 1];
    if (!mention) return;
    if (
      inputText.substr(
        inputText.trim().length - mention.name.length,
        inputText.trim().length
      ) == mention.name
    ) {
      setInputText((prev) =>
        prev.slice(0, inputText.length - `@${mention.name}`.length + 1)
      );
      mentions.current.pop();
    }
  };

  const textInputRef = useRef(false);
  const shareMedia = permissions.some((permission) =>
    [PERMISSION.share_document, PERMISSION.share_photos_and_videos].includes(
      permission
    )
  );
  const inputRef = useRef();

  useEffect(() => {
    if (inputRef.current && (reply || emojiPicker)) {
      inputRef.current.focus();
    }
  }, [inputRef.current, reply, emojiPicker]);

  return (
    <View style={{ height: "auto" }}>
      {reply ? <Reply message={reply} setReply={setReply} /> : null}
      {attach.length ? (
        <Attachment
          attach={attach}
          handleRemoveAttachment={handleRemoveAttachment}
          handleAttachements={handleAttachements}
          type={selectedType.current}
        />
      ) : (
        <></>
      )}
      {selectAttachType && (
        <SelectAttachmentType handleSelectAttachType={handleSelectAttachType} />
      )}
      {Platform.OS == "web" && emojiPicker ? (
        <View style={{ padding: 10 }}>
          <EmojiPicker
            open={emojiPicker}
            width={"100%"}
            height={300}
            onEmojiClick={({ emoji }) => {
              setInputText((prev) => prev + emoji);
              inputRef.current.focus();
            }}
            previewConfig={{ showPreview: false }}
            autoFocusSearch={false}
          />
        </View>
      ) : null}
      <View style={{ ...Styles.composermain, height: height + 40 }}>
        {enableRecording ? (
          <Recording
            enableRecording={enableRecording}
            setRecording={setRecording}
          />
        ) : recording ? (
          <TrackPlayer
            trackUri={recording.uri}
            setRecording={setRecording}
            trackDuration={recording.duration}
          />
        ) : (
          <>
            {shareMedia ? (
              <Pressable
                onPress={() => { if (selectAttachType || attach.length) { setAttach([]); setSelectAttachType(false) } else setSelectAttachType((prev) => !prev) }}
                style={{
                  ...Styles.composermainoption,
                  ...Styles.itemCenter,
                }}
              >
                {selectAttachType || attach.length ? crosscirclaicon : addcirclaicon}
              </Pressable>
            ) : null}
            <View
              style={
                enableMentionSuggestion
                  ? {
                    ...Styles.composerinputwrap,
                    marginLeft: shareMedia ? 0 : 10,
                    ...Styles.composerinputautosuggest,
                  }
                  : {
                    ...Styles.composerinputwrap,
                    marginLeft: shareMedia ? 0 : 10,
                  }
              }
            >
              {chat.chatType == CHAT_TYPE.group && enableMentionSuggestion ? (
                <MentionSuggestion inputRef={inputRef} />
              ) : null}

              {/* <View style={{ ...Styles.composerinputfield }}> */}
              <TextInput
                ref={inputRef}
                multiline
                style={{
                  ...Styles.composerinput,
                  ...webStyle,
                  height: height,
                }}
                placeholder="Send a Message"
                placeholderTextColor={Styles.fontlight.color}
                onChangeText={(text) => {
                  setInputText(text);
                  textInputRef.current = true;
                }}
                onContentSizeChange={(e) => {
                  if (textInputRef.current) {
                    updateSize(e, e.nativeEvent.contentSize.height);
                    textInputRef.current = false;
                  }
                }}
                onKeyPress={(e) => {
                  if (
                    chat.chatType == CHAT_TYPE.group &&
                    e.nativeEvent.key == "Backspace"
                  )
                    handleBackspace();

                  if (
                    Platform.OS == "web" &&
                    enableMentionSuggestion &&
                    (e.nativeEvent.key.includes("Arrow") ||
                      e.nativeEvent.key == "Enter")
                  ) {
                    e.preventDefault();
                    return false;
                  }
                  if (
                    Platform.OS == "web" &&
                    !enableMentionSuggestion &&
                    e.nativeEvent.key == "Enter" &&
                    !e.nativeEvent.shiftKey
                  ) {
                    e.preventDefault();
                    handleSendMessage();
                    return false;
                  }
                  return true;
                }}
                autoFocus={Platform.OS == "web"}
                // onFocus={() => emojiPicker && setEmojiPicker(false)}
                value={inputText}
              />
              {Platform.OS == "web" ? (
                <Pressable
                  onPress={() => setEmojiPicker((prev) => !prev)}
                  style={{
                    ...Styles.composermainoption,
                    ...Styles.itemCenter,
                    ...Styles.icon24,
                  }}
                >
                  {emojiPicker ? emojiIconPrimary : emojiIcon}
                </Pressable>
              ) : null}
            </View>
          </>
        )}
        <View
          style={{
            ...Styles.composermainoption,
            ...Styles.itemCenter,
            right: 0,
          }}
        >
          {inputText || attach.length || recording ? (
            <Pressable onPress={handleSendMessage}>{send}</Pressable>
          ) : permissions.includes(PERMISSION.record_and_send_audio) ? (
            <Pressable onPress={() => setEnableRecording((prev) => !prev)}>
              {enableRecording ? micprimary : mic}
            </Pressable>
          ) : (
            disableSend
          )}
        </View>
      </View>
    </View>
  );
};

export default ChatComposer;
