import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import {renderModuleFactory} from '@angular/platform-server';
import * as express from 'express';
import {readFileSync} from 'fs';
import {enableProdMode} from '@angular/core';

/*
* #############################################################
* #########Express Middleware for Universal Rendering##########
* #############################################################
* 1- We are going to start by defining an Express middleware that intercepts all HTTP requests that reach it.
* 2- Let's say that for example the user types in the url bar the address http://yourdomain.com/courses/03:
*    this request would hit our server and it would end up reaching this middleware.
* 3- This middleware will then define what response should be sent back to the browser
* Reference: https://blog.angular-university.io/angular-universal/
* */

// import pre-render production universal bundle
const {AppServerModuleNgFactory} = require('./dist-server/main');
// enable prod mode, to avoid having the application go twice through its change detection phase
enableProdMode();
// initialize Express Server
const app = express();

// read the production index.html present in the dist folder, and load it into as a string
const indexHtml = readFileSync(__dirname + '/dist/index.html', 'utf-8').toString();

/*
* 1- This middleware must be defined before the server-side rendering middleware,
*    and it will serve the static bundles from the dist client-side build output folder,
*    in case there is a file in the dist folder that matches the request.
* 2- Otherwise, if the request does match a static resource, then the catch-all middleware (*) is still going to be triggered.
* 3- But otherwise, if a static bundle is found that matches the resource,
*    then the middleware chain is interrupted and the server-side rendering middleware (*) will no longer be triggered.
* */
app.get('*.*', express.static(__dirname + '/dist', {
    maxAge: '1y'
}));

// the wildcard * means that this is indeed a catch-all middleware
app.route('*').get((req, res) => {
    // Notice that this file will never be served as a static file by Express Server,
    // its only used as the base template for server-side rendering.
    renderModuleFactory(AppServerModuleNgFactory, {
        document: indexHtml, // using production client-side index.html as our rendering template
        url: req.url // checking which route do we need to render by checking the req.url property
    })
        .then(html => {
            res.status(200).send(html); // send index.html to the browser, by passing it as the request response body
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

// launch the Express server, by listening for HTTP requests on port 9000
app.listen(9000, () => {
    console.log(`Angular Universal Node Express server listening on http://localhost:9000`);
});
