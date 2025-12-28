jest.mock("expo-audio", () => ({
  useAudioPlayer: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return {
    Ionicons: (props: any) =>
      React.createElement(Text, {
        testID: `icon-${props.name}`,
      }),
  };
});
