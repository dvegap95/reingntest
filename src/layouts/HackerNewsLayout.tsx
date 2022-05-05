import React, { useState } from "react";
import TabComponent from "../components/TabComponent";
import AllView from "../views/AllView";
import FavesView from "../views/FavesView";
import headerImg from "../img/hacker-news.svg";
import styles from "./styles/HackerNewsLayout.module.css";

export default function HackerNewsLayout() {
  const [tab, setTab] = useState({ id: 0 });
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerImgContainer}>
          <img src={headerImg} className={styles.headerImg}></img>
        </div>
      </div>
      <div className={styles.tabContainer}>
          <TabComponent value={tab} onChange={setTab}/>
      </div>
      {tab.id ? <FavesView /> : <AllView />}
    </div>
  );
}
