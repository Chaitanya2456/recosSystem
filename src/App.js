import React, { Component } from "react";
import Slider from "./components/NetflixSlider";
import "./App.scss";
/* global chrome */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      tvs: [],
      watched: [],
    };
  }
  render() {
    return (
      <div className="app">
        <h2>Recently Watched</h2>
        {this.renderWatching()}
        <h2>TV suggested for you</h2>
        {this.rendertvs()}
        <h2>Movies suggested for you</h2>
        {this.rendermovies()}
      </div>
    );
  }
  componentDidMount() {
    this.getMoviesData();
    this.getTVData();
    this.getWatchedData();
  }
  renderWatching = () => {
    return this.state.watched.length !== 0 ? (
      <Slider>
        {this.state.watched.map((movie) => (
          <Slider.Item movie={movie} key={movie.id}>
            item1
          </Slider.Item>
        ))}
      </Slider>
    ) : null;
  };
  rendertvs = () => {
    return this.state.tvs.length !== 0 ? (
      <Slider>
        {this.state.tvs.map((movie) => (
          <Slider.Item movie={movie} key={movie.id}>
            item1
          </Slider.Item>
        ))}
      </Slider>
    ) : null;
  };
  rendermovies = () => {
    return this.state.movies.length !== 0 ? (
      <Slider>
        {this.state.movies.map((movie) => (
          <Slider.Item movie={movie} key={movie.id}>
            item1
          </Slider.Item>
        ))}
      </Slider>
    ) : null;
  };
  getMoviesData = () => {
    let movies = this.state.movies;
    chrome.storage.local.get(
      "stored_movie_recos",
      function (data) {
        // Gets the titles from local storage
        var recArr = data.stored_movie_recos;
        for (var i = 0; i < recArr.length; i++) {
          movies.push({
            image:
              "https://image.tmdb.org/t/p/w92" +
              recArr[i].title_val.recoData.poster_path,
            title: recArr[i].key_title,
            type: "reco Movie",
            id: recArr[i].title_val.recoData.id,
            data: recArr[i].title_val.recoData,
          });
        }
        this.setState({ movies });
      }.bind(this)
    );
  };
  getTVData = () => {
    let tvs = this.state.tvs;
    chrome.storage.local.get(
      "stored_tv_recos",
      function (data) {
        var recArr = data.stored_tv_recos;
        for (var i = 0; i < recArr.length; i++) {
          tvs.push({
            image:
              "https://image.tmdb.org/t/p/w92" +
              recArr[i].title_val.recoData.poster_path,
            title: recArr[i].key_title,
            type: "reco TV",
            id: recArr[i].title_val.recoData.id,
            data: recArr[i].title_val.recoData,
          });
        }
        this.setState({ tvs });
      }.bind(this)
    );
  };
  getWatchedData = () => {
    let watched = this.state.watched;
    chrome.storage.local.get(
      "stored_titles",
      function (data) {
        // Gets the titles from local storage
        var recArr = data.stored_titles;
        for (var i = 0; i < recArr.length; i++) {
          watched.push({
            image:
              "https://image.tmdb.org/t/p/w92" +
              recArr[i].title_val.Data.poster_path,
            title: recArr[i].key_title,
            type: recArr[i].title_val.type,
            id: recArr[i].title_val.Data.id,
            data: recArr[i].title_val.Data,
          });
        }
        this.setState({ watched: watched });
      }.bind(this)
    );
  };
}

export default App;
