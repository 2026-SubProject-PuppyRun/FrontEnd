import { Divider } from "@/components/ui/divider";
import { CheckCircleIcon, Icon } from "@/components/ui/icon";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { IIconComponentType } from "@gluestack-ui/core/lib/esm/icon/creator/createIcon";
import React from "react";
import { ColorValue } from "react-native";
import { SvgProps } from "react-native-svg";

interface ShowToastOptions {
  message: string;
  icon?: IIconComponentType<
    | SvgProps
    | {
        fill?: ColorValue;
        stroke?: ColorValue;
      }
  >;
  iconColor?: string;
}

export const useCustomToast = () => {
  const toast = useToast();

  const showToast = ({ message, icon, iconColor }: ShowToastOptions) => {
    toast.show({
      placement: "bottom",
      duration: 2000,
      render: ({ id }) => {
        const toastId = "toast-" + id;
        return (
          <Toast
            nativeID={toastId}
            className="flex-row items-center gap-4 bg-primary-300 px-5 py-3 shadow-soft-1"
          >
            <Icon
              as={icon || CheckCircleIcon}
              size="xl"
              className={!iconColor ? "text-typography-black" : ""}
              color={iconColor}
            />
            <Divider
              orientation="vertical"
              className="h-[30px] bg-outline-200"
            />
            <ToastTitle size="sm">{message}</ToastTitle>
          </Toast>
        );
      },
    });
  };

  return { showToast };
};
