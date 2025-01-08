export const breadTheme = (currTheme) => ({
  siteVariables: {
    colorScheme: {
      default: {
        foreground: currTheme === "default" ? "black" : "white",
        backgroundHover: currTheme === "default" ? "#FAFAFA" : "rgb(59,58,57)",
      },
    },
  },
  componentVariables: {
    Text: ({ colorScheme }) => ({
      color: colorScheme.default.foreground,
      backgroundColor: colorScheme.default.backgroundHover,
    }),
  },
  componentStyles: {
    Text: {
      root: ({ variables }) => ({
        color: variables.color,
        backgroundColor: variables.backgroundColor,
      }),
    },
  },
});

