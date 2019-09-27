/*
Name: 		index.js
Purpose:	A-Level Computer Science coursework	new DNS script
Author:		Sava Max Heron
Created:	27/09/2019
Copyright:	(c) SMH 2019
Licence:	CC BY-NC-ND 4.0
*/

const dns = require(`native-dns`);
const async = require(`async`);
//const mariadb = require(`mariadb`);
const fs = require(`fs`);

const entries = require(`./entries.json`);
const blocklist = require(`./blocklist.json`);

const server = dns.createUDPServer();

class Server {
    constructor(ip, resolver) {
        this.ip = ip
        this.resolver = resolver;
    };

    proxyquery(question, response, callback) {
        console.log(`proxying request for ${JSON.stringify(question.name)} to "${this.resolver.address}"`);
        fs.appendFile(`./logs/proxied.log`, `proxying request for ${JSON.stringify(question.name)} to "${this.resolver.address}"\n`, function (error) {
            if (error) throw error;
        });
        let request = dns.Request({	//formulates request to upstream authoritative server
            question: question,
            server: this.resolver,
            cache: false
        });
        request.on(`message`, (_error, message) => {
            message.answer.forEach(element => {
                response.answer.push(element);
            });
        });
        request.on(`end`, callback);
        request.send();
    };

    handlequery(request, response) {
        console.log(`request from ${JSON.stringify(request.address.address)} for ${JSON.stringify(request.question[0].name)}`);
        fs.appendFile(`./logs/requests.log`, `request from ${JSON.stringify(request.address.address)} for ${JSON.stringify(request.question[0].name)}\n`, function (error) {
            if (error) throw error;
        });
        let i = []; //array of requests
        let block = blocklist.filter(element => {
            let blockeddomain = `.${element.domain}`;
            let temprequestquestion = `.${JSON.stringify(request.question[0])}`;
            return new RegExp(`.*${blockeddomain}`, `i`).exec(temprequestquestion);
        });
        if (block.length) {	//if regex finds match(es)
            request.question.forEach(_question => {
                console.log(`blocking request for "${request.question[0].name}"`);	//confirms blocking of URL to STDOUT
                fs.appendFile(`./logs/blocked.log`, `blocking request for "${request.question[0].name}"\n`, function (error) {	//saves to log
                    if (error) throw error;
                });
                response.answer.push(dns.CNAME({	//hijacks URL to point towards blockpage
                    name: request.question[0].name,
                    data: `vsdns.secure`,
                    ttl: 1800
                }));
            });
        } else {
            request.question.forEach(question => {	//compare question.name against entries
                let entry = entries.filter(element => {
                    return new RegExp(question.name, `i`).exec(element.domain);
                });
                if (entry.length) {	//if regex finds match(es)
                    console.log(`resolving request for "${request.question[0].name}"`);
                    fs.appendFile(`./logs/resolved.log`, `resolving request for "${request.question[0].name}"\n`, function (error) { //saves to log
                        if (error) throw error;
                    });
                    entry[0].records.forEach(record => {
                        record.name = question.name;
                        record.ttl = record.ttl;
                        if (record.type == `CNAME`) {	//checks for CNAME records in entries.json
                            record.data = record.address;
                            i.push(callback => {
                                let question = {
                                    name: record.data,
                                    type: dns.consts.NAME_TO_QTYPE.A,
                                    class: 1
                                };
                                return this.proxyquery(question, response, callback);
                            });
                        };
                        return response.answer.push(dns[record.type](record));
                    });
                } else {
                    i.push(callback => {
                        return this.proxyquery(question, response, callback);	//proxies requests to upstream authoritative server for each question
                    });
                };
            });
        };
        async.parallel(i, function () {
            return response.send();
        });
    };

    startserver() {
        server.serve(53, this.ip);

        server.on(`listening`, () => {
            let address = server.address()
            return console.log(`listening on ${JSON.stringify(address.port)}`);	//confirms to STDOUT the server is listening
        });

        server.on(`close`, () => {
            return console.log(`closed`);
        });

        server.on('error', (error, _buff, _request, _response) => {
            return console.error(error.stack);
        });

        server.on(`socketError`, (error, _socket) => {
            return console.error(error);
        });

        server.on(`request`, (request, response) => { //handles requests
            return this.handlequery(request, response);
        });
    };
};

module.exports = Server;
