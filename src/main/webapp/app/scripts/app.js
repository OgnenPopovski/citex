'use strict';

/**
 * @ngdoc Definition of the application module. The first argument is the name
 *        of the module. It is used in the ng-app directive to expose the
 *        angular components that can be used. The second argument is an array
 *        that defines the dependencies (modules) that are used by the
 *        application. In this case we are only use the ngRoute module as a
 *        dependency in order to provide partial content inclusion through the
 *        routes
 * @see router.js for more information
 * @name avAngularStartupApp - the name of the module used in the ng-app
 *       directive
 * @description # avAngularStartupApp Main module of the application.
 */
var Auction = angular.module('eAuction', ['ngResource', 'ngRoute',
    'ngAnimate', 'ngTable', 'ngTableExport', 'ngCookies',
    'chieffancypants.loadingBar', 'ui.bootstrap', 'ui.select2',
    'mgcrea.ngStrap', 'toaster', 'angularFileUpload',
    'pascalprecht.translate', 'ngQuickDate', 'ui.calendar'
]);

Auction.config([
    '$translateProvider',
    '$httpProvider',
    'settings',
    'ngQuickDateDefaultsProvider',
    function($translateProvider, $httpProvider, settings,
        ngQuickDateDefaultsProvider) {

        ngQuickDateDefaultsProvider.set({
            closeButtonHtml: "<i class='fa fa-times'></i>",
            buttonIconHtml: "<i class='fa fa-clock-o'></i>",
            nextLinkHtml: "<i class='fa fa-chevron-right'></i>",
            prevLinkHtml: "<i class='fa fa-chevron-left'></i>",
            // Take advantage of moment for date parsing
            parseDateFunction: function(str) {
                if (str == null) return moment().toDate();
                return moment(str, ['DD-MM', 'DD-MM-YY', 'DD-MM-YYYY', 'DD-MM-YYYY HH:mm'])
                    .toDate();
            }
        });
        // Initialize angular-translate
        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/',
            suffix: '.json'
        });

        $translateProvider.preferredLanguage(settings.language)
;
        $translateProvider.useCookieStorage();
        $httpProvider.interceptors.push('HRHttpInterceptors');

        Date.prototype.toJSON = function() {
            return moment(this).format('YYYY-MM-DD HH:mm');
        };
    }
]);
