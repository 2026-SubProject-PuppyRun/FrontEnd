import React from "react";
import { Text, View } from "react-native";

interface HeaderProps {
  title?: string;
  children?: React.ReactNode;
}

const Header = ({ title, children }: HeaderProps) => {
  return (
    <View className="sticky top-0 z-10 h-12 flex-row items-center justify-between bg-white px-4">
      {title && <Text>{title}</Text>}
      {children}
    </View>
  );
};

export default Header;
