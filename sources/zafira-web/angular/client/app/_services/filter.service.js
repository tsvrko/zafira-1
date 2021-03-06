(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('FilterService', ['$http', '$cookies', '$rootScope', 'UtilService', 'API_URL', FilterService])

    function FilterService($http, $cookies, $rootScope, UtilService, API_URL) {
        var service = {};

        service.createFilter = createFilter;
        service.getAllPublicFilters = getAllPublicFilters;
        service.updateFilter = updateFilter;
        service.deleteFilter = deleteFilter;
        service.getSubjectBuilder = getSubjectBuilder;

        return service;

        function createFilter(filter) {
            return $http.post(API_URL + '/api/filters', filter).then(UtilService.handleSuccess, UtilService.handleError('Unable to create filter'));
        }

        function getAllPublicFilters() {
            return $http.get(API_URL + '/api/filters/all/public').then(UtilService.handleSuccess, UtilService.handleError('Unable to get public filters'));
        }

        function updateFilter(filter) {
            return $http.put(API_URL + '/api/filters', filter).then(UtilService.handleSuccess, UtilService.handleError('Unable to update filter'));
        }

        function deleteFilter(id) {
            return $http.delete(API_URL + '/api/filters/' + id).then(UtilService.handleSuccess, UtilService.handleError('Unable to delete filter'));
        }

        function getSubjectBuilder(name) {
            return $http.get(API_URL + '/api/filters/' + name + '/builder').then(UtilService.handleSuccess, UtilService.handleError('Unable to get ' + name + ' builder'));
        }
    }
})();
