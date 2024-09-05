const mongoose = require('mongoose');

let isConnected = false;

const connectToDatabase = async (username, password, database) => {
    if (isConnected) {
        console.log('Usando conexão existente com o MongoDB.');
        return;
    }

    try {
        const mongoURL = `mongodb+srv://${username}:${encodeURIComponent(password)}@cluster0.slvyghg.mongodb.net/${database}?retryWrites=true&w=majority`;

        await mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            socketTimeoutMS: 30000,
            connectTimeoutMS: 30000,
        });

        isConnected = true;
        console.log('Conexão com o MongoDB estabelecida com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        throw error;
    }
};

const closeDatabaseConnection = async () => {
    if (!isConnected) {
        console.log('Nenhuma conexão ativa com o MongoDB.');
        return;
    }

    try {
        await mongoose.connection.close();
        isConnected = false;
        console.log('Conexão com o MongoDB fechada com sucesso!');
    } catch (error) {
        console.error('Erro ao fechar a conexão com o MongoDB:', error);
        throw error;
    }
};

module.exports = {
    connectToDatabase,
    closeDatabaseConnection
};
