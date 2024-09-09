import { Redis } from "ioredis";

const redis = new Redis({
    port: process.env.REDIS_PORT || 6379,  // Use correct env variable
    host: process.env.REDIS_HOST || "localhost",  // Allow host to be set via env
    password: process.env.REDIS_PASSWORD || undefined,  // Add password support
    db: process.env.REDIS_DB || 0,  // Allow selecting a specific Redis DB
    retryStrategy(times) {  // Add retry strategy in case of connection failures
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    reconnectOnError(err) {  // Reconnect on specific errors
        const targetError = "READONLY";
        if (err.message.includes(targetError)) {
            // Only reconnect when the error is related to READONLY state
            return true;
        }
    },
    showFriendlyErrorStack: true,  // Enable friendly error stack for better debugging
});

// Log any errors
redis.on('error', (err) => {
    console.error('Redis error:', err);
});

export default redis;
