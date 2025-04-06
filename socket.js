let io;

module.exports = {
  init: (server) => {
    io = require('socket.io')(server, {
        pingInterval: 60000,
        pingTimeout: 60000
      });
    return io;
  },
  getIo: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};