import { useModal } from "../..";
import { Dropdown, DropdownItem } from "./dropdown.component";

export default {
  component: Dropdown,
  title: "Overlays/Dropdown",
};

export const Title = () => {
  const { showModal, onModalOpen, onModalClose } = useModal();
  return (
    <Dropdown
      open={showModal}
      onOpen={onModalOpen}
      onClose={onModalClose}
      type="title"
      title="Select One"
    >
      <DropdownItem text="First Option" onClick={() => {}} />
      <DropdownItem text="Second Option" onClick={() => {}} />
      <DropdownItem text="Third Option" onClick={() => {}} />
    </Dropdown>
  );
};

export const Burger = () => {
  const { showModal, onModalOpen, onModalClose } = useModal();
  return (
    <Dropdown
      open={showModal}
      onOpen={onModalOpen}
      onClose={onModalClose}
      type="burger"
    >
      <DropdownItem text="First Option" onClick={() => {}} />
      <DropdownItem text="Second Option" onClick={() => {}} />
      <DropdownItem text="Third Option" onClick={() => {}} />
    </Dropdown>
  );
};

export const Ellipses = () => {
  const { showModal, onModalOpen, onModalClose } = useModal();
  return (
    <Dropdown
      open={showModal}
      onOpen={onModalOpen}
      onClose={onModalClose}
      type="ellipses"
    >
      <DropdownItem text="First Option" onClick={() => {}} />
      <DropdownItem text="Second Option" onClick={() => {}} />
      <DropdownItem text="Third Option" onClick={() => {}} />
    </Dropdown>
  );
};

export const LeftAligned = () => {
  const { showModal, onModalOpen, onModalClose } = useModal();
  return (
    <Dropdown
      open={showModal}
      onOpen={onModalOpen}
      onClose={onModalClose}
      type="ellipses"
      alignment="left"
    >
      <DropdownItem text="First Option" onClick={() => {}} />
      <DropdownItem text="Second Option" onClick={() => {}} />
      <DropdownItem text="Third Option" onClick={() => {}} />
    </Dropdown>
  );
};

export const RightAligned = () => {
  const { showModal, onModalOpen, onModalClose } = useModal();
  return (
    <Dropdown
      open={showModal}
      onOpen={onModalOpen}
      onClose={onModalClose}
      type="ellipses"
      alignment="right"
    >
      <DropdownItem text="First Option" onClick={() => {}} />
      <DropdownItem text="Second Option" onClick={() => {}} />
      <DropdownItem text="Third Option" onClick={() => {}} />
    </Dropdown>
  );
};

export const ResponsiveType = () => {
  const { showModal, onModalOpen, onModalClose } = useModal();
  return (
    <Dropdown
      open={showModal}
      onOpen={onModalOpen}
      onClose={onModalClose}
      type={{
        laptop: "title",
        desktop: "title",
        wideScreen: "title",
        tablet: "ellipses",
        mobile: "burger",
      }}
      title="Click Me"
      alignment="left"
    >
      <DropdownItem text="First Option" onClick={() => {}} />
      <DropdownItem text="Second Option" onClick={() => {}} />
      <DropdownItem text="Third Option" onClick={() => {}} />
    </Dropdown>
  );
};
