chrome.runtime.sendMessage({ msg: "ack by new tab" }, function (response) {
  console.log(response);
  var a = document.getElementById("poster");
  var heading = document.getElementById("heading");
  if (response.type === "Movie" || response.type === "TV") {
    var img = document.createElement('img');
    img.src = "https://image.tmdb.org/t/p/w92" + response.data.poster_path;
    heading.innerText = "Recently watched";
    a.appendChild(img);
    a.href = "https://www.primevideo.com/search/ref=atv_nb_sr?phrase="+(response.type === "Movie" ? response.data.title : response.data.name)+"&ie=UTF8";
  }
  if (response.type === "reco TV") {
    var img = document.createElement('img');
    img.src = "https://image.tmdb.org/t/p/w92" + response.data.poster_path;
    heading.innerText = "Suggested Tv for you";
    a.appendChild(img);
    a.href = "https://www.primevideo.com/search/ref=atv_nb_sr?phrase="+response.data.name+"&ie=UTF8";
  }
  if (response.type === "reco Movie") {
    var img = document.createElement('img');
    img.src = "https://image.tmdb.org/t/p/w92" + response.data.poster_path;
    heading.innerText = "Suggested movies for you";
    a.href = "https://www.primevideo.com/search/ref=atv_nb_sr?phrase="+response.data.title+"&ie=UTF8";
    a.appendChild(img);
  }
});

console.log("working");
