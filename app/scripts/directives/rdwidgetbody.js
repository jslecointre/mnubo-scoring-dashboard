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
 * @ngdoc directive
 * @name ScoresexplorerApp.directive:rdWidgetBody
 * @description
 * # rdWidgetBody
 */
angular.module('ScoresexplorerApp')
    .directive('rdWidgetBody', function() {
        var directive = {
            requires: '^rdWidget',
            scope: {
                loading: '@?',
                classes: '@?'
            },
            transclude: true,
            template: '<div class="widget-body" ng-class="classes"><rd-loading ng-show="loading">' +
            '</rd-loading><div ng-hide="loading" class="widget-content" ng-transclude></div></div>',
            restrict: 'E'
        };
        return directive;
    });
