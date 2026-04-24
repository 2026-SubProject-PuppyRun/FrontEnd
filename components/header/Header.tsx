import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { ChevronLeftIcon, Icon } from "../ui/icon";
import { Pressable } from "../ui/pressable";

interface HeaderProps {
  title?: string;
  children?: React.ReactNode;
  disableBack?: boolean;
}

const Header = ({ title, children, disableBack }: HeaderProps) => {
  const router = useRouter();
  return (
    <View className="sticky top-0 z-10 h-12 flex-row items-center justify-between  bg-white px-4">
      <View className="flex-row items-center">
        {!disableBack && (
          <Pressable onPress={() => router.back()} className="p-2">
            <Icon as={ChevronLeftIcon} size="xl" color="#000" />
          </Pressable>
        )}
        {title && <Text className="text-lg font-bold">{title}</Text>}
      </View>
      {children}
    </View>
  );
};

export default Header;
