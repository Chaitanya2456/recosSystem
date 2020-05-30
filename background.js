// ***This script runs in the background looking for event triggers***




let mediaSet = new Set();


// This function searches the recent history update for streaming service URLs
function updateHistory() {
  
    var ottPlatforms = ['netflix', 'hotstar', 'primevideo', 'sonyliv'];
	for(var i=0;i<4;i++){
	    chrome.history.search({
	    	'text': ottPlatforms[i],
	    	maxResults: 10
	    }, function(historyItems) {
	        for (var i = 0; i<historyItems.length&&i<10;++i) {
	        	console.log(historyItems[i].url);
	        }
	    });
    }
}


// This function receives data i.e titles and their platforms. It then makes API calls to get their IDs from TMDB and calls the fetchRecs functions

function sendData(mediaTitle, mediaPlatform) {
	if(mediaTitle.length) {
		console.log(mediaTitle);
			if(mediaPlatform=="Netflix") {         // Checking the platform
				if(mediaTitle.match(/S[0-9]+/)){   // to check if it's a TV series
					var pos = mediaTitle.search(/S[0-9]+/);  // getting the index of S[0-9] format from title
					mediaTitle = mediaTitle.substring(0, pos); // removes the S[0-9] format form title
					//titleSet.add(mediaTitle);
					if(mediaSet.has(mediaTitle)){              // checking redundant titles
						console.log("already sought recommendations for " + mediaTitle);
					}else{
						mediaSet.add(mediaTitle);
						var request = "https://api.themoviedb.org/3/search/tv?api_key=ddda0e20c54495aef2d2b5acce042abe&language=en-US&page=1&query="+mediaTitle+"&include_adult=true";
						console.log("title requested " + mediaTitle);
						fetch(request).then(r => r.text()).then(result => {  // making an API call to search TV series with title for ID.
						    	const json = result;
						    	const obj = JSON.parse(json);
								//console.log(json);
								if(typeof obj.results[0]==='undefined'){
									console.log("couldn't store titles - title format is unidentified");
								}else{
								storeTitles(mediaTitle, "TV", obj.results);
								console.log(obj.results[0].original_name+" id is "+obj.results[0].id);
								
						    	var id = obj.results[0].id;     // getting the ID from the JSON
						             fetchTvRecs(id, mediaTitle);     // calling the recs function by passing the ID.
								}
							});
					}
				} else {   // If the title is of a movie
					if(mediaSet.has(mediaTitle)){
						console.log("Already sought recommendations for " + mediaTitle);
					}else{
						//titleSet.add(mediaTitle);
						mediaSet.add(mediaTitle);
						var request = "https://api.themoviedb.org/3/search/movie?api_key=ddda0e20c54495aef2d2b5acce042abe&language=en-US&query="+mediaTitle+"&page=1&include_adult=true";
						console.log("title requested " + mediaTitle);
						fetch(request).then(r => r.text()).then(result => { // making an API call to search movies with title for ID
						    	const json = result;
						    	const obj = JSON.parse(json);
								//console.log(json);
								if(typeof obj.results[0]==='undefined'){
									console.log("couldn't store titles - title format is unidentified");
								}else{
								storeTitles(mediaTitle, "Movie", obj.results);
						    	console.log(obj.results[0].original_title+" id is "+obj.results[0].id);
								//var genreArr = obj.results[0].genre_ids;
								
						    	var id = obj.results[0].id;  // getting ID from the JSON
						    	fetchMovieRecs(id, mediaTitle);          // calling the recs for mivies by passing the IDs
								}
							});
					}
				}
			} else if (mediaPlatform=="PrimeVideo") {
              var pos = mediaTitle.search("(#type)");
              if(mediaTitle.substring(pos+6)=="null"){ // checking for movie
                   console.log("Its a movie");
                   mediaTitle = mediaTitle.substring(0, pos-1); // extracting title from the string
				   //titleSet.add(mediaTitle);
				   if(mediaSet.has(mediaTitle)){
						console.log("Already sought recommendations for " + mediaTitle);
					}else{
						mediaSet.add(mediaTitle);
						var request = "https://api.themoviedb.org/3/search/movie?api_key=ddda0e20c54495aef2d2b5acce042abe&language=en-US&query="+mediaTitle+"&page=1&include_adult=true";
						console.log("title requested " + mediaTitle);
						fetch(request).then(r => r.text()).then(result => {
						    	const json = result;
						    	const obj = JSON.parse(json);
								//console.log(json);
								if(typeof obj.results[0]==='undefined'){
									console.log("couldn't store titles - title format is unidentified");
								}else{
								storeTitles(mediaTitle, "Movie", obj.results);
								console.log(obj.results[0].original_title+" id is "+obj.results[0].id);
						    	var id = obj.results[0].id;
									 fetchMovieRecs(id, mediaTitle);
								}
    						});
					}
              }else {
                   console.log("Its a Tv show");
                   mediaTitle = mediaTitle.substring(0, pos-1);  // extracting the title
                   if(mediaSet.has(mediaTitle)){
						console.log("already sought recommendations for " + mediaTitle);
					}else{
						//titleSet.add(mediaTitle);
						mediaSet.add(mediaTitle);
						var request = "https://api.themoviedb.org/3/search/tv?api_key=ddda0e20c54495aef2d2b5acce042abe&language=en-US&page=1&query="+mediaTitle+"&include_adult=true";
						console.log("title requested " + mediaTitle);
						fetch(request).then(r => r.text()).then(result => {
						    	const json = result;
						    	const obj = JSON.parse(json);
								//console.log(json);
								if(typeof obj.results[0]==='undefined'){
									console.log("couldn't store title - title format unidentified");
								}else{
									storeTitles(mediaTitle, "TV", obj.results);
								console.log(obj.results[0].original_name+" id is "+obj.results[0].id);
							
						    	var id = obj.results[0].id;
									 fetchTvRecs(id, mediaTitle);
								}
    						});
					}
              }
			}
			
		
	}
}

function storeTitles(title, type, arr) {
	if(typeof arr === 'undefined'){
		console.log("undefined results");
	}else{
	chrome.storage.local.get("stored_titles", function(data){   // Gets the titles from local storage
		let recoMap = new Map();
			recoMap.set(title, {type: type, Data: arr[0]});
		for(var i=0;i<data.stored_titles.length;i++){
			recoMap.set(data.stored_titles[i].key_title, {type: data.stored_titles[i].title_val.type, Data : data.stored_titles[i].title_val.Data});
		}
		
		var merged = [];
		recoMap.forEach(function(val, key){
			merged.push({key_title: key, title_val: val});
		});

		chrome.storage.local.set({stored_titles: merged}, function() {  // storing the titles in local storage (not the recs, just watched for future reference. Recs are logged to console for now.)
			console.log("recently watched title stored");
		});
	});
  }
}

/*
function getRecommendations(titleList) {
	//console.log(titleList);
    var test_title = titleList[titleList.length-1];
    if(mediaSet.has(test_title)){
    	console.log("already sought recommendations");
    }else{
    	mediaSet.add(test_title);
    	var request = "https://api.themoviedb.org/3/search/multi?api_key=ddda0e20c54495aef2d2b5acce042abe&language=en-US&query="+test_title+"&page=1&include_adult=true";
    console.log("title requested " + test_title);
    fetch(request).then(r => r.text()).then(result => {
    	const json = result;
    	const obj = JSON.parse(json);
    	//console.log(json);
    	console.log(obj.results[0].original_name+" id is "+obj.results[0].id);
    	var mediaType = obj.results[0].media_type;
    	var id = obj.results[0].id;
    	if(mediaType=="tv"){
             fetchTvRecs(id);
    	}else if(mediaType=="movie"){
             fetchMovieRecs(id);
    	}else{
    		console.log("No results");
    	}
    });
    }
    
}
*/

//This function gets the ID and makes an API call to get TV recommendations for the ID

function fetchTvRecs(id, mediaTitle) {
	var url = "https://api.themoviedb.org/3/tv/"+id+"/recommendations?api_key=ddda0e20c54495aef2d2b5acce042abe&language=en-US&page=1"
	fetch(url).then(r => r.text()).then(result => { // making an API call for TV recs
		const json = result;
		const obj = JSON.parse(json);
		var recArr = obj.results;
		recArr.length = Math.min(recArr.length, 5); // limiting to 10 recs
		recArr.sort(function(a, b){
            return b.vote_average - a.vote_average; // sorting per rating
		});
		
		console.log("THE RECOMMENDATIONS ARE: " + " \n\ ");
		for(var i=0;i<recArr.length;i++){
			console.log(recArr[i].name + " " + recArr[i].vote_average + " \n\ ");
		}

		chrome.storage.local.get("stored_tv_recos", function(data){   // Gets the titles from local storage
	        let recoMap = new Map();
            for(var i=0;i<recArr.length;i++){
				if(mediaSet.has(recArr[i].name)) continue;
				mediaSet.add(recArr[i].name);
				recoMap.set(recArr[i].name, {recoFor: mediaTitle, recoData: recArr[i]});
            }
            console.log("Recos for "+ mediaTitle);
            for(var i=0;i<data.stored_tv_recos.length;i++){
            	recoMap.set(data.stored_tv_recos[i].key_title, {recoFor: data.stored_tv_recos[i].title_val.recoFor, recoData : data.stored_tv_recos[i].title_val.recoData});
            }
            
            var merged = [];
            recoMap.forEach(function(val, key){
                merged.push({key_title: key, title_val: val});
            });

	        //var recosSet = new Set(data.stored_recos);
	        //var currRecosSet = new Set(recArr);
	        //var merged = new Set([...recosSet, ...currRecosSet]);
	        merged.sort(function(a, b){
	        	return b.title_val.recoData.vote_average - a.title_val.recoData.vote_average;
	        });
	        chrome.storage.local.set({stored_tv_recos: merged}, function() {  // storing the titles in local storage (not the recs, just watched for future reference. Recs are logged to console for now.)
				console.log("title stored");
			});
        });
	});
}


//This function gets the ID and makes an API call to get TV recommendations for the ID

function fetchMovieRecs(id, mediaTitle) {
	var url = "https://api.themoviedb.org/3/movie/"+id+"/recommendations?api_key=ddda0e20c54495aef2d2b5acce042abe&language=en-US&page=1";
	fetch(url).then(r => r.text()).then(result => { // making an API call for movie recs
		const json = result;
		const obj = JSON.parse(json);
		var recArr = obj.results;
		recArr.length = Math.min(recArr.length, 5); // limiting to 10 recs
		recArr.sort(function(a, b){
            return b.vote_average - a.vote_average;  // sorting per rating
		});
		 
		console.log("THE RECOMMENDATIONS ARE: " + " \n\ ");
		for(var i=0;i<recArr.length;i++){
			console.log(recArr[i].title + " " + recArr[i].vote_average + " \n\ ");
		}


		chrome.storage.local.get("stored_movie_recos", function(data){   // Gets the titles from local storage
	        let recoMap = new Map();
            for(var i=0;i<recArr.length;i++){
				if(mediaSet.has(recArr[i].title)) continue;
				mediaSet.add(recArr[i].title);
				recoMap.set(recArr[i].title, {recoFor: mediaTitle, recoData: recArr[i]});
            }
            console.log("Recos for "+ mediaTitle);
            for(var i=0;i<data.stored_movie_recos.length;i++){
            	recoMap.set(data.stored_movie_recos[i].key_title, {recoFor: data.stored_movie_recos[i].title_val.recoFor, recoData : data.stored_movie_recos[i].title_val.recoData});
            }
            
            var merged = [];
            recoMap.forEach(function(val, key){
                merged.push({key_title: key, title_val: val});
            });

	        //var recosSet = new Set(data.stored_recos);
	        //var currRecosSet = new Set(recArr);
	        //var merged = new Set([...recosSet, ...currRecosSet]);
	        merged.sort(function(a, b){
	        	return b.title_val.recoData.vote_average - a.title_val.recoData.vote_average;
	        });
	        chrome.storage.local.set({stored_movie_recos: merged}, function() {  // storing the titles in local storage (not the recs, just watched for future reference. Recs are logged to console for now.)
				console.log("title stored");
			});
        });
	});


}


//Tried sorting by setting threshold, but did not work in most cases.
/*
function fetchMovieRecs(id, genreArr) {
	var url = "https://api.themoviedb.org/3/movie/"+id+"/recommendations?api_key=ddda0e20c54495aef2d2b5acce042abe&language=en-US&page=1";
	var threshold = genreArr.length - 2;
	fetch(url).then(r => r.text()).then(result => {
		const json = result;
		const obj = JSON.parse(json);
		var recArr = obj.results;
		var filteredArr = [];
		for(var i=0;i<recArr.length;i++){
			if(matchedGenres(recArr[i].genre_ids, genreArr)>=threshold){
				filteredArr.push(recArr[i]);
			}
		}
		filteredArr.sort(function(a, b){
            return b.vote_average - a.vote_average;
		});
		console.log("THE RECOMMENDATIONS ARE: " + " \n\ ");
		for(var i=0;i<filteredArr.length;i++){
			console.log(filteredArr[i].title + " " + filteredArr[i].vote_average + " \n\ ");
		}
	})
}
*/

function matchedGenres(recGenreArr, genreArr) {
     recGenreArr.sort();
     genreArr.sort();
     var count = 0;
     for(var i=0;i<Math.min(recGenreArr.length, genreArr.length);i++){
     	if(recGenreArr[i]==genreArr[i]) count++;
     }
     return count;
}


//This function scrapes the title from the HTML of the Netflix video player

function getNetflixMediaTitle() {
	console.log("waiting to load video ");
	setTimeout(() => {chrome.tabs.query({active: true}, function(tabs){
		var tab = tabs[0];
		chrome.tabs.executeScript(tab.id, {
			code: 'document.querySelector(".ellipsize-text").textContent'
		}, function(results){ sendData(results.toString(), "Netflix");});
	});}, 8000);
	
}

//This function scrapes the title from the primeVideo web page

function getPrimeMediaTitle() {
	console.log("waiting to load");
	setTimeout(() => {chrome.tabs.query({active: true}, function(tabs){
		var tab = tabs[0];
		chrome.tabs.executeScript(tab.id, {
			code: 'var title = document.querySelector("h1[data-automation-id]").textContent; var type = document.querySelector(".Mr2JWZ"); title+"(#type)"+type'
		}, function(results){ sendData(results.toString(), "PrimeVideo");});
	});}, 2000);
}


// Work still needs to be done on this function
function getHotstarTitle() {
	setTimeout(() => {chrome.tabs.query({active: true}, function(tabs){
		var tab = tabs[0];
		chrome.tabs.executeScript(tab.id, {
			code: 'document.getElementsByClass("meta-wrap").querySelector("h1").textContent'
		}, function(results){ sendData(results.toString(), "Hotstar");});
	});}, 2000);
}
function display(results) {
     console.log(results);
}


// This function checks for the history updates on streaming service URLs and calls respective functions for scraping the details
function updateWatchHistory() {
	chrome.history.search({
		'text': '',
		maxResults: 1
	}, function(historyItems) {
		var str = historyItems[0].url;
       if(str.includes("netflix.com/watch")){
       	 getNetflixMediaTitle();
       }else if(str.includes("hotstar")&&str.includes("watch")){
       	console.log(historyItems[0].title);
       	//getHotstarTitle();
       }else if(str.includes("primevideo")&&str.includes("detail")){
           //console.log(historyItems[0].title);
           getPrimeMediaTitle();
       }
        
	});
}

// This is an event trigger for updates in history that calls updateWatchHistory() function.
chrome.history.onVisited.addListener(function(result){
	console.log("HISTORY UPDATED");
	updateWatchHistory();
	chrome.storage.local.get("tvGenresList", function(data){
       if(typeof data.tvGenresList === 'undefined') {
		var url = "https://api.themoviedb.org/3/genre/tv/list?api_key=ddda0e20c54495aef2d2b5acce042abe&language=en-US";
		fetch(url).then(r => r.text()).then(result => {
			const obj = JSON.parse(result);
			chrome.storage.local.set({tvGenresList: obj.genres}, function(){
				console.log("Stored the genres of Tv series");
				console.log(obj.genres);
			});
		});
		
	   } else {
		   console.log("already stored TV genres");
	   }
	});

	chrome.storage.local.get("movieGenresList", function(data){
		if(typeof data.movieGenresList === 'undefined') {
		 var url = "https://api.themoviedb.org/3/genre/movie/list?api_key=ddda0e20c54495aef2d2b5acce042abe&language=en-US";
		 fetch(url).then(r => r.text()).then(result => {
			const obj = JSON.parse(result);
			chrome.storage.local.set({movieGenresList: obj.genres}, function(){
				console.log("Stored the genres of movies");
				console.log(obj.genres);
			});
		 });
		 
		} else {
			console.log("already stored movie genres");
		}
	 });
});

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({stored_titles: []}, function() {
    	if(chrome.runtime.lastError) {
				console.error("Error setting " + stored_titles + ": "
					+ chrome.runtime.lastError.message);
			}
    });

     chrome.storage.local.set({stored_tv_recos: []}, function() {
    	if(chrome.runtime.lastError) {
				console.error("Error setting " + stored_tv_recos + ": "
					+ chrome.runtime.lastError.message);
			}
	});

	chrome.storage.local.set({stored_movie_recos: []}, function() {
    	if(chrome.runtime.lastError) {
				console.error("Error setting " + stored_movie_recos + ": "
					+ chrome.runtime.lastError.message);
			}
	});
	
	 

  });

  let data = null;
  let type = null;

  chrome.runtime.onMessage.addListener(
	  function(request, sender, sendResponse) {
		  if(request.msg === "new tab for watched titles") {
			data = request.data;
			//console.log(request.data);
			type = "watched titles";
			chrome.tabs.create({url: chrome.extension.getURL('reco_index.html')}, function(tab) {});
		  }

		  if(request.msg === "new tab for tv recos") {
			data = request.data;
			//console.log(request.data);
			type = "tv recos";
			chrome.tabs.create({url: chrome.extension.getURL('reco_index.html')}, function(tab) {});
		  }

		  if(request.msg === "new tab for movie recos") {
			data = request.data;
			//console.log(request.data);
			type = "movie recos";
			chrome.tabs.create({url: chrome.extension.getURL('reco_index.html')}, function(tab) {});
		  }



		  if(request.msg === "ack by new tab") {
			  //console.log("sent to new tab: " + data);
			  sendResponse({type: type, data: data});
		  }
	  }
  );

