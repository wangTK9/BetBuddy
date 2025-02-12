import React from "react";
import { createRoot } from "react-dom/client";
import { CapsuleModal, CapsuleModalProps } from "@usecapsule/react-sdk";
import "@usecapsule/react-sdk/styles.css";

export const createCapsuleModalConnector = (
  targetEl: HTMLElement,
  props: Omit<CapsuleModalProps, "isOpen">
) => {
  const root = createRoot(targetEl);

  const state = {
    isOpen: false,
    render: (isOpen: boolean) => {
      state.isOpen = isOpen;
      root.render(
        <CapsuleModal
          {...props}
          isOpen={isOpen}
          onClose={() => {
            state.isOpen = false;
            state.render(false);
            props.onClose?.();
          }}
        />
      );
    },
  };

  return {
    open: () => state.render(true),
    close: () => state.render(false),
    isOpen: () => state.isOpen,
    unmount: () => root.unmount(),
  };
};
