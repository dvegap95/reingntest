import React, { useEffect, useRef, useState } from "react";
import SelectComponent from "../components/SelectComponent";
import ItemComponent, { Hit } from "../components/ItemComponent";
import styles from "./styles/AllView.module.css";
import PaginationComponent from "../components/PaginationComponent";

//todo refactor infinite scroll and pagination into separated component
interface HitsPageInfo { //interface for pagination information received from API
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
const queryParams = ["angular", "reactjs", "vuejs"]; //first requesr query option possible values
const hitsPerPage = 8; //query parameter for API specifying amount of expected items

const InlineLoading = () => (//indicates whether the infinite scroll is loading more items 
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


let savePageTimeoutControl:NodeJS.Timeout; //timeout control for pagination latency implementation


export default function AllView() {
  const [selection, setSelection] = useState({ id: 0 }); //handler for an instance of SelectComponent
  const [page, setPage] = useState(1); //current page state  
  const [lastDownloadedPage, setLastDownloadedPage] = useState(1); //greatest page number which items are contained in data state
  const [firstDownloadedPage, setFirstDownloadedPage] = useState(1); //smallest page number which items are contained in data state
  
  //current loading status 
  //-1 means loading previous page
  //0 means not loading (dafault)
  //1 means loading next page
  //2 means global downloading
  const [loadingMore, setLoadingMore] = useState(0);

  //total number of pages given the amount of items per page, obtained from each api successfull response
  const [pageCount, setPageCount] = useState(1);
  
  const [data, setData] = useState(new Array<Hit>(0)); //current data state (information to display items)

  //favorites dictionary-like object map (in state) for tracking favorite changes
  const [favorites, setFavorites]: [any, Function] = useState({});
  
  // height in pixels ocupied by a single page inside the scroll view
  // determined each time a single page data is fetched from the API
  const [pageHeight, setPageHeight] = useState(0);

  const itemsViewRef = useRef<HTMLDivElement>(null); //reference to infinite scroll component

  useEffect(() => {
    let faves,
      favesStr = localStorage.getItem("favorites"); //get favorites from local site storage
    if (favesStr) {// was there favorites in local storage?
      faves = JSON.parse(favesStr);//parse favorites
      setFavorites(faves);//update favorites in state
    } else faves = favorites;//assign current favorites state to faves which should be undefined 

    //?code block analog to previous one, this time for selection
    let sel,
      selStr = localStorage.getItem("newsSelection");
    if (selStr) {
      sel = JSON.parse(selStr);
      setSelection(sel);
    } else sel = selection;

    //?code block analog to previous one, this time for page
    let p,
      pStr = localStorage.getItem("all_page");
    if (pStr) {
      p = JSON.parse(pStr);
      setPage(p);
    } else p = page;

    //fetches API data for the first time according to local 
    //scoped selection (sel) and page (p)
    getData(sel, p);
  }, []);

  //function getData: fetches data from API 
  //params:
  //@sel: selection to determine request query data
  //@p: page to fetch (included in request query data)
  //@concat: determines whether fetched data should combine with existent
  //          -1 means prepend; 0 means replace; 1 means append  
  function getData(sel = selection, p = page, concat = 0) {
    setLoadingMore(concat || 2);//set loading state acording to concat param
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
          setData(r.hits);//replace current data with response page data
        } else if (concat > 0) setData([...data, ...r.hits]);//prepend response page data to current data 
        else if (concat < 0) setData([...r.hits, ...data]);//append response page data to current data
        setPageCount(r.nbPages);//set total of pages
        if (concat >= 0) setLastDownloadedPage(p);//update lowest page number related to data state
        if (concat <= 0) setFirstDownloadedPage(p);//update highest page number related to data state
        
        //asynchronically scroll down to maintain scroll position when data is added at start 
        setTimeout(() => {
          if (concat < 0) {
            if (itemsViewRef.current) {
              itemsViewRef.current.scrollTop = pageHeight;
            }
          }
        });

        
        if (lastDownloadedPage === firstDownloadedPage) {//current data represents a single page?
          setPageHeight(itemsViewRef.current?.scrollHeight || 0);//update page height
        }
      })
      .catch(alert)//todo implement toast system
      .finally(() => setLoadingMore(0));//reset loading state to 0 (not loading)
  }

  //function getMoreData: prepares getData call to use data concatenation
  //params:
  //@position: indicates where is the fetched data to be added and the target page to fetch it from api
  function getMoreData(position: number = 1) {
    if(loadingMore)return;
    let targetPage =
      position < 0 ? firstDownloadedPage - 1 : lastDownloadedPage + 1;//dertemine target page to be fetched
    if (targetPage < 1 || targetPage > pageCount) return; //validates target page 
    getData(selection, targetPage, position);//executes getData call if targetPage was valid;
  }

  function saveFavorites(faves: any) {//if not loading store favorites (faves) in localStorage and in state
    if(loadingMore)return;
    localStorage.setItem("favorites", JSON.stringify(faves));
    setFavorites(faves);
  }


  function savePage(p: number) {//if not loading store page (p) in localStorage and in state
    if(loadingMore)return;
    localStorage.setItem("all_page", JSON.stringify(p));
    setPage(p);
    // getData(selection, p, 0);
  }

  function saveSelection(sel: { id: number }) {//if not loading store selection (sel) in localStorage and in state
    if(loadingMore)return;
    localStorage.setItem("newsSelection", JSON.stringify(sel));
    setSelection(sel);
    getData(sel, page);//aditionally call getData becouse of the new query parameter
  }

  const handleScroll = (e: any) => {//scroll event handler for infinite scroll component
    //if loading or not overflow state (no scroll) return;
    if (loadingMore || e.target.scrollHeight <= e.target.offsetHeight) return;
    //determines current page from the current scrollTop position, the total scroll height and the single page size 
    savePage(Math.floor(firstDownloadedPage + (e.target.scrollTop + e.target.clientHeight/2) / pageHeight));
    if (
      e.target.scrollHeight - e.target.scrollTop - 1 <=
      e.target.clientHeight
    ) {//is scroll fully at bottom?
      getMoreData(1); //append next page to current data
    } else if (e.target.scrollTop <= 0) {//is scroll fully at top?
      getMoreData(-1); //prepend previous page to current data
    }
  };

  //wheel event handler for infinite scroll component
  //while infinite scroll content height doesn't overflow, 
  //the wheel event trigger API requests
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if(loadingMore)return;//if it's loading already do nothing
    if (
      itemsViewRef.current &&
      itemsViewRef.current?.scrollHeight <= itemsViewRef.current?.offsetHeight
    ) {//does infinite scroll content height NOT overflow?
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
                  onFavoriteChanged={(val: boolean) => {//edit favorites dictionary
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
            //code block to add a delay to page change response, so the page can be 
            //changed severalTimes consecutively without trigger API calls
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
