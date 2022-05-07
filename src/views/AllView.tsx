import React, { useEffect, useRef, useState } from "react";
import SelectComponent from "../components/SelectComponent";
import ItemComponent, { Hit } from "../components/ItemComponent";
import styles from "./styles/AllView.module.css";
import PaginationComponent from "../components/PaginationComponent";

//todo refactor infinite scroll and pagination into separated component
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

const InlineLoading = () => (
  <div
    style={{
      display: "flex",
      width: "100%",
      height: 20,
      flexDirection: "row",
      justifyContent: "center",
    }}
  >
    Loading...
  </div>
);


let savePageTimeoutControl:NodeJS.Timeout;


export default function AllView() {
  const [selection, setSelection] = useState({ id: 0 });
  const [page, setPage] = useState(1);
  const [lastDownloadedPage, setLastDownloadedPage] = useState(1);
  const [firstDownloadedPage, setFirstDownloadedPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [data, setData] = useState(new Array<Hit>(0));
  const [favorites, setFavorites]: [any, Function] = useState({});
  const [pageHeight, setPageHeight] = useState(0);

  const itemsViewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let faves,
      favesStr = localStorage.getItem("favorites");
    if (favesStr) {
      faves = JSON.parse(favesStr);
      setFavorites(faves);
    } else faves = favorites;
    let sel,
      selStr = localStorage.getItem("newsSelection");
    if (selStr) {
      sel = JSON.parse(selStr);
      setSelection(sel);
    } else sel = selection;
    let p,
      pStr = localStorage.getItem("all_page");
    if (pStr) {
      p = JSON.parse(pStr);
      setPage(p);
    } else p = page;
    getData(sel, p);
  }, []);

  function getData(sel = selection, p = page, concat = 0) {
    setLoadingMore(concat || 2);
    fetch(
      `https://hn.algolia.com/api/v1/search_by_date?query=${
        queryParams[sel.id]
      }&page=${p - 1}&hitsPerPage=${hitsPerPage}`
    )
      .then((res) => {

        return res.json();
      })
      .then((response: unknown) => {
        let r = response as HitsPageInfo;
        if (concat === 0) {
          // if (itemsViewRef.current) {
          //   itemsViewRef.current.scrollTop = -1;
          // }
          setData(r.hits);
        } else if (concat > 0) setData([...data, ...r.hits]);
        else if (concat < 0) setData([...r.hits, ...data]);
        setPageCount(r.nbPages);
        if (concat >= 0) setLastDownloadedPage(p);
        if (concat <= 0) setFirstDownloadedPage(p);
        setTimeout(() => {
          if (concat < 0) {
            if (itemsViewRef.current) {
              itemsViewRef.current.scrollTop = pageHeight;
            }
          }
        });
        if (lastDownloadedPage === firstDownloadedPage) {
          setPageHeight(itemsViewRef.current?.scrollHeight || 0);
        }
      })
      .catch(alert)
      .finally(() => setLoadingMore(0));
  }
  function getMoreData(position: number = 1) {
    if(loadingMore)return;
    let targetPage =
      position < 0 ? firstDownloadedPage - 1 : lastDownloadedPage + 1;
    if (targetPage < 1 || targetPage > pageCount) return;
    getData(selection, targetPage, position);
  }

  function saveFavorites(faves: any) {
    if(loadingMore)return;
    localStorage.setItem("favorites", JSON.stringify(faves));
    setFavorites(faves);
  }


  function savePage(p: number) {
    if(loadingMore)return;
    localStorage.setItem("all_page", JSON.stringify(p));
    setPage(p);
    // getData(selection, p, 0);
  }

  function saveSelection(sel: { id: number }) {
    if(loadingMore)return;
    localStorage.setItem("newsSelection", JSON.stringify(sel));
    setSelection(sel);
    getData(sel, page);
  }

  const handleScroll = (e: any) => {
    if (loadingMore || e.target.scrollHeight <= e.target.offsetHeight) return;
    savePage(Math.floor(firstDownloadedPage + (e.target.scrollTop + e.target.clientHeight/2) / pageHeight));
    if (
      e.target.scrollHeight - e.target.scrollTop - 1 <=
      e.target.clientHeight
    ) {
      getMoreData(1);
    } else if (e.target.scrollTop <= 0) {
      getMoreData(-1);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if(loadingMore)return;
    if (
      itemsViewRef.current &&
      itemsViewRef.current?.scrollHeight <= itemsViewRef.current?.offsetHeight
    ) {
      if (e.deltaY > 10) {
        getMoreData(1);
      } else if (e.deltaY < -10) {
        getMoreData(-1);
      }
    }
  };

  return (
    <div className={styles.globalContainer}>
      <div className={styles.selectorContainer}>
        <SelectComponent value={selection} onChange={saveSelection} />
      </div>
      <div
        className={styles.itemsContainer}
        onScroll={handleScroll}
        onWheel={handleWheel}
        ref={itemsViewRef}
      >
        {data.length && loadingMore !== 2 ? (
          <>
            {loadingMore === -1 && <InlineLoading />}
            {data.map((e, index) => (
              <div style={{ flex: "1 0 50%" }} key={index}>
                <ItemComponent
                  hit={e}
                  favorite={!!favorites[e.objectID]}
                  onFavoriteChanged={(val: boolean) => {
                    if (!val) {
                      let faves = { ...favorites };
                      if (faves[e.objectID]) delete faves[e.objectID];
                      saveFavorites(faves);
                    } else {
                      let faves = { ...favorites };
                      faves[e.objectID] = e;
                      saveFavorites(faves);
                    }
                  }}
                  style={{ margin: "1.5vh 20px" }}
                />
              </div>
            ))}
            {loadingMore === 1 && <InlineLoading />}
          </>
        ) : (
          <h2 className={styles.loadingText}>Loading...</h2>
        )}
      </div>
      <div className={styles.footer}>
        <PaginationComponent
          page={page}
          totalPages={pageCount}
          onPageChanged={(p: number) => {
            if (loadingMore) return; //todo implement disabled option and styling for pagination component
            savePage(p);
            if(savePageTimeoutControl){
              clearTimeout(savePageTimeoutControl);
            }
            savePageTimeoutControl = setTimeout(()=>{
              getData(selection, p);
            },1000);
          }}
          maxItemCount={9}
        />
      </div>
    </div>
  );
}
