import React from "react";
import cx from "classnames";
import SliderContext from "./context";

import "./Item.scss";
/* global chrome */
const Item = ({ movie }) => (
  <SliderContext.Consumer>
    {({ onSelectSlide, currentSlide, elementRef }) => {
      const isActive = currentSlide && currentSlide.id === movie.id;

      return (
        <div
          onClick={() => handleClick(movie)}
          ref={elementRef}
          className={cx("item", {
            "item--open": isActive,
          })}
        >
          <img src={movie.image} alt="" />
        </div>
      );
    }}
  </SliderContext.Consumer>
);

const handleClick = (movie) => {
  console.log(movie);
  chrome.runtime.sendMessage({
    msg: "go to new tab",
    type: movie.type,
    data: movie.data,
  });
};

export default Item;
