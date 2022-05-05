import React from "react";
import styles from "./styles/ItemComponent.module.css";
import clockImg from "../img/iconmonstr-time-2.svg";
import favImgOutlined from "../img/iconmonstr-favorite-2.svg";
import favImgFilled from "../img/iconmonstr-favorite-3.svg";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')
export interface Hit {
  author: string
  // comment_text: string
  created_at: string
  // created_at_i: number
  // num_comments?: number | null
  objectID: string
  // parent_id: number
  // points?: any
  // story_id: number //assumed to be unique
  // story_text?: string | null
  story_title: string
  story_url: string
  // title: string | null
  // url: string | null
  }

  
export default function StyledDropdown(props: {
  favorite?: boolean;
  onFavoriteChanged?: Function;
  onCLick?: React.MouseEventHandler<HTMLDivElement>;
  style?:React.CSSProperties | undefined;
  hit:Hit
}) {
  return (
    <div className={styles.cardContainer} onClick={props.onCLick} style={props.style}>
      <div className={styles.cardContent}>
        <div className={styles.cardSubtitleContainer}>
          <img src={clockImg} className={styles.cardSubtitleImg}></img>
          <div className={styles.cardSubtitle}>{timeAgo.format(new Date(props.hit.created_at))} by {props.hit.author}</div>
        </div>
        <div className={styles.cardTitle}>{props.hit.story_title || "-no title-"}</div>
      </div>
      <div className={styles.cardFavSection}>
        <img
          src={props.favorite ? favImgFilled : favImgOutlined}
          className={styles.cardFavImg}
          onClick={(event)=>{
            props.onFavoriteChanged && props.onFavoriteChanged(!props.favorite);
            event?.stopPropagation();
          }}
        ></img>
      </div>
    </div>
  );
}
