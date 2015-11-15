'use strict';

/* Directives */


Auction.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
        elm.text(version);
    };
}]);

Auction.directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                // alert('image is loaded');
            });
        }
    };
});

Auction.directive('pageHeader', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            headerTitle: '@',
            icon: '@',
            url: '@',
            urlTitle: '@',
            short: '@'
        },
        templateUrl: 'directives/page-header.html'
    };
});

Auction.directive('linkedPageHeader', function($filter) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            headerTitle: '@',
            icon: '@',
            url: '@',
            urlTitle: '@',
            short: '@'
        },
        templateUrl: 'directives/linked-page-header.html',
        link: function($scope) {
            $scope.$watch('$root.activePage', function(n, o) {
                if (n && n.name) {
                    $scope.icon = n.icon;
                    $scope.headerTitle = n.label;
                }
            });
        }

    };
});
Auction.directive('validate', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            label: '@',
            field: '@',
            message: '@',
            baseClass: '@'
        },
        controller: function($scope, $element) {
            $scope.form = $element.parent().controller('form');
        },
        link: function(scope, element, attrs, ctrl, transclude, formCtrl) {
            var requiredSpan = element.find('span');
            var baseClass = scope.baseClass || "form-group";
            var input = element.find("input");
            var textarea = element.find("textarea");
            var select = element.find("select");
            if (select.attr("ng-required") || select.attr("required")) {
                requiredSpan.addClass("ng-show");
            } else if (input.attr('required') || input.attr("ng-required")) {
                requiredSpan.addClass("ng-show");
            } else if (textarea.attr('required') || textarea.attr("ng-required")) {
                requiredSpan.addClass("ng-show");
            } else {
                requiredSpan.addClass("ng-hide");
            }
            var div = element.find("div");
            div.addClass(baseClass);
        },
        templateUrl: 'directives/validatedInput.html'
    };
});

Auction.directive('deleteButton', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            deleteFunction: '&',
            hideText: '='
        },
        templateUrl: 'directives/deleteButton.html',
        compile: function(tElem, attrs) {
            if (attrs.$attr.small) {
                tElem[0].children[0].className += " btn-xs";
            }
            return function(scope, elem, attrs) {
                // linking function here
            };
        }
    };
});
Auction.directive('editButton', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            editFunction: '&'
        },
        templateUrl: 'directives/editButton.html',
        compile: function(tElem, attrs) {
            if (attrs.$attr.small) {
                tElem[0].children[0].className += " btn-xs";
            }
            return function(scope, elem, attrs) {
                // linking function here
            };
        }
    };
});
Auction.directive('cancelButton', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            cancelFunction: '&'
        },
        templateUrl: 'directives/cancelButton.html',
        compile: function(tElem, attrs) {
            if (attrs.$attr.small) {
                tElem[0].children[0].className += " btn-xs";
            }
            return function(scope, elem, attrs) {
                // linking function here
            };
        }
    };
});

Auction.directive('boolView', function() {
    return {
        restrict: 'E',
        scope: {
            value: '='
        },
        link: function(scope, element, attrs) {
            var span = element.find("span");
            var i = element.find("i");
            if (scope.value) {
                span.addClass('label-success');
                i.addClass("fa-check");
            } else {
                span.addClass('label-default');
                i.addClass("fa-times");
            }
        },
        templateUrl: 'directives/boolView.html'
    };
});

Auction.directive('dateRange', function() {
    return {
        restrict: 'E',
        scope: {
            dateFrom: '=',
            dateTo: '='
        },
        link: function(scope, element, attrs) {
            scope.$watch('dateFrom', function(newVal) {
                var df = new Date(scope.dateFrom);
                var dt = new Date(scope.dateTo);
                var today = new Date();
                var span = dt.getTime() - df.getTime();
                var time = today.getTime() - df.getTime();
                scope.progress = Math.round(time * 100.0 / span);
                var div = element.find('div');
                scope.title = moment(dt).fromNow();
                if (scope.progress < 0) {
                    scope.progress = 0;
                } else if (scope.progress > 100) {
                    scope.progress = 100;
                    div.children().addClass('progress-bar-danger')
                } else {
                    if (scope.progress > 80) {
                        div.children().addClass('progress-bar-warning');
                    } else {
                        div.children().addClass('progress-bar-info')
                    }
                }
            }, true);
        },
        templateUrl: 'directives/dateRange.html'
    };
});

Auction.directive('disableAnimation', function($animate) {
    return {
        restrict: 'A',
        link: function($scope, $element, $attrs) {
            $attrs.$observe('disableAnimation', function(value) {
                $animate.enabled(!value, $element);
            });
        }
    };
});
