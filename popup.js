//*** The script for pop-up page of the extension***

let tvGenreMap = new Map();
let movieGenreMap = new Map();

function onAnchorClick(event) {
	chrome.tabs.create({
		selected: true,
		url: event.srcElement.href
	});
	return false;
}

/*function buildPopupDom(divName, data) {
       var popupDiv = document.querySelector('#typedUrl_div');
		var ul = document.createElement('ul');
		popupDiv.appendChild(ul);
        console.log("Yes");
		for(var i=0, ie = data.length; i<ie;++i) {
			var a = document.createElement('a');
			a.href = data[i];
			a.appendChild(document.createTextNode(data[i]));
			a.addEventListener('click', onAnchorClick);

			var li = document.createElement('li');
			li.appendChild(a);

			ul.appendChild(li);
		}
}*/
function populateTitles(data){
	var cont = document.getElementById("watch_list");
	console.log("populating titles");
	for(var i=0;i<data.length;i++){
		var a = document.createElement('a');
		a.href = "#";
		a.className = "item";
		//console.log("from storage "+data[i].key_title);
		let info = data[i];
		a.addEventListener('click', function() {
			chrome.runtime.sendMessage({
				msg: "new tab for watched titles",
				data: info
			});
		});
		var img = document.createElement('img');
		img.dataset.src = 'https://image.tmdb.org/t/p/w92' + data[i].title_val.Data.poster_path;
		img.className = "lazy";
		a.appendChild(img);
		cont.appendChild(a);
	}

}

function populateTvRecs(data){
	var cont = document.getElementById("tv_rec_list");
	for(var i=0;i<data.length;i++){
		var a = document.createElement('a');
		a.href = "#";
		a.className = "item";
		let info = data[i];
		a.addEventListener('click', function() {
			chrome.runtime.sendMessage({
				msg: "new tab for tv recos",
				data: info
			});
		});
		var img = document.createElement('img');
		img.dataset.src = 'https://image.tmdb.org/t/p/w92' + data[i].title_val.recoData.poster_path;
		img.className = "lazy";
		a.appendChild(img);
		cont.appendChild(a);
	}

}

function populateMovieRecs(data){
	var cont = document.getElementById("movie_rec_list");
	for(var i=0;i<data.length;i++){
		var a = document.createElement('a');
		a.href = "#";
		a.className = "item";
		let info = data[i];
		a.addEventListener('click', function() {
			chrome.runtime.sendMessage({
				msg: "new tab for movie recos",
				data: info
			});
		});
		var img = document.createElement('img');
		img.dataset.src = 'https://image.tmdb.org/t/p/w92' + data[i].title_val.recoData.poster_path;
		img.className = "lazy";
		a.appendChild(img)
		cont.appendChild(a);
	}

}




function populateList(data) {
        var titleList = document.getElementById("title_list");
        console.log(data);
        for(var i=0; i<data.length&&i<10; i++){
			var a = document.createElement('a');
            if(data[i].title_val.type=="Movie"){
				a.appendChild(document.createTextNode(data[i].title_val.Data.original_title));
			}else if(data[i].title_val.type=="TV"){
                a.appendChild(document.createTextNode(data[i].title_val.Data.original_name));
			}
		    var li = document.createElement('li');
		    li.appendChild(a);
		    titleList.appendChild(li);
        }
		
//buildPopupDom(divName, urlArray.slice(0, urlArray.length));
}

/*let xhr = new XMLHttpRequest();
let url = new URL('https://www.netflix.com/watch/80018877?trackId=14170035&tctx=0%2C4%2Cc5021d72-2594-4d43-b5ec-786456b38469-29255984%2Cf2c6c898-a27d-466a-b56e-f6025edb3a17_8292028X19XX1588146919039%2Cf2c6c898-a27d-466a-b56e-f6025edb3a17_ROOT');
xhr.open('GET', url);
xhr.responseType = 'document';
xhr.send();

xhr.onload = function() {
	let respObj = xhr.response;
	console.log(respObj);
};
*/
/*
chrome.history.onVisited.addListener(function(result){
	console.log("history updated");
	buildTypedUrlList("typedUrl_div");
});
*/

document.addEventListener('DOMContentLoaded', function () {
	console.log("created DOM");
  //buildTypedUrlList("typedUrl_div");
  chrome.storage.local.get("stored_titles", function(data){   // Gets the titles from local storage
	populateTitles(data.stored_titles); // calls the function for diplaying wathced titles
	console.log("set list");
});

chrome.storage.local.get("stored_tv_recos", function(data){   // Gets the titles from local storage
	var recArr = data.stored_tv_recos;
	for(var i=0;i<recArr.length;i++){
		console.log(recArr[i].key_title + " " + recArr[i].title_val.recoData.vote_average + " \n\ ");
	}
	populateTvRecs(data.stored_tv_recos);

});

chrome.storage.local.get("stored_movie_recos", function(data){   // Gets the titles from local storage
	var recArr = data.stored_movie_recos;
	for(var i=0;i<recArr.length;i++){
		console.log(recArr[i].key_title + " with rating " + recArr[i].title_val.recoData.vote_average + " and genre is " +movieGenreMap.get(recArr[i].title_val.recoData.genre_ids[0])+ " \n\ ");
	}
	populateMovieRecs(data.stored_movie_recos);
	lazyLoad();
});
  
});

chrome.storage.local.get("tvGenresList", function(data){
	if(typeof data.tvGenresList === 'undefined') {
       console.log("No genre list stored");
	} else {
		var genreArr = data.tvGenresList;
		for(var i=0;i<genreArr.length;i++){
			tvGenreMap.set(genreArr[i].id, genreArr[i].name);
		}
	}
 });

 chrome.storage.local.get("movieGenresList", function(data){
	if(typeof data.movieGenresList === 'undefined') {
       console.log("No genre list stored");
	} else {
		var genreArr = data.movieGenresList;
		for(var i=0;i<genreArr.length;i++){
			movieGenreMap.set(genreArr[i].id, genreArr[i].name);
		}
	}
 });




chrome.storage.local.get("movieGenresList", function(data){
    console.log(data.movieGenresList);
});

function lazyLoad() {
	var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

	if("IntersectionObserver" in window) {
		console.log("observing");
		let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
			entries.forEach(function(entry){
			   if(entry.isIntersecting) {
				   console.log("starts observing");
				   let lazyImage = entry.target;
				   lazyImage.src = lazyImage.dataset.src;
				   //lazyImage.srcset = lazyImage.dataset.srcset;
				   lazyImage.classList.remove("lazy");
				   lazyImageObserver.unobserve(lazyImage);
			   }
			});
		});
		lazyImages.forEach(function(lazyImage) {
			lazyImageObserver.observe(lazyImage);
		});
	} else {
		console.log("couldn't apply lazy loading");
	}
}

