import React , {Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import {Link} from 'react-router';
import { changeCompetitorName , queryToGetCompleteTournamentData } from '../schema/schema';

class TournamentCompetitors extends Component{

    updateCompetitorName(competitor,event){
        const name = event.target.value;
        this.props.changeCompetitorName({
            variables:{
                id:competitor.id,
                name
            },
            refetchQueries:[{query:queryToGetCompleteTournamentData}]
        }).then(
            ()=>{
                console.log("Successfully updated");
            },
            (err)=>{
                console.log(err);
            }
        )
    }
    renderListofCompetitors(){
        return this.props.data.competitors.map((competitor)=>{
            return (
                <input key={competitor.id} defaultValue={competitor.name}
                    onBlur={(e) => this.updateCompetitorName(competitor,e)}/>
            )
        })
    }
    render(){
        if(this.props.data.loading){
            return <div>Loading ... </div>
        }
        return (<div className="container">
            <div>{this.renderListofCompetitors()}</div>
            <div>On Blur COmpetitor's Name will be changed</div>
            <Link to="/" className="btn-floating btn-large red right">
                <i className="material-icons">arrow_back</i>
            </Link>
        </div>)
    }
}


const TournamentQueryAndMutationCollection =  compose(
    graphql(queryToGetCompleteTournamentData),
    graphql(changeCompetitorName, {
        name : 'changeCompetitorName'
    })
  )(TournamentCompetitors);

export default TournamentQueryAndMutationCollection;