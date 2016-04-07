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

/* eslint camelcase: 0 */

'use strict';
var _ = require('lodash');

var Components = [

    {
        name: 'login_out_score',
        displayName: 'Login/logout score',
        short: 'Login/logout',
        mediatypes: ['panel_armState'],
        object_type: 'panel'
    }, {
        name: 'communication_score',
        displayName: 'Communication score',
        short: 'Communication',
        mediatypes: ['panel_armState'],
        object_type: 'panel'
    }, {
        name: 'settings_mgt_score',
        displayName: 'Settings management score',
        short: 'Settings',
        mediatypes: ['lock_boolean'],
        object_type: 'sensor'
    }, {
        name: 'device_mgt_score',
        displayName: 'Device management score',
        short: 'Device management',
        mediatypes: ['sensor_doorWindow'],
        object_type: 'sensor'
    }, {
        name: 'alarm_set_score',
        displayName: 'Alarm set on/off score',
        short: 'Alarm set',
        mediatypes: ['lock_boolean'],
        object_type: 'sensor'

    }, {
        name: 'camera_use_score',
        displayName: 'Camera Use score',
        short: 'Camera Use',
        mediatypes: ['camera_snapshot', 'camera_videoClip'],
        object_type: 'camera'

    }

];

var scorecomponent = {
    name: 'engagement_score',
    displayName: 'engagement score',
    short: 'engagement score'
};

var countWidgets = [

    {
        widgetclass: 'blue',
        fa: 'glyphicon glyphicon glyphicon-home',
        count: -1,
        item: 'sites',
        andfilters: [{
            x_object_type: 'site',
            operator: 'eq'
        }],
        orfilters: []
    }, {
        widgetclass: 'orange',
        fa: 'fa fa-sign-out',
        count: -1,
        item: 'gateway',
        andfilters: [{
            x_object_type: 'gateway',
            operator: 'eq'
        }],
        orfilters: []
    },

    {
        widgetclass: 'blue',
        fa: 'fa fa-unlock-alt',
        count: -1,
        item: 'camera',
        andfilters: [{
            x_object_type: 'camera',
            operator: 'eq'
        }],
        orfilters: []
    },

    {
        widgetclass: 'blue',
        fa: 'fa fa-unlock-alt',
        count: -1,
        item: 'panel',
        andfilters: [{
            x_object_type: 'panel',
            operator: 'eq'
        }],
        orfilters: []
    }

];

var requestTypes = {
    ScoreComponent: {
        selecteditems: [],
        index: 'engagement_scoring',
        operation: 'avg',
        timeinterval: [],
        andfilters: [],
        orfilters: [],
        groupby: [''],
        orderby: []
    },
    allScores: {
        selecteditems: _.map(Components.concat(scorecomponent), 'name'),
        index: 'engagement_scoring',
        operation: 'avg',
        timeinterval: [],
        andfilters: [],
        orfilters: [],
        groupby: ['week_start_day', 'siteid'],
        orderby: []
    },
    allScoresVariance: {
        selecteditems: _.map(Components.concat(scorecomponent), 'name'),
        index: 'engagement_scoring',
        operation: 'variance',
        timeinterval: [],
        andfilters: [],
        orfilters: [],
        groupby: ['siteid'],
        orderby: []
    },
    allScoresAverage: {
        selecteditems: _.map(Components.concat(scorecomponent), 'name'),
        index: 'engagement_scoring',
        operation: 'avg',
        timeinterval: [],
        andfilters: [],
        orfilters: [],
        groupby: ['siteid'],
        orderby: []
    },
    allScoredSites: {
        selecteditems: [],
        index: 'engagement_scoring',
        operation: '',
        timeinterval: [],
        andfilters: [{
            engagement_score: 'value',
            operator: 'has'
        }],
        orfilters: [],
        groupby: ['siteid'],
        orderby: []
    },
};

var engagementDictionary = {
    Components: Components,
    scorecomponent: scorecomponent,
    countWidgets: countWidgets,
    requestTypes: requestTypes
};

// export the module
module.exports = engagementDictionary;
