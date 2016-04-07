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
 * @ngdoc service
 * @name ScoresexplorerApp.fetchdata
 * @description
 * # fetchdata
 * Service in the ScoresexplorerApp.
 */
angular.module('ScoresexplorerApp')
    .service('fetchdata', function($http) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.getSitesScored = function(customer, scoreType) {
            return $http({
                method: 'GET',
                url: '/' + customer + '/' + scoreType + '/sites'
            });
        };

        this.getWidgets = function(customer, scoreType) {
            return $http({
                method: 'GET',
                url: '/' + customer + '/' + scoreType + '/widgets'
            });
        };

        this.getAllScores = function(customer, scoreType) {
            return $http({
                method: 'GET',
                url: '/' + customer + '/' + scoreType + '/allscores'
            });
        };

        this.getScoresvariances = function(customer, scoreType) {
            return $http({
                method: 'GET',
                url: '/' + customer + '/' + scoreType + '/allscoresvariances'
            });
        };

        this.getScorersByCategory = function(customer, scoreType, aggregation) {
            return $http({
                method: 'GET',
                url: '/' + customer + '/' + scoreType + '/' + aggregation
            });
        };

        this.getScoresComponents = function(customer, scoreType) {
            return $http({
                method: 'GET',
                url: '/' + customer + '/' + scoreType + '/components'
            }).then(function(resp) {
                return resp.data;
            });
        };

        this.getDataSets = function(customer) {
            return $http({
                method: 'GET',
                url: '/datasets/' + customer
            });
        };

        this.getScoresByComponents = function(customer, scoreType,
            aggregated, scorecomponents, sites) {
            var body = {
                sites: sites,
                scorecomponents: scorecomponents,
                aggregated: aggregated
            };

            return $http({
                method: 'POST',
                contentType: 'application/json',
                url: '/' + customer + '/' + scoreType + '/score',
                data: JSON.stringify(body)
            });
        };
    });
