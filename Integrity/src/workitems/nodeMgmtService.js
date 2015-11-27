(function(module) {
    module.service('nodeMgmtService', nodeMgmtService);

    function nodeMgmtService(defaultRoot, nodePersistence, ObjectId, $q) {

        var service = {
            getRoot: getRoot,
            getNode: getNode,
            saveNode: saveNode,
			removeNode: removeNode,
            addNewChildToNode: addNewChildToNode,
            addNewSiblingNode: addNewSiblingNode
        }

		function removeNode(){
			throw "Not implemented";
		}

        function addNewSiblingNode(currentLink, parentNode) {
            var newSequence = currentLink.sequence + 1;
            return service.addNewChildToNode(parentNode, newSequence);
        }

        function addNewChildToNode(parentNode, newSequence) {
            newSequence  = newSequence || parentNode.links.length
            var newNode = {
                id: (new ObjectId).toString(),
                title: "",
                description: "",
                links: []
            }
            parentNode.links = parentNode.links || [];
            parentNode.links.push({
                id: newNode.id,
                sequence: newSequence,
                node: newNode
            });
            for (var i = 0; i < parentNode.links.length; i++) {
                var link = parentNode.links[i];
                if (link.sequence >= newSequence && link.id != newNode.id) {
                    link.sequence++;
                }
            }
            return $q.all([
                service.saveNode(newNode),
                service.saveNode(parentNode)
            ]).then(function(results) {
                return results[0]; // return the new node only;
            });
	}
        function getRoot() {
            return nodePersistence.getNode(defaultRoot)
                .then(function(root) {
                    return root.data;
                }).catch(function (err) {
                    if (err.status === 404) {
                        return createRoot();
                    }
                    throw err;
                });
        }
        function getNode(id) {
            return nodePersistence.getNode(id).then(function(result) {
                return result.data;
            });
        }
        function saveNode(node) {
            if (!node.createdTime) {
                node.createdTime = new Date().getTime();
            }
            node.modifiedTime = new Date().getTime();;
            var shallowClone = _.clone(node);
            shallowClone.links = [];
            for (var i = 0; i < node.links.length; i++) {
                shallowClone.links.push({
                    id: node.links[i].id,
                    sequence: node.links[i].sequence
                });
            }
            return nodePersistence.saveNode(shallowClone).then(function() {
                return node;
            });
        }
        function createRoot() {
            var newNode = {
                id: defaultRoot,
                title: "Root",
                description: "",
                links: [],
                createdTime: new Date().getTime(),
                modifiedTime : new Date().getTime()
            }
            return nodePersistence.saveNode(newNode).then(function() {
                return newNode;
            });
        }

	    return service;
	}
})(angular.module('app'));