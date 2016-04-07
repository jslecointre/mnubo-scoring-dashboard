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

'use strict';

var _ = require('lodash');
var mnubo = require('mnubo-sdk');

var Mnubo = function(client) {
    /* Load mnubo SDK. */
    /* only if running node < 4.0.0 */
    this.client = new mnubo.Client(client);
};

/* build a query */

Mnubo.prototype.getSearchResponse = function(index, selecteditems, andfilter,
    orfilter, groupby, operation,
    timeinterval, orderby) {
    var aggregation = {};
    var request = {
        from: index
    };
    var orderByItem = 'orderBy';
    var orderByValue = orderby;
    var or;
    if (selecteditems.length > 0) {
        var select = selecteditems.map(function(obj) {
            aggregation = {};
            aggregation[operation] = obj;
            return aggregation;
        });

        request.select = select;
        request.limit = 5000;

        if (operation !== 'value') {
            delete request.limit;
            orderByItem = 'orderLastGroupBy';
            if (orderby.length > 0) {
                orderByValue = orderby[0];
            }
        }
    }
    if (orfilter.length > 0 && andfilter.length === 0) {
        or = orfilter.map(function(obj) {
            var filter = {};
            filter[_.keys(obj)[0]] = {};
            filter[_.keys(obj)[0]][_.values(obj)[1]] = _.values(obj)[0];
            return filter;
        });

        request.where = {
            or: or
        };
    }
    if (andfilter.length > 0) {
        var and = andfilter.map(function(obj) {
            var filter = {};
            filter[_.keys(obj)[0]] = {};
            filter[_.keys(obj)[0]][_.values(obj)[1]] = _.values(obj)[0];
            return filter;
        });

        request.where = {
            and: and
        };
        if (orfilter.length > 0) {
            or = orfilter.map(function(obj) {
                var filter = {};
                filter[_.keys(obj)[0]] = {};

                filter[_.keys(obj)[0]][_.values(obj)[1]] = _.values(obj)[0];
                return filter;
            });
            request.where.and.push({
                or: or
            });
        }
    }
    if (groupby.length > 0) {
        request.groupBy = [];
        request.groupBy = groupby;
        request.limitLastGroup = 5000;
    }
    if (orderby.length > 0) {
        request[orderByItem] = [];
        request[orderByItem] = orderByValue;
    }
    if (timeinterval.length > 0) {
        request.groupByTime = {};
        request.groupByTime.field = 'x_timestamp';
        request.groupByTime.interval = timeinterval;
        request.groupByTime.timeZone = 'America/New_York';
    }
    //console.log('request', JSON.stringify(request));
    return this.client.search.createBasicQuery(request).then(function(resp) {
        //return resp['rows'];
        return resp;
    }).catch(function(error) {
        //console.log('request in error', JSON.stringify(request));
        //console.log('error code', error);
        return error;
    });
};

/* get dataset from sandbox */

Mnubo.prototype.getDataModelFromPtf = function() {
    return this.client.search.getDatasets().catch(function(error) {
        return error;
    })
        .then(function(dataset) {
            var datasetObject = {};
            _.each(dataset, function(obj) {
                var fields = _.filter(obj.fields, function(field) {
                    return !field.key.startsWith('x_');
                });
                datasetObject[obj.key] = fields;
            });
            return datasetObject;
        });
};

// export the class
module.exports = Mnubo;
