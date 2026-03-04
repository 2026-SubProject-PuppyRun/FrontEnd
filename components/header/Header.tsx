import React from "react";
import { Text, View } from "react-native";

interface HeaderProps {
  title?: string;
  children?: React.ReactNode;
}

const Header = ({ title, children }: HeaderProps) => {
  return (
    <View className="h-12 flex-row justify-between bg-white px-4">
      <Text>{title || "Header"}</Text>
      {children}
    </View>
  );
};

export default Header;
