import { createContext, useContext, useState } from "react";
import { Platform } from "react-native";
import { useDispatch } from "react-redux";
import { newChatOpen } from "../store/reducer";
import { AppContext } from "./app";

export const SettingContext = createContext();

export const SettingProvider = ({ children, navigation }) => {
  const dispatch = useDispatch();
  const [optionPage, setOptionPage] = useState(null);
  const { appNavigation } = useContext(AppContext);
  const [selectOption, setSelectOption] = useState(null)

  appNavigation.current = navigation;

  const handleBack = () => (Platform.OS == "web" ? null : navigation.goBack());

  const handleNavigate = (id, screen) => {
    Platform.OS !== "web"
      ? navigation.navigate(screen, { id: id })
      : dispatch(newChatOpen({ id, screen }));
  };

  const handlePageNav = (screen) => {
    if (Platform.OS == "web") setOptionPage(screen);
    else navigation.navigate(screen);
  };

  return (
    <SettingContext.Provider
      value={{
        handleBack,
        handleNavigate,
        handlePageNav,
        optionPage,
        setOptionPage,
        selectOption, setSelectOption
      }}
    >
      {children}
    </SettingContext.Provider>
  );
};
