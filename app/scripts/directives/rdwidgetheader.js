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
 * @name ScoresexplorerApp.directive:rdWidgetHeader
 * @description
 * # rdWidgetHeader
 */
angular.module('ScoresexplorerApp')
    .directive('rdWidgetHeader', function() {
        var directive = {
            requires: '^rdWidget',
            scope: {
                title: '@',
                icon: '@'
            },
            transclude: true,
            template: '<div class="widget-header"><div class="row"><div class="pull-left">' +
            '<i class="fa" ng-class="icon"></i> {{title}} </div>' +
            '<div class="pull-right col-xs-6 col-sm-4" ng-transclude></div></div></div>',
            restrict: 'E'
        };
        return directive;
    });
