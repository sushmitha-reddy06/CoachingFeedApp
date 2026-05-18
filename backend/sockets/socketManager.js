const socketIo = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { pubClient, subClient } = require('../config/redis');
const logger = require('../utils/logger');

let io;

const initSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    logger.info(`New socket client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      logger.info(`Socket client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    logger.warn("Socket.io not initialized!");
  }
  return io;
};

const attachRedisAdapter = () => {
  if (io && pubClient && subClient) {
    try {
      io.adapter(createAdapter(pubClient, subClient));
      logger.info('Socket.IO Redis adapter attached successfully');
    } catch (err) {
      logger.error('Failed to attach Socket.IO Redis adapter', err);
    }
  }
};

module.exports = {
  initSocket,
  getIo,
  attachRedisAdapter
};
