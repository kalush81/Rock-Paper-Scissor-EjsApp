function play(cb) {
  cb();
  Array.from(playBtns).forEach((playbtn) => {
    playbtn.addEventListener("click", sendOption);
  });
}

function sendOption(e) {
  socket.emit("player-move", {
    playerName: nativePlayer,
    option: e.target.innerText,
  });
  
  playBtns.forEach((btn) => {
    if (btn.innerText !== e.target.innerText) {
      btn.style.display = "none";
    }
  });
}
