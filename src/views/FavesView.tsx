import React, { useEffect, useRef, useState } from "react";
import SelectComponent from "../components/SelectComponent";
import ItemComponent, { Hit } from "../components/ItemComponent";
import styles from "./styles/FavesView.module.css";
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
export default function FavesView() {
  const [page, setPage] = useState(1);
  const [favorites, setFavorites]: [any, Function] = useState({});

  const favoritesArr = Object.entries(favorites).map((el) => el[1] as Hit);

  useEffect(() => {
    let faves,
      favesStr = localStorage.getItem("favorites");
    if (favesStr) {
      faves = JSON.parse(favesStr);
      setFavorites(faves);
    } else faves = favorites;
    let p,
      pStr = localStorage.getItem("faves_page");
    if (pStr) {
      p = JSON.parse(pStr);
      setPage(p);
    } else p = page;
  }, []);

  function saveFavorites(faves: any) {
    localStorage.setItem("favorites", JSON.stringify(faves));
    if (Object.entries(faves).length <= (page - 1) * 8)
      savePage(Math.max(page - 1, 1));
    setFavorites(faves);
  }

  function savePage(p: number) {
    localStorage.setItem("faves_page", JSON.stringify(p));
    setPage(p);
  }

  return (
    <div className={styles.globalContainer}>
      <div className={styles.selectorContainer}>
        <div style={{ width: 240, height: 32 }}></div>
      </div>
      <div className={styles.itemsContainer}>
        {favoritesArr.length ? (
          favoritesArr
            .slice((page - 1) * 8, Math.min(page * 8, favoritesArr.length))
            .map((e, index) => {
              return (
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
                    style={{ margin: "15px 20px" }}
                  />
                </div>
              );
            })
        ) : (
          <h2 className={styles.noItemsText}>- No favorites -</h2>
        )}
      </div>
      <div className={styles.footer}>
        <PaginationComponent
          page={page}
          totalPages={Math.ceil(favoritesArr.length / 8) || 1}
          onPageChanged={savePage}
          maxItemCount={9}
        />
      </div>
    </div>
  );
}
