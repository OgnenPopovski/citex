Auction.controller('NavigationController', [
    '$scope',
    '$location',
    'Auth',
    function($scope, $location, Auth) {
        $scope.openLanguageMenu = false;
        $scope.openUserMenu = false;
        $scope.navWidth = 250;
        $scope.collapse = true;
        $scope.collapseMenu = function() {
            if ($scope.collapse) {
                $scope.navWidth = 80;
                $scope.collapse = false;
            } else {
                $scope.navWidth = 250;
                $scope.collapse = true;
            }
        }
        $scope.isActive = function(viewLocation) {
            var re = new RegExp(viewLocation);
            return re.test($location.path());
        };

        $scope.expands = {};
        Auth.getUser(function(user) {
            $scope.pageGroups = user.pageGroups;
            $scope.rolePages = user.rolePages;
        }, function() {
            var loginGroup = {
                icon: 'fa-user',
                label: 'auction.login',
                parent: null,
                weight: 1
            };
            var loginItem = {
                icon: 'fa-user',
                label: 'auction.login',
                group: loginGroup,
                weight: 2,
                url: '/login'
            };
            $scope.pageGroups = [loginGroup];
            $scope.rolePages = [loginItem];


        });
    }
]);
