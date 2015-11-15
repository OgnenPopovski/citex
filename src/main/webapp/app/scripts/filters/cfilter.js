'use strict';

Auction.filter('cfilter', function() {

    function isEmpty(y) {
        if (y == "" || y == null) {
            return true;
        }
        return false;
    }

    function isDate(d) {
        return d instanceof Date;
    }


    function compareDates(x, y) {
        var a = moment(x);
        var b = moment(y);
        if (a.isSame(b)) {
            return 0;
        } else if (a.isAfter(b)) {
            return 1;
        } else if (a.isBefore(b)) {
            return -1;
        } else {
            return null;
        }

    }

    function eq(x, y) {
        if (isDate(y)) {
            var r = compareDates(x, y);
            if (r === null) {
                return true;
            } else {
                return r === 0;
            }
        }
        return x == y;
    }

    var leafComparator = {
        'lk_': function(x, y) {
            y = ('' + y).toLowerCase();
            return ('' + x).toLowerCase().indexOf(y) > -1;
        },
        'ne_': function(x, y) {
            if (isEmpty(y)) {
                return true;
            }
            if (isDate(y)) {
                var r = compareDates(x, y);
                if (r === null) {
                    return true;
                } else {
                    return r !== 0;
                }
            }
            return x != y;
        },
        "gt_": function(x, y) {
            if (isEmpty(y)) {
                return true;
            }
            if (isDate(y)) {
                var r = compareDates(x, y);
                if (r === null) {
                    return true;
                } else {
                    return r === 1;
                }
            }
            return x != y;
        },
        'ge_': function(x, y) {
            if (isEmpty(y)) {
                return true;
            }
            if (isDate(y)) {
                var r = compareDates(x, y);
                if (r === null) {
                    return true;
                } else {
                    return r !== -1;
                }
            }
            return x >= y;
        },
        'lt_': function(x, y) {
            if (isEmpty(y)) {
                return true;
            }
            if (isDate(y)) {
                var r = compareDates(x, y);
                if (r === null) {
                    return true;
                } else {
                    return r === -1;
                }
            }
            return x < y;
        },
        'le_': function(x, y) {
            if (isEmpty(y)) {
                return true;
            }
            if (isDate(y)) {
                var r = compareDates(x, y);
                if (r === null) {
                    return true;
                } else {
                    return r !== 1;
                }
            }
            return x <= y;
        }
    };

    return function(array, expression, comparator) {

        var isArray = (function() {
            if (typeof Array.isArray !== 'function') {
                return function(
                    value) {
                    return toString.call(value) === '[object Array]';
                };
            }
            return Array.isArray;
        })();

        if (!isArray(array)) return array;


        function operator(objKey) {
            var nlc = eq;
            if (typeof objKey === 'string' && objKey.length > 3) {
                var prefix = "" + objKey[0] + objKey[1] + objKey[2];
                nlc = leafComparator[prefix];
            }
            if (!nlc) {
                nlc = eq;
            }
            return nlc;
        }

        var comparatorType = typeof(comparator),
            predicates = [];

        predicates.check = function(value) {
            for (var j = 0; j < predicates.length; j++) {
                if (!predicates[j](value)) {
                    return false;
                }
            }
            return true;
        };

        if (comparatorType !== 'function') {
            if (comparatorType === 'boolean' && comparator) {
                comparator = function(obj, text) {
                    return angular.equals(obj, text);
                };
            } else {
                comparator = function(obj, text, lc) {
                    if (obj && text && typeof obj === 'object' && typeof text === 'object') {
                        for (var objKey in text) {
                            if (objKey.charAt(0) !== '$' && hasOwnProperty.call(obj, objKey) && !comparator(obj[objKey], text[objKey],
                                    lc)) {
                                return false;
                            }
                        }
                        return true;
                    }
                    return lc(obj, text);
                };
            }
        }

        var search = function(obj, text, lc) {
            lc = lc || eq;
            switch (typeof obj) {
                case "boolean":
                case "number":
                case "string":
                    return comparator(obj, text, lc);
                case "object":
                    switch (typeof text) {
                        case "object":
                            return comparator(obj, text, lc);
                        default:
                            for (var objKey in obj) {
                                if (objKey.charAt(0) !== '$') {
                                    var nlc = operator(objKey);
                                    var subKey = objKey;
                                    if (nlc != eq) {
                                        subKey = objKey.slice(3)
                                    }
                                    if (search(obj[subKey], text, nlc)) {
                                        return true;
                                    }
                                }
                            }
                            break;
                    }
                    return false;
                case "array":
                    for (var i = 0; i < obj.length; i++) {
                        if (search(obj[i], text, lc)) {
                            return true;
                        }
                    }
                    return false;
                default:
                    return false;
            }
        };

        switch (typeof expression) {
            case "boolean":
            case "number":
            case "string":
                // Set up expression object and fall through
                expression = {
                    $: expression
                };
            case "object":
                for (var key in expression) {
                    (function(path) {
                        if (typeof expression[path] === 'undefined') return;
                        var nlc = operator(path);
                        var subKey = path;
                        if (nlc != eq) {
                            subKey = path.slice(3)
                        }
                        predicates.push(function(value) {
                            return search(path == '$' ? value : (value && value[subKey]), expression[path],
                                nlc);
                        });
                    })(key);
                }
                break;
            case 'function':
                predicates.push(expression);
                break;
            default:
                return array;
        }
        var filtered = [];
        for (var j = 0; j < array.length; j++) {
            var value = array[j];
            if (predicates.check(value)) {
                filtered.push(value);
            }
        }
        return filtered;
    };
});
