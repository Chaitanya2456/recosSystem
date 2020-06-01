import React from "react";
import cx from "classnames";
import SliderContext from "./context";
import ShowDetailsButton from "./ShowDetailsButton";
import Mark from "./Mark";
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
          <img src={movie.detailsbtn ? movie.imageBg : movie.image} alt="" />
          {movie.detailsbtn && (
            <ShowDetailsButton onClick={() => onSelectSlide(movie)} />
          )}
          {isActive && <Mark />}
        </div>
      );
    }}
  </SliderContext.Consumer>
);

const handleClick = (movie) => {
  console.log(movie);

  if (!movie.detailsbtn) {
    chrome.runtime.sendMessage({
      msg: "go to new tab",
      type: movie.type,
      data: movie.data,
    });
  }
};

const getYoutubeLink = () => {
  var type = "tv";
  var id = 1972;
  var url =
    "https://api.themoviedb.org/3/" +
    type +
    "/" +
    id +
    "/videos?api_key=ddda0e20c54495aef2d2b5acce042abe&language=en-US";

  fetch(url)
    .then((r) => r.text())
    .then((result) => {
      const obj = JSON.parse(result);
      console.log("obj");
      var iframe = document.getElementById("vid");
      iframe.src = "https://www.youtube.com/embed/" + obj.results[1].key;
    });
};

export default Item;
