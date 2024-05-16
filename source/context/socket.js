/* eslint-disable react-hooks/exhaustive-deps */
// SocketContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BASE_URL } from "../constant";
import { AuthContext } from "./auth";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const socket = io(`${BASE_URL}?token=${token}`, {
    transports: ["websocket"],
  });

  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to Server :", socket.connected);
      // if (connectionError) {
      //   setConnectionError(false);
      //   window.location.reload()
      // }
    });

    socket.on("disconnected", () => {
      console.log("Disconnected From server");
    });

    socket.on("error", () => {
      console.log("Error while connection", socket.connected);
    });

    socket.on("connect_error", (error) => {
      console.log("connect_error >>>", error);
      // setConnectionError(true)
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
