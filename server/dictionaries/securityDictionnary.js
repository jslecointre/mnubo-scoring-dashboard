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

var Components = [{
    name: 'armed_sessions_sos_score',
    displayName: 'duration of armed sessions score',
    short: 'armed sessions',
    mediatypes: ['panel_armState'],
    object_type: 'panel'
}, {
    name: 'opened_door_window_sos_score',
    displayName: 'frequency of door/window opened score',
    short: 'door opened',
    mediatypes: ['sensor_doorWindow'],
    object_type: 'sensor'
}, {
    name: 'opened_garage_door_sos_score',
    displayName: 'frequency of garage door unlocked score',
    short: 'garage door',
    mediatypes: ['lock_boolean'],
    object_type: 'sensor'
}, {
    name: 'outdoor_camera_presence_score',
    displayName: 'presence of outdoor camera score',
    short: 'camera presence',
    mediatypes: ['camera_snapshot', 'camera_videoClip'],
    object_type: 'sensor'
}, {
    name: 'door_lock_presence_score',
    displayName: 'door lock presence',
    short: 'door lock presence',
    mediatypes: ['lock_boolean'],
    object_type: 'sensor'
}, {
    name: 'unlocked_door_sos_score',
    displayName: 'frequency of front door unlocked score',
    short: 'unlocked door',
    mediatypes: ['lock_boolean'],
    object_type: 'sensor'
}];

var scorecomponent = {
    name: 'security_score',
    displayName: 'security score',
    short: 'security score'
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
        widgetclass: 'blue',
        fa: 'fa fa-server',
        count: -1,
        item: 'gateway',
        andfilters: [{
            x_object_type: 'gateway',
            operator: 'eq'
        }],
        orfilters: []
    }, {
        widgetclass: 'blue',
        fa: 'fa fa-unlock-alt',
        count: -1,
        item: 'door lock',
        andfilters: [{
            x_object_type: 'sensor',
            operator: 'eq'
        }],
        orfilters: [{
            model: 'Door Lock',
            operator: 'eq'
        }, {
            model: 'Door Lock - Kwikset/Baldwin',
            operator: 'eq'
        }, {
            model: 'UNSUPPORTED Door Lock',
            operator: 'eq'
        }]
    }, {
        widgetclass: 'orange',
        fa: 'fa fa-sign-out',
        count: -1,
        item: 'door sensor',
        andfilters: [{
            x_object_type: 'sensor',
            operator: 'eq'
        }],
        orfilters: [{
            model: 'Door Sensor',
            operator: 'eq'
        }]
    }, {
        widgetclass: 'orange',
        fa: 'fa fa-windows',
        count: -1,
        item: 'window sensor',
        andfilters: [{
            x_object_type: 'sensor',
            operator: 'eq'
        }],
        orfilters: [{
            model: 'Window Sensor',
            operator: 'eq'
        }]
    }, {
        widgetclass: 'orange',
        fa: 'fa fa-random',
        count: -1,
        item: 'door window',
        andfilters: [{
            x_object_type: 'sensor',
            operator: 'eq'
        }],
        orfilters: [{
            model: 'Door/Window Sensor',
            operator: 'eq'
        }]
    }, {
        widgetclass: 'green',
        fa: 'fa fa-video-camera',
        count: -1,
        item: 'indoor camera',
        andfilters: [{
            x_object_type: 'camera',
            operator: 'eq'
        }],
        orfilters: [{
            model: 'RC8021 Indoor Camera',
            operator: 'eq'
        }, {
            model: 'RC8025 Indoor/Night Camera',
            operator: 'eq'
        }, {
            model: 'RC8322 Indoor/Night HD Camera',
            operator: 'eq'
        }, {
            model: 'RC8322T Indoor Wide Angle HD Camera',
            operator: 'eq'
        }, {
            model: 'iCamera-1000 Indoor/Outdoor Camera',
            operator: 'eq'
        }]
    }, {
        widgetclass: 'green',
        fa: 'fa fa-video-camera',
        count: -1,
        item: 'outdoor camera',
        andfilters: [{
            x_object_type: 'camera',
            operator: 'eq'
        }],
        orfilters: [{
            model: 'OC431 Outdoor/Night HD Camera',
            operator: 'eq'
        }, {
            model: 'OC431T Outdoor/Night HD Camera',
            operator: 'eq'
        }, {
            model: 'OC810 Outdoor/Night Camera',
            operator: 'eq'
        }]
    }, {
        widgetclass: 'red',
        fa: 'fa fa-tablet',
        count: -1,
        item: 'security panel',
        andfilters: [{
            x_object_type: 'panel',
            operator: 'eq'
        }],
        orfilters: []
    }, {
        widgetclass: 'pink',
        fa: 'fa fa-car',
        count: -1,
        item: 'garage door',
        andfilters: [{
            x_object_type: 'Garage Door Controller',
            operator: 'eq'
        }],
        orfilters: []
    }

];

var requestTypes = {
    ScoreComponent: {
        selecteditems: [],
        index: 'security_scoring_v2',
        operation: 'avg',
        timeinterval: [],
        andfilters: [],
        orfilters: [],
        groupby: [''],
        orderby: []
    },
    allScores: {
        selecteditems: _.map(Components.concat(scorecomponent), 'name'),
        index: 'security_scoring_v2',
        operation: 'avg',
        timeinterval: [],
        andfilters: [],
        orfilters: [],
        groupby: ['week_start_day', 'siteid'],
        orderby: []
    },
    allScoresVariance: {
        selecteditems: _.map(Components.concat(scorecomponent), 'name'),
        index: 'security_scoring_v2',
        operation: 'variance',
        timeinterval: [],
        andfilters: [],
        orfilters: [],
        groupby: ['siteid'],
        orderby: []
    },
    allScoresAverage: {
        selecteditems: _.map(Components.concat(scorecomponent), 'name'),
        index: 'security_scoring_v2',
        operation: 'avg',
        timeinterval: [],
        andfilters: [],
        orfilters: [],
        groupby: ['siteid'],
        orderby: []
    },
    allScoredSites: {
        selecteditems: [],
        index: 'security_scoring_v2',
        operation: '',
        timeinterval: [],
        andfilters: [{
            security_score: 'value',
            operator: 'has'
        }],
        orfilters: [],
        groupby: ['siteid'],
        orderby: []
    },
};

var securityDictionary = {
    Components: Components,
    scorecomponent: scorecomponent,
    countWidgets: countWidgets,
    requestTypes: requestTypes
};

// export the module
module.exports = securityDictionary;
