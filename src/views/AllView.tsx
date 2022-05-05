import React, { useEffect, useRef, useState } from "react";
import SelectComponent from "../components/SelectComponent";
import ItemComponent, { Hit } from "../components/ItemComponent";
import styles from "./styles/AllView.module.css";
import PaginationComponent from "../components/PaginationComponent";

interface HitsPageInfo {
  exhaustiveNbHits: boolean;
  exhaustiveTypo: boolean;
  hits: Array<Hit>;
  hitsPerPage: number;
  nbHits: number;
  nbPages: number;
  page: number;
  params: string;
  processingTimeMS: number;
  query: string;
}
const queryParams = ["angular", "reactjs", "vuejs"];
const hitsPerPage = 8;
export default function AllView() {
  const [selection, setSelection] = useState({ id: 0 });
  const [page, setPage] = useState(1);
  const [data, setData] = useState(new Array<Hit>(0));
  const [favorites, setFavorites]: [any, Function] = useState({});


  useEffect(()=>{
    let faves,favesStr = localStorage.getItem('favorites');
    if(favesStr)
    {
      faves = JSON.parse(favesStr);
      setFavorites(faves);
    }
    else faves = favorites;
    let sel, selStr = localStorage.getItem('newsSelection');
    if(selStr){
      sel = JSON.parse(selStr);
      setSelection(sel);
    }
    else sel = selection;
    let p, pStr = localStorage.getItem('all_page');
    if(pStr){
      p = JSON.parse(pStr);
      setPage(p);
    }
    else p = page;
    getData(sel,p);
  },[]);

  function getData(sel = selection,p = page){
    fetch(
      `https://hn.algolia.com/api/v1/search_by_date?query=${
        queryParams[sel.id]
      }&page=${p}&hitsPerPage=${hitsPerPage}`
    )
      .then((res) => res.json())
      .then((response: unknown) => {
        let r = response as HitsPageInfo;
        setData(r.hits);
      })
      .catch(alert);
  }


  function saveFavorites(faves:any){
    localStorage.setItem('favorites',JSON.stringify(faves));
    setFavorites(faves);
  }

  function savePage(p:number){
    localStorage.setItem('all_page',JSON.stringify(p));
    setPage(p);
    getData(selection,p)
  }
  
 function saveSelection(sel:{id:number}){
  localStorage.setItem('newsSelection',JSON.stringify(sel));
  setSelection(sel);
  getData(sel,page);
 }

  return (
    <div className={styles.globalContainer}>
      <div className={styles.selectorContainer}>
        <SelectComponent value={selection} onChange={saveSelection} />
      </div>
      <div className={styles.itemsContainer}>
        {data.length ? data.map((e,index) => (
          <div style={{ flex:"1 0 50%" }} key={index}>
            <ItemComponent
              hit={e}
              favorite={!!favorites[e.objectID]}
              onFavoriteChanged={(val:boolean) => {
                if (!val) {
                  let faves = {...favorites}
                  if(faves[e.objectID]) delete faves[e.objectID];
                  saveFavorites(faves);
                } else {
                  let faves = {...favorites}
                  faves[e.objectID] = e;
                  saveFavorites(faves);
                }
              }}
              style={{ margin: "1.5vh 20px" }}
            />
          </div>
        )) : <h2 className={styles.loadingText}>Loading...</h2>}
      </div>
      <div className={styles.footer}>
        <PaginationComponent
          page={page}
          totalPages={9}
          onPageChanged={savePage}
        />
      </div>
    </div>
  );
}
