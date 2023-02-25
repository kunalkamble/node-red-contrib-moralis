const rp = require('request-promise');
const buildApiUrl = require('node-red-contrib-moralis/buildApiUrl')
class Moralis {
    constructor({
        tmpPath = './',
        debugLevel = 0,
        API_KEY = false,
    }) {
        const s = this;
        s.tmpPath = tmpPath;
        s.debugLevel = debugLevel;
        s.API_KEY = API_KEY;
        s.API_URL = API_URL;
    }

    async call({
        endpoint = false,
        queryString = false,
        body = false,
        method = false,
        headers = {
            'content-type': 'application/json',
            'accept': 'application/json',
        },
        address,
        contractAddress,
        tokenId
    }) {
        const s = this;
        let url = buildApiUrl(s.API_URL, address, contractAddress, tokenId);
        headers['X-API-Key'] = s.API_KEY
        //Make Moralis API call
        var options = {
            uri: url,
            method: method,
            headers: headers
        };

        if (method === 'POST' && !body) {
            throw new Error('Invalid msg.body');
        }
        if (body) {
            options.body = body;
            if (!method) {
                options.method = 'POST';
            }
        }
        if (queryString) {
            options.qs = queryString;
            if (!method) {
                method = 'GET';
            }
        }

        return rp(options);
    }

}

module.exports = Moralis;