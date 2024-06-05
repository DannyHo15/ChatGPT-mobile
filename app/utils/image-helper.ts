import * as MediaLibrary from "expo-media-library"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"
import * as Clipboard from "expo-clipboard"
import { Alert } from "react-native"

export const shareImage = async (imageUrl: string) => {
  Sharing.shareAsync(imageUrl)
}

export const copyImageToClipboard = async (imageUrl: string) => {
  const fileUri = FileSystem.documentDirectory + `${Date.now()}.jpg`
  try {
    const res = await FileSystem.downloadAsync(imageUrl, fileUri)
    const base64 = await FileSystem.readAsStringAsync(res.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    await Clipboard.setImageAsync(base64);
    Alert.alert("Image copied to clipboard");
  } catch (error) {
    Alert.alert("Error", "Unable to copy the image to clipboard.");
    console.error("Clipboard error: ", error);
  }
}
export const downloadAndSaveImage = async (imageUrl: string) => {
  const fileUri = FileSystem.documentDirectory + `${new Date().getTime()}.jpg`;

  try {
    console.log(imageUrl, fileUri)
    const res = await FileSystem.downloadAsync(imageUrl, fileUri);
    return saveFile(res.uri);
  } catch (err) {
    Alert.alert("Error", "Unable to download and save the image.");
    console.error("File download error: ", err);
  }
};

const saveFile = async (fileUri: string) => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission required', 'Please allow permissions to download');
    return;
  }

  try {
    const asset = await MediaLibrary.createAssetAsync(fileUri);
    let album = await MediaLibrary.getAlbumAsync('Download');
    if (!album) {
      album = await MediaLibrary.createAlbumAsync('Download', asset, false);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    }
    Alert.alert('Image saved to Photos');
  } catch (error) {
    Alert.alert("Error", "Unable to save the image.");
    console.error("Save file error: ", error);
  }
};
