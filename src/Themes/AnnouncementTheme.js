export const Headertheme = () => ({
    componentVariables: {
      Flex: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.brand.white,
      }),
    },
    componentStyles: {
      Flex: {
        root: ({ variables }) => ({
          color: variables.color,
          backgroundColor: variables.backgroundColor,
        }),
      },
    },
  });
  export const leaderTheme = (theme) => ({

    siteVariables: {
      colorScheme: {
        default: {
          foreground: `${theme.theme == "default" ? `#616161` : `#E8E8E8`}`,
        },
      },
    },
    componentVariables: {
      Text: ({ colorScheme }) => ({
        color: colorScheme.default.foreground,
        backgroundColor: colorScheme.brand.white,
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