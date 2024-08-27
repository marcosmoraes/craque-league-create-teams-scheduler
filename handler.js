const axios = require('axios');
const mongoose = require('mongoose');
const { Statistics } = require('./model/players-statistics-model');
const { buildResponse } = require('./utils/response-utils');
const AWS = require('aws-sdk');
const sqs = new AWS.SQS({ region: 'us-east-1' });

exports.handler = async (event, context) => {
    if (process.env.NODE_ENV !== 'production') {
        require('dotenv').config();
    }

    const { MONGODB_USERNAME, MONGODB_PASSWORD, DATABASE, API_KEY } = process.env;

    try {
        if (event.httpMethod === 'OPTIONS') {
            return buildResponse(200, {});
        }

        const username = MONGODB_USERNAME;
        const password = MONGODB_PASSWORD;
        const mongoURL = `mongodb+srv://${username}:${encodeURIComponent(password)}@cluster0.slvyghg.mongodb.net/${DATABASE}?retryWrites=true&w=majority`;

        await mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Conexão estabelecida com sucesso!');

        const requestBody = JSON.parse(event.body);
        const { teamIds, leagueId, season } = requestBody; // Captura leagueId e season do corpo da requisição

        const getPlayersData = async (teamId, page) => {
            try {

                const response = await axios.get(`https://v3.football.api-sports.io/players?season=${season}&team=${teamId}&league=${leagueId}&page=${page}`, {
                    headers: {
                        'x-rapidapi-key': API_KEY,
                    },
                });

                return response.data.response;
            } catch (error) {
                console.error('Erro ao obter dados dos jogadores:', error);
                return [];
            }
        };

        for (const teamId of teamIds) {
            let page = 1;
            let playersData;
            let playersStatsTotals = {};
            let count = 1;

            do {
                playersData = await getPlayersData(teamId, page);

                for (const playerData of playersData) {
                    const playerStatsArray = playerData.statistics;
                    console.log(count++ + ' ' + playerData.player.name);

                    for (const playerStats of playerStatsArray) {
                        if (!playersStatsTotals[playerData.player.id]) {
                            playersStatsTotals[playerData.player.id] = {
                                player: playerData.player,
                                statistics: [],
                            };
                        }

                        playersStatsTotals[playerData.player.id].statistics.push({
                            team: playerStats.team,
                            league: playerStats.league,
                            games: playerStats.games,
                            substitutes: playerStats.substitutes,
                            shots: playerStats.shots,
                            goals: playerStats.goals,
                            passes: playerStats.passes,
                            tackles: playerStats.tackles,
                            duels: playerStats.duels,
                            dribbles: playerStats.dribbles,
                            fouls: playerStats.fouls,
                            cards: playerStats.cards,
                            penalty: playerStats.penalty
                        });

                        // Calcula e adiciona os totais para o jogador
                        playersStatsTotals[playerData.player.id].total_goals = (playersStatsTotals[playerData.player.id].total_goals || 0) + (playerStats.goals?.total || 0);
                        playersStatsTotals[playerData.player.id].total_dribbles = (playersStatsTotals[playerData.player.id].total_dribbles || 0) + (playerStats.dribbles?.success || 0);
                        playersStatsTotals[playerData.player.id].total_desarmes = (playersStatsTotals[playerData.player.id].total_desarmes || 0) + (playerStats.tackles?.total || 0);
                        playersStatsTotals[playerData.player.id].total_passes = (playersStatsTotals[playerData.player.id].total_passes || 0) + (playerStats.passes?.total || 0);
                        playersStatsTotals[playerData.player.id].total_appearances = (playersStatsTotals[playerData.player.id].total_appearances || 0) + (playerStats.games?.appearences || 0);
                        playersStatsTotals[playerData.player.id].total_defesas = (playersStatsTotals[playerData.player.id].total_defesas || 0) + (playerStats.goals?.saves || 0);
                    }
                }

                // Enviar estatísticas para o SQS
                const params = {
                    MessageBody: JSON.stringify(playersStatsTotals),
                    QueueUrl: process.env.SQS_URL_PLAYERS_STATS, // Certifique-se de definir essa variável de ambiente
                    MessageAttributes: {
                        "teamId": {
                            DataType: "String",
                            StringValue: teamId.toString()
                        },
                        "leagueId": {
                            DataType: "String",
                            StringValue: leagueId.toString()
                        },
                        "season": {
                            DataType: "String",
                            StringValue: season.toString()
                        }
                    }
                };

                await sqs.sendMessage(params).promise();
                console.log(`Estatísticas enviadas para o SQS para o time ${teamId}, página ${page}`);

                page++;
            } while (playersData.length > 0);

            // Verificar se as estatísticas para o time e temporada já existem na coleção
            for (const playerId in playersStatsTotals) {
                const playerStats = playersStatsTotals[playerId];
                const existingRecord = await Statistics.findOne({
                    'player.id': playerStats.player.id,
                    'statistics.team.id': teamId,
                    'statistics.league.id': leagueId,
                    'statistics.league.season': season
                });

                if (!existingRecord) {
                    const statistics = new Statistics(playerStats);
                    await statistics.save();
                } else {
                    console.log(`Estatísticas para o jogador ${playerStats.player.name} no time ${teamId} na temporada ${season} já existem. Não foram duplicadas.`);
                }
            }
        }

        await mongoose.connection.close();
        console.log('Tarefa concluída com sucesso!');
        return buildResponse(200, 'Tarefa concluída com sucesso!');

    } catch (error) {
        console.error('Erro:', error);
        return buildResponse(500, 'Erro ao executar a função Lambda');
    }
};
