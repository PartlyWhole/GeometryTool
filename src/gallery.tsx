// Temporary: renders every library figure for visual audit.
import React from "react";
import { createRoot } from "react-dom/client";
import { LIBRARY } from "./practice/content/library";
import { Figure } from "./practice/Figure";
import "./style.css";
import "./practice/practice.css";

function Gallery() {
  return (
    <div className="app-page">
      <div className="page" style={{ maxWidth: 1500 }}>
        <h1>Figure gallery</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {Object.entries(LIBRARY).map(([name, make]) => (
            <div key={name}>
              <h3 style={{ margin: "0 0 6px", fontSize: 13 }}>{name}</h3>
              <Figure board={make()} height={250} ariaLabel={name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
createRoot(document.getElementById("root")!).render(<Gallery />);
