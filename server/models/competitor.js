const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompetitorSchema = new Schema({
  name: { type: String },
  competeAgainst:{ type: String },
  round: { type: Number },
  active : { type: Boolean},
  primaryIndex : { type : Number }
});

CompetitorSchema.statics.changeCompetitorDetails = function(id, competitorObj) {
  return this.findById(id)
    .then(competitor => {
      if(competitorObj["name"])
        competitor.name = competitorObj.name;
      if(competitorObj["competeAgainst"])
        competitor.competeAgainst = competitorObj.competeAgainst;
      if(competitorObj["round"])
        competitor.round = competitorObj.round;
      if(competitorObj["active"])
        competitor.active = competitorObj.active;
      return competitor.save()
        .then((competitor) => competitor,
      );
    },
    (err)=>{
        console.log(err);
    });
}



CompetitorSchema.statics.changeRound = function(id, round) {
  return this.findById(id)
    .then(competitor => {
      competitor.round = round;
      return competitor.save()
        .then((competitor) => competitor);
    },
    (err)=>{
        console.log(err);
    });
}

CompetitorSchema.statics.changeStatus = function(id, active) {
  return this.findById(id)
    .then(competitor => {
      competitor.active = active;
      return competitor.save()
        .then((competitor) => competitor);
    },
    (err)=>{
        console.log(err);
    });
}

CompetitorSchema.statics.changeName = function(id, name) {
  return this.findById(id)
    .then(competitor => {
      competitor.name = name;
      return competitor.save()
        .then((competitor) => competitor);
    },
    (err)=>{
        console.log(err);
    });
}

CompetitorSchema.statics.changeCompeteAgainst = function(id, competeAgainst) {
  return this.findById(id)
    .then(competitor => {
      competitor.competeAgainst = competeAgainst;
      return competitor.save()
        .then((competitor) => competitor);
    },
    (err)=>{
        console.log(err);
    });
}

CompetitorSchema.statics.resetCompetition = function(competitors) {
  var bulk = this.collection.initializeUnorderedBulkOp();
  
  competitors.forEach(element => {
    bulk
      .find({'_id': mongoose.Types.ObjectId(element.id)}).updateOne( { $set: { round:element.round, active:true,competeAgainst:element.competeAgainst } } );
  });
  
  return bulk.execute();
}



mongoose.model('competitor', CompetitorSchema);
