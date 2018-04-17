import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { Router , Route , hashHistory, IndexRoute} from 'react-router';

import App from './components/App';
import TournamentTree from './components/TournamentTree';
import TournamentCompetitors from './components/TournamentCompetitors';

const client = new ApolloClient({});
const Root = () => {
  return (
    <ApolloProvider client = {client}>
      <Router history ={hashHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={TournamentTree}/>
          <Route path="competitorList" component={TournamentCompetitors}/>
        </Route>
      </Router>
    </ApolloProvider>
  )
};

ReactDOM.render(
  <Root />,
  document.querySelector('#root')
);
