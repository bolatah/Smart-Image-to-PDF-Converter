import React, { useCallback, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import {
  Text,
  IconButton,
  Tooltip,
  Portal,
  Dialog,
  Button,
} from "react-native-paper";
import useControllers from "../utils/useControllers";
import SortableList, { RowProps } from "react-native-sortable-list";
import PDFModal from "./PDFModal";
import Row from "./ListRow";
import { Asset } from "expo-media-library";

type ImagesListProps = {
  data: Asset[];
  displayImages: () => Promise<string[]>;
};

const window = Dimensions.get("window");

const ImagesList = (props: ImagesListProps) => {
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [visibleModalPDF, setVisibleModalPDF] = useState(false);
  const controller = useControllers();
  let { data, displayImages } = props;

  const hideDialog = () => setVisibleDialog(false);

  const takePicture = async () => {
    await controller.takePicture();
    await displayImages();
  };

  const addImage = async () => {
    await controller.addImagesToAlbum();
    await displayImages();
  };

  const deleteAlbumImagesFromAlbum = async () => {
    await controller.deleteAllImagesFromAlbum(data);
    await displayImages();
  };

  const toggleModalPDF = () => {
    setVisibleModalPDF(!visibleModalPDF);
  };

  const renderRow = useCallback(({ data, active, index }: RowProps) => {
    return (
      <Row
        data={data}
        active={active}
        displayImages={displayImages}
        index={index}
      />
    );
  }, []);

  return (
    <>
      <View style={{ flexDirection: "row-reverse" }}>
        <Tooltip title="Delete all">
          <IconButton
            iconColor="#FF0000"
            icon="file-image-remove"
            selected
            size={20}
            onPress={() => setVisibleDialog(true)}
          />
        </Tooltip>
        <Tooltip title="Add from Gallery">
          <IconButton
            icon="file-image-plus"
            selected
            size={20}
            onPress={addImage}
          />
        </Tooltip>
        <Tooltip title="Take a picture">
          <IconButton icon="camera" selected size={20} onPress={takePicture} />
        </Tooltip>
        <Tooltip title="Convert to PDF File">
          <IconButton
            icon="file-pdf-box"
            iconColor="#FF0000"
            selected
            size={20}
            onPress={toggleModalPDF}
          />
        </Tooltip>
      </View>
      <SortableList
        data={data}
        style={styles.list}
        contentContainerStyle={styles.contentContainer}
        renderRow={renderRow}
        onReleaseRow={(key, currentOrder) => {
          console.log(key, currentOrder);
        }}
      />

      <PDFModal
        visible={visibleModalPDF}
        toggleModal={toggleModalPDF}
        displayImages={displayImages}
      />
      <Portal>
        <Dialog visible={visibleDialog} onDismiss={hideDialog}>
          <Dialog.Content>
            <Dialog.Icon icon="alert" />
            <Text variant="bodyMedium">
              Are you sure to delete all images ?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Disagree</Button>
            <Button onPress={deleteAlbumImagesFromAlbum}>Agree</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },
  title: {
    fontSize: 20,
    paddingVertical: 20,
    color: "#999999",
  },
  list: {
    flex: 1,
  },
  contentContainer: {
    width: window.width,
    paddingHorizontal: 0,
  },

  text: {
    fontSize: 24,
    color: "#222222",
  },
});

export default ImagesList;
