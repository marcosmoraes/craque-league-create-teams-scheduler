const axios = require('axios');
const { findExistingStatistics } = require('../repositories/statistics-repository');

const API_KEY = process.env.API_KEY;

const getPlayersData = async (teamId, leagueId, season, page) => {
    try {
        const response = await axios.get(`https://v3.football.api-sports.io/players`, {
            params: { season, team: teamId, league: leagueId, page },
            headers: { 'x-rapidapi-key': API_KEY },
        });

        return response.data.response;
    } catch (error) {
        console.error('Erro ao obter dados dos jogadores:', error);
        return [];
    }
};

const filterExistingPlayers = async (playersData, teamId, leagueId, season) => {
    const newPlayers = [];

    for (const playerData of playersData) {
        const exists = await findExistingStatistics(playerData.player.id, teamId, leagueId, season);
        if (!exists) {
            const playerStats = {
                player: playerData.player,
                statistics: playerData.statistics
            };
            newPlayers.push(playerStats);
        } else {
            console.log(`Estatísticas para o jogador ${playerData.player.name} já existem.`);
        }
    }

    return newPlayers;
};

module.exports = {
    getPlayersData,
    filterExistingPlayers
};
