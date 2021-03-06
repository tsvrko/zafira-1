(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('ProjectService', ['$http', '$cookies', '$rootScope', 'UtilService', 'API_URL', ProjectService])

    function ProjectService($http, $cookies, $rootScope, UtilService, API_URL) {
        var service = {};

        service.createProject = createProject;
        service.deleteProject = deleteProject;
        service.updateProject = updateProject;
        service.getAllProjects = getAllProjects;

        return service;

        function createProject(project) {
            return $http.post(API_URL + '/api/projects', project).then(UtilService.handleSuccess, UtilService.handleError('Unable to create project'));
        }

        function deleteProject(id) {
            return $http.delete(API_URL + '/api/projects/' + id).then(UtilService.handleSuccess, UtilService.handleError('Unable to delete project'));
        }

        function updateProject(project) {
            return $http.put(API_URL + '/api/projects', project).then(UtilService.handleSuccess, UtilService.handleError('Unable to update project'));
        }
        function getAllProjects() {
            return $http.get(API_URL + '/api/projects').then(UtilService.handleSuccess, UtilService.handleError('Unable to get projects list'));
        }
    }
})();
