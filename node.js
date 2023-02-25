module.exports = function (RED) {
    const operations = require('./operations')
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

    function MoralisNode(config) {
        const node = this;
        RED.nodes.createNode(node, config);
        node.host = RED.nodes.getNode(config.config);
        const Connector = require('./Connector.js');
        node.zoom = new Connector({
            API_KEY: node.host.apiKey
        });

        //
        let nodeOperation;
        if (node.operation) {
            nodeOperation = operations[node.operation];
        }

        node.on('input', function (msg) {
            node.status({
                fill: "blue",
                shape: "dot",
                text: `Running...`
            });

            msg['_original'] = msg.payload;
            msg.payload = {
                endpoint: msg.req.originalUrl,
                queryString: msg.req.query,
                body: msg.req.body,
                method: msg.req.method,
                token: msg.req.headers.token,
            }
            node.zoom.
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