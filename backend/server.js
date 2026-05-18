const http = require('http');
const app = require('./app');
const { initSocket, attachRedisAdapter } = require('./sockets/socketManager');
const connectDB = require('./config/db');
const { redisClient, pubClient, subClient } = require('./config/redis');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initSocket(server);

const startServer = async () => {
  try {
    await connectDB();
    
    try {
      await Promise.all([
        redisClient.connect(),
        pubClient.connect(),
        subClient.connect()
      ]);
      attachRedisAdapter();
    } catch (redisError) {
      logger.warn('Could not connect to Redis at startup. Running without cache and pub/sub adapter.');
    }

    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
