const { Statistics } = require('../model/players-statistics-model');

const findExistingStatisticsForTeam = async (teamId, leagueId, season) => {
    return Statistics.find({
        'statistics.team.id': teamId,
        'statistics.league.id': leagueId,
        'statistics.league.season': season
    });
};

module.exports = {
    findExistingStatisticsForTeam
};
