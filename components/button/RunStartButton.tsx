import { useRunStore } from "@/store/useRunStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Center } from "../ui/center";

interface RunStartButtonProps {
  disabled: boolean;
}

const RunStartButton = ({ disabled }: RunStartButtonProps) => {
  const [disabledRoute, setDisabledRoute] = useState(false);
  const selectedRoute = useRunStore((state) => state.setSelectedRoute);
  const recommendedRoutes = useRunStore((state) => state.recommendedRoutes);
  if (disabled) return null;
  return (
    <Center className="absolute bottom-12 right-1/2 h-1/5 w-96 translate-x-1/2 flex-row rounded-3xl bg-primary-400">
      <Button
        className={`h-28 w-28 rounded-full bg-primary-200 data-[active=true]:bg-primary-300 `}
      >
        <Ionicons name="paw" size={32} color={`#A69A88`} />
      </Button>
      <Button
        className={`absolute left-[50%] ml-20 h-16 w-16 rounded-full bg-primary-200 data-[active=true]:bg-primary-300 `}
        onPress={() => {
          setDisabledRoute((prev) => !prev);
          if (disabledRoute) {
            selectedRoute(recommendedRoutes ? recommendedRoutes[0] : null);
          } else {
            selectedRoute(null);
          }
        }}
      >
        {!disabledRoute ? (
          <Ionicons name="golf" size={16} color={`#A69A88`} />
        ) : (
          <Ionicons name="golf-outline" size={16} color={`#A69A88`} />
        )}
      </Button>
    </Center>
  );
};

export default RunStartButton;
