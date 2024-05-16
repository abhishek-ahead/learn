import React, { useContext, useEffect } from "react";
import { Platform, Pressable, Text, TextInput, View } from "react-native";
import { CONTENT_TYPE, NAV_TABS, VIEW_MORE } from "../../constant";
import {
  audioIcon,
  backIcon,
  cameraIcon,
  closeIcon,
  documentIcon,
  linkIcon,
  videoIcon,
} from "../../constant/icons";
import { AppContext } from "../../context/app";
import { ChatContext } from "../../context/chat";
import { chatSearch } from "../../services/chat";
import { webStyle } from "../../styles";

const OutlinePreview = () => {
  const { Styles } = useContext(AppContext)
  const { selectFilter } = useContext(AppContext);
  switch (selectFilter) {
    case CONTENT_TYPE.image:
      return cameraIcon(Styles.icondefault);
    case CONTENT_TYPE.link:
      return linkIcon({ ...Styles.icondefault, ...Styles.icon12 });
    case CONTENT_TYPE.video:
      return videoIcon(Styles.icondefault);
    case CONTENT_TYPE.application:
      return documentIcon(Styles.icondefault);
    case CONTENT_TYPE.audio:
      return audioIcon(Styles.icondefault);
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
    Styles
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
          {backIcon(Styles.icondefault)}
        </Pressable>

        {selectFilter ? (
          <View style={{ ...Styles.searchtype }}>
            <View style={{ ...Styles.icon16, ...Styles.searchtypeicon, ...Styles.itemCenter }}>
              <OutlinePreview />
            </View>
            <Text style={{ ...Styles.fontsizesmall, ...Styles.fontdefault }}>
              {translation[selectFilter]}
            </Text>
          </View>
        ) : null}
        <View style={{ ...Styles.searchboxtextbox }}>
          <TextInput
            autoFocus={Platform.OS == "web"}
            style={{ ...Styles.forminputText, ...webStyle }}
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
            {closeIcon(Styles.icondefault)}
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
                {cameraIcon(Styles.icondefault)}
              </View>
              <Text style={Styles.selectsearchtypetext}>
                {translation.photos}
              </Text>
            </View>
          </Pressable>
          {/* <Pressable onPress={() => setSelectFilter(CONTENT_TYPE.gif)} style={{ ...Styles.selectsearchtypewrap }}>
                    <View style={{ ...Styles.selectsearchtype }}>
                        <View style={Styles.selectsearchtypeicon}>
                            {gifIcon(Styles.icondefault)}
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
                {linkIcon({ ...Styles.icondefault, ...Styles.icon12 })}
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
                {videoIcon(Styles.icondefault)}
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
                {documentIcon(Styles.icondefault)}
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
                {audioIcon(Styles.icondefault)}
              </View>
              <Text style={Styles.selectsearchtypetext}>
                {translation.audio}
              </Text>
            </View>
          </Pressable>
          {/* <Pressable onPress={() => setSelectFilter(CONTENT_TYPE.poll)} style={{ ...Styles.selectsearchtypewrap }}>
                    <View style={{ ...Styles.selectsearchtype }}>
                        <View style={Styles.selectsearchtypeicon}>
                            {poll_Icon({ ...Styles.icondefault, ...Styles.icon12 })}
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
