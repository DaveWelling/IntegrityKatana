(function(module) {
    module.service('nodePersistence', nodePersistence);

    function nodePersistence($http) {
        return {
            getNode: getNode,
            saveNode: saveNode,
            removeNode: removeNode
        }
        function getNode(id) {
            return $http.get("/api/workitems/" + id);
        }
        function saveNode(workitem) {
            return $http.post("/api/workitems/" + workitem.id, workitem);
        }
        function removeNode(nodeToRemove) {
            throw new Error("Not implemented.");
        }
    }
})(angular.module('app'));