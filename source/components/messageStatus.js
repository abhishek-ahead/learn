import { MESSAGE_STATUS } from "../constant";
import { doubleTick, pending, seenTick, singleTick } from "../constant/icons";

const MessageStatus = ({ status }) => {
  switch (status) {
    case MESSAGE_STATUS.pending:
      return pending;
    case MESSAGE_STATUS.sent:
      return singleTick;
    case MESSAGE_STATUS.received:
      return doubleTick;
    case MESSAGE_STATUS.seen:
      return seenTick;
    default:
      return <></>;
  }
};

export default MessageStatus;
