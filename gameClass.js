const check = require("./utils/check");

class Game {
  constructor(name) {
    (this.name = name), (this.limit = false);
    this.calculated = false;
    this.players = [];
    this.playerData = [];
    this.winner = '';
  }
 
  isNameInRoom(name) {
      return this.players.find(player => name.toLowerCase() == player.name.toLowerCase());
  }

  addPlayer(player) {
    if (this.players.length < 2) {
        this.players.push(player);
        //console.log('room obj and players:', this.players)
    } else {
        //console.log('ktos probowal sie dolaczyc do pokoju');
        this.limit =  true
    }  
  }

  removePlayer(player) {
    const idx = this.players
      .map((player) => player.name)
      .indexOf(player);
    this.players.splice(idx, 1);
  }

  assignPlayerData({ playerName, option }) {
      console.log('player data name and option on assignPlayerData execution', playerName, option)
    if (this.playerData.length < 2) {
      this.playerData.push({ playerName, option });
    }
    if (this.playerData.length >= 2) {
      this.calculateMatchResult();
    }
  }

  calculateMatchResult() {
    const [p1, p2] = this.playerData;
    console.log('playerData on calulation time: ', this.playerData)
    const winner = check(p1, p2); //zwracamy imie zwyciezcy lub 'remis'
    console.log('winner', winner)

    if (winner !== "remis") {
      this.players.find((player) => player.name == winner.name).score++;
    } else {
      console.log("remis", winner);
    }

    this.playerData = [];
    this.calculated = true;
    this.winner = winner;
  }

  resetAllScores() {
    this.players.forEach(player => {
      player.score = 0;
    })
  }
}

module.exports = Game;
