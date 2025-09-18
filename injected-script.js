const shortData = {};
let responseData = {};



// wait for a /results page
window.addEventListener("yt-navigate-finish", checkURL);
function checkURL() {
  if (document.URL.startsWith("https://www.youtube.com/results")) {
    monkeyPatchFetch();
  }
}

function monkeyPatchFetch() {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    let response = await originalFetch(...args);
    console.log(response.clone().json().then((data)=>{console.log(data)}).catch(error=>console.log(error)));
    return response;

    //await response
    //  .clone()
    //  .json()
    //  .then(function(data){
    //    responseData = data;
    //    console.log(responseData);

        // if it's a short, add the length to shortData with a key like the author or title or something
        // ...
    //  })
    //  .catch(err => console.error(err));

    //return new Response(JSON.stringify(responseData));
  }
}
