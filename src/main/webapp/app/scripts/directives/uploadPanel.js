Auction.directive('uploadPanel', [
    "$upload",
    "Attachment",
    "toaster",
    '$modal',
    '$filter',
    function($upload, Attachment, toaster, $modal, $filter) {
        return {
            restrict: 'E',
            transclude: false,
            scope: {
                objectId: "=",
                bean: "@",
                label: "@"
            },
            templateUrl: 'templates/upload.html',
            link: function(scope, element, attrs, ctrl, transclude, formCtrl) {
                /*
                 * scope.$watch("objectId", function(oldVal, newVal) { if (newVal ||
                 * scope.objectId) { var x = newVal || scope.objectId;
                 * scope.attachments = Attachment.getAttachmentsByObjectId({ id: x,
                 * bean: scope.bean }); } });
                 */
                if (scope.objectId) {
                    scope.attachments = Attachment.getAttachmentsByObjectId({
                        id: scope.objectId,
                        bean: scope.bean
                    });
                }

                var modalDeleteAttachment = $modal({
                    scope: scope,
                    template: '/templates/modal-form-notitle.tpl.html',
                    contentTemplate: '/templates/delete-attachment.html',
                    show: false
                });

                scope.deleteAttachmentDialog = function(id) {
                    scope.attachmentId = id;
                    modalDeleteAttachment.show();
                };

                scope.deleteAttachment = function(id) {
                    Attachment.deleteAttachment({
                        id: scope.attachmentId
                    }, function() {
                        scope.attachments = Attachment.getAttachmentsByObjectId({
                            id: scope.objectId,
                            bean: scope.bean
                        });
                        modalDeleteAttachment.hide();
                    });
                };

                scope.onFileSelect = function($files) {

                    function onSuccess(data, status, headers, config) {
                        toaster.pop('success', $filter('translate')('generic.success'),
                            $filter('translate')('action.saved'));
                        scope.attachments = Attachment.getAttachmentsByObjectId({
                            id: scope.objectId,
                            bean: scope.bean
                        });
                    }

                    function onError(data, status, headers, config) {
                        toaster.pop('error', $filter('translate')('generic.error'),
                            $filter('translate')('Upload failed'));
                    }

                    for (var i = 0; i < $files.length; i++) {
                        var file = $files[i];
                        scope.upload = $upload.upload({
                            url: "/data/rest/attachments/" + scope.bean + "/" + scope.objectId,
                            data: {
                                id: scope.objectId,
                                bean: scope.bean
                            },
                            file: file
                        }).success(onSuccess).error(onError);

                    }
                };
            }
        };
    }
]);
