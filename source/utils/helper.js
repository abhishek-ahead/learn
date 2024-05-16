import { Dimensions, Platform, PixelRatio } from "react-native";
const moment = require("moment");

const { width, height } = Dimensions.get("window");

export const Size = width > 350 ? 350 : width;

export function fontSize(size, webFontSize, multiplier = 2) {
  const scale = (width / height) * multiplier;

  if (Platform.OS == "web" && webFontSize) return webFontSize;

  const newSize = size * (Platform.OS == "web" ? 1 : scale);

  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export const formatDate = (date, translationYesterday) => {
  const today = moment().startOf("day");
  const yesterday = moment().subtract(1, "days").startOf("day");
  if (moment(date).isSame(today, "d")) {
    return moment(date).format("LT");
  } else if (moment(date).isSame(yesterday, "d")) {
    return translationYesterday;
  } else {
    return moment(date).format("L");
  }
};
