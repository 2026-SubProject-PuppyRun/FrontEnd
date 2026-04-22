import React, { useEffect } from "react";
import { Text, View } from "react-native";

interface CountDownProps {
  onComplete: () => void;
}

const CountDown = ({ onComplete }: CountDownProps) => {
  const [count, setCount] = React.useState(3);
  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }
    const timer = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [count, onComplete]);

  return (
    <View className="absolute z-50 h-screen w-screen items-center justify-center bg-black/60">
      <Text className="text-9xl font-bold color-white">{count}</Text>
    </View>
  );
};

export default CountDown;
