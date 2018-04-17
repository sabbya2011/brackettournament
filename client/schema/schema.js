import gql from 'graphql-tag';
const queryToGetCompleteTournamentData = gql`
{
    competitors{
      id,
      name,
      competeAgainst,
      round,
      active,
      primaryIndex
    }
}`;

const resetTournament = gql`
    mutation resetCompetition ($competitors : [CompetitorInputType]){
        resetCompetition(competitors: $competitors)
    }
`;

const changeCompetitorRound = gql`
    mutation changeCompetitorRound ($id : ID, $round :Int){
        changeCompetitorRound(id: $id, round: $round){
            round
        }
    }
`;
const changeCompetitorStatus = gql`
    mutation changeCompetitorStatus ($id : ID,$active: Boolean){
        changeCompetitorStatus(id: $id,active: $active){
            active
        }
    }
`;
const changeCompetitorName = gql`
    mutation changeCompetitorName ($id : ID,$name: String){
        changeCompetitorName(id: $id, name: $name){
            name
        }
    }
`;
const changeCompeteAgainst = gql`
    mutation changeCompeteAgainst ($id : ID,$competeAgainst: String){
        changeCompeteAgainst(id: $id,competeAgainst: $competeAgainst){
            competeAgainst
        }
    }
`;
module.exports = {
    queryToGetCompleteTournamentData,
    resetTournament,
    changeCompetitorRound,
    changeCompetitorStatus,
    changeCompetitorName,
    changeCompeteAgainst
}