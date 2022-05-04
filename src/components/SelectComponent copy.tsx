import React from "react";
import imgAngular138 from "../img/image-138.png";
import styles from "./styles/SelectComponent.module.css";

export default function SelectComponent() {
  const selectLabel = "Select your news";
  console.log(imgAngular138);
  return (
    <div className={styles.selectContainer}>
        <span className={styles.selectLabel}>
          {selectLabel}
        </span>
      <div className={styles.selectMenu}>
        <div className={styles.selectOption}>
          <img src={imgAngular138} className={styles.selectIcon}></img>
          <span className={styles.selectOptionLabel}>Angular</span>
        </div>
      </div>
    </div>
  );
}
