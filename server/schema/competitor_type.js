const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLInputObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLBoolean } = graphql;
const Competitor = mongoose.model('competitor');

const CompetitorType = new GraphQLObjectType({
  name:  'CompetitorType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    competeAgainst:{ type: GraphQLString },
    round: { type:GraphQLInt },
    active : { type:GraphQLBoolean},
    primaryIndex: { type: GraphQLInt }
  })
});

const InputCompetitorType = new GraphQLInputObjectType({
  name:  'CompetitorInputType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    competeAgainst:{ type: GraphQLString },
    round: { type:GraphQLInt },
    active : { type:GraphQLBoolean},
    primaryIndex: { type: GraphQLInt }
  })
});

module.exports = {CompetitorType,InputCompetitorType};
