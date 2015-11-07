(function(module) {
	module. service('nodeMgmtService', nodeMgmtService);

	function nodeMgmtService(defaultRoot, nodePersistence, ObjectId) {
	    
	    return {
		    getRoot: getRoot,
		    getNode: getNode,
		    saveNode: saveNode,
            addNewChildToNode: addNewChild
	    }

	    function addNewChild(parentNode) {
            var newNode = {
                id: (new ObjectId).toString(),
                title: "new Node",
                description: "",
                links: []
            }
            parentNode.links = parentNode.links || [];
            parentNode.links.push({
                id: newNode.id,
                node: newNode
            });
            nodePersistence.saveNode(newNode);
            nodePersistence.saveNode(parentNode);
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
                shallowClone.links.push({ id: node.links[i].id });
            }
            return nodePersistence.saveNode(shallowClone);
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
        
	}
})(angular.module('app'));