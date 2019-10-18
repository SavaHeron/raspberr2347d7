/*
Name: 		dhcp.js
Purpose:	A-Level Computer Science coursework DHCP script
Author:		Sava Max Heron
Created:	27/09/2019
Copyright:	(c) SMH 2019
Licence:	CC BY-NC-ND 4.0
*/

const dhcpd = require(`dhcp`);

const server = dhcpd.createServer({
    range: [
        `10.0.0.1`, `10.255.255.254`
    ],
    netmask: `255.0.0.0`,
    router: `10.0.0.1`,
    dns: [`1.1.1.1`, `1.0.0.1`],
    broadcast: `255.255.255.255`,
    server: `127.0.0.1`
});

server.listen();

