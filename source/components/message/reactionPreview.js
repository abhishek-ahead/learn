
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { MenuOption } from "react-native-popup-menu";
import { AppContext } from "../../context/app";
import { AuthContext } from "../../context/auth";
import Styles from "../../styles";
import { removeReaction } from "../../services/message";

const MessageReactionPreview = ({ chat, messageReactions }) => {
    const { reactions, translation } = useContext(AppContext);
    const { user } = useContext(AuthContext);

    return (
        messageReactions.map(reaction => {
            const userDetails = reaction.user == chat._id ? chat : user;
            return <MenuOption onSelect={() => userDetails._id == user._id && removeReaction({ message: reaction.message })} key={`message_reaction_${reaction._id}`}>
                <View style={{ ...Styles.chatListItem, minWidth: 220 }}>
                    <View style={{ ...Styles.chatListItemInner, borderTopWidth: 0, paddingVertical: 0, }}>
                        <View style={Styles.chatListItemthumb}>
                            <Image style={{ height: 45, width: 45, borderRadius: 50 }} source={{ uri: userDetails.avatar }} />
                        </View>
                        <View style={Styles.chatListIteminfo}>
                            <View style={Styles.chatListIteminfoTop}>
                                <Text style={Styles.chatListIteminfoTitle} numberOfLines={1}>{userDetails.name}</Text>
                            </View>
                            {userDetails._id == user._id ? <View style={Styles.chatListIteminfoBtm}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={Styles.chatListIteminfoMsg}>
                                    {translation.clickToRemove}
                                </Text>
                            </View> : null}
                        </View>
                        <View style={Styles.chatListItemRighticon}>
                            <Image style={Styles.icon24} source={{ uri: reactions[reaction.reaction].url }} />
                        </View>
                    </View>
                </View>
            </MenuOption>
        })
    )
}

export default MessageReactionPreview


// <Modal animationType="fade"
//     transparent={true}
//     visible={visible}
//     onRequestClose={onClose}
// >
//     <View style={Styles.modalContainer}>
//         <View style={Styles.modalmain}>
//             <View style={Styles.modalheader}>
//                 <Pressable onPress={onClose} style={Styles.modalheaderOption}>
//                     {Platform.OS !== "web" ? <View style={Styles.modalheaderOptionicon}>
//                         <View style={{ ...Styles.icon, ...Styles.icon24 }}>
//                             {backIcon}
//                         </View>
//                     </View> : null}
//                 </Pressable>
//                 <View style={Styles.modalheaderinfo}>
//                     <Text style={Styles.modalheadertitle}>Message reactions</Text>
//                 </View>
//                 <Pressable onPress={onClose} style={Styles.modalheaderOption}>
//                     {Platform.OS == "web" ?
//                         <View style={Styles.modalheaderOptionicon}>
//                             <View style={{ ...Styles.icon, ...Styles.icon24 }}>
//                                 {closeIcon}
//                             </View>
//                         </View> : null
//                     }
//                 </Pressable>
//             </View>
//             <View style={{ ...Styles.tabswrap }}>
//                 <View style={Styles.tabs}>
//                     <View style={{ ...Styles.tabsitem, ...Styles.tabsitemactive }}>
//                         <Text style={{ ...Styles.tabsitemtext, ...Styles.tabsitemactivetext }}>All 5</Text>
//                     </View>
//                     <View style={Styles.tabsitem}>
//                         <Image style={Styles.tabsitemicon} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         <Text style={{ ...Styles.tabsitemtext }}>1</Text>
//                     </View>
//                 </View>
//             </View>
//             <ScrollView style={{ ...Styles.appStyle, ...Styles.modalcontent }}>
//                 <View style={{ ...Styles.chatListItem }}>
//                     <View style={{ ...Styles.chatListItemInner, borderTopWidth: 0 }}>
//                         <View style={Styles.chatListItemthumb}>
//                             <Image style={{ height: 45, width: 45, borderRadius: 50 }} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         </View>
//                         <View style={Styles.chatListIteminfo}>
//                             <View style={Styles.chatListIteminfoTop}>
//                                 <Text style={Styles.chatListIteminfoTitle} numberOfLines={1}>Bharat Negi</Text>
//                             </View>
//                             <View style={Styles.chatListIteminfoBtm}>
//                                 <Text numberOfLines={1} ellipsizeMode="tail" style={Styles.chatListIteminfoMsg}>
//                                     Click to remove
//                                 </Text>
//                             </View>
//                         </View>
//                         <View style={Styles.chatListItemRighticon}>
//                             <Image style={Styles.icon24} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         </View>
//                     </View>
//                 </View>
//                 <View style={{ ...Styles.chatListItem }}>
//                     <View style={Styles.chatListItemInner}>
//                         <View style={Styles.chatListItemthumb}>
//                             <Image style={{ height: 45, width: 45, borderRadius: 50 }} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         </View>
//                         <View style={Styles.chatListIteminfo}>
//                             <View style={Styles.chatListIteminfoTop}>
//                                 <Text style={Styles.chatListIteminfoTitle} numberOfLines={1}>Bharat Negi</Text>
//                             </View>
//                             <View style={Styles.chatListIteminfoBtm}>
//                                 <Text numberOfLines={1} ellipsizeMode="tail" style={Styles.chatListIteminfoMsg}>
//                                     Click to remove
//                                 </Text>
//                             </View>
//                         </View>
//                         <View style={Styles.chatListItemRighticon}>
//                             <Image style={Styles.icon24} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         </View>
//                     </View>
//                 </View>
//                 <View style={{ ...Styles.chatListItem }}>
//                     <View style={Styles.chatListItemInner}>
//                         <View style={Styles.chatListItemthumb}>
//                             <Image style={{ height: 45, width: 45, borderRadius: 50 }} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         </View>
//                         <View style={Styles.chatListIteminfo}>
//                             <View style={Styles.chatListIteminfoTop}>
//                                 <Text style={Styles.chatListIteminfoTitle} numberOfLines={1}>Bharat Negi</Text>
//                             </View>
//                             <View style={Styles.chatListIteminfoBtm}>
//                                 <Text numberOfLines={1} ellipsizeMode="tail" style={Styles.chatListIteminfoMsg}>
//                                     Click to remove
//                                 </Text>
//                             </View>
//                         </View>
//                         <View style={Styles.chatListItemRighticon}>
//                             <Image style={Styles.icon24} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         </View>
//                     </View>
//                 </View>
//                 <View style={{ ...Styles.chatListItem }}>
//                     <View style={Styles.chatListItemInner}>
//                         <View style={Styles.chatListItemthumb}>
//                             <Image style={{ height: 45, width: 45, borderRadius: 50 }} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         </View>
//                         <View style={Styles.chatListIteminfo}>
//                             <View style={Styles.chatListIteminfoTop}>
//                                 <Text style={Styles.chatListIteminfoTitle} numberOfLines={1}>Bharat Negi</Text>
//                             </View>
//                             <View style={Styles.chatListIteminfoBtm}>
//                                 <Text numberOfLines={1} ellipsizeMode="tail" style={Styles.chatListIteminfoMsg}>
//                                     Click to remove
//                                 </Text>
//                             </View>
//                         </View>
//                         <View style={Styles.chatListItemRighticon}>
//                             <Image style={Styles.icon24} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         </View>
//                     </View>
//                 </View>
//                 <View style={{ ...Styles.chatListItem }}>
//                     <View style={Styles.chatListItemInner}>
//                         <View style={Styles.chatListItemthumb}>
//                             <Image style={{ height: 45, width: 45, borderRadius: 50 }} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         </View>
//                         <View style={Styles.chatListIteminfo}>
//                             <View style={Styles.chatListIteminfoTop}>
//                                 <Text style={Styles.chatListIteminfoTitle} numberOfLines={1}>Bharat Negi</Text>
//                             </View>
//                             <View style={Styles.chatListIteminfoBtm}>
//                                 <Text numberOfLines={1} ellipsizeMode="tail" style={Styles.chatListIteminfoMsg}>
//                                     Click to remove
//                                 </Text>
//                             </View>
//                         </View>
//                         <View style={Styles.chatListItemRighticon}>
//                             <Image style={Styles.icon24} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         </View>
//                     </View>
//                 </View>
//                 <View style={{ ...Styles.chatListItem }}>
//                     <View style={Styles.chatListItemInner}>
//                         <View style={Styles.chatListItemthumb}>
//                             <Image style={{ height: 45, width: 45, borderRadius: 50 }} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         </View>
//                         <View style={Styles.chatListIteminfo}>
//                             <View style={Styles.chatListIteminfoTop}>
//                                 <Text style={Styles.chatListIteminfoTitle} numberOfLines={1}>Bharat Negi</Text>
//                             </View>
//                             <View style={Styles.chatListIteminfoBtm}>
//                                 <Text numberOfLines={1} ellipsizeMode="tail" style={Styles.chatListIteminfoMsg}>
//                                     Click to remove
//                                 </Text>
//                             </View>
//                         </View>
//                         <View style={Styles.chatListItemRighticon}>
//                             <Image style={Styles.icon24} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         </View>
//                     </View>
//                 </View>
//                 <View style={{ ...Styles.chatListItem }}>
//                     <View style={Styles.chatListItemInner}>
//                         <View style={Styles.chatListItemthumb}>
//                             <Image style={{ height: 45, width: 45, borderRadius: 50 }} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         </View>
//                         <View style={Styles.chatListIteminfo}>
//                             <View style={Styles.chatListIteminfoTop}>
//                                 <Text style={Styles.chatListIteminfoTitle} numberOfLines={1}>Bharat Negi</Text>
//                             </View>
//                             <View style={Styles.chatListIteminfoBtm}>
//                                 <Text numberOfLines={1} ellipsizeMode="tail" style={Styles.chatListIteminfoMsg}>
//                                     Click to remove
//                                 </Text>
//                             </View>
//                         </View>
//                         <View style={Styles.chatListItemRighticon}>
//                             <Image style={Styles.icon24} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         </View>
//                     </View>
//                 </View>
//                 <View style={{ ...Styles.chatListItem }}>
//                     <View style={Styles.chatListItemInner}>
//                         <View style={Styles.chatListItemthumb}>
//                             <Image style={{ height: 45, width: 45, borderRadius: 50 }} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         </View>
//                         <View style={Styles.chatListIteminfo}>
//                             <View style={Styles.chatListIteminfoTop}>
//                                 <Text style={Styles.chatListIteminfoTitle} numberOfLines={1}>Bharat Negi</Text>
//                             </View>
//                             <View style={Styles.chatListIteminfoBtm}>
//                                 <Text numberOfLines={1} ellipsizeMode="tail" style={Styles.chatListIteminfoMsg}>
//                                     Click to remove
//                                 </Text>
//                             </View>
//                         </View>
//                         <View style={Styles.chatListItemRighticon}>
//                             <Image style={Styles.icon24} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         </View>
//                     </View>
//                 </View>
//                 <View style={{ ...Styles.chatListItem }}>
//                     <View style={Styles.chatListItemInner}>
//                         <View style={Styles.chatListItemthumb}>
//                             <Image style={{ height: 45, width: 45, borderRadius: 50 }} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         </View>
//                         <View style={Styles.chatListIteminfo}>
//                             <View style={Styles.chatListIteminfoTop}>
//                                 <Text style={Styles.chatListIteminfoTitle} numberOfLines={1}>Bharat Negi</Text>
//                             </View>
//                             <View style={Styles.chatListIteminfoBtm}>
//                                 <Text numberOfLines={1} ellipsizeMode="tail" style={Styles.chatListIteminfoMsg}>
//                                     Click to remove
//                                 </Text>
//                             </View>
//                         </View>
//                         <View style={Styles.chatListItemRighticon}>
//                             <Image style={Styles.icon24} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         </View>
//                     </View>
//                 </View>
//                 <View style={{ ...Styles.chatListItem }}>
//                     <View style={Styles.chatListItemInner}>
//                         <View style={Styles.chatListItemthumb}>
//                             <Image style={{ height: 45, width: 45, borderRadius: 50 }} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         </View>
//                         <View style={Styles.chatListIteminfo}>
//                             <View style={Styles.chatListIteminfoTop}>
//                                 <Text style={Styles.chatListIteminfoTitle} numberOfLines={1}>Bharat Negi</Text>
//                             </View>
//                             <View style={Styles.chatListIteminfoBtm}>
//                                 <Text numberOfLines={1} ellipsizeMode="tail" style={Styles.chatListIteminfoMsg}>
//                                     Click to remove
//                                 </Text>
//                             </View>
//                         </View>
//                         <View style={Styles.chatListItemRighticon}>
//                             <Image style={Styles.icon24} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         </View>
//                     </View>
//                 </View>
//                 <View style={{ ...Styles.chatListItem }}>
//                     <View style={Styles.chatListItemInner}>
//                         <View style={Styles.chatListItemthumb}>
//                             <Image style={{ height: 45, width: 45, borderRadius: 50 }} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         </View>
//                         <View style={Styles.chatListIteminfo}>
//                             <View style={Styles.chatListIteminfoTop}>
//                                 <Text style={Styles.chatListIteminfoTitle} numberOfLines={1}>Bharat Negi</Text>
//                             </View>
//                             <View style={Styles.chatListIteminfoBtm}>
//                                 <Text numberOfLines={1} ellipsizeMode="tail" style={Styles.chatListIteminfoMsg}>
//                                     Click to remove
//                                 </Text>
//                             </View>
//                         </View>
//                         <View style={Styles.chatListItemRighticon}>
//                             <Image style={Styles.icon24} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         </View>
//                     </View>
//                 </View>
//                 <View style={{ ...Styles.chatListItem }}>
//                     <View style={Styles.chatListItemInner}>
//                         <View style={Styles.chatListItemthumb}>
//                             <Image style={{ height: 45, width: 45, borderRadius: 50 }} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         </View>
//                         <View style={Styles.chatListIteminfo}>
//                             <View style={Styles.chatListIteminfoTop}>
//                                 <Text style={Styles.chatListIteminfoTitle} numberOfLines={1}>Bharat Negi</Text>
//                             </View>
//                             <View style={Styles.chatListIteminfoBtm}>
//                                 <Text numberOfLines={1} ellipsizeMode="tail" style={Styles.chatListIteminfoMsg}>
//                                     Click to remove
//                                 </Text>
//                             </View>
//                         </View>
//                         <View style={Styles.chatListItemRighticon}>
//                             <Image style={Styles.icon24} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         </View>
//                     </View>
//                 </View>
//                 <View style={{ ...Styles.chatListItem }}>
//                     <View style={Styles.chatListItemInner}>
//                         <View style={Styles.chatListItemthumb}>
//                             <Image style={{ height: 45, width: 45, borderRadius: 50 }} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         </View>
//                         <View style={Styles.chatListIteminfo}>
//                             <View style={Styles.chatListIteminfoTop}>
//                                 <Text style={Styles.chatListIteminfoTitle} numberOfLines={1}>Bharat Negi</Text>
//                             </View>
//                             <View style={Styles.chatListIteminfoBtm}>
//                                 <Text numberOfLines={1} ellipsizeMode="tail" style={Styles.chatListIteminfoMsg}>
//                                     Click to remove
//                                 </Text>
//                             </View>
//                         </View>
//                         <View style={Styles.chatListItemRighticon}>
//                             <Image style={Styles.icon24} source={{ uri: "https://www.mecgale.com/wp-content/uploads/2017/08/dummy-profile.png" }} />
//                         </View>
//                     </View>
//                 </View>
//             </ScrollView>

//         </View>
//         {/* <Pressable onPress={onClose} style={{ ...Styles.cancelButton }}>
//   <Text style={{ ...Styles.textcenter }}>Cancel</Text>
// </Pressable> */}
//     </View>
// </Modal>