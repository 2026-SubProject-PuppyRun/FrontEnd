import { useRouter } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { Avatar, AvatarImage } from "../ui/avatar";

const HomeAvatar = () => {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => {
        router.push("/mypage");
      }}
    >
      <Avatar size="md">
        <AvatarImage
          source={{
            uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
          }}
        />
      </Avatar>
    </Pressable>
  );
};

export default HomeAvatar;
