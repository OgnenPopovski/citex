Auction.directive('md', [
    '$filter',
    '$compile',
    'MarkdownEditorButtons',
    'MarkedConfig',
    function($filter, $compile, MarkdownEditorButtons, MarkedConfig) {
        return {
            restrict: 'E',
            templateUrl: 'templates/md.html',
            scope: {
                bind: '=',
                mdResult: '='
            },
            link: function(scope, el, attrs) {

                var textarea = $(el).find("textarea");

                MarkedConfig.cfg();

                function refresh(content) {
                    scope.$apply(function() {
                        scope.mdResult = content;
                    });
                }

                var markdownCfg = {
                    iconlibrary: 'fa',
                    rows: 20,
                    additionalButtons: [
                        [{
                            name: 'groupBind',
                            data: [MarkdownEditorButtons.cmdBind(refresh),
                                MarkdownEditorButtons.cmdRepeat(refresh),
                                MarkdownEditorButtons.cmdTable(refresh)
                            ]
                        }]
                    ]
                };

                textarea.markdown(markdownCfg);

                scope.suggestions = [];

                scope.$watch('bind', function(n, o) {
                    if (n === o || !n) return;

                    function pass(obj, prefix) {
                        angular.forEach(obj, function(v, k) {
                            scope.suggestions.push(prefix + '.' + k);
                            if (typeof v === 'object') {
                                pass(v, prefix + '.' + k);
                            }
                        });
                    }
                    pass(n, 'bind');
                });

                textarea.textcomplete([{
                    match: /\B\{\{([\-+\w\.]*)$/,
                    search: function(term, callback) {
                        callback($.map(scope.suggestions,
                            function(s) {
                                if (s.indexOf(term) === 0 && s.indexOf('.', term.length) === -1) {
                                    return s;
                                } else {
                                    return null;
                                }
                            }));
                    },
                    template: function(value) {
                        return value;
                    },
                    replace: function(value) {
                        return '{{' + value;
                    },
                    index: 1,
                    maxCount: 30
                }]);
            }
        };
    }
]);

Auction.directive('mdShow', ['$filter', '$compile', 'MarkedConfig',
    function($filter, $compile, MarkedConfig) {
        return {
            scope: {
                mdText: '=',
                bind: '='
            },
            compile: function(el, attrs) {
                return function($scope, el, attrs) {
                    $scope.resultEl = $(el);

                    MarkedConfig.cfg();

                    $scope.$watch('mdText', function(n, o) {
                        if ($scope.resultEl && n) {
                            var content = marked(n);

                            $scope.resultEl.html(content);
                            $compile($scope.resultEl.contents())($scope);
                        }
                    });
                };
            }
        };
    }
]);
