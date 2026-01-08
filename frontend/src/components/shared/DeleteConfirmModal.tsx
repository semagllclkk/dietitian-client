import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

interface Props {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal = ({ title, message, onConfirm, onCancel }: Props) => {
  return (
    <Modal show={true} size="md" onClose={onCancel} popup>
      <ModalHeader />
      <ModalBody>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-400" />
          <h3 className="mb-5 text-lg font-normal !text-gray-800">
            {title}
          </h3>
          <p className="mb-5 text-sm text-gray-400">
            {message}
          </p>
          <div className="flex justify-center gap-4">
            <Button
              color="red"
              onClick={onConfirm}
            >
              Evet, Eminim
            </Button>
            <Button
              color="gray"
              onClick={onCancel}
            >
              Hayır, İptal
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default DeleteConfirmModal;