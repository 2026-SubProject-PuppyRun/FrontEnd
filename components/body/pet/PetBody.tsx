import PastureBoard from "@/components/board/PetBoard/PastureBoard";
import PetListBoard from "@/components/board/PetBoard/PetListBoard";
import React from "react";
import { ScrollView } from "react-native";

const PetBody = () => {
  return (
    <ScrollView className="bg-gray-50 px-4 pb-8 pt-2">
      <PastureBoard />
      <PetListBoard />
    </ScrollView>
  );
};

export default PetBody;
