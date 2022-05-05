import React, { useState } from "react";
import SelectComponent from "../components/SelectComponent";
import ItemComponent from "../components/ItemComponent";
import styles from "./styles/AllView.module.css";
import PaginationComponent from "../components/PaginationComponent";
export default function AllView() {
  const [selection, setSelection] = useState({ id: 0 });
  return (
    <div className={styles.globalContainer}>
      <div className={styles.selectorContainer}>
        <SelectComponent value={selection} onChange={setSelection} />
      </div>
      <div className={styles.itemsContainer}>
        {new Array(8).fill(1).map((e) => (
          <div style={{ display: "inline-block" }}>
            <ItemComponent style={{ margin: "15px 20px" }} />
          </div>
        ))}
      </div>
      <div className={styles.footer}>
        <PaginationComponent page={2} totalPages={10} />
      </div>
    </div>
  );
}
