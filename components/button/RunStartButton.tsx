import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Button } from "../ui/button";
import { Center } from "../ui/center";

const RunStartButton = ({ disabled }: { disabled: boolean }) => {
  if (disabled) return null;
  return (
    <Center className="absolute bottom-12 right-1/2 h-1/5 w-96 translate-x-1/2 rounded-3xl bg-primary-400">
      <Button
        className={`h-28 w-28 rounded-full  ${disabled ? "data-[disabled=true] bg-gray-300" : "bg-primary-200 data-[active=true]:bg-primary-300"} `}
      >
        <Ionicons
          name="paw"
          size={32}
          color={`${!disabled ? "#A69A88" : "black"}`}
        />
      </Button>
    </Center>
  );
};

export default RunStartButton;
