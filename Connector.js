const rp = require('request-promise');
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
        s.API_URL = `https://deep-index.moralis.io/api/v2/`;
    }

    log(msg, level = 4) {
        const s = this;
        if (s.debugLevel) {
            if (level <= s.debugLevel) {
                console.log(msg);
            }
        }
    }
    async sleep(timer) {
        return new Promise(res => setTimeout(res, timer))
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
        contractAddress
    }) {
        const s = this;
        let url = `${s.API_URL}`;
        switch (endpoint) {
            case 'address/nft':
                url = `${s.API_URL}${address}/nft`
                break;

            default:
                break;
        }
        console.log("🚀 ~ file: Connector.js:40 ~ Moralis ~ endpoint:", endpoint, url)
        s.log(`+ call: ${url}`)
        headers['X-API-Key'] = s.API_KEY
        //Make Moralis API call
        var options = {
            uri: url,
            method: method,
            headers: headers
        };


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