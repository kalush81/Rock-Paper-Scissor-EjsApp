
module.exports = (p1, p2) => {
    if (p1.option == p2.option) {
        return 'remis'
// zmienilem return p?.playerName na object {name: ..., option: ...};
    } else if (p1.option === "rock") {
      if (p2.option === "paper") {
        return {name: p2.playerName, option: p2.option}
      };
      if (p2.option === "scissors") {
        return {name: p1.playerName, option: p1.option}
      }

    } else if (p1.option === "paper") {
      if (p2.option === "rock") {
        return {name: p1.playerName, option: p1.option}
      }
      if (p2.option === "scissors") {
        return {name: p2.playerName, option: p2.option}
      }
      
    } else if (p1.option === "scissors") {
      if (p2.option === "rock") {
        return {name: p2.playerName, option: p2.option}
      }
      if (p2.option === "paper") {
        return {name: p1.playerName, option: p1.option}
      }
    }
  };