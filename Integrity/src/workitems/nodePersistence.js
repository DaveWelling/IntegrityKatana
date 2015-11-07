(function(module) {
    module.service('nodePersistence', nodePersistence);

    function nodePersistence($http) {
        return {
            getNode: getNode,
            saveNode: saveNode
        }
        function getNode(id) {
            return $http.get("/api/workitems/" + id);
        }
        function saveNode(workitem) {
            return $http.post("/api/workitems/" + workitem.id, workitem);
        }
    }
})(angular.module('app'));