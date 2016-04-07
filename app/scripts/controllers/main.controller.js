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
 * # MasterdashctrlCtrl
 * Controller of the ScoresexplorerApp
 */

angular.module('ScoresexplorerApp').controller('MainCtrl',
    function($scope, $cookieStore) {
        this.awesomeThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma'];

        /**
         * Sidebar Toggle & Cookie Control
         */

        var mobileView = 992;

        $scope.getWidth = function() {
            return window.innerWidth;
        };

        $scope.$watch($scope.getWidth, function(newValue) {
            if (newValue >= mobileView) {
                if (angular.isDefined($cookieStore.get('toggle'))) {
                    $scope.toggle = !$cookieStore.get('toggle') ? false : true;
                } else {
                    $scope.toggle = true;
                }
            } else {
                $scope.toggle = false;
            }
        });
        $scope.count = 4;
        $scope.toggleSidebar = function() {
            $scope.toggle = !$scope.toggle;
            $cookieStore.put('toggle', $scope.toggle);
        };

        window.onresize = function() {
            $scope.$apply();
        };
    });
