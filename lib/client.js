'use strict';
const Wreck = require('wreck');

const DEFAULT_BASE_URL = 'https://api.hackerone.com/v1/';

const Client = class {

    constructor(username, token, baseURL = DEFAULT_BASE_URL) {

        this.username = username;
        this.token = token;
        this.baseURL = baseURL;
    }


};



