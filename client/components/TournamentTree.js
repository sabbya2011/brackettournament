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
        
        const newColumnIndex = columnIndex+1;
        
        newItemIndex = newItemIndex%2?newItemIndex-1:newItemIndex+1;
        
        if(this.tournamentList[newColumnIndex]){
            const newCompetitor = this.tournamentList[newColumnIndex][newItemIndex];
        
            return newCompetitor?newCompetitor.id:'';
        }else{
            return '';
        }
        
    }


    makeCommonOnClickChanges(roundChangeBody,statusChangeBody,competeAgainstBody,updateOldCompetitor={newCompetitor:''}){
        let promiseArray = [
            this.props.changeCompetitorRound({
                variables:roundChangeBody
            }),
            this.props.changeCompetitorStatus({
                variables:statusChangeBody
            }),
            this.props.changeCompeteAgainst({
                variables:competeAgainstBody
            })
        ];
        if(updateOldCompetitor.newCompetitor!=''){
            promiseArray.push(
                this.props.changeCompeteAgainst({
                    variables:updateOldCompetitor.variables
                })
            );
        }
        return Promise
            .all(promiseArray);
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
        let updatedRound = Number(data.round);
        updatedRound++;
        const competeAgainstInfo = this.tournamentList[data.round].find(competitor=>{
            if(competitor)
            return competitor.id==data.competeAgainst
        });
        
        const newCompetitor = this.getNewCompetitor(updatedRound,columnIndex,itemIndex);
        
        if(data.competeAgainst=="" || ((Math.abs(competeAgainstInfo.round-data.round)==1)&&(competeAgainstInfo.competeAgainst!=""))
            || (Math.abs(competeAgainstInfo.round-data.round)>1) || (columnIndex<data.round)){
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
            },
            {
                newCompetitor,
                variables:{
                    id:newCompetitor,
                    competeAgainst:data.id
                }
            }
        )
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

    createDefaultObjectBody(competitor,competeAgainstId){
        return {
            id:competitor.id,
            name:competitor.name,
            competeAgainst:competeAgainstId,
            round : 0,
            active : true,
            primaryIndex:competitor.primaryIndex
        }
    }
    
    resetTournament(){
        const resetUsers = [];
        this.tournamentList[0].forEach((item)=>{
            if(item.round!=0){
                return;
            }
            if(this.checkDuplicateCompetitor(item.id,resetUsers)){
                return;
            }
            
            let resetCompetitor = this.createDefaultObjectBody(item,item.competeAgainst);
            
            const competeAgainstId = resetCompetitor.competeAgainst;
            let competeAgainstCompetitor = this.createDefaultObjectBody(this.props.data.competitors.find(item=>item.id==competeAgainstId),resetCompetitor.id);
            resetUsers.push(resetCompetitor);
            resetUsers.push(competeAgainstCompetitor);
        });
        const param = {
            "competitors": resetUsers
        };
        this.props.resetTournament({
            variables:param
        }).then(
            ()=>{
                this.rerenderUIComponents();
            }
        )
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
                <button onClick={(e)=>{this.resetTournament()}}>Reset Tournament</button>
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
    graphql(resetTournament, {
        name : 'resetTournament'
    }),
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