import React from "react";
import styles from "./styles/ItemComponent.module.css";
import clockImg from "../img/iconmonstr-time-2.svg";
import favImgOutlined from "../img/iconmonstr-favorite-2.svg";
import favImgFilled from "../img/iconmonstr-favorite-3.svg";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");
export interface Hit {
  author: string;
  created_at: string;
  objectID: string; //assumed to be unique
  story_title: string;
  story_url: string;

  //non used props
  // parent_id: number
  // points?: any
  // story_id: number
  // story_text?: string | null
  // comment_text: string
  // created_at_i: number
  // num_comments?: number | null
  // title: string | null
  // url: string | null
}

export default function StyledDropdown(props: {
  favorite?: boolean; //is it a favorite (controlled prop)
  onFavoriteChanged?: Function; //item favorite state change triggered internally
  onCLick?: React.MouseEventHandler<HTMLDivElement>; //item click handler
  style?: React.CSSProperties | undefined; //prop extension for inline styling
  hit: Hit; //item information
}) {
  return (
    <div
      className={styles.cardContainer}
      onClick={(e) => {
        props.onCLick
          ? props.onCLick(e)
          : window.open(props.hit.story_url, "_blank")?.focus();
      }}
      style={props.style}
      data-testid="item_component__container"
    >
      <div className={styles.cardContent}>
        <div className={styles.cardSubtitleContainer}>
          <img src={clockImg} className={styles.cardSubtitleImg}></img>
          <div className={styles.cardSubtitle}
          data-testid="item_component__subtitle"
          >
            {timeAgo.format(new Date(props.hit.created_at))} by{" "}
            {props.hit.author}
          </div>
        </div>
        <div className={styles.cardTitle}>
          {props.hit.story_title || "-no title-"}
        </div>
      </div>
      <div className={styles.cardFavSection}>
        <img
          //if favorite render filled heart img, outlined heart otherwise
          data-testid="item_component__faves"
          src={props.favorite ? favImgFilled : favImgOutlined}
          className={styles.cardFavImg}
          onClick={(event) => {
            props.onFavoriteChanged && props.onFavoriteChanged(!props.favorite);
            event?.stopPropagation(); //prevent clobal element click to be triggered when favorite state is changed
          }}
        ></img>
      </div>
    </div>
  );
}
