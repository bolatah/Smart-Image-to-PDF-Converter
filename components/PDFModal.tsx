import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Alert,
  Pressable,
  TextInput,
} from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import * as FileSytem from "expo-file-system";

type PDFModalProps = {
  visible: boolean;
  displayImages: () => Promise<string[]>;
  toggleModal: () => void;
};

const initialText = "File name";

export default function PDFModal(props: PDFModalProps) {
  const [value, setValue] = useState(initialText);
  let { visible, displayImages, toggleModal } = props;

  /*   const images = async () => {
    await displayImages();
  }; */
  const html = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    </head>
    <body style="text-align: center;">
      <script>
      const parentTag = document.getElementsByTagName("body");
      for (i = 0; i < assets.length; i++) {
        var image = document.createElement("img");
        image.setAttribute("src", assets[i].uri);
        parentTag.appendChild(image);
      }
      </script>
    </body>
  </html>
  `;
  const sharePDF = async () => {
    if (value.length > 0 && value !== initialText) {
      try {
        let { uri } = await Print.printToFileAsync({ html });
        let uuidName = uri.substring(
          uri.lastIndexOf("/") + 1,
          uri.lastIndexOf(".pdf")
        );

        const customizedNewUri = uri.replace(uuidName, value);
        await FileSytem.moveAsync({ from: uri, to: customizedNewUri });

        const isSharable = await Sharing.isAvailableAsync();

        if (isSharable) {
          await Sharing.shareAsync(customizedNewUri, {
            UTI: ".pdf",
            mimeType: "Printlication/pdf",
          });
        } else {
          alert(`Sharing isn't available.`);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      Alert.alert("wrong file name");
    }
  };
  useEffect(() => {
    setValue(initialText);
  }, [toggleModal]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        toggleModal();
        Alert.alert("Window has been closed.");
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text>Please give a name for your PDF file!</Text>
          <TextInput
            editable
            maxLength={40}
            onChangeText={(text) => setValue(text)}
            value={value}
            style={styles.input}
          />
          <View style={{ flexDirection: "row" }}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                toggleModal();
              }}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                sharePDF().then(() => toggleModal());
              }}
            >
              <Text style={styles.textStyle}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    paddingLeft: 5,
    borderRadius: 5,
    margin: 20,
  },

  button: {
    borderRadius: 20,
    padding: 5,
    elevation: 2,
    marginLeft: 20,
    marginRight: 20,
    width: 80,
    height: 30,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
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
