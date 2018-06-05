'use strict';
const Wreck = require('wreck');
const Joi = require('joi');

const DEFAULT_BASE_URL = 'https://api.hackerone.com/v1';

const JOI_ID = Joi
    .alternatives()
    .try([
        Joi.string().regex(/^\d+$/),
        Joi.number().integer()
    ]);

const JOI_SCHEMAS = {
    getReports: Joi.alternatives().try([
        JOI_ID,
        Joi.object().keys({
            filter: {
                // TODO
            }
        })
    ])
};

const Client = class {

    constructor(username, token, baseURL = DEFAULT_BASE_URL, log = () => {
    }) {

        this.username = username;
        this.token = token;
        this.baseURL = baseURL;
        this.log = log;
    }

    get _headers() {

        const auth = Buffer.from(`${this.username}:${this.token}`).toString('base64');
        return {
            Authorization: `Basic ${auth}`
        };
    }

    async GET(url) {

        try {
            const res = await Wreck.get(url, {headers: this._headers, json: true});
            return {payload: res.payload, headers: res.res.headers, statusCode: res.res.statusCode};
        }
        catch (e) {
            throw e;
        }
    }

    async report(id) {

        const result = Joi.validate(id, JOI_ID);
        if (result.error) {
            return Promise.reject(result.error);
        }

        const url = `${this.baseURL}/reports/${id}`;
        this.log('GET', url);
        const data = await this.GET(url);

        return data.payload.data;
    }
};


module.exports = Client;
