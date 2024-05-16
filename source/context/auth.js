import { createContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import { useDispatch } from "react-redux";
import { clearOpens } from "../store/reducer";
import axiosInstance from "../utils/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children, clientToken, client }) => {
  const dispatch = useDispatch();
  const [USER_ID, SET_USER_ID] = useState();
  const [token, setToken] = useState(token);
  const [user, setUser] = useState();

  useEffect(() => {
    if (Platform.OS == "web") {
      window.top.postMessage("circuitChatDefaultParams", "*");
      window.addEventListener(
        "message",
        (event) => {
          if (event.data.type == "circuitChat") {
            const { user, token } = event.data;
            if (!user || !token) {
              console.log("user credentials invalid", user, token);
              return;
            }
            const localuser = localStorage.getItem("user");
            if (localuser != user._id) {
              localStorage.clear();
              dispatch(clearOpens());
              localStorage.setItem("user", user._id);
            }
            SET_USER_ID(user._id);
            setToken(token);
            setUser(user);
          }
        },
        false
      );
    } else {
      SET_USER_ID(client?._id || "6596334199121a2a10df8777");
      setToken(
        clientToken ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk2MzM0MTk5MTIxYTJhMTBkZjg3NzciLCJpYXQiOjE3MTAxMzM3MjN9.XAp6xS_TAxF4VtrGfoN3C88fqia9r6Nw8cJ4pYrQ8lY"
      );
      setUser(
        client || {
          _id: "6596334199121a2a10df8777",
          email: "vashist.mani@aheadsofttech.com",
          uid: 23,
          name: "Vashist Mani",
          status: 1,
          about: "Available",
          language: "en",
          verified: false,
          avatar:
            "https://communitychat.socialnetworking.solutions/uploads/file/2023/12/28/1703755393701-151205811.png",
          role: 1,
          link: "https://php8demo.socialnetworking.solutions/communitychat/profile/vashist",
          timezone: "US/Pacific",
          gender: "male",
          first_name: "Vashist",
          last_name: "Mani",
          createdAt: "2024-01-04T04:25:37.350Z",
          updatedAt: "2024-03-07T09:59:17.720Z",
          password:
            "$2b$10$/QPmzSxm.yHqBzikBPP7l.5sZ9KiVyPNZEJLaP7IFwaWqQb84WOMq",
        }
      );
    }
  }, []);

  if (USER_ID && token && user) {
    axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + token;
    return (
      <AuthContext.Provider value={{ USER_ID, token, user, setUser }}>
        {children}
      </AuthContext.Provider>
    );
  }
  return null;
};
