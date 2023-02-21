import React, { useEffect, useState } from "react";
import { List } from "react-native-paper";
import useControllers from "../utils/useControllers";
import ImagesList from "./ImagesList";
import { Alert } from "react-native";
import { Asset } from "expo-media-library";

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
      <List.Section title="Image to PDF Converter Management">
        <List.Accordion
          title="Image Management"
          left={(props) => <List.Icon {...props} icon="file-image" />}
          expanded={expanded}
          onPress={() => setExpanded(!expanded)}
        >
          <List.Accordion
            title="Add image"
            style={{ paddingLeft: 25 }}
            expanded
            left={(props) => <List.Icon {...props} icon="image-plus" />}
            right={() => null}
          >
            <List.Item
              title="Take a Picture"
              style={{ paddingLeft: 75 }}
              left={(props) => <List.Icon {...props} icon="camera" />}
              onPress={async () => {
                await controller.takePicture().then(() => setRefresh(!refresh));
              }}
            />
            <List.Item
              title="Add from gallery"
              style={{ paddingLeft: 75 }}
              left={(props) => <List.Icon {...props} icon="file-image-plus" />}
              onPress={async () => {
                await controller
                  .addImagesToAlbum()
                  .then(() => setRefresh(!refresh));
              }}
            />
          </List.Accordion>
          <List.Item
            title="Display Images"
            style={{ paddingLeft: 10 }}
            left={(props) => <List.Icon {...props} icon="file-eye" />}
            onPress={
              assets.length > 0
                ? async () => {
                    await displayImages();
                  }
                : () => Alert.alert("there is no image to display")
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
