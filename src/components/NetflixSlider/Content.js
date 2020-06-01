import React from "react";
import IconCross from "./../Icons/IconCross";
import "./Content.scss";
class Content extends React.Component {
  state = {
    imageID: "",
  };
  render() {
    const { movie, onClose } = this.props;
    return (
      <div className="content">
        <div className="content__background">
          <div className="content__background__shadow" />
          <iframe
            className="content__background__image"
            src={
              "https://www.youtube.com/embed/" +
              this.state.imageID +
              "?autoplay=1&amp;controls=0&amp;loop=1&amp;showinfo=0&amp;modestbranding=1&amp;disablekb=1&amp;enablejsapi=1&amp;"
            }
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
  }
  componentDidMount() {
    this.updateVideo();
  }
  componentDidUpdate() {
    this.updateVideo();
  }
  updateVideo = () => {
    console.log(this.props.movie);
    var type = this.props.movie.type.includes("TV") ? "tv" : "movie";
    var id = this.props.movie.id;
    console.log("Type: " + type + " ID " + id);
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
        console.log(obj);
        this.setState({ imageID: obj.results[0].key });
      });
  };
}
/*
const Content = ({ movie, onClose }) => (
  <div className="content">
    <div className="content__background">
      <div className="content__background__shadow" />
      <iframe
        className="content__background__image"
        src={
          "https://www.youtube.com/embed/" +
          "k3CN-wR05pY" +
          "?autoplay=1&amp;controls=0&amp;loop=1&amp;showinfo=0&amp;modestbranding=1&amp;disablekb=1&amp;enablejsapi=1&amp;"
        }
      ></iframe>
    </div>
    <div className="content__area">
      <div className="content__area__container">
        <div className="content__title">{movie.title}</div>
        <div className="content__description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          et euismod ligula. Morbi mattis pretium eros, ut mollis leo tempus
          eget. Sed in dui ac ipsum feugiat ultricies. Phasellus vestibulum enim
          quis quam congue, non fringilla orci placerat. Praesent sollicitudin
        </div>
      </div>
      <button className="content__close" onClick={onClose}>
        <IconCross />
      </button>
    </div>
  </div>
);
*/
const getYoutubeID = () => {
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
      console.log(obj);
      return obj.results[1].key;
    });
};
/*
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
    console.log(myRef);
    var iframe = myRef.current;
    iframe.src = "https://www.youtube.com/embed/" + obj.results[1].key;
  });
  */
export default Content;
