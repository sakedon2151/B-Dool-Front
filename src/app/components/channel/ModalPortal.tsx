// participant modal
import { ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalPortalProps { // 추후 model 로 이전
    children: ReactNode;
}

export default function ModalPortal({ children }: ModalPortalProps) {
    return createPortal(
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}>
        <div style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "500px",
          width: "100%",
        }}>
          {children}
        </div>
      </div>,
      document.body
    )
}
