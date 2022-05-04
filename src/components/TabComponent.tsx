import React from "react";
import styles from "./styles/TabComponent.module.css";

export default function TabComponent(props: {
  value: { id: number };
  onChange: Function;
}) {
  const btns = [{ text: "All" }, { text: "My faves" }];
  return (
    <div className={styles.tabContainer}>
      {btns.map((btn, index) => (
        <div
          className={styles.tabBtn}
          onClick={() => {
            props.onChange({ ...btn, id:index });
          }}
          style={
            props.value.id === index
              ? {
                  color: "#1797ff",
                  borderColor: "#1797ff",
                }
              : {}
          }
        >
          <span className={styles.tabBtnText}>{btn.text}</span>
        </div>
      ))}
    </div>
  );
}
