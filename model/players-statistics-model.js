const mongoose = require('mongoose');

const statisticsSchema = new mongoose.Schema({
    player: {
        id: Number,
        name: String,
        firstname: String,
        lastname: String,
        age: Number,
        birth: {
            date: String,
            place: String,
            country: String
        },
        nationality: String,
        height: String,
        weight: String,
        injured: Boolean,
        photo: String
    },
    statistics: [
        {
            team: {
                id: Number,
                name: String,
                logo: String
            },
            league: {
                id: Number,
                name: String,
                country: String,
                logo: String,
                flag: String,
                season: Number
            },
            games: {
                appearences: Number,
                lineups: Number,
                minutes: Number,
                number: Number,
                position: String,
                rating: String,
                captain: Boolean
            },
            substitutes: {
                in: Number,
                out: Number,
                bench: Number
            },
            shots: {
                total: Number,
                on: Number
            },
            goals: {
                total: Number,
                conceded: Number,
                assists: Number,
                saves: Number
            },
            passes: {
                total: Number,
                key: Number,
                accuracy: Number
            },
            tackles: {
                total: Number,
                blocks: Number,
                interceptions: Number
            },
            duels: {
                total: Number,
                won: Number
            },
            dribbles: {
                attempts: Number,
                success: Number,
                past: Number
            },
            fouls: {
                drawn: Number,
                committed: Number
            },
            cards: {
                yellow: Number,
                yellowred: Number,
                red: Number
            },
            penalty: {
                won: Number,
                commited: Number,
                scored: Number,
                missed: Number,
                saved: Number
            }
        }
    ],
    // // Estatísticas calculadas para cada jogador
    total_defesas: {
        type: Number,
        default: 0
    },
    total_dribbles: {
        type: Number,
        default: 0
    },
    total_desarmes: {
        type: Number,
        default: 0
    },
    total_passes: {
        type: Number,
        default: 0
    },
    total_goals: {
        type: Number,
        default: 0
    },
    total_appearances: {
        type: Number,
        default: 0
    },
    goal_per_appearance: {
        type: Number,
        default: 0
    },
    desarmes_per_appearance: {
        type: Number,
        default: 0
    },
    defesas_per_appearance: {
        type: Number,
        default: 0
    },
    dribbles_per_appearance: {
        type: Number,
        default: 0
    },
    passes_per_appearance: {
        type: Number,
        default: 0
    },
    habilidade: {
        type: Number,
        default: 0
    }
}
);

// Function to calculate the "habilidade" value for each player
const calculateHabilidade = (totalGoals, totalAppearances) => {
    const habilidade = totalGoals / (totalAppearances || 1);
    return habilidade.toFixed(2);
};


const Statistics = mongoose.model('Statistics', statisticsSchema, 'players-statistics-team');

module.exports = {
    Statistics, 
    calculateHabilidade 
};



