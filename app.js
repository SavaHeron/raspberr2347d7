/*
Name: 		app.js
Purpose:	A-Level Computer Science coursework	app script
Author:		Sava Max Heron
Created:	07/09/2019
Copyright:	(c) SMH 2019
Licence:	CC BY-NC-ND 4.0
*/

const express = require(`express`);
const app = express()

app.set(`view engine`, `pug`);
app.set(`views`, `${__dirname}/app/views`)

app.get(`/app/styles/blocked.css`, function (_request, response) {
    response.sendFile(`./app/styles/blocked.css`, { root: __dirname });
});

app.get(`*`, function (_request, response) {    //keep at bottom
    response.render(`blocked`)
})

app.listen(80, function() {
    console.log(`listening on 80`)
})
