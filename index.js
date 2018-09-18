const path = require('path');
const axios = require('axios');
const express = require('express');
const mockData = require('./mockData');
const isDevMode = process.argv.includes('dev');

let _port = 80;

let content;
let orientation;
let user;

function update({URL}){
  if(isDevMode) return;
  process.send({type: 'update', path: URL});
}

function display({URL}){
  if(isDevMode) return;
  log({message: 'display sent back with path: ' + URL});
  process.send({type: 'display', path: URL});
}

function log({message}){
  if(isDevMode) return console.log(message);
  process.send({type: 'log', message});
}

function error({message}){
  if(isDevMode) return;
  process.send({type: 'error', message});
}

function ready(){
  if(isDevMode) return;
  process.send({type: 'isReady'});
}

/* Server Codes */

const app = express();
const staticPath = path.join(__dirname, 'public');
app.use(express.static(staticPath));
app.set('view engine', 'pug');

function createServer({content, orientation, port, user}){
  app.get('/', (req, res) => {
    res.render('index', { title: 'DashMon Application', message: 'Sample App', content })
  });
  app.get('/info', (req, res) => {
    res.send(content);
  });
  app.listen(port, () => {
    log({message: `Listening on port ${port}`});
    ready();
  });
}

function devMode(){
  createServer({content: mockData.content, orientation: mockData.orientation, port: _port, user: mockData.user});
}

if(isDevMode){
  devMode();
} else {
  process.on('message', async (data) => {
    switch (data.type){
      case 'init':
        log({message: 'App received init'});
        _port = data.port;
        let {content, orientation, port, user} = data;
        await init({content, orientation, port, user});
        createServer({content, orientation, port, user});
        break;
      case 'display':
        log({message: 'App received display'});
        display({URL: `http://localhost:${_port}`});
        break;
    }
  });
}

async function init({content, orientation, port, user}){
  // Initialization
}