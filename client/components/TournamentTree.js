import React , {Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

import {Link} from 'react-router';
import '../style/style.css';

class TournamentTree extends Component{
    constructor(props){
        super(props);
        this.tournamentList = [];

    }
    
    getNewCompetitor(updatedRound,columnIndex,itemIndex){
        let newItemIndex = Math.floor(itemIndex/2);
        const newColumnIndex = columnIndex++;
        newItemIndex = newItemIndex%2?newItemIndex--:newItemIndex++;
        const newCompetitor = this.tournamentList[newColumnIndex][newItemIndex];
        return newCompetitor?newCompetitor.id:'';
    }


    makeCommonOnClickChanges(roundChangeBody,statusChangeBody,competeAgainstBody){
        return Promise
            .all([
                    this.props.changeCompetitorRound({
                        variables:roundChangeBody
                    }),
                    this.props.changeCompetitorStatus({
                        variables:statusChangeBody
                    }),
                    this.props.changeCompeteAgainst({
                        variables:competeAgainstBody
                    })
                ]);
    }

    revertBackAlreadyModifiedCompetitor(data,competeAgainstInfo){
        return this.makeCommonOnClickChanges(
            {
                id:competeAgainstInfo.id,
                round:data.round
            },
            {
                id:data.id,
                active:true
            },
            {
                id:competeAgainstInfo.id,
                competeAgainst:data.id
            }
        );
    }

    competitorClicked(data,columnIndex,itemIndex){
        console.log(this.props);
        let updatedRound = Number(data.round);
        updatedRound++;
        const competeAgainstInfo = this.tournamentList[data.round].find(competitor=>competitor.id==data.competeAgainst);
        const newCompetitor = this.getNewCompetitor(updatedRound,columnIndex,itemIndex);
        if(data.competeAgainst=="" || columnIndex != data.round){
            return;
        }
        this.makeCommonOnClickChanges(
            {
                id:data.id,
                round:updatedRound
            },
            {
                id:competeAgainstInfo.id,
                active:false
            },
            {
                id:data.id,
                competeAgainst:newCompetitor
            }
        )
        .then(()=>{
            if(newCompetitor!=''){
                this.props.changeCompeteAgainst({
                    variables:{
                        id:newCompetitor,
                        competeAgainst:data.id
                    }
                })
            }
        })
        .then((res)=>{
            if(data.active==false){
                this.revertBackAlreadyModifiedCompetitor(data,competeAgainstInfo)
                    .then(()=>{
                        this.rerenderUIComponents();
                    })
            }else{
                this.rerenderUIComponents();
            }
        });
         
    }

    rerenderUIComponents(){
        this.props.data.refetch()
            .then(()=>{
                this.renderTournamentList();
            });
    }

    getMaximumNumberofRounds(tournamentList){
        return Math.log2(tournamentList.length);
    }
    
    getPositionPerProgress(index,round){
        const devider = Math.pow(2,round);
        return Math.floor(index/devider);
    }
    checkDuplicateCompetitor(id,tournamentList){
        return (this.getCompeteAgainst(id,tournamentList))?true:false;
    }
    getCompeteAgainst(id,tournamentList){
        return tournamentList.find(candidate=>candidate.id==id);
    }
    rearrangeListasPerMatches(tournamentCandidates){
        let tournamentList = [];
        for(let i =0;i<tournamentCandidates.length;i++){
            const competitor = tournamentCandidates[i];
            tournamentList[competitor.primaryIndex] = competitor;
        }
        return tournamentList;
    }
    populateBracketList(tournamentList){
        tournamentList = this.rearrangeListasPerMatches(tournamentList);
        let maxRounds = this.getMaximumNumberofRounds(tournamentList);
        let createdBracketList = [];
        for(let i = 0;i<tournamentList.length;i++){
            let competitor = tournamentList[i];
            for(let j = 0; j<=competitor.round;j++){
                if(!createdBracketList[j])
                    createdBracketList[j] = [];
                const pos = this.getPositionPerProgress(i,j);
                createdBracketList[j][pos]=competitor;
            }
        }
        return createdBracketList;
    }
    getPosition(columnIndex,itemIndex){
        if(columnIndex==0)
            return {top: itemIndex*50+"px"};
        else if(columnIndex==1)
            return {top: (25 + (columnIndex+1)*itemIndex*50)+"px"};
        else if(columnIndex==2)
            return {top: (75 + (columnIndex+2)*itemIndex*50)+"px"};
        else
            return {top:180+"px"};
    }
    getTotalHeight(items){  
        return {height: items.length*50+"px"};
    }
    renderTournamentList(){
        const tournamentList = this.populateBracketList(this.props.data.competitors);
        console.log(tournamentList);
        this.tournamentList = tournamentList;
        
        return tournamentList.map((list,columnIndex)=>{
            const columns = list.map((competitor,itemIndex)=>{
                return (
                    <div className="column-item" key={competitor.id} style={this.getPosition(columnIndex,itemIndex)}
                        onClick={(e) => this.competitorClicked(competitor,columnIndex,itemIndex)}>{competitor.name}</div>
                )
            })
            return <div className="column" style={this.getTotalHeight(tournamentList[0])} key={columnIndex}>{columns}</div>
        })
    }
    render(){
        if(this.props.data.loading){
            return <div>Loading ... </div>;
        }
        return( 
            <div>
                <div className="collection">{this.renderTournamentList()}</div>
                {/* <Link to="song/new" className="btn-floating btn-large red right">
                    <i className="material-icons">add</i>
                </Link> */}
                <button onCick={(e)=>{this.resetTournament()}}>Reset Tournament</button>
            </div>
        )
    }
}

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

// const changeCompetitorDetails = gql`

//     input AvatarOptions {
//         name: String
//         competeAgainst: String,
//         round : Int,
//         active : Boolean
//     }
//     mutation changeCompetitorDetails ($id : ID, $competitor : AvatarOptions){
//         changeCompetitorDetails(id: $id, competitor: $competitor){
//             round
//         }
//     }
// `;

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
        changeCompetitorName(id: $id,competeAgainst: $name){
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

const TournamentQueryAndMutationCollection =  compose(
    graphql(queryToGetCompleteTournamentData),
    // graphql(changeCompetitorDetails, {
    //     name : 'changeCompetitorDetails'
    // }),
    graphql(changeCompetitorRound, {
        name : 'changeCompetitorRound'
    }),
    graphql(changeCompetitorStatus, {
        name: 'changeCompetitorStatus'
    }),
    graphql(changeCompetitorName, {
        name : 'changeCompetitorName'
    }),
    graphql(changeCompeteAgainst, {
        name: 'changeCompeteAgainst'
    }),
  )(TournamentTree);

export default TournamentQueryAndMutationCollection;