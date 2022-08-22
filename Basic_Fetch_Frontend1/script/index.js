//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
'use strict';  // Try without strict mode

//https://openjavascript.info/2022/01/03/using-fetch-to-make-get-post-put-and-delete-requests

const url = "https://localhost:7049/api/CardGame/";

async function myFetch(url, method = null, body = null) {
  try {

    let res = await fetch(url, {
      method: method ?? 'GET',
      headers: { 'content-type': 'application/json' },
      body: body ? JSON.stringify(body) : null
    });

    if (res.ok) {

      console.log("Request successful");

      if (method == 'PUT' || method == 'DELETE')
        //request is successful, but WebAPI is not send a response, so I return the body which represenst the effect on the database
        return body;

      //get the data from server
      let data = await res.json();
      return data;
    }
    else {

      //typcially you would log an error instead
      console.log(`Failed to recieved data from server: ${res.status}`);
      alert(`Failed to recieved data from server: ${res.status}`);
    }
  }
  catch (err) {

    //typcially you would log an error instead
    console.log(`Failed to recieved data from server: ${err.message}`);
    alert(`Failed to recieved data from server: ${err.message}`);
  }
}

//Lets use myFetch. As it is an async method and I cannot have await at top level, I need to make trick.
//See analogy on making in C# main async
//I make main as an asych arrow function with immediate execution of syntax, (async() => {})();

(async () => {

  //Here I write all the code to be executed at script top level, c# main level

  //Start a game
  const responseStart = await myFetch(`${url}StartGame?gameType=highcard`);
  if (responseStart) {
    console.log(responseStart);
  }

  //Deal a card
  const card = await myFetch(`${url}DealCard`);
  if (card) {
    console.log(card);
  }

  //Deal 5 cards DealCards?nrOfCards=5
  const cards = await myFetch(`${url}DealCards?nrOfCards=5`);
  if (cards) {
    console.log(cards);
  }

   //WinningCards
   const winners = await myFetch(`${url}WinningCards`, 'POST', cards);
   if (winners) {
     console.log(winners);
   }

  //End game
  const responseEnd = await myFetch(`${url}EndGame`);
  if (responseEnd) {
    console.log(responseEnd);
  }
  
})();

