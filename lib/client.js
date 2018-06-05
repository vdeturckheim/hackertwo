'use strict';
const Wreck = require('wreck');
const Joi = require('joi');

const Activity = require('./activity');

const DEFAULT_BASE_URL = 'https://api.hackerone.com/v1';
const NOOP = function () {};

const JOI_ID = Joi
    .alternatives()
    .try([
        Joi.string().regex(/^\d+$/),
        Joi.number().integer()
    ]);

const Client = class {

    constructor(username, token, baseURL = DEFAULT_BASE_URL, log = NOOP) {

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

        this.log('GET', url);
        const res = await Wreck.get(url, { headers: this._headers, json: true });
        return { payload: res.payload, headers: res.res.headers, statusCode: res.res.statusCode };
    }

    async POST(url, payload) {

        this.log('POST', url);
        const res = await Wreck.post(url, { headers: this._headers, json: true, payload });
        return { payload: res.payload, headers: res.res.headers, statusCode: res.res.statusCode };
    }

    async get_report(id) {

        const valid = Joi.validate(id, JOI_ID);
        if (valid.error) {
            throw valid.error;
        }

        const url = `${this.baseURL}/reports/${id}`;
        const data = await this.GET(url);

        return data.payload.data;
    }

    async find_reports(filter) {

        throw new Error('not implemented yet');
    }

    async write_comment(reportId, message, internal) {

        const valid = Joi.validate({ reportId, message, internal }, {
            reportId: JOI_ID,
            message: Joi.string(),
            isInternal: Joi.boolean()
        });
        if (valid.error) {
            throw valid.error;
        }
        const url = `${this.baseURL}/reports/${reportId}/activities`;
        return this.POST(url, {
            data: {
                type: Activity.TYPE.COMMENT,
                attributes: { message, internal }
            }
        });
    }
};
Client.DEFAULT_BASE_URL = DEFAULT_BASE_URL;


module.exports = Client;
