require('dotenv').config();

function validateEnvVars() {
    const requiredEnvVars = ['MONGODB_USERNAME', 'MONGODB_PASSWORD', 'DATABASE', 'SQS_URL_PLAYERS_STATS', 'API_KEY'];
    requiredEnvVars.forEach((envVar) => {
        if (!process.env[envVar]) {
            throw new Error(`Missing required environment variable: ${envVar}`);
        }
    });
}

module.exports = { validateEnvVars };