const playBtns = document.querySelectorAll(".play-box button");
const urlParams = new URLSearchParams(window.location.search);
let newGameAccepted = true;

const room = urlParams.get("room");
const nativePlayer = urlParams.get("username");

const socket = io({ query: { nativePlayer, room }, timeout: 1000 });

socket.on("connect", () => {
  socket.emit("joinRoom", room, nativePlayer, (newNumOfMembers) => {});

  //   socket.on('leave', num => {
  //       console.log('members numer: ', num)
  //       if (num == 1) {
  //         document.querySelector(
  //             ".match-between"
  //           ).innerHTML = ' ...wait for an oponent!';
  //       }
  //   });
  
// check this if needed !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // socket.on("new_player", (num) => {
  //   console.log("members number: ", num);
  // });

  // socket.on("playersNumber", (data) => {
  //   console.log("playersNumber event", data);
  //   if (data == 2) {
  //     playBtns.forEach((playbtn) => {
  //       playbtn.style.display = "inline";
  //     });
  //   }
  // });

  socket.on("rejected", (data) => {
    window.location.href = "http://localhost:3000/choose-another-room";
  });

  socket.on("wrong-name", (data) => {
    window.location.href = "http://localhost:3000/choose-another-name";
  });
});
// socket.on("update_users", (num, players) => {
//   // display something

//   if (num == 1) {
//       console.log('wait for an opponent')
//   } else if (num == 2) {
//       //redirect to html with playmode
//       console.log('you can play')
//   } else {
//       console.log('too much or to less players')
//   }
// });

//   socket.on("oponent-has-left", (numOfPlayers, room) => {
//     document.querySelector(".match-between").innerHTML =
//       "...wait for an oponent";
//     play("disactive"); //tutaj removeListeners na guzikach
//   });

// green so the game can happen 
socket.on("green", (message, players, winner) => {
  if (players.length == 2 && newGameAccepted) {
    const oponent = players.find((pl) => pl.name !== nativePlayer);
    const you = players.find((pl) => pl.name == nativePlayer);
    displayScores(you, oponent);
    play(displayPlayBtns); //tutaj sie pobieraja guziki i dodaja listenery na clicka i wysyla wybrane opcje do servera
  }
});

// red light so game can't start because there is just one player
socket.on("red", (message) => {
  waitForOponent(newGameAccepted, message);
});

// one round winner come so we display his name and afetr 2 seconds sets buttons for new round.
socket.on("new-round", (winner) => {
  oneRoundWinner(winner);
});

socket.on("sayIfWonAndOfferNewGame", (ultimateWinner) => {
  console.log(ultimateWinner, "ask for next game now!.. ");
  deletePlayBtns();
  matchWinner(ultimateWinner);
  playOrLeave();
  newGameAccepted = false;
});

function setNewGame() {
  newGameAccepted = true;
  socket.emit("restartGame");
  console.log("newGameaccepted:", newGameAccepted, "emit restart game sent");
}

socket.on("new-game", (players) => {
  console.log(" i can play again.. set me html for it with players: ", players);
  if (players.length == 2) {
    //let match begin
    const oponent = players.find((pl) => pl.name !== nativePlayer);
    const you = players.find((pl) => pl.name == nativePlayer);
    resetUIForNextMatch()
    displayScores(you , oponent)
    displayPlayBtns()
  } else {
    //wait for oponent
    resetUIForNextMatch();
    waitForOponent('...wait for oponent')
  }

});
//   //tutaj bedziemy wysylac wynik rundy , narazie console.log po kazdym ruchu gracza
//   socket.on("wynik-rundy", (data) => {
//     console.log('wynik rundy', data);
//   });
// });
// //jesli utracone polaczenie z serwerem
// socket.on("disconnect", () => {
//   console.log("connection down 1");
//   document.querySelector(".match-between").innerHTML = `...wait for an oponent`;
//   play("disactive");
// });

// socket.on('limit', () => {
//     window.location.href = 'http://localhost:3000/';
// })

// nee set of rules for game circle:

// UI functions;
//1. function greetings() {} // alwyas displays native player name and room name player is in

function waitForOponent(newGameAccepted) {
  if (newGameAccepted) {
    document.querySelector(".match-between").innerHTML = '...wait for oponent';
    document.querySelector(".whoWon").innerHTML = "";
  } else {
    console.warn("you must new game accept !");
  }
} // displays ...wait for oponent if there is only one player (waiting for a 2nd player)

function displayScores(you, oponent) {
  document.querySelector(
    ".match-between"
  ).innerHTML = `${you.name} : ${you.score} vs ${oponent.name} : ${oponent.score}`;
}

function displayPlayBtns() {
  console.log('dis Plat Btns fn worked');
  document.querySelector(".play-box").style.display = "block";
  document.querySelector('.play-box').querySelectorAll('button').forEach(btn => btn.style.display = 'inline');
  
}

function deletePlayBtns() {
  console.log('displa play buttons')
  document.querySelector(".play-box").style.display = "none";
}

function oneRoundWinner(winner) {
  const won = document.querySelector(".winner");
  won.innerHTML = winner.name
    ? `<h2>${winner.name} wybral ${winner.option} i wygral</h2>`
    : "remis";

  setTimeout(() => {
    won.innerHTML = "";
    displayPlayBtns();
    document.querySelector('.play-box').querySelectorAll('button').forEach(btn => btn.style.display = 'inline');
  }, 2000);
}

function matchWinner(ultimateWinner) {
  const whoWon = document.querySelector(".whoWon");
  whoWon.innerHTML = `<h3>${ultimateWinner.name} won</h3>                       `;
}

function playOrLeave() {
  const whoWon = document.querySelector(".whoWon");
  whoWon.innerHTML += `<button onclick='setNewGame()'>play again</button>
  <a href="/"><button>leave gane</button></a>`;
}

function resetUIForNextMatch() {
  document.querySelector(".whoWon").innerHTML = '';
}
