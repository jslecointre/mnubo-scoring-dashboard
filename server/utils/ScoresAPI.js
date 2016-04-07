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
var bluebird = require('bluebird');

var Security = require('./../dictionaries/securityDictionnary.js');
var Engagement = require('./../dictionaries/engagementDictionnary.js');

var ScoresAPI = {
    getWidgets: function(mnubo, scoreType) {
        if (scoreType === 'security') {
            var countWidgets = Security.countWidgets;
        } else if (scoreType === 'engagement') {
            countWidgets = Engagement.countWidgets;
        }

        var widgets = [];
        var widgetCopy = {};

        var Promises = _.map(countWidgets, function(widget) {
            return mnubo.getSearchResponse(
                    'object', ['*'],
                    widget.andfilters,
                    widget.orfilters, [],
                    'count', [], []);
        }

        );

        return bluebird.all(Promises)
            .then(function(endresult) {
                _.forEach(countWidgets, function(value, key) {
                    widgetCopy = _.cloneDeep(value);
                    widgetCopy.count = endresult[key].rows[0][0];
                    delete widgetCopy.andfilters;
                    delete widgetCopy.orfilters;
                    widgets.push(widgetCopy);
                });

                return widgets;
            });
    },

    scoreComponentResult: function(sites, scoreType, elements, aggregated, mnubo) {
        if (scoreType === 'security') {
            var requestTypes = Security.requestTypes;
            var Components = Security.Components;
            var scorecomponent = Security.scorecomponent;
        } else if (scoreType === 'engagement') {
            requestTypes = Engagement.requestTypes;
            Components = Engagement.Components;
            scorecomponent = Engagement.scorecomponent;
        }

        var request = _.cloneDeep(requestTypes.ScoreComponent);

        if (aggregated === true) {
            request.groupby = ['week_start_day'];
        } else {
            request.groupby = ['week_start_day', 'siteid'];
        }

        request.selecteditems = request.selecteditems.concat(elements
            .map(function(component) {
                return _.filter(Components.concat(scorecomponent), ['short', component])[0].name;
            }));

        return mnubo.getSearchResponse(
            request.index,
            request.selecteditems,
            request.andfilters,
            sites.map(function(obj) {
                return {
                    siteid: obj,
                    operator: 'eq'
                };
            }),
            request.groupby,
            request.operation,
            request.timeinterval,
            request.orderby).then(function(resp) {
                return ScoresAPI.addQueryLabels(request, resp);
            });
    },

    scoreComponents: function(scoreType) {
        if (scoreType === 'security') {
            var Components = Security.Components;
        } else if (scoreType === 'engagement') {
            Components = Engagement.Components;
        }

        return _.map(Components, 'short');
    },
    scoredSites: function(mnubo, scoreType) {
        if (scoreType === 'security') {
            var requestTypes = Security.requestTypes;
        } else if (scoreType === 'engagement') {
            requestTypes = Engagement.requestTypes;
        }

        var request = _.cloneDeep(requestTypes.allscoredSites);

        return mnubo.getSearchResponse(
            request.index,
            request.selecteditems,
            request.andfilters,
            request.orfilters,
            request.groupby,
            request.operation,
            request.timeinterval,
            request.orderby);
    },

    allScores: function(mnubo, scoreType) {
        if (scoreType === 'security') {
            var requestTypes = Security.requestTypes;
            var Components = Security.Components;
            var scorecomponent = Security.scorecomponent;
        } else if (scoreType === 'engagement') {
            requestTypes = Engagement.requestTypes;
            Components = Engagement.Components;
            scorecomponent = Engagement.scorecomponent;
        }

        var request = _.cloneDeep(requestTypes.allScores);
        var res = {};

        return mnubo.getSearchResponse(
            request.index,
            request.selecteditems,
            request.andfilters,
            request.orfilters,
            request.groupby,
            request.operation,
            request.timeinterval,
            request.orderby).then(function(resp) {
                resp = ScoresAPI.addQueryLabels(request, resp);
                _.forEach(request.selecteditems, function(value, key) {
                    resp.columns[key + request.groupby.length + request.timeinterval.length].label =
                    _.first(_.filter(Components.concat(scorecomponent), {
                        name: value
                    })).short;
                });
                var sites = _.uniq(_.map(resp.rows, function(obj) {
                    return obj[1];
                }));
                _.pullAt(resp.columns, 1);

                _.forEach(sites, function(site) {
                    res[site] = {
                        rows: [],
                        columns: resp.columns
                    };

                    _.map(resp.rows, function(result) {
                        if (result[1] === site) {
                            _.pullAt(result, 1);
                            res[site].rows.push(result);
                        }
                    });
                });
                return _.map(sites, function(site) {
                    return {
                        name: site,
                        result: res[site]
                    };
                });
            });
    },
    allScoresAggregated: function(mnubo, scoreType, aggregationType) {
        if (scoreType === 'security') {
            var requestTypes = Security.requestTypes;
        } else if (scoreType === 'engagement') {
            requestTypes = Engagement.requestTypes;
        }

        if (aggregationType === 'variance') {
            var request = _.cloneDeep(requestTypes.allScoresVariance);
        } else if (aggregationType === 'average') {
            request = _.cloneDeep(requestTypes.allScoresAverage);
        }

        var res = {};
        return mnubo.getSearchResponse(
            request.index,
            request.selecteditems,
            request.andfilters,
            request.orfilters,
            request.groupby,
            request.operation,
            request.timeinterval,
            request.orderby).then(function(resp) {
                resp = ScoresAPI.addQueryLabels(request, resp);

                var sites = _.uniq(_.map(resp.rows, function(obj) {
                    return obj[0];
                }));
                _.pullAt(resp.columns, 0);

                _.forEach(sites, function(site) {
                    res[site] = {
                        rows: [],
                        columns: resp.columns
                    };

                    _.map(resp.rows, function(result) {
                        if (result[0] === site) {
                            _.pullAt(result, 0);
                            res[site].rows.push(result);
                        }
                    });
                });
                var doc = {};
                return _.map(sites, function(site) {
                    doc = {};
                    doc.name = site;
                    doc[aggregationType] = res[site];
                    return doc;
                });
            });
    },
    sitesScoreAggregated: function(mnubo, scoreType, aggregation) {
        return ScoresAPI.allScoresAggregated(mnubo, scoreType, aggregation)
        .then(function(resp) {
            var res = {};

            res[aggregation] = _.orderBy(_.map(resp, function(result) {
                var doc = {};
                doc.siteid = result.name;
                doc[aggregation] = result[aggregation].rows[0][6];

                return doc;
            }), [aggregation], ['desc']);
            return res;
        });
    },
    addQueryLabels: function(request, resp) {
        _.forEach(request.groupby, function(value, key) {
            if (value === 'week_start_day') {
                resp.columns[key].query = 'groupbyTime';
            } else {
                resp.columns[key].query = 'groupby';
            }
        });

        _.forEach(request.selecteditems, function(value, key) {
            // change the label to be displayed and add query information

            resp.columns[key + request.groupby.length + request.timeinterval.length]
            .query = 'select';
        });
        return resp;
    }
};

module.exports = ScoresAPI;
