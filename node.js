module.exports = function (RED) {
    "use strict";
    const operations = require('./operations');
    const chains = require('./chains');
    const appEnv = require('cfenv').getAppEnv();
    var handle_error = function (err, node) {
        node.log(err.body);
        node.status({
            fill: "red",
            shape: "dot",
            text: err.message
        });
        node.error(err.message);
    };

    RED.httpAdmin.get('/moralis/operations', function (req, res) {
        res.json(Object.keys(operations).sort());
    });
    RED.httpAdmin.get('/moralis/chains', function (req, res) {
        res.json(Object.keys(chains).sort());
    });

    function MoralisNode(config) {
        const Connector = require('./Connector.js');
        const node = this;
        RED.nodes.createNode(node, config);
        node.host = RED.nodes.getNode(config.config);
        this.configNode = config.config;
        this.operation = config.operation;
        this.chain = config.chain;
        const configService = appEnv.getService(config.service);
        node.moralis = new Connector({
            API_KEY: node.host.apiKey,
            API_URL: node.host.apiUrl
        });

        //
        let nodeOperation;
        if (node.operation) {
            nodeOperation = operations[node.operation];
        }
        let nodeChain;
        if (node.chain) {
            nodeChain = chains[node.chain];
        }

        node.on('input', function (msg) {
            node.status({
                fill: "blue",
                shape: "dot",
                text: `Running...`
            });

            msg['_original'] = msg.payload;
            msg.payload = {
                endpoint: nodeOperation[0],
                queryString: `?chain=${nodeChain}&format=decimal&cursor=${msg.cursor || ''}`,
                body: msg?.req?.body,
                method: nodeOperation[1],
                address: msg.address,
                contractAddress: msg.contractAddress
            }
            node.moralis.
                call(msg.payload)
                .then(data => {
                    node.status({
                        fill: "green",
                        shape: "dot",
                        text: `Success !`
                    });
                    msg.payload = data;
                    node.send(msg);
                }).catch(err => {
                    console.log('err', err.error)
                    node.error(err);
                    handle_error(err, node);
                    msg.statusCode = err.statusCode
                    msg.payload = err.error;
                    node.send(msg);
                });
        });
    }


    RED.nodes.registerType("moralis", MoralisNode);
};