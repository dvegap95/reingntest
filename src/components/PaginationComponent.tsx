import React from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import styles from "./styles/PaginationComponent.module.css";
export default function PaginationComponent(props: {
  page: number; //current page (controled prop)
  totalPages: number; //total of existing pages
  onPageChanged?: Function; //controlled prop page internal change handler 
  maxItemCount?: number; //amount of controls (page specific buttons) to be displayed. 
                         //It should be an even value. 
                         //Omit for displaying all page controls

}) {
  //******implementation of truncated pagination*****
  
  // in case of ommited, it takes a suficiently large value to avoid truncation
  let maxItemCount: number = props.maxItemCount || props.totalPages * 2; 
  
  // make even if odd
  if (!(maxItemCount % 2)) {
    maxItemCount--;
  }
  
  //take first and last page elements and also truncation separators (...) 
  //into consideration for element counting
  maxItemCount-=4;

  //make odd for half splitting simplicity
  maxItemCount --;
  
  //check aganist minimun acceptable value
  if(maxItemCount < 2)maxItemCount = 2;

  let pages: any = {}; //pageBtn-related information
  let pagesButtons = []; //actual tsx elements

  //----using pages as dictionary to determine page range overlapping----
  //Eg:
  //For props.page = 5, props.totalPages = 9, props.itemCount = 7 =>> {1:1,3:3,4:4,5:5,6:6,7:7,9:9}
  //For props.page = 2, props.totalPages = 9, props.itemCount = 7 =>> {1:1,2:2,3:3,4:4,5:5,6:6,9:9}
  
  pages[1] = 1;//first page button always displays
  
  let topLeft = 0,topRight=props.totalPages;//boundaries for the displayed range of buttons 
  
  //is page range at start? 
  if(props.page < maxItemCount/2 + 3){
    topRight = maxItemCount + 3;
  }
  //is page range at end?
  else if(props.page > props.totalPages - maxItemCount/2 - 2){
    topLeft = props.totalPages - maxItemCount - 2;
  }
  //no boundaries overlapping conditions
  else{
    topLeft = props.page - maxItemCount / 2;
    topRight = props.page + maxItemCount / 2;
  }

  //page dictionary map construction
  for (
    let i = topLeft;
    i <= topRight;
    i++
  ) {
    if (i <= 0 || i > props.totalPages) continue; //ommit outsider values
    pages[i] = i;
  }
  pages[props.totalPages] = props.totalPages; //last page button always displays

  //tsx element creation

  let p = 1, // page for iteration
    index = 0;
  let pagesArr = Object.entries(pages); //array of page dictionary entries  
  while (index < pagesArr.length) {
    const currPg = p; //fixed copy of iteration page for current element
    if (pages[p]) {//does page exist in dictionary?
      pagesButtons.push( //add pageButton element
        <div
          className={styles.paginationButton}
          data-testid={`page_component__page_${currPg}`}
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
      //insert separator element (...)
      pagesButtons.push(<div style={{margin:"0 15px"}} key={"points_"+index}>...</div>);
      
      p =
        +pagesArr[index][0];//iterating page becomes next valid page on dictionary's entries
    }
  }
  return (
    <div className={styles.paginationContainer}>
      <div
        className={styles.paginationButton}
        onClick={() => {
          props.onPageChanged &&
            props.onPageChanged(Math.max(props.page - 1, 1));//decrese page if possible
        }}
      >
        <MdChevronLeft className={styles.paginationControlIcon} 
          data-testid="page_component__prev"
          />
      </div>
      {pagesButtons}
      <div
        className={styles.paginationButton}
        onClick={() => {
          props.onPageChanged &&
            props.onPageChanged(Math.min(props.page + 1, props.totalPages));//increase page if possible
        }}
      >
        <MdChevronRight className={styles.paginationControlIcon} 
          data-testid="page_component__next"
          />
      </div>
    </div>
  );
}
