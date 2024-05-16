import React, { useContext, useEffect } from "react";
import { Platform, Pressable, Text, TextInput, View } from "react-native";
import { CONTENT_TYPE, NAV_TABS, VIEW_MORE } from "../../constant";
import {
  backIcon,
  cameraoutlinedefault,
  closeIcon,
  documentoutlinedefault,
  linkoutlinedefault,
  muscioutlinedefault,
  videooutlinedefault,
} from "../../constant/icons";
import { AppContext } from "../../context/app";
import { ChatContext } from "../../context/chat";
import { chatSearch } from "../../services/chat";
import Styles, { webStyle } from "../../styles";

const OutlinePreview = () => {
  const { selectFilter } = useContext(AppContext);
  switch (selectFilter) {
    case CONTENT_TYPE.image:
      return cameraoutlinedefault;
    case CONTENT_TYPE.link:
      return linkoutlinedefault;
    case CONTENT_TYPE.video:
      return videooutlinedefault;
    case CONTENT_TYPE.application:
      return documentoutlinedefault;
    case CONTENT_TYPE.audio:
      return muscioutlinedefault;
  }
};

const SearchChat = () => {
  const {
    handleSearchNav,
    tabNav,
    setFilter,
    selectFilter,
    setSelectFilter,
    translation,
    searchText,
    setText,
  } = useContext(AppContext);
  const initialText = "";
  if (tabNav == NAV_TABS.chat) {
    const {
      searchResult,
      setSearchResult,
      setSearchLoading,
      viewMore,
      setViewMore,
    } = useContext(ChatContext);
    useEffect(() => {
      if (searchText || selectFilter) {
        setSearchLoading(true);
        let timeout;
        timeout = setTimeout(() => {
          let params;
          if (selectFilter) {
            params = { media: selectFilter };
            searchText && (params.text = searchText);
          } else {
            params = { text: searchText };
          }
          chatSearch(params)
            .then((res) => {
              if (res.success) setSearchResult(res.data);
            })
            .finally(() => {
              setSearchLoading(false);
              setViewMore("");
            });
        }, 700);
        return () => clearTimeout(timeout);
      } else {
        setSearchLoading(false);
        setSearchResult({});
        return;
      }
    }, [searchText, selectFilter]);

    useEffect(() => {
      if (viewMore) {
        setSearchLoading(true);
        let params;
        if (selectFilter) {
          params = { media: selectFilter };
          searchText && (params.text = searchText);
        } else {
          params = { text: searchText };
        }
        params.more = viewMore;
        switch (viewMore) {
          case VIEW_MORE.chats:
            params.lastChat =
              searchResult[viewMore].data[
                searchResult[viewMore].data.length - 1
              ].chat._id;
            break;
          case VIEW_MORE.messages:
          case VIEW_MORE.starred:
            params.lastMessage =
              searchResult[viewMore].data[
                searchResult[viewMore].data.length - 1
              ]._id;
            break;
        }

        chatSearch(params)
          .then((res) => {
            if (res.success) {
              setSearchResult((prev) => {
                const newData = { ...prev };
                const keys = Object.keys(res.data);
                for (let key of keys) {
                  newData[key] = {
                    data: [...newData[key].data, ...res.data[key].data],
                    more: res.data[key].more,
                  };
                }
                return newData;
              });
            }
          })
          .finally(() => {
            setSearchLoading(false);
            setViewMore("");
          });
      }
    }, [searchText, selectFilter, viewMore]);

    useEffect(() => {
      return () => handleClose();
    }, []);
  } else if (tabNav == NAV_TABS.people) {
    useEffect(() => {
      setFilter(searchText);
    }, [searchText]);
    useEffect(() => {
      return () => setFilter("");
    }, []);
  }

  const handleClose = () => {
    setText(initialText);
    setSelectFilter(initialText);
  };

  return (
    // <View style={{ ...Styles.chatBubble, ...appStyle, ...Styles.Search }}>
    <View style={{ ...Styles.searchboxhead }}>
      <View style={{ ...Styles.searchbox }}>
        <Pressable
          onPress={handleSearchNav}
          style={{ ...Styles.searchboxback, ...Styles.icon, ...Styles.icon24 }}
        >
          {backIcon}
        </Pressable>

        {selectFilter ? (
          <View style={{ ...Styles.searchtype }}>
            <View style={{ ...Styles.icon16, ...Styles.searchtypeicon }}>
              <OutlinePreview />
            </View>
            <Text style={{ ...Styles.fontsizesmall }}>
              {translation[selectFilter]}
            </Text>
          </View>
        ) : null}
        <View style={{ ...Styles.searchboxtextbox }}>
          <TextInput
            autoFocus={Platform.OS == "web"}
            style={{ ...Styles.searchboxtext, ...webStyle, width: "100%" }}
            onChangeText={(text) => setText(text)}
            value={searchText}
            placeholder={translation.search}
            placeholderTextColor={Styles.fontlight.color}
          />
        </View>
        {searchText.length || selectFilter ? (
          <Pressable
            onPress={handleClose}
            style={{ ...Styles.icon, ...Styles.icon24 }}
          >
            {closeIcon}
          </Pressable>
        ) : null}
      </View>
      {!selectFilter && !searchText && tabNav == NAV_TABS.chat ? (
        <View style={{ ...Styles.searchtypecontainer }}>
          <Pressable
            onPress={() => setSelectFilter(CONTENT_TYPE.image)}
            style={{ ...Styles.selectsearchtypewrap }}
          >
            <View style={{ ...Styles.selectsearchtype }}>
              <View style={Styles.selectsearchtypeicon}>
                {cameraoutlinedefault}
              </View>
              <Text style={Styles.selectsearchtypetext}>
                {translation.photos}
              </Text>
            </View>
          </Pressable>
          {/* <Pressable onPress={() => setSelectFilter(CONTENT_TYPE.gif)} style={{ ...Styles.selectsearchtypewrap }}>
                    <View style={{ ...Styles.selectsearchtype }}>
                        <View style={Styles.selectsearchtypeicon}>
                            {gifoutlinedefault}
                        </View>
                        <Text style={Styles.selectsearchtypetext}>GIFs</Text>
                    </View>
                </Pressable> */}
          <Pressable
            onPress={() => setSelectFilter(CONTENT_TYPE.link)}
            style={{ ...Styles.selectsearchtypewrap }}
          >
            <View style={{ ...Styles.selectsearchtype }}>
              <View style={Styles.selectsearchtypeicon}>
                {linkoutlinedefault}
              </View>
              <Text style={Styles.selectsearchtypetext}>
                {translation.links}
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => setSelectFilter(CONTENT_TYPE.video)}
            style={{ ...Styles.selectsearchtypewrap }}
          >
            <View style={{ ...Styles.selectsearchtype }}>
              <View style={Styles.selectsearchtypeicon}>
                {videooutlinedefault}
              </View>
              <Text style={Styles.selectsearchtypetext}>
                {translation.videos}
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => setSelectFilter(CONTENT_TYPE.application)}
            style={{ ...Styles.selectsearchtypewrap }}
          >
            <View style={{ ...Styles.selectsearchtype }}>
              <View style={Styles.selectsearchtypeicon}>
                {documentoutlinedefault}
              </View>
              <Text style={Styles.selectsearchtypetext}>
                {translation.documents}
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => setSelectFilter(CONTENT_TYPE.audio)}
            style={{ ...Styles.selectsearchtypewrap }}
          >
            <View style={{ ...Styles.selectsearchtype }}>
              <View style={Styles.selectsearchtypeicon}>
                {muscioutlinedefault}
              </View>
              <Text style={Styles.selectsearchtypetext}>
                {translation.audio}
              </Text>
            </View>
          </Pressable>
          {/* <Pressable onPress={() => setSelectFilter(CONTENT_TYPE.poll)} style={{ ...Styles.selectsearchtypewrap }}>
                    <View style={{ ...Styles.selectsearchtype }}>
                        <View style={Styles.selectsearchtypeicon}>
                            {polllinedefault}
                        </View>
                        <Text style={Styles.selectsearchtypetext}>Polls</Text>
                    </View>
                </Pressable> */}
        </View>
      ) : null}
    </View>
    // </View>
  );
};

export default SearchChat;
