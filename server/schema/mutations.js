const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLBoolean, GraphQLInt, GraphQLList } = graphql;
const mongoose = require('mongoose');
const {CompetitorType, InputCompetitorType} = require('./competitor_type');
const Competitor = mongoose.model('competitor');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addCompetitor: {
      type: CompetitorType,
      args: {
        name: { type: GraphQLString },
        competeAgainst:{ type: GraphQLString },
        round: { type:GraphQLInt },
        active : { type:GraphQLBoolean},
        primaryIndex : { type:GraphQLInt }
      },
      resolve(parentValue, { name,competeAgainst,round,active }) {
        return (new Competitor({ name,competeAgainst,round,active })).save()
      }
    },
    
    // changeCompetitorDetails: {
    //   type: CompetitorType,
    //   args: {
    //     id: { type: GraphQLID },
    //     competitor: { type: GraphQLObjectType}
    //   },
    //   resolve(parentValue, { id, competitor }) {
    //     return Competitor.changeCompetitorDetails(id, competitor);
    //   }
    // },
    changeCompetitorRound: {
      type: CompetitorType,
      args: {
        id: { type: GraphQLID },
        round: { type:GraphQLInt }
      },
      resolve(parentValue, { id, round }) {
        return Competitor.changeRound(id, round);
      }
    },
    changeCompetitorStatus: {
      type: CompetitorType,
      args: {
        id: { type: GraphQLID },
        active: { type:GraphQLBoolean }
      },
      resolve(parentValue, { id, active }) {
        return Competitor.changeStatus(id, active);
      }
    },
    changeCompetitorName: {
      type: CompetitorType,
      args: {
        id: { type: GraphQLID },
        name: { type:GraphQLString }
      },
      resolve(parentValue, { id, name }) {
        return Competitor.changeName(id, name);
      }
    },
    changeCompeteAgainst: {
      type: CompetitorType,
      args: {
        id: { type: GraphQLID },
        competeAgainst: { type:GraphQLString }
      },
      resolve(parentValue, { id, competeAgainst }) {
        return Competitor.changeCompeteAgainst(id, competeAgainst);
      }
    },
    resetCompetition: {
      type: GraphQLBoolean,
      args: {
        competitors: { type: new GraphQLList(InputCompetitorType) }
      },
      resolve(parentValue, { competitors }) {
        return Competitor.resetCompetition(competitors);
      }
    },
  }
});

module.exports = mutation;
