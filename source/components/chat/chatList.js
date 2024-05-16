import { useContext, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { SCREEN } from "../../constant";
import { archiveIcon } from "../../constant/icons";
import { AppContext } from "../../context/app";
import { ChatContext } from "../../context/chat";
import NoResult from "../noResult";
import ChatItem from "./chatItem";
import LoadingShimmer from "./loadingShimmer";

const ArchiveItem = () => {
  const { archive, handlePageNav } = useContext(ChatContext);
  const { translation, Styles } = useContext(AppContext);
  return (
    !archive && (
      <Pressable
        onPress={() => handlePageNav(SCREEN.archive, { archive: true })}
        style={Styles.chatListItem}
      >
        <View style={{ ...Styles.chatListItemInner, paddingVertical: 5, }}>
          <View style={{ ...Styles.chatListItemthumb, ...Styles.itemCenter, height: 35 }}>
            <View style={{ ...Styles.icon, ...Styles.icon24 }}>
              {archiveIcon({ ...Styles.icondefault })}
            </View>
          </View>
          <Text style={Styles.chatListIteminfoTitle}>
            {translation.archived}
          </Text>
        </View>
      </Pressable>
    )
  );
};

const ChatList = () => {
  const {
    chatsData,
    users,
    handleScroll,
    chatsLoading,
    archivedCount,
    openOptionId,
    enableSearch,
    setEnableSearch,
  } = useContext(ChatContext);
  const [openSwipeableId, setOpenSwipeableId] = useState(null);
  return useMemo(
    () => (
      <FlatList
        scrollEventThrottle={10}
        data={chatsData}
        renderItem={({ item }) => (
          <ChatItem
            item={item}
            openSwipeableId={openSwipeableId}
            setOpenSwipeableId={setOpenSwipeableId}
          />
        )}
        onScrollBeginDrag={() => {
          enableSearch && setEnableSearch((prev) => !prev);
        }}
        keyExtractor={(item) => item.chat._id}
        ListHeaderComponent={archivedCount > 0 ? <ArchiveItem /> : null}
        onEndReached={handleScroll}
        onEndReachedThreshold={2}
        ListFooterComponent={
          chatsLoading ? (
            <View style={{ marginVertical: 10, }}><ActivityIndicator size="small" color="#6a6f75" /></View>
          ) : null
        }
        ListEmptyComponent={
          !chatsLoading && !chatsData.length
            ? NoResult
            : chatsLoading
              ? LoadingShimmer
              : null
        }
      />
    ),
    [
      chatsData,
      users,
      openSwipeableId,
      openOptionId,
      chatsLoading,
      archivedCount,
      enableSearch,
      setEnableSearch,
    ]
  );
};

export default ChatList;
