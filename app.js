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

class App {
    constructor(port) {
        this.port = port;
    };

    startapp() {
        app.set(`view engine`, `pug`);
        app.set(`views`, `${__dirname}/app/views`);
        app.listen(this.port, function () {
	    let port = this.port
            console.log(`listening on ${this.port}`)
        });
        app.get(`/app/styles/blocked.css`, function (_request, response) {
            response.sendFile(`./app/styles/blocked.css`, { root: __dirname });
        });
        app.get(`*`, function (_request, response) {    //keep at bottom
            response.render(`blocked`)
        })
    };
};

module.exports = App;
