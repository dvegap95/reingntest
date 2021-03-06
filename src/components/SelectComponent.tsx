import React, { useEffect, useState } from "react";
import imgAngular from "../img/image-138.png";
import imgAngular2x from "../img/image-138@2x.png";
import imgAngular3x from "../img/image-138@3x.png";
import imgReact from "../img/image-140.png";
import imgReact2x from "../img/image-140@2x.png";
import imgReact3x from "../img/image-140@3x.png";
import imgVue from "../img/image-141.png";
import imgVue2x from "../img/image-141@2x.png";
import imgVue3x from "../img/image-141@3x.png";
import styles from "./styles/SelectComponent.module.css";
import {MdExpandMore} from "react-icons/md"

export default function SelectComponent(props: {
  value:{id:number} //controlled component selection value (object-like format)
  onChange:Function, //handler for selection value changes
}) {
  const selectLabel = "Select your news";
  const [menu, setMenu] = useState(false);// show/hide menu

  useEffect(()=>{
    //window click event listener for close menu when clicking outside
    window.onclick = (event) => {
      setMenu(false);
    };
    return()=>{
      //release event on component unmount
      window.onclick = null;
    }
  },[]);

  const options = [ //menu option information array for extensibility (if needed)
    {
      text: "Angular",
      img: imgAngular,
      img2x: imgAngular2x,
      img3x: imgAngular3x,
      onClick: (element:any) => props.onChange(element),
    },
    {
      text: "React",
      img: imgReact,
      img2x: imgReact2x,
      img3x: imgReact3x,
      onClick: (element:any) => props.onChange(element),
    },
    {
      text: "Vuejs",
      img: imgVue,
      img2x: imgVue2x,
      img3x: imgVue3x,
      onClick: (element:any) => props.onChange(element),
    },
  ];
  return (
    <div
      className={styles.selectContainer}
      onClick={(event) => {
        event.stopPropagation();//prevent window to handle click event when it comes from current component
        setMenu(!menu);
      }}
      data-testid="select_component__container"
      >
      <span className={styles.selectLabel}>{selectLabel}</span>
      <MdExpandMore className={styles.selectIcon}/>
      <div
        className={styles.selectMenu}
        style={{ display: menu ? "initial" : "none" }}
      >
        {options.map((option,index) => (
          <div
            className={styles.selectOption}
            onClick={(event) => {
              option.onClick({id:index})
            }}
            style={props.value?.id === index ? {backgroundColor:"#eaeaea90"}:{}}//different background color if selected
            key={index}
          >
            <img
              src={option.img}
              className={styles.selectOptionImg}
              srcSet={option.img2x + " 2x, " + option.img3x + " 3x"}
            ></img>
            <span className={styles.selectOptionLabel}>{option.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
