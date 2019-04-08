import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [createUsername, setCU] = useState("");
  const [createPassword, setCP] = useState("");

  const [jokes, setJokes] = useState([]);

  return (
    <div className="App">

      <h3>login</h3>    
      <form
        onSubmit={e => {
          e.preventDefault();
          

          axios.post('http://localhost:3300/api/login', { username , password })
            .then(res => {
              localStorage.setItem('token', res.data.token);
              const config = {headers: {Authorization: res.data.token}}
              axios.get('http://localhost:3300/api/jokes', config)
                .then(res => setJokes(res.data))
                .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
        }}
      >
        <label>username</label>
        <input 
        value={username}
        onChange={e => {
          setUsername(e.target.value)
        }}
        type="text" />
        <label>password</label>
        <input 
        value={password}
        onChange={e => {
          setPassword(e.target.value)
        }}
        type="password" />
        <button>submit</button>
      </form>

      <h3>register</h3> 
      <form
        onSubmit={e => {
          e.preventDefault();

          axios.post('http://localhost:3300/api/register', { username: createUsername , password: createPassword })
            .then(res => console.log(res))
            .catch(err => console.log(err))
        }}
      >
        <label>username</label>
        <input 
        value={createUsername}
        onChange={e => {
          setCU(e.target.value)
        }}
        type="text" />
        <label>password</label>
        <input 
        value={createPassword}
        onChange={e => {
          setCP(e.target.value)
        }}
        type="password" />
        <button>submit</button>
      </form>
      
      { jokes.length ? jokes.map(joke => {
        console.log(joke);
        return <div style={{margin: "10px"}} key={joke.id}>{joke.joke}</div>
      }) : null }
    </div>
  );
}

export default App;
