var app = angular.module('demo-app', []);
app.controller('DemoController',
    ['$scope', '$rootScope', '$interval', '$timeout', '$q', '$http', '$log',
        function ($scope, $rootScope, $interval, $timeout, $q, $http, $log) {
            //$scope.user= {};
            $scope.user.name = "preetham"
            //$scope.user.age = 12;
            var defer = $q(function (resolve, reject) {
                $timeout(function () {
                    if ($scope.user.name != "preetham") {
                        reject("Name changed!")
                    } else {
                        resolve(++$scope.user.age);
                    }
                }, 5000)
            })

            defer.then(function success(data) {
                $scope.user.age = data;
                $log.log("user age updated!", $scope.user)
                console.debug("user age updated!", $scope.user);
            }, function failure(err) {
                $log.error(err);
            })

            $http.get('http://localhost:8090/user.json').then((user) => {
                $rootScope.user = user.data
            }, (err) => {
                console.error(err)
            })

            $scope.pasted = function ($event) {
                alert($event.target.value);
            }


        }])

app.controller('AliasController',
    ['$scope', '$rootScope', '$log', 'loggerProvider','consoleFactory',
        function ($scope, $rootScope, $log, loggerProvider,consoleFactory) {
            $scope.vm = this;
            var logger = loggerProvider;
            logger.debug("testing the debug mode")

            this.content = "this is the content rendered using controllerAs syntax"
            this.logger = function logger(val) {
                $log.log("logging from controller", val)
                return true;
            }

            logger = consoleFactory($log)
           // console.log(logger instanceof $log)
            var consoler = consoleFactory(window.console)
        }])

app.directive('banner', [function () {
    return {
        link: function (scope, ele) {
            return ele.text = "test"
        }
    }
}])

app.provider('loggerProvider', function () {
    this.loggingLevel = "info";
    this.$get = function () {
        logger = {};
        logger.log = (content) => console.log(content);
        if (this.loggingLevel == "info") {
            console.info("debugging disabled!")
            logger.debug = angular.noop;
        } else {
            console.log("debuggig enabled")
            logger.debug = (content) => console.debug(content);
        }
        return logger;
    }
})

function user_console(_console){
   Object.assign(this,_console);
}

app.factory('consoleFactory',function(){
    // used for custom object generation
    // this factory returns a logger based on input to this factory
    return function(_console){ return new user_console(_console)};
})

app.service('asycUserService',function(){
    
})

app.filter('log', function ($log) {
    return function (term) {
        $log.log("logging from filter", term);
        return term;
    }
})
app.run(['$rootScope', function ($rootScope) {
    $rootScope.user = {};
    $rootScope.user.gender = "M";
}])

app.config(['$httpProvider', 'loggerProviderProvider', function ($httpProvider, loggerProviderProvider) {
    $httpProvider.interceptors.push(httpInterceptor);
    loggerProviderProvider.loggingLevel = "info"


}])

function httpInterceptor($q) {
    return {
        request: (config) => {
            console.debug("httpConfig", config);
            var transformfer = config.transformResponse;
            config.transformResponse = requestTranformer(transformfer, function (val) {

                val.name = val.name.toUpperCase();
                console.log(val);
                return val;
            });
            return $q.resolve(config)
        },
        requestError: (config) => {
            console.error("error occurred while rquesting", config);
            return $q.reject("error occurred while requesting!")
        },
        response: (config) => {
            console.debug("reposne retireved suucessfully", config)
            return $q.resolve(config)
        },
        responseError: (config) => {
            console.debug("error", config);
            return $q.reject(config)
        }
    }

}

function requestTranformer(defaults, tranform) {
    defaults = angular.isArray(defaults) ? defaults : [defaults];
    return defaults.concat(tranform)

}
//angular.bootstrap(document,['demo-app'])

