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
angular.module('ScoresexplorerApp').controller('GraphCtrl',
    function($q, $scope) {
        $scope.groupby = 1;
        $scope.chartConfig = [];
        $scope.$watch('goModel', function() {
            if ($scope.goModel.rows) {
                $scope.graphFromSearchResult($scope.goModel);
            }
        });
        // Function for plotly graph
        $scope.graphFromSearchResult = function(resp) {
            // Find the type of query to Display
            var select = $scope.countQueryElements(resp, 'select');
            var groupBy = $scope.countQueryElements(resp, 'groupby');
            var groupByTime = $scope.countQueryElements(resp, 'groupbyTime');
            var charts = {};
            //Initialize the graph data
            var mygraphlayout = {};
            mygraphlayout.xaxis = {};
            mygraphlayout.yaxis = {};
            mygraphlayout.title = $scope.chartTitle;

            var mygraphdata = [];
            var xlabel;
            var ylabel;
            var minY = 1;
            var maxY = 0;
            var categories;
            var categoryIndex;

            // 1 select and 1 GroupBy 1 GroupByTime (1 GroupBy is the categories
            //, 1 GroupBy for the values in X axis)
            if (groupBy === 1 && select === 1 && groupByTime === 1) {
                // Find all the unique categories (groupBy element)
                categories = _.uniq(resp.rows.map(function(obj) {
                    return obj[1];
                }));

                _.each(categories, function(category) {
                    charts[category] = [
                        [],
                        []
                    ];
                });

                _.each(resp.rows, function(row) {
                    // x
                    charts[row[1]][0].push(row[0]);
                    // y
                    charts[row[1]][1].push(row[2]);
                });

                // the xAxis elements must be at index 1 (groupByTime element)
                xlabel = resp.columns[0].label;
                // the yAxis elements must be at index 2 (select element)
                ylabel = resp.columns[2].label;

                // the the type of x axis depending on the label received
                if (resp.columns[0].label === 'week_start_day' ||
                 resp.columns[1].type === 'datatime') {
                    mygraphlayout.xaxis.type = 'date';
                } else {
                    mygraphlayout.xaxis.type = 'scatter';
                }

                if (categories.length > 10) {
                    mygraphlayout.showlegend = false;
                } else {
                    mygraphlayout.showlegend = true;
                }
            }

            // 1 select and 1 GroupByTime 0 GroupBy (1 GroupByTime for the values in X axis)
            if (select === 1 && groupByTime === 1 && groupBy === 0) {
                // no categories in case of 1 GroupBy
                charts.nocategories = [
                    [],
                    []
                ];

                _.each(resp.rows, function(row) {
                    charts.nocategories[0].push(row[0]);
                    charts.nocategories[1].push(row[1]);
                });

                // the the type of x axis depending on the label received
                if (resp.columns[0].label === 'week_start_day' ||
                resp.columns[0].type === 'datatime') {
                    mygraphlayout.xaxis.type = 'date';
                } else {
                    mygraphlayout.xaxis.type = 'scatter';
                }

                // the xAxis elements must be at index 1 (groupByTime)
                xlabel = resp.columns[0].label;
                // the yAxis elements must be at index 2 (select)
                ylabel = resp.columns[1].label;

                mygraphlayout.showlegend = false;
            }
            // More than 1 select and 0 GroupBy 1 GroupByTime
            if (select > 1 && groupByTime === 1 && groupBy === 0) {
                // Find all the unique categories (select)
                categories = _.slice(resp.columns, groupBy + groupByTime, resp.columns.length)
                .map(function(obj) {
                    return obj.label;
                });

                _.each(categories, function(category, index) {
                    charts[category] = [
                        [],
                        []
                    ];
                    _.each(resp.rows, function(row) {
                        // x values GroupbyTime (index 0)
                        charts[category][0].push(row[0]);
                        // y values (index depends on category)
                        charts[category][1].push(row[index + groupByTime + groupBy]);
                    });
                });

                // the xAxis elements must be at index 0 (groupByTime element)
                xlabel = resp.columns[0].label;
                // the yAxis elements must be at index (groupByTime+groupby)
                //=> select element position
                //ylabel = resp.columns[0+groupBy+1].label;

                // the the type of x axis depending on the label received
                if (resp.columns[0].label === 'week_start_day' ||
                resp.columns[0].type === 'datatime') {
                    mygraphlayout.xaxis.type = 'date';
                } else {
                    mygraphlayout.xaxis.type = 'scatter';
                }

                mygraphlayout.showlegend = true;
            }
            // Build the trace(s)
            var trace = {
                opacity: 0.5,
                type: 'scatter',
                uid: '5ffd92',
                mode: 'lines+markers',
                xaxis: 'x',
                yaxis: 'y',
            };

            _(charts).forEach(function(values, category) {
                trace.name = category;
                trace.x = values[0];
                trace.y = values[1];

                minY = Math.min(Math.min.apply(Math, values[1]), minY);
                maxY = Math.max(Math.max.apply(Math, values[1]), maxY);

                /* lookup in the data if the siteid is already in*/
                categoryIndex = mygraphdata.findIndex(function(y) {
                    return y.name === trace.name;
                });
                // In case of 1 GroupBy there is no categories and only one serie display
                if (category === 'nocategories') {
                    mygraphdata = [angular.copy(trace)];
                } else if (categoryIndex >= 0) {
                    /* the category is already in the graph update the content */
                    mygraphdata[categoryIndex] = angular.copy(trace);
                } else {
                    mygraphdata.push(angular.copy(trace));
                }
            });

            mygraphlayout.autosize = true;
            //mygraphlayout.height=410;
            //mygraphlayout.width= 600;
            mygraphlayout.height = 310;
            mygraphlayout.width = 500;
            ///mygraphlayout.legend= {xanchor:"center",yanchor:"top",y:-0.3, x:0.5};

            // Xaxis definition
            mygraphlayout.xaxis.autorange = true;
            mygraphlayout.xaxis.title = xlabel;
            mygraphlayout.xaxis.type = 'date';

            // Yaxis definition
            mygraphlayout.yaxis.autorange = false;
            mygraphlayout.yaxis.range = [minY - minY / 10, maxY + maxY / 10];
            mygraphlayout.yaxis.title = ylabel;
            mygraphlayout.yaxis.type = 'scatter';

            $scope.chartConfig = angular.copy(mygraphdata);
            $scope.chartLayout = angular.copy(mygraphlayout);
        };
        $scope.countQueryElements = function(resp, element) {
            return _.sum(_.map(resp.columns, function(obj) {
                if (obj.query === element) {
                    return 1;
                } else {
                    return 0;
                }
            }));
        };
    });
