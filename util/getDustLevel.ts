export const getDustLevel = (value: number, type: "pm10" | "pm25") => {
  if (type === "pm10") {
    if (value <= 30) return { text: "좋음", color: "#3b82f6", icon: "happy" };
    if (value <= 80) return { text: "보통", color: "#22c55e", icon: "happy" };
    if (value <= 150) return { text: "나쁨", color: "#eab308", icon: "sad" };
    return { text: "매우 나쁨", color: "#ef4444", icon: "sad" };
  } else {
    // pm2.5
    if (value <= 15) return { text: "좋음", color: "#3b82f6", icon: "happy" };
    if (value <= 35) return { text: "보통", color: "#22c55e", icon: "happy" };
    if (value <= 75) return { text: "나쁨", color: "#eab308", icon: "sad" };
    return { text: "매우 나쁨", color: "#ef4444", icon: "sad" };
  }
};
