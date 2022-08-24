const express = require('express'); 
const app = express(); 
const axios = require('axios').default;
const request = require('request');
require('dotenv').config();
const { auth, requiresAuth } = require('express-openid-connect');
var router = require('express').Router();

// Authorization middleware. When used, the Access Token must 
// exist and be verified against the Auth0 JSON Web Key Set. 


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const DOMAIN = process.env.DOMAIN;

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Auth0 action clients',
        isAuthenticated: req.oidc.isAuthenticated()
    });
});

router.get('/list', requiresAuth(), function(req, res) {

    let actions = [];
    let clients = [];
    
    // 1. Authenticate at oauth endpoint
    var options = { 
        method: 'POST',
        url: `https://${DOMAIN}/oauth/token`,
        headers: { 'content-type': 'application/json' },
        body: `{"client_id":"${CLIENT_ID}","client_secret":"${CLIENT_SECRET}","audience":"https://${DOMAIN}/api/v2/","grant_type":"client_credentials"}`
    };

    request(options, async function (error, response, body) {
        if (error) throw new Error(error);

        // 2. Get bearer token from string of response body
        const parsedBody = JSON.parse(body)
        // console.log(parsedBody.access_token);


        /* FETCH CLIENT LOGIC*/
        // 3. Call /clients endpoint with fresjly parsed token
        const axiosConfig = {
            method: 'GET',
            url: `https://${DOMAIN}/api/v2/clients`,
            headers: { authorization: `Bearer ${parsedBody.access_token}`},
        };

   
        await axios(axiosConfig)
        .then(response => {
            // console.log(response.data);
            clients.push(response.data);
            // console.log(clients)
        })
        .catch(error => {
            console.log(error);
        });



        /* FETCH ACTION LOGIC*/
        // 4. Call /actions/actions
        const axiosConfig2 = {
            method: 'GET',
            url: `https://${DOMAIN}/api/v2/actions/actions`,
            headers: { authorization: `Bearer ${parsedBody.access_token}`},
        };

        await axios(axiosConfig2)
        .then(response => {
            // console.log(response.data);
            actions.push(response.data.actions);
            // console.log(actions[0].actions);
        })
        .catch(error => {
            console.log(error);
        });


        //Look for client_id substring in string of action's code block
        for (let i = 0; i < clients[0].length; i++) {
            for (let j = 0; j < actions[0].length; j++) {
              if (actions[0][j].code.includes(clients[0][i].name)) {
                // Pair any matches, and log a string of these matches, printing the name of the action, 
                // the client it references, 
                // and the supported triggers.
                console.log(`Action: "${actions[0][j].name}" is an action of Client: "${clients[0][i].name}". It's triggers are ${actions[0][j].supported_triggers[0].id}`); 
                // Logs: Action: {action name} is an action of Client: {client name}. It's triggers are {supported triggers}.
              }
            }
        };

    });

});

module.exports = router;
