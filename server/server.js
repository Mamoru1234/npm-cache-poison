const express = require('express');
const proxy = require('express-http-proxy');
const app = express();

const PORT = 6790;

// lp@1.3.0 -> prom@4.2.6 -> lp@1.2.0 -> prom@4.2.5 -> lp@1.3.0

app.use(proxy('registry.npmjs.org', {
    userResDecorator: (proxyRes, proxyResData, userReq) => {
        console.info(`Method ${userReq.method} url: ${userReq.url}`);
        if (userReq.method !== 'GET') {
            return proxyResData;
        }
        const metadata = JSON.parse(proxyResData.toString());
        if (metadata.name === 'left-pad') {
            console.log('processing left-pad');
            metadata.versions['1.3.0'].dependencies = {
                'es6-promise': '4.2.6',
            };
            metadata.versions['1.2.0'].dependencies = {
                'es6-promise': '4.2.5',
            };
        }
        if (metadata.name === 'es6-promise') {
            console.log('processing promise');
            metadata.versions['4.2.6'].dependencies = {
                'left-pad': '1.2.0',
            };
            metadata.versions['4.2.5'].dependencies = {
                'left-pad': '1.3.0',
            };
        }
        return JSON.stringify(metadata);
    }
}));

app.listen(PORT, (err) => {
    if (err) {
        console.error('Error when starting');
        console.error(err);
    }
    console.info('Server listening: ', PORT);
});
