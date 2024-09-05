const AWS = require('aws-sdk');
const sqs = new AWS.SQS({ region: 'us-east-1' });

const savePlayersToSqs = async (teamId, season, leagueId, playersForTeam) => {
    const params = {
        MessageBody: JSON.stringify({
            teamId,
            season,
            leagueId,
            players: playersForTeam
        }),
        QueueUrl: process.env.SQS_URL_PLAYERS_STATS,
        MessageAttributes: {
            "teamId": { DataType: "String", StringValue: teamId.toString() },
            "leagueId": { DataType: "String", StringValue: leagueId.toString() },
            "season": { DataType: "String", StringValue: season.toString() }
        }
    };

    await sqs.sendMessage(params).promise();
    console.log(`Estatísticas para o time ${teamId} enviadas para o SQS.`);
};

module.exports = {
    savePlayersToSqs
};
