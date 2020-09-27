import React, {useState, useEffect}  from 'react';
//import logo from './logo.svg';
import './App.css';
import {Container, ListGroup, Button} from 'react-bootstrap';
import axios from 'axios';

axios.defaults.baseURL = 'https://diamond-server.azurewebsites.net';

// on component loaded, load all clients
// select them, press button and generate url
//let clients = [{name:'anna'}]

//    {(() => {if(true) return 'msg'})()}

 //{

const urlRoutePrefix = "https://www.google.com/maps/dir/?api=1&origin=197%20Anthony%20Ln%2C%20Concord&destination=197%20Anthony%20Ln%2C%20Concord&travelmode=driving&waypoints="
function App() {
  let [clients, setClients] = useState([]);
  let [mapUrl, setMapUrl] = useState('http://google.com');


  const fetchUsers = () => {
    axios.get('/getClients')
    .then(function (response) {
      clients = response.data;
      setClients(response.data);
      generateMap();
    })
    .catch(function (error) {
      console.log('err', error);
    });
  }

  const onItemClick = (index) => {
    let clientToUpdate = [...clients];
    let client = {...clientToUpdate[index]};
    client.deselected = client.deselected ? false : true;
    clientToUpdate[index] = client;
    setClients(clientToUpdate);
    clients = clientToUpdate;
    generateMap();
  }

  const generateMap = () => {
    let newMapUrl = clients
    .filter(client => !client.deselected)
    .reduce((url, client, idx)=>{
      return url + (idx === 0 ? "" : "|") +encodeURIComponent(client.address);
    }, urlRoutePrefix);
    setMapUrl(newMapUrl);
  }

  useEffect(fetchUsers, []);

  return (
    <Container className="p-6 mt-3">
    <ListGroup as="ul">
      {clients.map((client, index) => {
          return (
          <ListGroup.Item key={index} active={!client.deselected} as="li" onClick={() => onItemClick(index)}>
            <p class="h6">{client.name}</p>
            <p>{client.address}</p>
          </ListGroup.Item>
          )
      })}
    </ListGroup>

    <div className="mt-3 float-right">
      <Button variant="success" href={mapUrl} target="_blank">Open Maps</Button>
    </div>

    </Container>
  );
}

export default App;
