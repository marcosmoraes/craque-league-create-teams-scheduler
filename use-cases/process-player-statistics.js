const { getPlayersData } = require('../services/player-statistics-service');
const { savePlayersToSqs } = require('../repositories/sqs-repository');
const { findExistingStatisticsForTeam } = require('../repositories/statistics-repository');

const processPlayerStatistics = async ({ teamIds, leagueId, season }) => {
    for (const teamId of teamIds) {
        let page = 1;
        let playersForTeam = [];
        let playersData;

        // Buscar todos os jogadores existentes no banco para esse time, liga e temporada
        const existingPlayers = await findExistingStatisticsForTeam(teamId, leagueId, season);
        const existingPlayerIds = existingPlayers.map(player => player.player.id);

        do {
            // Obtém os dados dos jogadores a partir da API
            playersData = await getPlayersData(teamId, leagueId, season, page);

            // Para cada jogador da API, verifica se ele já existe no banco de dados
            for (const playerData of playersData) {
                if (!existingPlayerIds.includes(playerData.player.id)) {
                    // Se o jogador não existir no banco, adiciona ao array de jogadores para enviar ao SQS
                    playersForTeam.push({
                        player: playerData.player,
                        statistics: playerData.statistics
                    });
                } else {
                    console.log(`Estatísticas para o jogador ${playerData.player.name} no time ${teamId} na temporada ${season} já existem.`);
                }
            }

            page++;
        } while (playersData.length > 0);

        // Se houver jogadores para enviar ao SQS, envia todos os jogadores desse time
        if (playersForTeam.length > 0) {
            await savePlayersToSqs(teamId, season, leagueId, playersForTeam);
        } else {
            console.log(`Todas as estatísticas para o time ${teamId} já existem.`);
        }
    }

    return 'Tarefa concluída com sucesso!';
};

module.exports = {
    processPlayerStatistics
};
