'use strict';
const CLient = require('./lib/client');

const client = new CLient(require('./secret').hackerone_user, require('./secret').hackerone_token);

const run = async function () {

    const id = 361880;
    const res = await client.get_report(id);
    console.log(res);

    const res2 = await client.write_comment(id);

};

run()
.catch(console.log)