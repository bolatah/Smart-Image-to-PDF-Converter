import { Asset, AssetRef } from "expo-media-library";
import React, { useRef, useMemo, useEffect, useState } from "react";
import {
  Animated,
  Platform,
  Easing,
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";
import { Tooltip, IconButton } from "react-native-paper";
import { RowProps } from "react-native-sortable-list";
import useControllers from "../utils/useControllers";
import FullImageModal from "./FullImageModal";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`",
]);

const window = Dimensions.get("window");

export interface IRow extends RowProps {
  data: Asset;
  displayImages: () => Promise<string[]>;
}

const Row = (props: IRow) => {
  const [visibleFullImage, setVisibleFullImage] = useState(false);

  let { active, data, displayImages, index } = props;
  const controller = useControllers();
  const indexing = index === 0 ? 1 : index ? index + 1 : null;

  const deleteImage = async (id: AssetRef | AssetRef[]) => {
    await controller.deleteImage(id);
    await displayImages();
  };
  const toggleModalFullImage = () => {
    setVisibleFullImage(!visibleFullImage);
  };

  const activeAnim = useRef(new Animated.Value(0, { useNativeDriver: true }));
  const style = useMemo(
    () => ({
      ...Platform.select({
        android: {
          transform: [
            {
              scale: activeAnim.current.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.07],
              }),
            },
          ],
          elevation: activeAnim.current.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 6],
          }),
        },
      }),
    }),
    []
  );

  useEffect(() => {
    Animated.timing(activeAnim.current, {
      useNativeDriver: true,
      duration: 300,
      easing: Easing.bounce,
      toValue: Number(active),
    }).start();
  }, [active]);

  return (
    <Animated.View style={style}>
      <View style={[!active ? styles.row : styles.activeRow]}>
        <Image
          source={{ uri: data.uri }}
          style={!active ? styles.image : styles.activeImage}
        />
        <View style={styles.tooltip}>
          <Tooltip title="Delete Image">
            <IconButton
              icon="window-close"
              iconColor="#FF0000"
              selected
              size={20}
              onPress={() => deleteImage(data.id)}
            />
          </Tooltip>
          <Tooltip title="Enlarge Image">
            <IconButton
              icon="window-maximize"
              selected
              size={20}
              onPress={toggleModalFullImage}
            />
          </Tooltip>
        </View>

        <FullImageModal
          imageUri={data.uri}
          visible={visibleFullImage}
          toggleModalFullImage={toggleModalFullImage}
        />
      </View>
      <View style={{ alignSelf: "center" }}>
        <Text>{indexing} </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    height: 150,
    flex: 2,
    marginTop: 7,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: "#89CFF0",
    width: window.width - 30 * 2,
    elevation: 0,
    marginHorizontal: 30,
  },
  activeRow: {
    flexDirection: "row",
    backgroundColor: "red",
    height: 175,
    flex: 2,
    marginTop: 7,
    borderRadius: 8,

    width: window.width - 30 * 2,
    elevation: 0,
    marginHorizontal: 30,
  },
  tooltip: {
    alignItems: "center",
    justifyContent: "space-around",
    flex: 1,
  },
  image: {
    flex: 7,
    alignSelf: "flex-start",
    margin: 10,
    width: 200,
    height: 125,
    borderRadius: 10,
  },
  activeImage: {
    flex: 7,
    alignSelf: "flex-start",
    margin: 10,
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  text: {
    fontSize: 24,
    color: "#222222",
  },
});

export default Row;
