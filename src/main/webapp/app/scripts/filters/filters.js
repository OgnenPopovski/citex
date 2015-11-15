'use strict';

/* Filters */


Auction.filter('interpolate', ['version',
    function(version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        };
    }
]).filter('fileSize', function() {
    return function(fileSizeInBytes) {
        var i = -1;
        var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
        do {
            fileSizeInBytes = fileSizeInBytes / 1024;
            i++;
        } while (fileSizeInBytes > 1024);

        return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
    };
}).filter('shorten', function() {
    return function(value) {
        value = value || "";
        if (value.length && value.length > 50) {
            return value.substring(0, 50) + "...";
        } else {
            return value;
        }
    };
}).filter('after', function() {
    return function(dateString) {
        return moment(dateString).isAfter();
    };
}).filter('fromNow', function() {
    return function(dateString) {
        return moment(dateString).fromNow();
    };
}).filter('years', function() {
    return function(dateString) {
        return moment().diff(moment(dateString), 'years');
    };
}).filter('months', function() {
    return function(dateFrom, dateTo) {
        var m = moment();
        if (dateTo) {
            m = moment(dateTo);
        }
        return m.diff(moment(dateFrom), 'months');
    };
}).filter('days', function() {
    return function(dateFrom, dateTo) {
        var m = moment();
        if (dateTo) {
            m = moment(dateTo);
        }
        return m.diff(moment(dateFrom), 'days');
    };
}).filter('monthsToYears', function() {
    return function(months) {
        if (months >= 12) {
            var res = Math.floor(months / 12) + ' y';
            if (months % 12 != 0) {
                res = res + ' ' + months % 12 + ' m';
            }
            return res;
        } else {
            return months + ' m';
        }
    };
}).filter(
    'daysToYears', [
        '$filter',
        function($filter) {
            return function(days) {
                if (days >= 365) {
                    var res = Math.floor(days / 365) + ' ' + $filter('translate')('generic.years');
                    if (days % 365 != 0) {
                        res = res + ' ' + days % 365 + ' ' + $filter('translate')('generic.days');;
                    }
                    return res;
                } else {
                    return days + ' ' + $filter('translate')('generic.days');;
                }
            };
        }
    ]).filter('mDate', function() {
    return function(dateString) {
        if (dateString) {
            return moment(dateString).format('ll');
        } else {
            return "";
        }
    };
}).filter('mDateTime', function() {
    return function(dateString) {
        if (dateString) {
            return moment(dateString).format('HH:mm DD.MM.YYYY');
        }
        return null;
    };
}).filter('mTime', function() {
    return function(dateString) {
        if (dateString) {
            return moment(dateString).format('HH:mm');
        }
        return null;
    };
}).filter('hourMinutes', ['$filter',
    function($filter) {
        return function(minutes) {
            var mins = minutes % 60;
            var hours = (minutes - mins) / 60;
            return hours + ":" + ((mins > 10) ? mins : "0" + mins);
        };
    }
]).filter('objectEval', function() {
    return function(v, path, join) {
        if (!path) {
            return [];
        }
        if (typeof path === 'function') {
            return path(v);
        }
        var result = [];
        var elems = path.split(' ');
        for (var i in elems) {
            var t = elems[i];
            var fields = t.split('.');
            var x = v;
            for (var j in fields) {
                if (typeof x === 'undefined') {
                    break;
                }
                x = x[fields[j]];
            }
            result.push(x);
        }
        if (join) {
            return result.join(" ").trim();
        } else {
            return result;
        }
    };
}).filter('serviceMethods', ['$injector',
    function($injector) {
        return function(path) {
            var result = [];
            var elems = path.split(' ');
            for (var i in elems) {
                var t = elems[i];
                var fields = t.split('.');

                var x = $injector.get(fields[0]);
                fields.shift();
                for (var j in fields) {
                    if (typeof x === 'undefined') {
                        break;
                    }
                    x = x[fields[j]];
                }
                result.push(x);
            }
            return result;
        };
    }
]).filter('employeeName', function() {
    return function(employee) {
        if (employee) {
            return employee.firstName + ' ' + employee.lastName;
        } else {
            return '';
        }

    };
}).filter('range', function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i = 0; i < total; i++)
            input.push(i);
        return input;
    };
}).filter('numberFixedLen', function() {
    return function(n, len) {
        var num = parseInt(n, 10);
        len = parseInt(len, 10);
        if (isNaN(num) || isNaN(len)) {
            return n;
        }
        num = '' + num;
        while (num.length < len) {
            num = '0' + num;
        }
        return num;
    };
}).filter('markdown', function() {
    return function(text) {
        if (typeof text == "undefined") {
            return "";
        }
        var converter = new Showdown.converter({
            extensions: ['github', 'prettify', 'table', 'twitter']
        });
        return converter.makeHtml(text);
    };
}).filter('marked', function() {
    return function(text, id) {
        if (typeof text == "undefined") {
            return "";
        }
        var m = marked;
        m.setOptions({
            renderer: new m.Renderer(),
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false
        });
        return m(text);
    };
}).filter('yesNo', function() {
    return function(choice) {
        if (typeof choice == "undefined") {
            return 'glyphicon glyphicon-question-sign';
        } else if (choice) {
            return 'glyphicon glyphicon-ok-sign';
        } else {
            return 'glyphicon glyphicon-remove-sign';
        }
    };
}).filter('jsonPrettify', function() {
    return function(obj) {
        function replacer(k, v) {
            if (typeof v !== "object" && typeof v !== "Array") {
                var res = typeof v;
                return res;
            } else {
                return v;
            }
        }
        return JSON.stringify(obj, replacer, '  ');
    };
});
