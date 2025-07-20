import { createServer } from "http";
import app from "./app";
import { Env } from "./config/env.config";

import logger from "./lib/logger";
import { connectToDatabase } from "./config/db.config";

const server = createServer(app);

const PORT = Env.PORT;
const HOST = Env.HOST;

connectToDatabase()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://${HOST}:${PORT}`);

      logger.info(`🚀 Server running on http://${HOST}:${PORT}`);
    });

    server.on("error", (error) => {
      logger.error("❌ Server error:", error);
      process.exit(1);
    });
  })
  .catch((error) => {
    logger.error("❌ Server error:", error);
  });
