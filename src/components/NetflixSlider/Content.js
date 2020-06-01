import React from "react";
import IconCross from "./../Icons/IconCross";
import "./Content.scss";

const Content = ({ movie, onClose }) => (
  <div className="content">
    <div className="content__background">
      <div className="content__background__shadow" />>
      <iframe
        className="content__background__image"
        src="https://www.youtube.com/embed/k3CN-wR05pY?autoplay=1&amp;controls=0&amp;loop=1&amp;showinfo=0&amp;modestbranding=1&amp;disablekb=1&amp;enablejsapi=1&amp;"
        frameborder="0"
      ></iframe>
    </div>
    <div className="content__area">
      <div className="content__area__container">
        <div className="content__title">{movie.title}</div>
        <div className="content__description">{movie.data.overview}</div>
      </div>
      <button className="content__close" onClick={onClose}>
        <IconCross />
      </button>
    </div>
  </div>
);

export default Content;
