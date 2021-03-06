(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('UtilService', ['$rootScope', '$mdToast', '$timeout', UtilService])

    function UtilService($rootScope, $mdToast, $timeout) {
        var service = {};

        service.untouchForm = untouchForm;
        service.truncate = truncate;
        service.handleSuccess = handleSuccess;
        service.handleError = handleError;
        service.isEmpty = isEmpty;
        service.settingsAsMap = settingsAsMap;
        service.reconnectWebsocket = reconnectWebsocket;
        service.websocketConnected = websocketConnected;

        return service;

        function untouchForm(form) {
        	form.$setPristine();
        	form.$setUntouched();
        }

        function truncate(fullStr, strLen) {
            if (fullStr == null || fullStr.length <= strLen) return fullStr;
            var separator = '...';
            var sepLen = separator.length,
                charsToShow = strLen - sepLen,
                frontChars = Math.ceil(charsToShow/2),
                backChars = Math.floor(charsToShow/2);
            return fullStr.substr(0, frontChars) +
                separator +
                fullStr.substr(fullStr.length - backChars);
        };

        function handleSuccess(res) {
            return { success: true, data: res.data };
        }

        function handleError(error) {
            return function (res) {
                if(res.status == 400 && res.data.validationErrors && res.data.validationErrors.length) {
                    error = res.data.validationErrors.map(function(validation) {
                        return validation.message;
                    }).join('\n');
                }
                return { success: false, message: error, error: res };
            };
        }

        function isEmpty(obj) {
        		return jQuery.isEmptyObject(obj);
        };

        function settingsAsMap(settings) {
            var map = {};
            if(settings)
                settings.forEach(function(setting) {
                    map[setting.name] = setting.value;
                });
            return map;
	    };

        // ************** Websockets **************

        function reconnectWebsocket(name, func) {
            if(! $rootScope.disconnectedWebsockets) {
                $rootScope.disconnectedWebsockets = {};
                $rootScope.disconnectedWebsockets.websockets = {};
                $rootScope.disconnectedWebsockets.toastOpened = false;
            }
            var attempt = $rootScope.disconnectedWebsockets.websockets[name] ? $rootScope.disconnectedWebsockets.websockets[name].attempt - 1 : 3;
            $rootScope.disconnectedWebsockets.websockets[name] = {function: func, attempt: attempt};
            reconnect(name);
        };

        function reconnect (name) {
            var websocket = $rootScope.disconnectedWebsockets.websockets[name];
            if(websocket.attempt > 0) {
                var delay = 5000;
                $timeout(function () {
                    tryToReconnect(name);
                }, delay);
            } else {
                if(! $rootScope.disconnectedWebsockets.toastOpened) {
                    $rootScope.disconnectedWebsockets.toastOpened = true;
                    showReconnectWebsocketToast();
                }
            }
        };

        function websocketConnected (name) {
            if($rootScope.disconnectedWebsockets && $rootScope.disconnectedWebsockets.websockets[name]) {
                delete $rootScope.disconnectedWebsockets.websockets[name];
            }
        };

        function tryToReconnect(name) {
            $rootScope.$applyAsync($rootScope.disconnectedWebsockets.websockets[name].function);
        };

        function showReconnectWebsocketToast() {
            $mdToast.show({
                hideDelay: 0,
                position: 'bottom right',
                scope: $rootScope,
                preserveScope: true,
                controller  : function ($rootScope, $mdToast) {
                    $rootScope.reconnect = function() {
                        angular.forEach($rootScope.disconnectedWebsockets.websockets, function (websocket, name) {
                            tryToReconnect(name);
                        });
                        $rootScope.closeToast();
                    };

                    $rootScope.closeToast = function() {
                        $rootScope.disconnectedWebsockets.toastOpened = false;
                        $mdToast
                            .hide()
                            .then(function() {
                            });
                    };
                },
                templateUrl : 'app/_testruns/websocket-reconnect_toast.html'
            });
        };
    }
})();
