import { useContext } from "react";
import { MESSAGE_STATUS } from "../constant";
import { doubleTick, pending, seenTick, singleTick } from "../constant/icons";
import { AppContext } from "../context/app"

const MessageStatus = ({ status }) => {
  const { Styles } = useContext(AppContext)
  switch (status) {
    case MESSAGE_STATUS.pending:
      return pending(Styles.iconlight);
    case MESSAGE_STATUS.sent:
      return singleTick(Styles.iconlight);
    case MESSAGE_STATUS.received:
      return doubleTick(Styles.iconlight);
    case MESSAGE_STATUS.seen:
      return seenTick(Styles.iconprimary);
    default:
      return <></>;
  }
};

export default MessageStatus;
