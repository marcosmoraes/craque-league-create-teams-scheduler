const { validateEnvVars } = require('./config/config');
const { processPlayerStatistics } = require('./use-cases/process-player-statistics');
const { buildResponse } = require('./utils/response-utils');
const { connectToDatabase, closeDatabaseConnection } = require('./infrastructure/mongo-connection');

const handler = async (event, context) => {

    try {
        validateEnvVars();

        // Estabelece conexão com o banco
        await connectToDatabase(process.env.MONGODB_USERNAME, process.env.MONGODB_PASSWORD, process.env.DATABASE);

        if (event.httpMethod === 'OPTIONS') {
            return buildResponse(200, {});
        }

        const requestBody = JSON.parse(event.body);
        const result = await processPlayerStatistics(requestBody);

        return buildResponse(200, result);
    } catch (error) {
        console.error('Erro:', error);
        return buildResponse(500, 'Erro ao executar a função Lambda');
    } finally {
        // Fecha a conexão com o banco após a execução
        await closeDatabaseConnection();
    }
};

module.exports = {
    handler
};
