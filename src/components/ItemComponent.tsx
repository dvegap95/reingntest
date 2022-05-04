import React from "react";
import styles from "./styles/ItemComponent.module.css";
import clockImg from "../img/iconmonstr-time-2.svg";
import favImgOutlined from "../img/iconmonstr-favorite-2.svg";
import favImgFilled from "../img/iconmonstr-favorite-3.svg";
export default function StyledDropdown(props: {
  favorite?: boolean;
  onFavoriteChanged?: Function;
  onCLick?: React.MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <div className={styles.cardContainer} onClick={props.onCLick}>
      <div className={styles.cardContent}>
        <div className={styles.cardSubtitleContainer}>
          <img src={clockImg} className={styles.cardSubtitleImg}></img>
          <div className={styles.cardSubtitle}>2 hours ago by author</div>
        </div>
        <div className={styles.cardTitle}>From chaos to free will</div>
      </div>
      <div className={styles.cardFavSection}>
        <img
          src={props.favorite ? favImgFilled : favImgOutlined}
          className={styles.cardFavImg}
          onClick={(event)=>{
            props.onFavoriteChanged && props.onFavoriteChanged();
            event?.stopPropagation();
          }}
        ></img>
      </div>
    </div>
  );
}
