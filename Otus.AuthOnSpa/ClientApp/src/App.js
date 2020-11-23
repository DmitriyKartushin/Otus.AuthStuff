import React, {useEffect, useState} from 'react';
import {Redirect, Route, Switch, useHistory, useLocation} from 'react-router';
import {Layout} from './components/Layout';
import {Home} from './components/Home';
import {FetchData} from './components/FetchData';
import {Counter} from './components/Counter';
import './custom.css'
import {authService} from "./AuthService";


export default () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    authService
      .initAuth()
      .then(
        () => setIsLoaded(true),
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    // retry
    return <div>Error: {error.message}</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  
  return (
    <Layout>
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route path="/login">
          <LoginPage/>
        </Route>
        <Route path='/counter' component={Counter}/>
        <PrivateRoute path='/fetch-data'>
          <FetchData/>
        </PrivateRoute>
      </Switch>
    </Layout>
  );
}

function PrivateRoute({children, ...rest}) {
  let render = ({location}) =>
    authService.isAuthenticated ? (
      children
    ) : (
      <Redirect
        to={{
          pathname: "/login",
          state: {from: location}
        }}
      />
    );
  
  return (
    <Route
      {...rest}
      render={render
      }
    />
  );
}

function LoginPage() {
  let history = useHistory();
  let location = useLocation();

  let [email, setEmail] = useState();
  let [password, setPassword] = useState();

  let {from} = location.state || {from: {pathname: "/"}};

  let login = () => {
    authService.authenticate(email, password)
      .then(() => history.replace(from));
  };

  return (
    <div>
      <p>You must log in to view the page at {from.pathname}</p>

      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      /><br/>

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      /><br/>

      <button onClick={login}>Log in</button>
    </div>
  );
}