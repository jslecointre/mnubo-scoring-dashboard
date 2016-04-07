/*
 * ---------------------------------------------------------------------------
 *
 * COPYRIGHT (c) 2016 Mnubo Inc. All Rights Reserved.
 *
 * The copyright to the computer program(s) herein is the property of Mnubo
 * Inc. The program(s) may be used and/or copied only with the written
 * permission from Mnubo Inc. or in accordance with the terms and conditions
 * stipulated in the agreement/contract under which the program(s) have been
 * supplied.
 *
 * ---------------------------------------------------------------------------
 */

/* eslint no-console: 0 */

'use strict';

var path = require('path');
var express = require('express');
var app = express();
var ScoresAPI = require('./utils/ScoresAPI.js');
var customersSDK = require('./utils/customersSDK.js');
var bodyParser = require('body-parser');
var _ = require('lodash');
var favicon = require('serve-favicon');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var customers = customersSDK.getCustomers();
//var supportedScoreTypes = ['securty', 'engagement'];
/* initialize all the SDKs */
customersSDK.initializeSDKS();

app.use(bodyParser.json());

if (env === 'development') {
    //console.log('development mode');
    app.use('/bower_components', express.static(path.resolve(__dirname + './../bower_components')));
    app.use('/app', express.static(path.resolve(__dirname + './../app')));
    app.use('/scripts', express.static(path.resolve(__dirname + './../app/scripts')));
    app.use('/views', express.static(path.resolve(__dirname + './../app/views')));
    app.use('/styles', express.static(path.resolve(__dirname + './../app/styles')));
    //serve favicon
    app.use(favicon(__dirname + './../app/favicon.ico'));
    app.get('/', function(req, res) {
        res.sendFile(path.resolve(__dirname + '/../app/index.html'));
    });
} else if (env === 'production') {
    //console.log('production mode');

    app.get('/', function(req, res) {
        res.sendFile(path.resolve(__dirname + '/../dist/index.html'));
    });
    app.use('/scripts', express.static(path.resolve(__dirname + './../dist/scripts')));
    app.use('/styles', express.static(path.resolve(__dirname + './../dist/styles')));
    app.use('/fonts', express.static(path.resolve(__dirname + './../dist/fonts')));
    //serve favicon
    app.use(favicon(__dirname + './../dist/favicon.ico'));
}

app.get('/customers', function(req, res) {
    res.send(customers).status(200);
});

app.get('/datasets/:customer', function(req, res) {
    var customer = req.params.customer;

    if (customers.indexOf(customer) > -1) {
        var sdk = customersSDK.getSDK(customer);
        sdk.getDataModelFromPtf().then(function(results) {
            res.send(results).status(200);
        }).catch(function(err) {
            res.send(err).status(501);
        });
    } else {
        res.status(404).send({
            error: 'customer ' + customer + ' not found'
        });
    }
});

app.get('/:customer/:scoretype/sites', function(req, res) {
    var customer = req.params.customer;
    var scoretype = req.params.scoretype;

    if (customers.indexOf(customer) > -1) {
        var sdk = customersSDK.getSDK(customer);
        ScoresAPI.scoredSites(sdk, scoretype).then(function(results) {
            res.send(_.uniq(_.map(results.rows, function(obj) {
                return obj[0];
            }))).status(200);
        }).catch(function(err) {
            res.send(err).status(501);
        });
    } else {
        res.status(404).send({
            error: 'customer ' + customer + ' not found'
        });
    }
});

app.get('/:customer/:scoretype/components', function(req, res) {
    //var customer = req.params.customer;
    var scoretype = req.params.scoretype;

    res.send(ScoresAPI.scoreComponents(scoretype)).status(200);
});

app.get('/:customer/:scoretype/widgets', function(req, res) {
    var customer = req.params.customer;
    var scoretype = req.params.scoretype;
    var sdk = customersSDK.getSDK(customer);
    ScoresAPI.getWidgets(sdk, scoretype).then(function(resp) {
        res.send(resp).status(200);
    });
});
app.post('/:customer/:scoretype/score', function(req, res) {
    var customer = req.params.customer;
    var scoretype = req.params.scoretype;
    var sites = req.body.sites;
    var elements = req.body.scorecomponents;
    var aggregated = req.body.aggregated;
    var sdk = customersSDK.getSDK(customer);

    ScoresAPI.scoreComponentResult(sites, scoretype, elements, aggregated, sdk)
    .then(function(results) {
        res.send(results).status(200);
    })
        .catch(function(err) {
            res.send(err).status(501);
        });
});
app.get('/:customer/:scoretype/allscores', function(req, res) {
    var customer = req.params.customer;
    var scoretype = req.params.scoretype;
    var sdk = customersSDK.getSDK(customer);

    ScoresAPI.allScores(sdk, scoretype).then(function(results) {
        res.send(results).status(200);
    }).catch(function(err) {
        res.send(err).status(501);
    });
});
app.get('/:customer/:scoretype/allscoresvariances', function(req, res) {
    var customer = req.params.customer;
    var scoretype = req.params.scoretype;
    var sdk = customersSDK.getSDK(customer);

    ScoresAPI.allScoresAggregated(sdk, scoretype, 'variance').then(function(results) {
        res.send(results).status(200);
    }).catch(function(err) {
        res.send(err).status(501);
    });
});
app.get('/:customer/:scoretype/:operation', function(req, res) {
    var aggregation = req.params.operation;
    var scoretype = req.params.scoretype;
    var customer = req.params.customer;
    var sdk = customersSDK.getSDK(customer);
    ScoresAPI.sitesScoreAggregated(sdk, scoretype, aggregation).then(function(results) {
        res.send(results).status(200);
    }).catch(function(err) {
        res.send(err).status(501);
    });
});

app.listen(3000, function() {
    console.log('mnubo server up');
});

// export the module
module.exports = app;
