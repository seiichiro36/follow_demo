import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  colors: {
    tomato: {
      200: "#FC8181", // オリジナルのtomato.500
      300: "#F56565", // より濃いトマト色
      400: "#E53E3E", // さらに濃いトマト色
    },
  },
});
