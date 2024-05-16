import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { Image, Platform, Pressable, ScrollView, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import MessageContent from "../components/message/content";
import LoadingShimmer from "../components/message/loadingShimmer";
import NoResult from "../components/noResult";
import { SCREEN } from "../constant";
import { backIcon, checkcircleIcon, starIcon } from "../constant/icons";
import { AppContext } from "../context/app";
import { AuthContext } from "../context/auth";
import { deleteMessage, markUnstarred, starredMessage } from "../services/message";
import { chatNavigation } from "../store/reducer";
import { appStyle, mainStyle } from "../styles";

const ChatStarred = ({ navigation, route, id }) => {
    const dispatch = useDispatch()
    id = route?.params?.id || id;
    const [messages, setMessage] = useState([]);
    const chat = useSelector(state => state.chats.data[id]?.chat)
    const { USER_ID } = useContext(AuthContext);
    const [enableEdit, setEnableEdit] = useState(false);
    const [selected, setSelected] = useState([]);
    const { setForwardOpen, setConfimationDialog, translation, fetchChatDetails, Styles } = useContext(AppContext);
    const [loading, setLoading] = useState(true);

    const handleSelected = (id) => setSelected(selected => {
        const prev = [...selected];
        const index = prev.indexOf(id);
        if (index == -1) {
            prev.push(id)
            return prev
        } else {
            prev.splice(index, 1)
            return prev
        }
    });

    const handleClearMessage = () => {
        setMessage(messages => messages.filter(message => !selected.some(id => message._id == id)))
    }

    const handleStarredMessageDelete = (data) => {
        deleteMessage(data);
        handleClearMessage();
    }

    const getMessages = async () => {
        setLoading(true)
        const response = await starredMessage({ chat: chat._id, chatType: chat.chatType });
        if (response.success) {
            setMessage(response.data)
        }
        setLoading(false)
    };

    useEffect(() => {
        if (chat)
            getMessages()
        else fetchChatDetails(id);
    }, [chat]);

    useEffect(() => {
        if (!enableEdit) setSelected([])
    }, [enableEdit])

    const handleChatClose = () => dispatch(chatClose(id));
    const handleBackNavigation = () => {
        Platform.OS !== "web" ? navigation.goBack() :
            dispatch(chatNavigation({ id, screen: SCREEN.profile }))
    };

    return (
        <View style={mainStyle}>
            <View style={{ ...Styles.chatBubble, ...appStyle }}>
                <View style={{ ...Styles.chatBubbleHeader }}>
                    <Pressable onPress={handleBackNavigation} style={Styles.chatBubbleHeaderOption}>
                        <View style={Styles.chatBubbleHeaderOptionIcon}>
                            <View style={{ ...Styles.icon, ...Styles.icon24 }}>
                                {backIcon(Styles.icondefault)}
                            </View>
                        </View>
                    </Pressable>
                    <View style={Styles.chatBubbleHeaderInfo}>
                        <Text style={{ ...Styles.chatBubbleHeaderTitle }}>{translation.starredMessage}</Text>
                    </View>
                    {messages.length ? <Pressable onPress={() => setEnableEdit(prev => !prev)} style={Styles.chatBubbleHeaderOption}>
                        <View>
                            <Text style={{ ...Styles.fontprimary, ...Styles.cursor }}>{enableEdit ? translation.done : translation.edit}</Text>
                        </View>
                    </Pressable> : null}
                </View>
                <ScrollView>
                    {
                        loading ? <LoadingShimmer /> :
                            !messages.length ? <NoResult /> :
                                <View style={{ flex: 1, ...appStyle, ...Styles.starmessages }}>
                                    {
                                        messages.map(message =>
                                            <Pressable onPress={() => enableEdit && handleSelected(message._id)} key={`starred_${message._id}`} style={{...Styles.starmessagesitem, ...Styles.borderbottom}}>
                                                <View style={Styles.starmessagesitemmain}>
                                                    <View style={Styles.starmessagesitemhead}>
                                                        <Image style={Styles.starmessagesitemheadimg} source={{ uri: message.user.avatar }} />
                                                        <View style={{ ...Styles.starmessagesitemheadinfo, ...Styles.fdrow }}>
                                                            <Text style={{ ...Styles.font500, ...Styles.fontdefault }}>{message.sender == USER_ID ? translation.you : message.user.name.split(" ")[0]}</Text>
                                                            <Text style={{ ...Styles.fontlight }}>&#x2022;</Text>
                                                            <Text style={{ ...Styles.fontdefault}}>{message.receiver == USER_ID ? translation.you : message.chat.name.split(" ")[0]}</Text>
                                                        </View>
                                                        <Text style={{ ...Styles.starmessagesitemheaddate, ...Styles.fontsizesmall, ...Styles.fontlight }}>
                                                            {moment(message.createdAt).format("MMM D, YYYY")}
                                                        </Text>
                                                    </View>
                                                    <View style={{ ...Styles.messageitemdetails, marginTop: 10 }}>
                                                        <View style={{ ...Styles.messageitemtop, alignItems: "flex-start" }}>
                                                            <View style={Styles.messageitembody}>
                                                                <View style={{ ...Styles.messageitembodyinner, ...Styles.messageitembodyin }}>
                                                                    <MessageContent
                                                                        message={message}
                                                                        color={Styles.fontdefault.color}
                                                                        chat={chat}
                                                                    />
                                                                    {/* <View style={{ ...Styles.messageitembodytext }}>
                                                            <Text style={{ padding: 0 }}>Hello, how are you?</Text>
                                                        </View> */}
                                                                </View>
                                                            </View>
                                                        </View>
                                                        <View style={{ ...Styles.messageitemfooter }}>
                                                            <View style={{ ...Styles.messageitemfootericon, ...Styles.icon12 }}>
                                                                {starIcon(Styles.iconlight)}
                                                            </View>
                                                            <Text style={{ ...Styles.messageitemfootertime, ...Styles.fontlight, ...Styles.fontsizesmall }}>
                                                                {moment(message.starredAt).format("MMM D, YYYY")}
                                                            </Text>

                                                        </View>
                                                    </View>
                                                    {enableEdit ? <View style={Styles.checkcircle}>
                                                    </View> : null}
                                                    {
                                                        selected.includes(message._id) ? <View style={{ ...Styles.checkcircle, ...Styles.checkcircleactive, ...Styles.itemCenter }}>
                                                            {checkcircleIcon({ fill: "#fff", ...Styles.icon16 })}
                                                        </View> : null
                                                    }
                                                </View>
                                            </Pressable>
                                        )
                                    }

                                    {/* <View style={Styles.starmessagesitem}>
                            <View style={Styles.starmessagesitemmain}>
                                <View style={Styles.starmessagesitemhead}>
                                    <Image style={Styles.starmessagesitemheadimg} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                                    <View style={{ ...Styles.starmessagesitemheadinfo, ...Styles.fdrow }}>
                                        <Text style={{ ...Styles.font500 }}>Beth Mooney</Text>
                                        <Text style={{ ...Styles.fontlight }}>&#x2022;</Text>
                                        <Text>You</Text>
                                    </View>
                                    <Text style={{ ...Styles.starmessagesitemheaddate, ...Styles.fontlight }}>
                                        09/08/2023
                                    </Text>
                                </View>
                                <View style={{ ...Styles.messageitemdetails, marginTop: 10 }}>
                                    <View style={{ ...Styles.messageitemtop, alignItems: "flex-start" }}>
                                        <View style={Styles.messageitembody}>
                                            <View style={{ ...Styles.messageitembodyinner, ...Styles.messageitembodyin }}>
                                                <View style={{ ...Styles.messageitembodytext }}>
                                                    <Text style={{ padding: 0 }}>Hello, how are you?</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ ...Styles.messageitemfooter }}>
                                        <View style={{ ...Styles.messageitemfootericon, ...Styles.icon12 }}>
                                            <Svg viewBox="0 -960 960 960" style={Styles.iconlight}><Path d="m233-80 65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Z" /></Svg>
                                        </View>
                                        <Text style={{ ...Styles.messageitemfootertime, ...Styles.fontlight, ...Styles.fontsizesmall }}>
                                            09/08/2023
                                        </Text>

                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={Styles.starmessagesitem}>
                            <View style={Styles.starmessagesitemleft}>
                                <View style={{ ...Styles.radioactive, ...Styles.itemCenter }}>{checkcircleIcon({ fill: "#fff", ...Styles.icon16 })}</View>
                            </View>
                            <View style={Styles.starmessagesitemmain}>
                                <View style={Styles.starmessagesitemhead}>
                                    <Image style={Styles.starmessagesitemheadimg} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                                    <View style={{ ...Styles.starmessagesitemheadinfo, ...Styles.fdrow }}>
                                        <Text style={{ ...Styles.font500 }}>You</Text>
                                        <Text style={{ ...Styles.fontlight }}>&#x2022;</Text>
                                        <Text>Beth Mooney</Text>
                                    </View>
                                    <Text style={{ ...Styles.starmessagesitemheaddate, ...Styles.fontlight }}>
                                        09/08/2023
                                    </Text>
                                </View>
                                <View style={{ ...Styles.messageitemdetails, marginTop: 10 }}>
                                    <View style={{ ...Styles.messageitemtop, alignItems: "flex-start" }}>
                                        <View style={Styles.messageitembody}>
                                            <View style={{ ...Styles.messageitembodyinner, ...Styles.messageitembodyin }}>
                                                <View style={Styles.messageitembodytext}>
                                                    <Text style={{ padding: 0 }}>Hello, how are you?</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ ...Styles.messageitemfooter }}>
                                        <View style={{ ...Styles.messageitemfootericon, ...Styles.icon12 }}>
                                            <Svg viewBox="0 -960 960 960" style={Styles.iconlight}><Path d="m233-80 65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Z" /></Svg>
                                        </View>
                                        <Text style={{ ...Styles.messageitemfootertime, ...Styles.fontlight, ...Styles.fontsizesmall }}>
                                            09/08/2023
                                        </Text>

                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={Styles.starmessagesitem}>
                            <View style={Styles.starmessagesitemleft}>
                                <View style={{ ...Styles.radio, ...Styles.itemCenter }}></View>
                            </View>
                            <View style={Styles.starmessagesitemmain}>
                                <View style={Styles.starmessagesitemhead}>
                                    <Image style={Styles.starmessagesitemheadimg} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
                                    <View style={{ ...Styles.starmessagesitemheadinfo, ...Styles.fdrow }}>
                                        <Text style={{ ...Styles.font500 }}>Beth Mooney</Text>
                                        <Text style={{ ...Styles.fontlight }}>&#x2022;</Text>
                                        <Text>My Friends</Text>
                                    </View>
                                    <Text style={{ ...Styles.starmessagesitemheaddate, ...Styles.fontlight }}>
                                        09/08/2023
                                    </Text>
                                </View>
                                <View style={{ ...Styles.messageitemdetails, marginTop: 10 }}>
                                    <View style={{ ...Styles.messageitemtop, alignItems: "flex-start" }}>
                                        <View style={Styles.messageitembody}>
                                            <View style={{ ...Styles.messageitembodyinner, ...Styles.messageitembodyin }}>
                                                <View style={Styles.messageitembodytext}>
                                                    <Text style={{ padding: 0 }}>
                                                        Hello, how are you?
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ ...Styles.messageitemfooter }}>
                                        <View style={{ ...Styles.messageitemfootericon, ...Styles.icon12 }}>
                                            <Svg viewBox="0 -960 960 960" style={Styles.iconlight}><Path d="m233-80 65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Z" /></Svg>
                                        </View>
                                        <Text style={{ ...Styles.messageitemfootertime, ...Styles.fontlight, ...Styles.fontsizesmall }}>
                                            09/08/2023
                                        </Text>

                                    </View>
                                </View>
                            </View>
                        </View> */}
                                </View>
                    }
                </ScrollView>



                {/* Options : Apprear after click on select text */}
                {selected.length ? <View style={{ ...Styles.optionbar }}>
                    <View style={{ ...Styles.optionbarinner }}>
                        <Pressable onPress={() => { setForwardOpen(selected); setEnableEdit(false) }} style={{ ...Styles.optionbaricon, ...Styles.itemCenter }}>
                            <Svg viewBox="0 -960 960 960" style={{ ...Styles.iconlight, ...Styles.icon20 }}><Path d="m640-280-57-56 184-184-184-184 57-56 240 240-240 240ZM80-200v-160q0-83 58.5-141.5T280-560h247L383-704l57-56 240 240-240 240-57-56 144-144H280q-50 0-85 35t-35 85v160H80Z" /></Svg>
                        </Pressable>
                        {/* <View style={{ ...Styles.optionbaricon, ...Styles.optionbariconactive, ...Styles.itemCenter }}>
                            <Svg viewBox="0 0 24 24" style={{ ...Styles.iconprimary, ...Styles.icon20 }}><Path d="M19.333,14.667a4.66,4.66,0,0,0-3.839,2.024L8.985,13.752a4.574,4.574,0,0,0,.005-3.488l6.5-2.954a4.66,4.66,0,1,0-.827-2.643,4.633,4.633,0,0,0,.08.786L7.833,8.593a4.668,4.668,0,1,0-.015,6.827l6.928,3.128a4.736,4.736,0,0,0-.079.785,4.667,4.667,0,1,0,4.666-4.666ZM19.333,2a2.667,2.667,0,1,1-2.666,2.667A2.669,2.669,0,0,1,19.333,2ZM4.667,14.667A2.667,2.667,0,1,1,7.333,12,2.67,2.67,0,0,1,4.667,14.667ZM19.333,22A2.667,2.667,0,1,1,22,19.333,2.669,2.669,0,0,1,19.333,22Z" /></Svg>
                        </View> */}
                        <Pressable onPress={() => { markUnstarred({ chat: chat._id, messages: selected }); handleClearMessage(); setEnableEdit(false) }} style={{ ...Styles.optionbaricon, ...Styles.itemCenter }}>
                            <Svg fill="none" viewBox="0 0 24 24" style={Styles.icon20}>
                                <Path style={Styles.iconlight} fillRule="evenodd" d="M1.29288 1.29289C1.68341 0.902369 2.31657 0.902369 2.7071 1.29289L22.7071 21.2929C23.0976 21.6834 23.0976 22.3166 22.7071 22.7071C22.3166 23.0976 21.6834 23.0976 21.2929 22.7071L19.7319 21.1462C19.6068 22.543 18.0343 23.5031 16.6797 22.7267L12.02 20.0559C12.0075 20.0487 11.9925 20.0487 11.98 20.0559L7.32029 22.7267C5.75141 23.6259 3.89021 22.1957 4.32392 20.4556L5.65786 15.1036C5.66248 15.085 5.65576 15.0664 5.64282 15.0556L1.73499 11.7891C0.367417 10.646 1.01343 8.41128 2.79007 8.18852L6.33041 7.74463L1.29288 2.70711C0.90236 2.31658 0.90236 1.68342 1.29288 1.29289ZM8.1215 9.53572L17.1413 18.5555L17.7354 20.9393C17.7389 20.9534 17.7385 20.9621 17.7385 20.9621L17.7377 20.9661C17.7365 20.9694 17.7314 20.9789 17.7188 20.9885C17.7062 20.998 17.6945 21 17.6945 21L17.6931 20.9998C17.6931 20.9998 17.6862 20.9983 17.6742 20.9915L13.0146 18.3207C12.386 17.9604 11.614 17.9604 10.9854 18.3207L6.32573 20.9915C6.3138 20.9983 6.3069 20.9998 6.3069 20.9998L6.30538 21C6.30538 21 6.29374 20.998 6.28116 20.9885C6.26858 20.9789 6.26351 20.9694 6.26227 20.9661L6.26177 20.9645L6.26145 20.9621C6.26145 20.9621 6.26104 20.9534 6.26455 20.9393L7.59849 15.5872C7.78797 14.827 7.52734 14.0242 6.92549 13.5211L3.01766 10.2546C3.00711 10.2458 3.00274 10.2391 3.00274 10.2391L3.0011 10.2355C3.0001 10.2319 2.99848 10.2207 3.00313 10.2048C3.00777 10.1889 3.01502 10.1808 3.01714 10.1789L3.01926 10.1776C3.01926 10.1776 3.02564 10.1746 3.03888 10.173L8.1215 9.53572ZM13.9129 2.32841C13.2507 0.557197 10.7493 0.557196 10.0871 2.32841L9.59307 3.64981C9.39967 4.16713 9.66225 4.74328 10.1796 4.93668C10.6969 5.13008 11.273 4.8675 11.4664 4.35019L11.9605 3.02878C11.9662 3.01334 11.9715 3.00676 11.9715 3.00676L11.9723 3.00589C11.9723 3.00589 11.9829 3 12 3C12.0171 3 12.0277 3.00592 12.0277 3.00592L12.0285 3.00677C12.0285 3.00677 12.0338 3.01334 12.0396 3.02878L13.9698 8.19187C14.2358 8.90318 14.8741 9.40978 15.629 9.50444L20.9611 10.173C20.9744 10.1746 20.9807 10.1776 20.9807 10.1776L20.9829 10.1789C20.985 10.1808 20.9922 10.1889 20.9969 10.2048C21.0015 10.2207 20.9999 10.2319 20.9989 10.2355L20.9985 10.2369L20.9973 10.2391C20.9973 10.2391 20.9929 10.2458 20.9823 10.2546L18.3587 12.4477C17.9349 12.8019 17.8786 13.4325 18.2328 13.8563C18.587 14.28 19.2176 14.3364 19.6414 13.9822L22.265 11.7891C23.6326 10.646 22.9866 8.41128 21.2099 8.18852L15.8778 7.51997C15.8635 7.51818 15.8494 7.50826 15.8432 7.4915L13.9129 2.32841Z" clipRule="evenodd"></Path>
                            </Svg>
                        </Pressable>
                        <Pressable onPress={() => { setConfimationDialog({ heading: "Delete Message", message: "Are you sure want to Delete these Message?", callback: handleStarredMessageDelete, chat: { chat: id, messages: selected } }); setEnableEdit(false) }} style={{ ...Styles.optionbaricon, ...Styles.itemCenter }}>
                            <Svg viewBox="0 -960 960 960" style={{ ...Styles.iconlight, ...Styles.icon20 }}><Path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"></Path></Svg>
                        </Pressable>
                    </View>
                </View> : null}
            </View>
        </View>
    )
};

export default ChatStarred;
