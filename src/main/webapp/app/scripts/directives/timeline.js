/*
 * Directive for generic combo (select)
 *
 */

Auction.directive('timeline', ['crudService', '$window', '$filter',
    function(crudService, $window, $filter) {
        return {
            restrict: 'EA',
            scope: {
                data: '=',
                click: '=',
                itemId: '=',
                itemLabel: '=',
                itemStartDate: '=',
                itemEnd: '=',
                itemColor: '=',
                itemLane: '=',
                itemTooltip: '=',
                laneLabel: '=',
                laneId: '=',
                timelineHeight: '@',
                timelineWidth: '@'
            },
            link: function(scope, element, attrs) {
                var margin = {
                    top: 20,
                    right: 15,
                    bottom: 15,
                    left: 100
                };
                var height = parseInt(attrs.timelineHeight) - 75 || 500;

                var objectEval = function(v, p) {
                    return $filter('objectEval')(v, p)[0];
                };

                scope.svg = d3.select(element[0])
                    .append("svg").style('width', '100%').style('height', height + 75 + 'px').attr('class', 'chart');

                function adapt(timelineItems) {
                    var lanes = [],
                        items = [],
                        laneMap = {},
                        t = 0;
                    var color = d3.scale.category10();
                    angular.forEach(timelineItems, function(v, i) {
                        // get the lane object
                        var lane = objectEval(v, scope.itemLane);
                        // get the id of the lane object
                        var laneId = objectEval(lane, scope.laneId);
                        // set the lane object in the map
                        if (!laneMap[laneId]) {
                            laneMap[laneId] = {
                                id: t,
                                label: objectEval(lane, scope.laneLabel),
                                base: lane
                            };
                            t = t + 1;
                        }
                        var start = moment(objectEval(v, scope.itemStartDate));
                        var end = moment(objectEval(v, scope.itemEnd));
                        end = end.add(1, 'days');
                        items.push({
                            id: objectEval(v, scope.itemId),
                            lane: laneMap[laneId].id,
                            start: start.toDate(),
                            end: end.toDate(),
                            color: color(objectEval(v, scope.itemColor)),
                            desc: objectEval(v, scope.itemLabel),
                            base: v
                        });
                    });

                    angular.forEach(laneMap, function(v, k) {
                        lanes.push(v);
                    });

                    return {
                        lanes: lanes,
                        items: items
                    };
                }

                scope.display = function() {
                    var now = new Date();
                    var rects, labels, minExtent = d3.time.day(scope.brush.extent()[0]),
                        maxExtent = d3.time.day(scope.brush.extent()[1]),
                        visItems = scope.items.filter(function(d) {
                            return d.start < maxExtent && d.end > minExtent
                        });

                    scope.mini.select('.brush').call(scope.brush.extent([minExtent, maxExtent]));

                    scope.mainScaleX.domain([minExtent, maxExtent]);

                    if ((maxExtent - minExtent) > 1468800000) {
                        scope.x1DateAxis.ticks(d3.time.mondays, 1).tickFormat(d3.time.format('%a %d'))
                        scope.x1MonthAxis.ticks(d3.time.mondays, 1).tickFormat(d3.time.format('%b - Week %W'))
                    } else if ((maxExtent - minExtent) > 172800000) {
                        scope.x1DateAxis.ticks(d3.time.days, 1).tickFormat(d3.time.format('%a %d'))
                        scope.x1MonthAxis.ticks(d3.time.mondays, 1).tickFormat(d3.time.format('%b - Week %W'))
                    } else {
                        scope.x1DateAxis.ticks(d3.time.hours, 4).tickFormat(d3.time.format('%I %p'))
                        scope.x1MonthAxis.ticks(d3.time.days, 1).tickFormat(d3.time.format('%b %e'))
                    }


                    //x1Offset.range([0, x1(d3.time.day.ceil(now) - x1(d3.time.day.floor(now)))]);

                    // shift the today line
                    scope.main.select('.main.todayLine')
                        .attr('x1', scope.mainScaleX(now) + 0.5)
                        .attr('x2', scope.mainScaleX(now) + 0.5);

                    // update the axis
                    scope.main.select('.main.axis.date').call(scope.x1DateAxis);
                    scope.main.select('.main.axis.month').call(scope.x1MonthAxis)
                        .selectAll('text')
                        .attr('dx', 5)
                        .attr('dy', 12);

                    // upate the item rects
                    rects = scope.itemRects.selectAll('rect')
                        .data(visItems, function(d) {
                            return d.id;
                        })
                        .attr('x', function(d) {
                            return scope.mainScaleX(d.start);
                        })
                        .attr('width', function(d) {
                            return scope.mainScaleX(d.end) - scope.mainScaleX(d.start);
                        });

                    rects.enter().append('rect')
                        .attr('x', function(d) {
                            return scope.mainScaleX(d.start);
                        })
                        .attr('y', function(d) {
                            return scope.mainScaleY(d.lane) + .1 * scope.mainScaleY(1) + 0.5;
                        })
                        .attr('width', function(d) {
                            return scope.mainScaleX(d.end) - scope.mainScaleX(d.start);
                        })
                        .attr('height', function(d) {
                            return .8 * scope.mainScaleY(1);
                        })
                        .attr('class', 'mainItem clickable')
                        .style('fill', function(d) {
                            return d.color ? d.color : '';
                        })
                        .on('click', function(d) {
                            if (typeof scope.click === 'function') {
                                scope.$apply(function() {
                                    scope.click(d);
                                });
                            }
                        });

                    rects.exit().remove();

                    // update the item labels
                    labels = scope.itemRects.selectAll('text')
                        .data(visItems, function(d) {
                            return d.id;
                        })
                        .attr('x', function(d) {
                            return scope.mainScaleX(Math.max(d.start, minExtent)) + 2;
                        });

                    labels.enter().append('text')
                        .text(function(d) {
                            return d.desc;
                        })
                        .attr('x', function(d) {
                            return scope.mainScaleX(Math.max(d.start, minExtent)) + 2;
                        })
                        .attr('y', function(d) {
                            return scope.mainScaleY(d.lane) + .4 * scope.mainScaleY(1) + 0.5;
                        })
                        .attr('text-anchor', 'start')
                        .attr('class', 'itemLabel clickable')
                        .on('click', function(d) {
                            if (typeof scope.click === 'function') {
                                scope.$apply(function() {
                                    scope.click(d);
                                });
                            }
                        });;

                    labels.exit().remove();
                }


                scope.render = function(timelineItems) {
                    scope.svg.selectAll('*').remove();
                    if (!timelineItems) {
                        return;
                    }
                    scope.modelData = adapt(timelineItems);
                    scope.lanes = scope.modelData.lanes;
                    scope.items = scope.modelData.items;
                    var now = new Date(),
                        width = d3.select(element[0]).node().offsetWidth - margin.left - margin.right,
                        miniHeight = scope.lanes.length * 12 + 50,
                        mainHeight = height - miniHeight - 50;




                    // X axis for the mini panel 
                    scope.miniScaleX = d3.time.scale()
                        .domain([d3.time.sunday(d3.min(scope.items, function(d) {
                                return d.start;
                            })),
                            d3.max(scope.items, function(d) {
                                return d.end;
                            })
                        ])
                        .range([0, width]);
                    // X axis for the main panel 
                    scope.mainScaleX = d3.time.scale().range([0, width]);

                    // number of lanes (lanes range)
                    scope.laneMinMaxRange = d3.extent(scope.lanes, function(d) {
                        return d.id;
                    });

                    // Y axis for the main panel
                    scope.mainScaleY = d3.scale.linear()
                        .domain([scope.laneMinMaxRange[0], scope.laneMinMaxRange[1] + 1])
                        .range([0, mainHeight]);
                    // Y axis for the mini panel
                    scope.miniScaleY = d3.scale.linear()
                        .domain([scope.laneMinMaxRange[0], scope.laneMinMaxRange[1] + 1])
                        .range([0, miniHeight]);

                    // variable for the svg
                    var chart = scope.svg;

                    // Draw the main pannel
                    chart.append('defs').append('clipPath')
                        .attr('id', 'clip')
                        .append('rect')
                        .attr('width', width)
                        .attr('height', mainHeight);

                    scope.main = chart.append('g')
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                        .attr('width', width)
                        .attr('height', mainHeight)
                        .attr('class', 'main');
                    // Draw the mini panel
                    scope.mini = chart.append('g')
                        .attr('transform', 'translate(' + margin.left + ',' + (mainHeight + 60) + ')')
                        .attr('width', width)
                        .attr('height', miniHeight)
                        .attr('class', 'mini');

                    // draw the lanes for the main chart
                    scope.main.append('g').selectAll('.laneLines')
                        .data(scope.lanes)
                        .enter().append('line')
                        .attr('x1', 0)
                        .attr('y1', function(d) {
                            return d3.round(scope.mainScaleY(d.id)) + 0.5;
                        })
                        .attr('x2', width)
                        .attr('y2', function(d) {
                            return d3.round(scope.mainScaleY(d.id)) + 0.5;
                        })
                        .attr('stroke', function(d) {
                            // there will be no line between the sublanes
                            return d.label === '' ? 'white' : 'lightgray'
                        });

                    // append the lane label
                    scope.main.append('g').selectAll('.laneText')
                        .data(scope.lanes)
                        .enter().append('text')
                        .text(function(d) {
                            return d.label;
                        })
                        .attr('x', -10)
                        .attr('y', function(d) {
                            return scope.mainScaleY(d.id + .5);
                        })
                        .attr('dy', '0.5ex')
                        .attr('text-anchor', 'end')
                        .attr('class', 'laneText');

                    // draw the lanes for the mini chart
                    scope.mini.append('g').selectAll('.laneLines')
                        .data(scope.lanes)
                        .enter().append('line')
                        .attr('x1', 0)
                        .attr('y1', function(d) {
                            return d3.round(scope.miniScaleY(d.id)) + 0.5;
                        })
                        .attr('x2', width)
                        .attr('y2', function(d) {
                            return d3.round(scope.miniScaleY(d.id)) + 0.5;
                        })
                        .attr('stroke', function(d) {
                            return d.label === '' ? 'white' : 'lightgray'
                        });

                    // draw the mini lane text
                    scope.mini.append('g').selectAll('.laneText')
                        .data(scope.lanes)
                        .enter().append('text')
                        .text(function(d) {
                            return d.label;
                        })
                        .attr('x', -10)
                        .attr('y', function(d) {
                            return scope.miniScaleY(d.id + .5);
                        })
                        .attr('dy', '0.5ex')
                        .attr('text-anchor', 'end')
                        .attr('class', 'laneText');

                    // draw the x axis
                    scope.xDateAxis = d3.svg.axis()
                        .scale(scope.miniScaleX)
                        .orient('bottom')
                        .ticks(d3.time.mondays, (scope.miniScaleX.domain()[1] - scope.miniScaleX.domain()[0]) > 15552e6 ? 2 : 1)
                        .tickFormat(d3.time.format('%d'))
                        .tickSize(6, 0, 0);

                    scope.x1DateAxis = d3.svg.axis()
                        .scale(scope.mainScaleX)
                        .orient('bottom')
                        .ticks(d3.time.days, 1)
                        .tickFormat(d3.time.format('%a %d'))
                        .tickSize(6, 0, 0);

                    scope.xMonthAxis = d3.svg.axis()
                        .scale(scope.miniScaleX)
                        .orient('top')
                        .ticks(d3.time.months, 1)
                        .tickFormat(d3.time.format('%b %Y'))
                        .tickSize(15, 0, 0);

                    scope.x1MonthAxis = d3.svg.axis()
                        .scale(scope.mainScaleX)
                        .orient('top')
                        .ticks(d3.time.mondays, 1)
                        .tickFormat(d3.time.format('%b - Week %W'))
                        .tickSize(15, 0, 0);

                    scope.main.append('g')
                        .attr('transform', 'translate(0,' + mainHeight + ')')
                        .attr('class', 'main axis date')
                        .call(scope.x1DateAxis);

                    scope.main.append('g')
                        .attr('transform', 'translate(0,0.5)')
                        .attr('class', 'main axis month')
                        .call(scope.x1MonthAxis)
                        .selectAll('text')
                        .attr('dx', 5)
                        .attr('dy', 12);

                    scope.mini.append('g')
                        .attr('transform', 'translate(0,' + miniHeight + ')')
                        .attr('class', 'axis date')
                        .call(scope.xDateAxis);

                    scope.mini.append('g')
                        .attr('transform', 'translate(0,0.5)')
                        .attr('class', 'axis month')
                        .call(scope.xMonthAxis)
                        .selectAll('text')
                        .attr('dx', 5)
                        .attr('dy', 12);

                    // draw a line representing today's date
                    scope.main.append('line')
                        .attr('y1', 0)
                        .attr('y2', mainHeight)
                        .attr('class', 'main todayLine')
                        .attr('clip-path', 'url(#clip)');

                    scope.mini.append('line')
                        .attr('x1', scope.miniScaleX(now) + 0.5)
                        .attr('y1', 0)
                        .attr('x2', scope.miniScaleX(now) + 0.5)
                        .attr('y2', miniHeight)
                        .attr('class', 'todayLine');

                    // draw the items
                    scope.itemRects = scope.main.append('g')
                        .attr('clip-path', 'url(#clip)');

                    scope.mini.append('g').selectAll('miniItems')
                        .data(getPaths(scope.items))
                        .enter().append('path')
                        .attr('class', function(d) {
                            return 'miniItem';
                        })
                        .style('stroke', function(d) {
                            return d.color ? d.color : '';
                        })
                        .attr('d', function(d) {
                            return d.path;
                        });

                    // invisible hit area to move around the selection window
                    scope.mini.append('rect')
                        .attr('pointer-events', 'painted')
                        .attr('width', width)
                        .attr('height', miniHeight)
                        .attr('visibility', 'hidden')
                        .on('mouseup', moveBrush);

                    // draw the selection area
                    scope.brush = d3.svg.brush()
                        .x(scope.miniScaleX)
                        .extent([d3.time.monday(now), d3.time.saturday.ceil(now)])
                        .on("brush", scope.display);

                    scope.mini.append('g')
                        .attr('class', 'x brush')
                        .call(scope.brush)
                        .selectAll('rect')
                        .attr('y', 1)
                        .attr('height', miniHeight - 1);

                    scope.mini.selectAll('rect.background').remove();
                    scope.display();


                    function moveBrush() {
                        var origin = d3.mouse(this),
                            point = scope.miniScaleX.invert(origin[0]),
                            halfExtent = (scope.brush.extent()[1].getTime() - scope.brush.extent()[0].getTime()) / 2,
                            start = new Date(point.getTime() - halfExtent),
                            end = new Date(point.getTime() + halfExtent);

                        scope.brush.extent([start, end]);
                        scope.display();
                    }

                    // generates a single path for each item class in the mini display
                    // ugly - but draws mini 2x faster than append lines or line generator
                    // is there a better way to do a bunch of lines as a single path with d3?
                    function getPaths(items) {
                        var paths = {},
                            d, offset = .5 * scope.miniScaleY(1) + 0.5,
                            result = [];
                        for (var i = 0; i < items.length; i++) {
                            d = items[i];
                            if (!paths[d.color]) paths[d.color] = '';
                            paths[d.color] += ['M', scope.miniScaleX(d.start), (scope.miniScaleY(d.lane) + offset), 'H', scope.miniScaleX(d.end)].join(' ');
                        }

                        for (var className in paths) {
                            result.push({
                                color: className,
                                path: paths[className]
                            });
                        }

                        return result;
                    }

                };

                // watch for data changes and re-render
                scope.$watch('data', function(newVals, oldVals) {
                    return scope.render(newVals);
                }, true);

                // Browser onresize event
                window.onresize = function() {
                    scope.$apply();
                };
            },
            controller: function($scope, $element, crudService) {

            }
        };
    }
]);
