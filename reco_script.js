chrome.runtime.sendMessage({msg: "ack by new tab"}, function(response){
    console.log(response.data);
    var img = document.getElementById("poster");
    var heading = document.getElementById("heading");
    if(response.type === "watched titles"){
        img.src = 'https://image.tmdb.org/t/p/w92' + response.data.title_val.Data.poster_path;
        heading.innerText = "Recently watched";
    }
    if(response.type === "tv recos") {
        img.src = 'https://image.tmdb.org/t/p/w92' + response.data.title_val.recoData.poster_path;
        heading.innerText = "Suggested Tv for you";
    }
    if(response.type === "movie recos") {
        img.src = 'https://image.tmdb.org/t/p/w92' + response.data.title_val.recoData.poster_path;
        heading.innerText = "Suggested movies for you";
    }

})

console.log("working");