import React from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import styles from "./styles/PaginationComponent.module.css";
export default function PaginationComponent(props: {
  page: number;
  totalPages: number;
  onPageChanged?: Function;
}) {
  let pagesButtons = [];
  for (let i = 0; i < props.totalPages; i++) {
    pagesButtons.push(
      <div
        className={styles.paginationButton}
        style={
          props.page === i + 1
            ? { backgroundColor: "#1890ff", color: "#fff" }
            : {}
        }
        onClick={(event) => {
          props.onPageChanged && props.onPageChanged(i + 1);
        }}
      >
        <span className={styles.paginationButtonText}>{i + 1}</span>
      </div>
    );
  }
  return (
    <div className={styles.paginationContainer}>
      <div className={styles.paginationButton}
              onClick={() => {
                props.onPageChanged &&
                  props.onPageChanged(Math.max(props.page - 1, 1));
              }}
      >
        <MdChevronLeft className={styles.paginationControlIcon} />
      </div>
      {pagesButtons}
      <div
        className={styles.paginationButton}
        onClick={() => {
          props.onPageChanged &&
            props.onPageChanged(Math.min(props.page + 1, props.totalPages));
        }}
      >
        <MdChevronRight className={styles.paginationControlIcon}/>
      </div>
    </div>
  );
}
