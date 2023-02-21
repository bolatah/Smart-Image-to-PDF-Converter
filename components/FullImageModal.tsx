import { Modal, Portal } from "react-native-paper";
import { Image } from "react-native";

type FullImageModalProps = {
  imageUri: string;
  visible: boolean;
  toggleModalFullImage: () => void;
};

const containerStyle = { backgroundColor: "white", padding: 20 };

const FullImageModal = (props: FullImageModalProps) => {
  return (
    <Portal>
      <Modal
        visible={props.visible}
        onDismiss={props.toggleModalFullImage}
        contentContainerStyle={containerStyle}
      >
        <Image
          source={{ uri: props.imageUri }}
          style={{ width: 300, height: 300 }}
        />
      </Modal>
    </Portal>
  );
};

export default FullImageModal;
