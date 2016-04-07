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
 * @ngdoc overview
 * @name ScoresexplorerApp
 * @description
 * # ScoresexplorerApp
 *
 * Main module of the application.
 */
angular
    .module('ScoresexplorerApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'plotly',
        'ngCookies',
        'ui.router',
        'ui.bootstrap',
        'ui.select',
        'frapontillo.bootstrap-switch'
    ])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/securityv2.html'
            })
            .when('/securityv2', {
                templateUrl: 'views/securityv2.html'
            })
            .when('/engagementv2', {
                templateUrl: 'views/engagementv2.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
