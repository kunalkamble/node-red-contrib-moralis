const rp = require('request-promise');
const jwt = require('jsonwebtoken');
class Zoom {
    constructor({
        tmpPath = './',
        debugLevel = 0,
        API_KEY = false,
        TOKEN_EXPIRES_IN = "4h"
    }) {
        const s = this;
        s.tmpPath = tmpPath;
        s.debugLevel = debugLevel;
        s.API_KEY = API_KEY;
        s.API_URL = `https://api.zoom.us/v2`;
        s.TOKEN_EXPIRES_IN = TOKEN_EXPIRES_IN;
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

    async token() {
        const s = this;
        s.log(`+ token`);
        if (s.jwt) {
            return s.jwt;
        }
        s.jwt = jwt.sign({
            "iss": s.API_KEY
        },
            s.API_SECRET, {
            expiresIn: s.TOKEN_EXPIRES_IN
        });
        return s.jwt;
    }

    async call({
        endpoint = false,
        queryString = false,
        body = false,
        method = false,
        headers = {
            'User-Agent': 'Zoom-Jwt-Request',
            'content-type': 'application/json'
        },
        json = true,
        token = false
    }) {
        const s = this;
        var url = `${s.API_URL}${endpoint}`;
        s.log(`+ call: ${url}`)

        //Make Zoom API call
        var options = {
            uri: url,
            method: method,
            auth: {
                //Provide your token here
                'bearer': token || await s.token()
            },
            headers: headers
        };

        if (json) {
            options.json = true;
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

module.exports = Zoom;