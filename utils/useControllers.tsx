import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

const useControllers = () => {
  const getImage = async (id: MediaLibrary.AssetRef) => {
    const image = await MediaLibrary.getAssetInfoAsync(id);
    return image;
  };
  const deleteImage = async (
    id: MediaLibrary.AssetRef | MediaLibrary.AssetRef[]
  ) => {
    try {
      let status = await MediaLibrary.requestPermissionsAsync();

      if (status.granted) {
        await MediaLibrary.deleteAssetsAsync(id);
        console.log(`${id} is deleted`);
      }
    } catch (error) {
      console.log(`deleteImage : ${error}`);
    }
  };

  const deleteAllImagesFromAlbum = async (
    assets: MediaLibrary.AssetRef | MediaLibrary.AssetRef[]
  ) => {
    await MediaLibrary.deleteAssetsAsync(assets);
  };

  const getAlbumAssets = async () => {
    try {
      let status = await MediaLibrary.requestPermissionsAsync();

      if (status.granted) {
        const albumTest = await MediaLibrary.getAlbumAsync("test");
        if (albumTest) {
          const albumAssets = await MediaLibrary.getAssetsAsync({
            album: albumTest.id,
            sortBy: "creationTime",
          });
          const assets = albumAssets.assets;

          return assets;
        } else {
          return;
        }
      }
    } catch (error) {
      console.log(`getAlbumAssets : ${error}`);
    }
  };

  const getAlbumPictures = async () => {
    try {
      let status = await MediaLibrary.requestPermissionsAsync();

      if (status.granted) {
        let album = await MediaLibrary.getAssetsAsync({
          album: "-1033159534",
          sortBy: "creationTime",
        });

        if (album) {
          const assets = album.assets;
          let images = [];
          for (let asset of assets) {
            asset = await MediaLibrary.getAssetInfoAsync(asset.id);
            let assetUri = asset.uri;
            images.push(assetUri);
          }
          return images;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const takePicture = async () => {
    try {
      let resultCamera = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        base64: true,
      });
      let status = await MediaLibrary.requestPermissionsAsync();
      if (status.granted && resultCamera.assets !== null) {
        const album = await MediaLibrary.getAlbumAsync("test");
        if (album) {
          let assetsArray = [];
          for (let asset of resultCamera.assets) {
            const assetUri = await MediaLibrary.createAssetAsync(asset.uri);
            assetsArray.push(assetUri);
          }
          await MediaLibrary.addAssetsToAlbumAsync(
            assetsArray,
            album.id,
            false
          );
        } else {
          let newAsset = await MediaLibrary.createAssetAsync(
            resultCamera.assets[0].uri
          );
          let newAlbum = await MediaLibrary.createAlbumAsync(
            "test",
            newAsset,
            false
          );
          console.log(newAsset.id, newAlbum);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const addImagesToAlbum = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 1,
      });
      let status = await MediaLibrary.requestPermissionsAsync();
      if (status.granted && !result.canceled) {
        const album = await MediaLibrary.getAlbumAsync("test");
        if (album) {
          let assetsArray = [];
          for (let asset of result.assets) {
            const assetUri = await MediaLibrary.createAssetAsync(asset.uri);
            assetsArray.push(assetUri);
          }
          await MediaLibrary.addAssetsToAlbumAsync(
            assetsArray,
            album.id,
            false
          );
        } else {
          let newAsset = await MediaLibrary.createAssetAsync(
            result.assets[0].uri
          );
          let newAlbum = await MediaLibrary.createAlbumAsync(
            "test",
            newAsset,
            false
          );
          console.log(newAsset, newAlbum);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createAlbum = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 1,
      });
      let status = await MediaLibrary.requestPermissionsAsync();
      if (status.granted && !result.canceled) {
        let newAsset = await MediaLibrary.createAssetAsync(
          result.assets[0].uri
        );
        let newAlbum = await MediaLibrary.createAlbumAsync(
          "test",
          newAsset,
          false
        );
        console.log(newAsset, newAlbum);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAlbumId = async () => {
    try {
      let status = await MediaLibrary.requestPermissionsAsync();
      if (status.granted) {
        const album = await MediaLibrary.getAlbumAsync("test");
        console.log(album.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    takePicture,
    createAlbum,
    getAlbumId,
    addImagesToAlbum,
    getAlbumPictures,
    getAlbumAssets,
    deleteImage,
    getImage,
    deleteAllImagesFromAlbum,
  };
};
export default useControllers;
