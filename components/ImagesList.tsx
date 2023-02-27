import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, StatusBar } from "react-native";
import {
  Text,
  IconButton,
  Tooltip,
  Portal,
  Dialog,
  Button,
} from "react-native-paper";
import SortableList, { RowProps } from "react-native-sortable-list";
import { Asset } from "expo-media-library";
import useControllers from "../utils/useControllers";

import PDFModal from "./PDFModal";
import Row from "./ListRow";
import Toast from "./Toast";

type ImagesListProps = {
  data: Asset[];
  displayImages: () => Promise<string[]>;
};

const window = Dimensions.get("window");

const ImagesList = (props: ImagesListProps) => {
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [visibleModalPDF, setVisibleModalPDF] = useState(false);
  const [arrayInHTML, setArrayInHTML] = useState<Array<string>>();

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
  const modifyHTML = () => {
    return arrayInHTML;
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

  const showToast = () => {
    return (
      <Toast
        type="Info"
        title={"Please press on the image to drag!"}
        message={
          "You can change the order of images before converting to a PDF file."
        }
      />
    );
  };

  useEffect(() => {
    displayImages().then((res) => {
      setArrayInHTML(res);
      showToast();
    });
  }, []);

  useEffect(() => {
    displayImages().then((res) => {
      setArrayInHTML(res);
    });
  }, [data.length]);

  return (
    <>
      <View style={styles.tooltip}>
        <Tooltip title="Delete all">
          <IconButton
            icon="file-image-remove"
            selected
            size={25}
            onPress={() => setVisibleDialog(true)}
          />
        </Tooltip>
        <Tooltip title="Add from Gallery">
          <IconButton
            icon="file-image-plus"
            selected
            size={25}
            onPress={addImage}
          />
        </Tooltip>
        <Tooltip title="Take a picture">
          <IconButton icon="camera" selected size={25} onPress={takePicture} />
        </Tooltip>
        <Tooltip title="Convert to PDF File">
          <IconButton
            icon="file-pdf-box"
            selected
            size={29}
            onPress={toggleModalPDF}
          />
        </Tooltip>
      </View>
      <SortableList
        data={data}
        style={styles.list}
        contentContainerStyle={styles.contentContainer}
        renderRow={renderRow}
        onReleaseRow={async (key, currentOrder) => {
          const newReorderedArray = Array.from(
            currentOrder.map((i) => data[i].uri)
          );

          {
            newReorderedArray
              ? setArrayInHTML(newReorderedArray)
              : displayImages().then((res) => setArrayInHTML(res));
          }
        }}
      />

      <PDFModal
        visible={visibleModalPDF}
        toggleModal={toggleModalPDF}
        modifyHTML={modifyHTML}
      />

      <Portal>
        <Dialog
          visible={visibleDialog}
          onDismiss={hideDialog}
          style={styles.modal}
        >
          <Dialog.Content>
            <Text style={styles.dialogText}>
              <Dialog.Icon icon="alert" size={15} /> Are you sure to delete all
              images ?
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
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#E0C9A6",
    padding: 8,
  },
  title: {
    fontSize: 20,
    paddingVertical: 20,
    color: "#999999",
  },
  tooltip: { flexDirection: "row-reverse" },
  list: {
    flex: 1,
  },
  modal: { backgroundColor: "#fff", borderRadius: 0 },
  dialogText: { fontWeight: "600", fontSize: 17, marginTop: -20 },
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
