/*
 * Directive for generic combo (select)
 *
 */

Auction.directive('barChart', ['crudService', '$window', '$filter',
    function(crudService, $window, $filter) {
        return {
            restrict: 'EA',
            scope: {
                data: '=',
                helpFn: '=',
                click: '=',
                labelFn: '=',
                label: '@',
                value: '@',
                help: '@'
            },
            link: function(scope, element, attrs) {
                var margin = parseInt(attrs.margin) || 20,
                    barHeight = parseInt(attrs.barHeight) || 20,
                    barPadding = parseInt(attrs.barPadding) || 5;

                var barLabel = null;
                if (typeof scope.labelFn === 'function') {
                    barLabel = scope.labelFn;
                } else {
                    barLabel = function(d) {
                        return $filter('objectEval')(d, scope.label);
                    };
                }

                scope.svg = d3.select(element[0])
                    .append("svg").style('width', '100%').style('height', '100%');
                // Browser onresize event
                window.onresize = function() {
                    scope.$apply();
                };
                var tip = null;
                if (typeof scope.helpFn === 'function' || scope.help != null) {
                    tip = d3.tip()
                        .attr('class', 'd3-tip')
                        .offset([-10, 0])
                        .html(scope.helpFn || function(d) {
                            return $filter('objectEval')(d, scope.help);
                        });
                    scope.svg.call(tip);
                }


                scope.render = function(data) {
                    // remove all previous items before render
                    scope.svg.selectAll('*').remove();

                    // If we don't pass any data, return out of the element
                    if (!data) return;

                    var width = d3.select(element[0]).node().offsetWidth - margin;
                    // calculate the height
                    var height = scope.data.length * (barHeight + barPadding);
                    // Use the category20() scale function for multicolor support
                    var color = d3.scale.category20();
                    // our xScale
                    var xScale = d3.scale.linear().domain([0, d3.max(data, function(d) {
                        return $filter('objectEval')(d, scope.value);
                    })]).range([0, width - 30]);

                    // set the height based on the calculations above
                    scope.svg.attr('height', height);

                    //create the rectangles for the bar chart
                    var rectEnter = scope.svg.selectAll('rect')
                        .data(data).enter();

                    var rects = rectEnter.append('rect')
                        .attr('height', barHeight)
                        .attr('width', 140)
                        .attr('x', Math.round(margin / 2))
                        .attr('y', function(d, i) {
                            return i * (barHeight + barPadding);
                        })
                        .attr('fill', function(d) {
                            return color($filter('objectEval')(d, scope.value));
                        });
                    rects.transition()
                        .duration(1000)
                        .attr('width', function(d) {
                            return xScale($filter('objectEval')(d, scope.value));
                        });
                    var labels = rectEnter.append("text").attr("x", 150)
                        .attr("y", function(d, i) {
                            return i * (barHeight + barPadding) + barHeight / 2;
                        }).attr("dy", ".35em")
                        .text(function(d) {
                            return $filter('objectEval')(d, scope.value);
                        });
                    labels.transition()
                        .duration(1000)
                        .attr("x", function(d) {
                            return xScale($filter('objectEval')(d, scope.value)) + 15;
                        });
                    var values = rectEnter.append("text").attr("x", function(d) {
                            return 10;
                        }).attr("y", function(d, i) {
                            return i * (barHeight + barPadding) + barHeight / 2;
                        }).attr("dy", ".35em")
                        .text(barLabel);

                    if (tip) {
                        rects.on('mouseover', tip.show)
                            .on('mouseout', tip.hide);
                        labels.on('mouseover', tip.show)
                            .on('mouseout', tip.hide);
                        values.on('mouseover', tip.show)
                            .on('mouseout', tip.hide);
                    }

                    if (typeof scope.click === 'function') {
                        rects.on('click', scope.click);
                        rects.attr('class', 'clickable');
                        labels.on('click', scope.click);
                        labels.attr('class', 'clickable');
                        values.on('click', scope.click);
                        values.attr('class', 'clickable');
                    }

                };

                // watch for data changes and re-render
                scope.$watch('data', function(newVals, oldVals) {
                    return scope.render(newVals);
                }, true);
            },
            controller: function($scope, $element, crudService) {

            }
        };
    }
]);
