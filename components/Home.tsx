import React, { useEffect, useState } from "react";
import { List } from "react-native-paper";
import useControllers from "../utils/useControllers";
import ImagesList from "./ImagesList";
import { Alert, StyleSheet, LogBox } from "react-native";
import { Asset } from "expo-media-library";

LogBox.ignoreAllLogs();

function Home() {
  const [assets, setAssets] = useState<Array<Asset>>([]);
  const [refresh, setRefresh] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const controller = useControllers();

  const displayImages = async () => {
    setExpanded(false);
    let images: string[] = [];
    let assetsArray = await controller.getAlbumAssets();
    assetsArray ? setAssets(assetsArray) : setAssets([]);
    for (let asset of assets) {
      asset = await controller.getImage(asset.id);
      if (asset !== null) {
        let assetUri = asset.uri;
        images.push(assetUri);
      }
    }
    return images;
  };

  useEffect(() => {
    displayImages();
    setExpanded(false);
  }, [refresh]);

  return (
    <>
      <List.Section
        title={assets.length > 0 ? "" : "Smart Image to PDF Converter"}
        titleStyle={styles.title}
        style={
          assets.length > 0 ? styles.section : styles.sectionWithoutDisplay
        }
      >
        <List.Accordion
          title="Image Management"
          titleStyle={{
            color: "#000000",
            alignSelf: !expanded ? "center" : "flex-start",
            fontWeight: "900",
            fontSize: 18,
            backgroundColor: "#F8B6A8",
          }}
          style={styles.listAccordionImageManagement}
          left={(props) => (
            <List.Icon
              {...props}
              icon="file-image"
              color="#000000"
              style={{ display: !expanded ? "none" : "flex" }}
            />
          )}
          expanded={expanded}
          onPress={() => setExpanded(!expanded)}
        >
          <List.Accordion
            title="Add image"
            style={styles.listAccordionAddImage}
            titleStyle={styles.listAccordionAddImageTitle}
            expanded
            left={(props) => (
              <List.Icon {...props} icon="image-plus" color="#000000" />
            )}
            right={() => null}
          >
            <List.Item
              title="Take a Picture"
              titleStyle={styles.listItemTitle}
              style={styles.listItem}
              left={(props) => (
                <List.Icon {...props} icon="camera" color="#000000" />
              )}
              onPress={async () => {
                await controller.takePicture().then(() => setRefresh(!refresh));
              }}
            />
            <List.Item
              title="Add from gallery"
              titleStyle={styles.listItemTitle}
              style={styles.listItem}
              left={(props) => (
                <List.Icon {...props} icon="file-image-plus" color="#000000" />
              )}
              onPress={async () => {
                await controller
                  .addImagesToAlbum()
                  .then(() => setRefresh(!refresh));
              }}
            />
          </List.Accordion>
          <List.Item
            title="Display Images"
            titleStyle={styles.listItemDisplayIMageTitle}
            style={styles.listItemDisplayImage}
            left={(props) => (
              <List.Icon {...props} icon="file-eye" color="#000000" />
            )}
            onPress={
              assets.length > 0
                ? async () => {
                    await displayImages();
                  }
                : () => Alert.alert("There is no image to display.")
            }
          />
        </List.Accordion>
      </List.Section>

      {assets.length > 0 ? (
        <ImagesList data={assets} displayImages={displayImages} />
      ) : null}
    </>
  );
}
export default Home;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    margin: 10,
    fontWeight: "800",
    color: "#000000",
    alignSelf: "center",
  },

  sectionWithoutDisplay: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    marginTop: 22,
    backgroundColor: "#E0C9A6",
  },

  section: { marginTop: 40 },

  listAccordionImageManagement: {
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "#F8B6A8",
  },
  listAccordionAddImage: { paddingLeft: 25, backgroundColor: "#F8B6A8" },
  listAccordionAddImageTitle: { color: "#000000" },
  listItem: { paddingLeft: 75, backgroundColor: "#F8B6A8" },
  listItemTitle: { color: "#000000" },
  listItemDisplayImage: { paddingLeft: 7, backgroundColor: "#F8B6A8" },
  listItemDisplayIMageTitle: { color: "#000000", marginLeft: -9 },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
