import React, { Component } from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  RouteProps
} from 'react-router-dom';
import firebase from 'firebase/app';

import Login from './Login';
import Register from './Register';
import Feed from './Feed';
import NotFound from './NotFound';
import Spinner from './Spinner';
import firebaseApp from './firebase';

type AppState = {
  authenticated: boolean;
  loading: boolean;
  user: firebase.User | undefined;
};

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      loading: true,
      authenticated: false,
      user: undefined
    };
  }

  componentDidMount() {
    firebaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authenticated: true,
          user: user,
          loading: false
        });
      } else {
        this.setState({
          authenticated: false,
          user: undefined,
          loading: false
        });
      }
    });
  }

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }

    return (
      <BrowserRouter>
        <Switch>
          <Redirect from="/" exact to="/feed" />
          <PrivateRoute
            path="/feed"
            component={Feed}
            authenticated={this.state.authenticated}
          />
          <Route path="/login" render={() => <Login authenticated={this.state.authenticated} />} />
          <Route path="/register" render={() => <Register authenticated={this.state.authenticated} />} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  authenticated: boolean;
}

const PrivateRoute = ({
  component: Component,
  authenticated,
  ...rest
}: PrivateRouteProps) => (
  <Route
    {...rest}
    render={props =>
      authenticated ? (
        <Component {...props} {...rest} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

export default App;
