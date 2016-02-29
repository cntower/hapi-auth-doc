/*
angular.module('Product', [])

    .controller('mainController', function ($scope, $http) {

        $scope.formData = {};
        $scope.productData = {};

        // Get all product
        $http.get('/product')
            .success(function (data) {
                $scope.productData = data.data;
                console.log(data.data);
            })
            .error(function (error) {
                console.log('Error: ' + error);
            });

        // Create a new product
        $scope.createProduct = function() {
            $http.post('/product', $scope.formData)
                .success(function(data) {
                    $scope.formData = {};
                    $scope.productData = data;
                    console.log(data);
                })
                .error(function(error) {
                    console.log('Error: ' + error);
                });
        };
    });
*/

(function() {
    var app = angular.module('productStore', [])
        .run(function($rootScope) {
        $rootScope.logined = false;
    });
    app.config(function($interpolateProvider) {
        $interpolateProvider.startSymbol('{[{');
        $interpolateProvider.endSymbol('}]}');
    });
    app.controller('StoreController',['$rootScope', '$http', function($rootScope, $http){

        var store = this;
        store.products = [];
        var scope = $rootScope;
        scope.$watch('logined', function(newValue, oldValue) {
            if($rootScope.logined){
                $http.get('/product').success(function(data){
                    store.products = data.data;
                    console.log(store.products);
                }).error(function (error) {
                    console.log('Error: ' + error);
                });
            }
        });

    }]);
    app.controller('PanelController', function(){
        this.tab=1;
        this.selectTab = function(tab){
            this.tab = tab;
        }
        this.isSel = function(tab){
            return this.tab === tab;
        }
    });
    app.controller('RegController',['$http', function($http) {
        var regCtrl = this;
        regCtrl.user = {};

        this.addUser = function(user) {
            $http({method: "POST", url: '/register', data: user}).
            then(function(response) {
                console.log(response.status);
                console.log(response.data);
            }, function(response) {
                console.log(response.data || "Request failed");
                console.log(response.status);
            });
        };
    }]);
    app.controller('LoginController',['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
        var logCtrl = this;
        logCtrl.user = {};
        this.getCheckLogin = function(user) {
            $http({method: "POST", url: '/login', data: user}).
            then(function(response) {
                $rootScope.logined = true;
                console.log(response.status);
                console.log(response.data);
            }, function(response) {
                $rootScope.logined = false;
                console.log(response.data || "Request failed");
                console.log(response.status);
            });

        };
    }]);
    app.controller('LogoutController',['$rootScope', '$scope','$http', function($rootScope, $scope, $http) {
        this.logout = function() {
            $http({method: "GET", url: '/logout'}).
            then(function(response) {
                $rootScope.logined = false;
                console.log(response.status);
                console.log(response.data);
            }, function(response) {
                console.log(response.data || "Request failed");
                console.log(response.status);
            });

        };
    }]);
    app.controller('ProductController',['$http', function($http) {
        var prodCtrl = this;
        prodCtrl.user = {};

        this.addProduct = function(product) {
            $http({method: "POST", url: '/product', data: product}).
            then(function(response) {
                console.log(response.status);
                console.log(response.data);
            }, function(response) {
                console.log(response.data || "Request failed");
                console.log(response.status);
            });
        };
    }]);


})();
