import React from "react";

export default function Logo() {
  return (
    <div
      style={{
        width: 360,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10, // espaço entre as imagens
      }}
    >
      <img
        src="/assets/img/logovaiRapidoUber.png"
        alt="Logo Vai Rápido Uber 1"
        style={{ maxWidth: "50%", height: "auto" }}
      />
      <img
        src="/assets/img/logovaiRapidoCardapioOnlines.png"
        alt="Logo Vai Rápido Uber 2"
        style={{ maxWidth: "50%", height: "auto" }}
      />
    </div>
  );
}
