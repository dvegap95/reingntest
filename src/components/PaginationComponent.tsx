import React from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import styles from "./styles/PaginationComponent.module.css";
export default function PaginationComponent(props: {
  page: number;
  totalPages: number;
  onPageChanged?: Function;
  maxItemCount?: number;
}) {
  //implementation of truncated pagination
  let maxItemCount: number = props.maxItemCount || props.totalPages * 2;
  if (!(maxItemCount % 2)) {
    maxItemCount--;
  }
  maxItemCount-=5;
  if(maxItemCount < 2)maxItemCount = 2;
  let pages: any = {};
  let pagesButtons = [];
  pages[1] = 1;
  let topLeft = 0,topRight=props.totalPages;
  if(props.page < maxItemCount/2 + 3){
    topRight = maxItemCount + 3;
  }
  else if(props.page > props.totalPages - maxItemCount/2 - 2){
    topLeft = props.totalPages - maxItemCount - 2;
  }
  else{
    topLeft = props.page - maxItemCount / 2;
    topRight = props.page + maxItemCount / 2;
  }
  for (
    let i = topLeft;
    i <= topRight;
    i++
  ) {
    if (i <= 0 || i > props.totalPages) continue;
    pages[i] = i;
  }
  pages[props.totalPages] = props.totalPages;

  console.log(pages);
  let p = 1,
    index = 0;
  let pagesArr = Object.entries(pages);
  while (index < pagesArr.length) {
    const currPg = p;
    if (pages[p]) {
      pagesButtons.push(
        <div
          className={styles.paginationButton}
          style={
            props.page === p
              ? { backgroundColor: "#1890ff", color: "#fff" }
              : {}
          }
          key={currPg}
          onClick={(event) => {
            console.log({p});
            props.onPageChanged && props.onPageChanged(currPg);
          }}
        >
          <span className={styles.paginationButtonText}>{p}</span>
        </div>
      );
      p++;
      index++;
    } else {
      pagesButtons.push(<div style={{margin:"0 15px"}} key={"points_"+index}>...</div>);
      p =
        +pagesArr[index][0];
    }
  }
  return (
    <div className={styles.paginationContainer}>
      <div
        className={styles.paginationButton}
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
        <MdChevronRight className={styles.paginationControlIcon} />
      </div>
    </div>
  );
}
