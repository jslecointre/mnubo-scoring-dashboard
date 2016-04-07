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
 * @name ScoresexplorerApp.directive:rdLoading
 * @description
 * # rdLoading
 */
angular.module('ScoresexplorerApp')
    .directive('rdLoading', function() {
        var directive = {
            restrict: 'AE',
            template:
            '<div class="loading"><div class="double-bounce1">' +
            '</div><div class="double-bounce2"></div></div>'
        };
        return directive;
    });
