import React , {Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import {Link} from 'react-router';

class TournamentCompetitors extends Component{

    constructor(props){
        super(props);
        this.state = {
            title:''
        }
    }
    onSubmit(event){
        event.preventDefault();
        console.log(this.props);
        this.props.mutate({
            variables:{
                title:this.state.title
            },
            refetchQueries:[{
                query : gql`
                {
                    songs {
                        id,
                        title
                    }
                }
                `
            }]
        }).then(()=>{
            hashHistory.push('/');
        })
    }
    render(){
        return (<div>
            <Link to="/">Go Back</Link>
            <h3>Create New Song</h3>
            <form onSubmit={this.onSubmit.bind(this)}>
                <label>Song Title: </label>
                <input onChange={event=>this.setState( {"title" : event.target.value})}
                    value={this.state.title}/>
            </form>
        </div>);
    }
}

const changeCompetitorName = gql`
    mutation changeCompetitorName ($id : ID,$name: String){
        changeCompetitorName(id: $id,competeAgainst: $name){
            name
        }
    }
`;
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
const TournamentQueryAndMutationCollection =  compose(
    graphql(queryToGetCompleteTournamentData),
    graphql(changeCompetitorName, {
        name : 'changeCompetitorName'
    })
  )(TournamentCompetitors);

export default TournamentQueryAndMutationCollection;