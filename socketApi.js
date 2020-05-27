let socket_io = require("socket.io");
let io = socket_io();
let socketApi = {};

const Game = require("./gameClass");
const mars = new Game("Mars");
const venus = new Game("Venus");
const rooms = [mars, venus];

io.on("connect", (socket) => {
  socket.emit('hello', rooms);
  socket.on("joinRoom", (roomToJoin, name, numOfMembers) => {
    rooms.forEach((room) => {
      if (room.name == roomToJoin) {
        io.in(roomToJoin).clients((err, clients) => {
          if (clients.length < 2 && !room.isNameInRoom(name)) {
            socket.join(roomToJoin);
            room.addPlayer({ name, score: 0 });
            io.in(roomToJoin).emit("playersNumber", clients.length + 1);
          } else {
            if (room.isNameInRoom(name)) {
                room.addPlayer({ name, score: 0 });
              socket.emit(
                "wrong-name",
                "redirected to this page ... http://..."
              );
              socket.emit(
                "red",
                "...wait for oponent, socketApi.js - 24 linia"
              );
            } else {
              socket.emit("rejected", "redirected to this page ... http://...");
              socket.emit(
                "red",
                "...wait for oponent , socketApi.js - 28 linia"
              );
            }
          }
          if (clients.length + 1 == 2) {
              io.emit('blocked', room.name);
              setTimeout(()=>{
                  io.in(roomToJoin).emit(
                    "green",
                    "you can now start playing",
                    room.players
                  );
              },2000)
          }
          if (clients.length + 1 == 1) {
            socket.emit("red", "....wait for oponent");
          }
        });
      }
    });
    socket.on("disconnect", () => {
        io.in(roomToJoin).clients((err, clients) => {
            if(clients.length == 1) {
                io.in(roomToJoin).emit('red', '...wait for oponent');
                io.emit('enabled', roomToJoin);
            }
            rooms.forEach(room => {
                if (room.name === roomToJoin) {
                    room.removePlayer(name);
                }
            })
    })
  });

    // const roomToLeave = Object.keys(socket.rooms)[1];
    // if (roomToLeave) {
    //   console.log("adapter...", roomToLeave);
    //   //numOfMembers(io.sockets.adapter.rooms[roomToJoin].length);
    //   const roomToLeave = Object.keys(socket.rooms)[1];
    //   io.in(roomToLeave).emit("red", "...wait for oponent, line 63");
    // } else {
    //   console.log("ku-ku nobody here");
    // }
    //numOfMembers(num)
    //   io.in(roomToJoin).clients((err, clients) => {
    //     rooms.forEach((room) => {
    //       if (room.name === roomToJoin) {
    //         room.removePlayer(name);
    //         //room.limit = false;
    //       }
    //     });
    //     io.in(roomToJoin).emit(
    //       "oponent-has-left",
    //       clients.length,
    //       rooms.find((room) => room.name == roomToJoin)
    //     );
    //   });
  });

    socket.on("player-move", ({ playerName, option }) => {
      const roomTitle = Object.keys(socket.rooms)[1];
      const playRoom = rooms.find((room) => room.name === roomTitle);
      playRoom.assignPlayerData({ playerName, option });
      if (playRoom.calculated) {
        io.in(roomTitle).emit("green", '', playRoom.players );
        playRoom.calculated = false;
        const ultimateWinner = playRoom.players.find(player => player.score == 3)
        if (ultimateWinner) {
          playRoom.resetAllScores();
          io.in(roomTitle).emit('sayIfWonAndOfferNewGame', ultimateWinner);
        } else {
          io.in(roomTitle).emit("new-round", playRoom.winner); 
        }
      }
    });

    socket.on('restartGame', () => {
      const roomTitle = Object.keys(socket.rooms)[1];
      const playRoom = rooms.find((room) => room.name === roomTitle);
      socket.emit("new-game", playRoom.players);
    })

});

//Your socket logic here
socketApi.io = io;

module.exports.socketApi = socketApi;
module.exports.rooms = rooms;
