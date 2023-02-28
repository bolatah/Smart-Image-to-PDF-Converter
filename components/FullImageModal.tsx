import { Modal, Portal } from "react-native-paper";
import { Dimensions, Image, StyleSheet } from "react-native";

type FullImageModalProps = {
  imageUri: string;
  visible: boolean;
  toggleModalFullImage: () => void;
};

const containerStyle = { backgroundColor: "white", padding: 20 };

const window = Dimensions.get("window");

const FullImageModal = (props: FullImageModalProps) => {
  return (
    <Portal>
      <Modal
        visible={props.visible}
        onDismiss={props.toggleModalFullImage}
        contentContainerStyle={containerStyle}
      >
        <Image source={{ uri: props.imageUri }} style={styles.image} />
      </Modal>
    </Portal>
  );
};
const styles = StyleSheet.create({
  image: { width: window.width - 20 * 2, height: window.height },
});
export default FullImageModal;
