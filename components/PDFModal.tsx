import * as React from "react";
import { View, StyleSheet, Text, Modal, TextInput, Alert } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import * as FileSytem from "expo-file-system";
import * as fs from "expo-file-system";
import { Button } from "react-native-paper";

type PDFModalProps = {
  visible: boolean;
  toggleModal: () => void;
  modifyHTML: () => string[] | void;
};

const initialText = "File name";

export default function PDFModal(props: PDFModalProps) {
  const [value, setValue] = useState(initialText);
  let { visible, toggleModal, modifyHTML } = props;

  let images = modifyHTML();

  console.log(`PDF: ${images}`);

  const sharePDF = async () => {
    try {
      if (images && value.length > 0 && value !== initialText) {
        console.log(`images : ${images}`);

        const imgTagsRes = images.map(async (image) => {
          const res = await fs.readAsStringAsync(image, {
            encoding: "base64",
          });

          return `<img src="data:image/jpeg;base64,${res}" style="width: 90vw;"/>`;
        });

        Promise.all(imgTagsRes).then(async (res) => {
          let { uri } = await Print.printToFileAsync({
            html: `<html>` + res.join("\r\n") + `</html>`,
          });
          let uuidName = uri.substring(
            uri.lastIndexOf("/") + 1,
            uri.lastIndexOf(".pdf")
          );

          const customizedNewUri = uri.replace(uuidName, value);
          FileSytem.moveAsync({ from: uri, to: customizedNewUri });
          const isSharable = await Sharing.isAvailableAsync();
          if (isSharable) {
            await Sharing.shareAsync(customizedNewUri, {
              UTI: ".pdf",
              mimeType: "Printlication/pdf",
            });
          } else {
            alert(`Sharing isn't available.`);
          }
        });
      } else {
        Alert.alert("Wrong file name!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setValue(initialText);
  }, [toggleModal]);

  useEffect(() => {
    setTimeout(
      () =>
        Alert.alert(
          "Please press on the images to drag them!",
          "You can change the order of images before converting to a PDF file"
        ),
      5000
    );
  }, []);
  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          toggleModal();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Please give a name for your PDF file!
            </Text>
            <TextInput
              editable
              maxLength={40}
              onChangeText={(text) => setValue(text)}
              value={value}
              style={styles.input}
            />
            <View
              style={{
                flexDirection: "row",
                alignSelf: "flex-end",
              }}
            >
              <Button
                onPress={() => {
                  toggleModal();
                }}
              >
                Cancel
              </Button>

              <Button
                onPress={() => {
                  sharePDF().then(() => toggleModal());
                }}
              >
                Confirm
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
    backgroundColor: "#fff",
    padding: 15,
    alignItems: "center",
    width: 335,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 10,
  },
  modalText: { fontWeight: "500", fontSize: 17 },
  input: {
    borderWidth: 1,
    backgroundColor: "white",
    paddingLeft: 5,
    borderRadius: 5,
    margin: 20,
    width: 150,
  },
});
