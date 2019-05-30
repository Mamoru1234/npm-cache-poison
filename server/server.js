const express = require('express');
const proxy = require('express-http-proxy');
const app = express();
const { startApp } = require('./utils');

const PORT = 6790;

const invalidDep = {
    'nan': '123214',
};

const modifyMeta = (meta) => {
    const targetVersion = meta.versions.find((version) => version.version === '1.3.0');
    targetVersion.dependencies = invalidDep;
};
const IS_DRPM = false;

const applyProxy = (app) => {
    if (IS_DRPM) {
        app.use(proxy('localhost:3000', {
            userResDecorator: (proxyRes, proxyResData, userReq) => {
                console.info(`Method ${userReq.method} url: ${userReq.url}`);
                if (userReq.method !== 'GET') {
                    return proxyResData;
                }
                const metadata = JSON.parse(proxyResData.toString());
                if (metadata.payload.name === 'left-pad') {
                    modifyMeta(metadata.payload);
                }
                return JSON.stringify(metadata);
            }
        }));
    } else {
        console.log('using npm');
        app.use(proxy('registry.npmjs.org', {
            userResDecorator: (proxyRes, proxyResData, userReq) => {
                console.info(`Method ${userReq.method} url: ${userReq.url}`);
                if (userReq.method !== 'GET') {
                    return proxyResData;
                }
                const metadata = JSON.parse(proxyResData.toString());
                if (metadata.name === 'left-pad') {
                    console.log('processing left-pad');
                    metadata.versions['1.3.0'].dependencies = invalidDep;
                }
                return JSON.stringify(metadata);
            },
        }))
    }
};

applyProxy(app);

startApp(app, PORT);
