/*
Name: 		app.js
Purpose:	A-Level Computer Science coursework	admin script
Author:		Sava Max Heron
Created:	08/09/2019
Copyright:	(c) SMH 2019
Licence:	CC BY-NC-ND 4.0
*/

const express = require(`express`);
const app = express()

app.set(`view engine`, `pug`);
app.set(`views`, `${__dirname}/app/views`)

app.get(`*`, function (_request, response) {    //keep at bottom
    response.send(`not yet ready`)
})

app.listen(8080, function() {
    console.log(`listening on 8080`)
})
