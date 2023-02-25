module.exports = function (RED) {
    function MoralisConfigNode(n) {
        RED.nodes.createNode(this, n);

        //config
        this.name = n.name;
        this.apiKey = n.apiKey;
    }
    RED.nodes.registerType("moralis-config", MoralisConfigNode);
}