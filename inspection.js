/*
Name: 		app.js
Purpose:	A-Level Computer Science coursework	inspection script
Author:		Sava Max Heron
Created:	26/09/2019
Copyright:	(c) SMH 2019
Licence:	CC BY-NC-ND 4.0
*/

const nfq = require(`nfqueue-ng`);
const IPv4 = require(`pcap/decode/ipv4`);

nfq.createQueueHandler(1, function (nfpacket) {
    console.log("-- packet received --");
    console.log(JSON.stringify(nfpacket.info, null, 2));

    // Decode the raw payload using pcap library
    var packet = new IPv4().decode(nfpacket.payload, 0);
    // Protocol numbers, for example: 1 - ICMP, 6 - TCP, 17 - UDP
    console.log(
        "src=" + packet.saddr + ", dst=" + packet.daddr
        + ", proto=" + packet.protocol
    );
    console.log(packet);

    // Set packet verdict. Second parameter set the packet mark.
    nfpacket.setVerdict(nfq.NF_ACCEPT);

    // Or modify packet and set updated payload
    // nfpacket.setVerdict(nfq.NF_ACCEPT, null, nfpacket.payload);
});
