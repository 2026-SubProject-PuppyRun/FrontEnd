import React from "react";

import type { VariantProps } from "@gluestack-ui/utils/nativewind-utils";
import { resolveSpoqaFontFamily } from "@/util/fonts/spoqa";
import { Text as RNText } from "react-native";
import { textStyle } from "./styles";

type ITextProps = React.ComponentProps<typeof RNText> &
  VariantProps<typeof textStyle>;

const Text = React.forwardRef<React.ComponentRef<typeof RNText>, ITextProps>(
  function Text(
    {
      className,
      isTruncated,
      bold,
      underline,
      strikeThrough,
      size = "md",
      sub,
      italic,
      highlight,
      style,
      ...props
    },
    ref,
  ) {
    const resolvedClassName = textStyle({
      isTruncated: isTruncated as boolean,
      bold: bold as boolean,
      underline: underline as boolean,
      strikeThrough: strikeThrough as boolean,
      size,
      sub: sub as boolean,
      italic: italic as boolean,
      highlight: highlight as boolean,
      class: className,
    });

    return (
      <RNText
        className={resolvedClassName}
        style={[{ fontFamily: resolveSpoqaFontFamily(resolvedClassName, Boolean(bold)) }, style]}
        {...props}
        ref={ref}
      />
    );
  },
);

Text.displayName = "Text";

export { Text };
