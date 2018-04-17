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
        .then((competitor) => competitor);
    });
}



CompetitorSchema.statics.changeRound = function(id, round) {
  return this.findById(id)
    .then(competitor => {
      competitor.round = round;
      return competitor.save()
        .then((competitor) => competitor);
    });
}

CompetitorSchema.statics.changeStatus = function(id, active) {
  return this.findById(id)
    .then(competitor => {
      competitor.active = active;
      return competitor.save()
        .then((competitor) => competitor);
    });
}

CompetitorSchema.statics.changeName = function(id, name) {
  return this.findById(id)
    .then(competitor => {
      competitor.name = name;
      return competitor.save()
        .then((competitor) => competitor);
    });
}

CompetitorSchema.statics.changeCompeteAgainst = function(id, competeAgainst) {
  return this.findById(id)
    .then(competitor => {
      competitor.competeAgainst = competeAgainst;
      return competitor.save()
        .then((competitor) => competitor);
    });
}



mongoose.model('competitor', CompetitorSchema);