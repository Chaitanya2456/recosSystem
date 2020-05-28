This is a browser extension that tracks User's watch history and recommends movie and TV Series.
This extension scrapes the titles from the Netflix video player and prime after verifying whether the User has watched a particular movie/Tv show.
Then it stores all the watch history in local storage and makes the calls for TMDB API for recommendations, then picks the top 5 titles.
It also avoids redundant recommendations and display these recos in three sections : recently watched, TV suggestions, Movie suggestions.
All the sections are horizontally scrollable.
WORK TO BE DONE : 
1) Add netflix style horizontal scroll to each section. Also add netflix style zoom in and zoom out animations.
2) When a User clicks a poster in any section, the extension should redirect user to a new webpage in the new tab.
3) This webpage would contain all the user data such as watch history, recos data and primarily fetch more data about each reco like plot, cast,
   reviews and add links to the platforms that stream this particluar reco.
4) Sync all the data with the google sign-in for each user on firebase.
5) Build an Android app that takes the user data from firebase and display data accordingly, give user notifications on what to watch next
   and many other features etc.
