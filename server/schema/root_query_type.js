const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull } = graphql;

const CompetitorType = require('./competitor_type');
const Competitor = mongoose.model('competitor');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    competitors: {
      type: new GraphQLList(CompetitorType),
      resolve() {
        return Competitor.find({});
      }
    },
    competitor: {
      type: CompetitorType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Competitor.findById(id);
      }
    }
  })
});

module.exports = RootQuery;
