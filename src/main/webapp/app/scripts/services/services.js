Auction.factory('Attachment', ['$resource', function($resource) {
    return $resource('/object/:id', {}, {
        'getAttachmentsByObjectId': {
            method: 'GET',
            isArray: true,
            url: "/data/rest/attachments/:bean/:id"
        },
        'deleteAttachment': {
            method: 'DELETE',
            url: "/data/rest/attachments/:id"
        }
    });
}]);


Auction.factory('ExternalFunctionsResolver', ['ExternalFunctions',
    function(ExternalFunctions) {
        return {
            get: function(method) {
                if (typeof ExternalFunctions[method] === 'function') {
                    return ExternalFunctions[method];
                } else {
                    return method;
                }
            }
        };
    }
]);

Auction.factory('ExternalFunctions', ['$resource', '$filter',
    function($resource, $filter) {
        return {
            groupByTypeName: function(item) {
                return item.type.name;
            },
            groupByGroupName: function(item) {
                if (item.group) {
                    return item.group.name;
                } else {
                    return $filter("translate")('generic.no_group');
                }
            },
            groupByGroupLabel: function(item) {
                if (item.group) {
                    return $filter("translate")(item.group.label);
                } else {
                    return $filter("translate")('generic.no_group');
                }
            },
            groupByAbsenceType: function(item) {
                return item.absenceType.name;
            }
        };
    }
]);
