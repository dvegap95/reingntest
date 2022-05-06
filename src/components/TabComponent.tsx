import React from "react";
import styles from "./styles/TabComponent.module.css";

export default function TabComponent(props: {
  value: { id: number }; //controlled component tab value (object-like format)
  onChange: Function; //handler for tab value changes
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
            props.value.id === index //is selected?
              ? {
                  color: "#1797ff",
                  borderColor: "#1797ff",
                }
              : {}
          }
          key={index}
        >
          <span className={styles.tabBtnText}>{btn.text}</span>
        </div>
      ))}
    </div>
  );
}
