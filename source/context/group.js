import { createContext, useState } from "react";
import { Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { newChatOpen } from "../store/reducer";

export const GroupContext = createContext();

export const GroupProvider = ({ children, navigation, route, id }) => {
  id = route?.params?.id || id;
  const [selectedMember, setSelectedMember] = useState(null);
  const group = useSelector((state) => state.group.groups[id]);
  const dispatch = useDispatch();

  const handleNavigate = (screen, id) => {
    if (Platform.OS == "web") {
      dispatch(newChatOpen({ id, screen }));
    } else navigation.navigate(screen, { id: id });
  };

  return (
    <GroupContext.Provider
      value={{ selectedMember, setSelectedMember, handleNavigate, group }}
    >
      {children}
    </GroupContext.Provider>
  );
};
