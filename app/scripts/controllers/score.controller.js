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
/**
 * @ngdoc function
 * @name ScoresexplorerApp.controller:MasterdashctrlCtrl
 * @description
 * Controller of the ScoresexplorerApp
 */

angular.module('ScoresexplorerApp').controller('ScoreCtrl',
    function($q, $scope, $http, fetchdata) {
        this.awesomeThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma'];

        /* Aggregated view Switch */
        $scope.isaggregated = true;

        /* scores */
        $scope.sites = {
            scored: [],
            selected: []
        };

        $scope.Scores = [];
        $scope.ScoresMetrics = [];
        $scope.groupby = ['siteid', 'week_start_day'];

        /* refresh Data */
        $scope.refreshData = function() {
            if ($scope.isaggregated === true) {
                $scope.groupby = ['week_start_day'];
            } else {
                $scope.groupby = ['week_start_day', 'siteid'];
            }
            fetchdata.getScoresByComponents($scope.customer, $scope.scoreType, $scope.isaggregated,
                 [$scope.scorecomponent], _.map($scope.sites.selected, 'name'))
                .then(function(resp) {
                    $scope.Scores = resp.data;
                });
            fetchdata.getScoresByComponents($scope.customer, $scope.scoreType, $scope.isaggregated,
                [$scope.component], _.map($scope.sites.selected, 'name'))
                .then(function(resp) {
                    $scope.ScoresMetrics = resp.data;
                });
        };

        // Populate score variances for each site
        $scope.Categories = function(categoryType, numberOfSites) {
            var mapping = {
                steady: {
                    operation: 'variance'
                },
                changers: {
                    operation: 'variance'
                },
                top: {
                    operation: 'average'
                },
                low: {
                    operation: 'average'
                }
            };

            fetchdata.getScorersByCategory($scope.customer, $scope.scoreType,
                mapping[categoryType].operation).then(function(resp) {
                    var sitesList = _.map(resp.data[mapping[categoryType].operation], 'siteid');
                    mapping.steady.startindex = sitesList.length - numberOfSites;
                    mapping.steady.endindex = sitesList.length;
                    mapping.low.startindex = sitesList.length - numberOfSites;
                    mapping.low.endindex = sitesList.length;
                    mapping.changers.startindex = 0;
                    mapping.changers.endindex = numberOfSites;
                    mapping.top.startindex = 0;
                    mapping.top.endindex = numberOfSites;

                    sitesList = sitesList.slice(mapping[categoryType].startindex,
                        mapping[categoryType].endindex);

                    $scope.sites.selected = [];

                    _.each($scope.sites.scored, function(site) {
                        var idx = _.indexOf(sitesList, site.name);
                        if (idx > -1) {
                            $scope.sites.selected.push(site);
                        }
                    });
                    $scope.refreshData();
                });
        };

        // Populate the initial graphs

        fetchdata.getAllScores($scope.customer, $scope.scoreType).then(function(scores) {
            $scope.sites.scored = scores.data;
            fetchdata.getScoresComponents($scope.customer, $scope.scoreType)
            .then(function(components) {
                $scope.components = components;
                $scope.scorecomponent = $scope.scoreType + ' score';
                $scope.component = $scope.components[0];
                $scope.refreshData();
            });

            fetchdata.getWidgets($scope.customer, $scope.scoreType).then(function(resp) {
                $scope.Widgets = resp.data;
            });
        });
    });
