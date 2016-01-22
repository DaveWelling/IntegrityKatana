(function(module) {
    module.service('nodeMgmtService', nodeMgmtService);

    function nodeMgmtService(defaultRootId, nodePersistence, ObjectId, $q) {

        var nodeHash = {};
        var service = {
            getRoot: getRoot,
            getNode: getNode,
            saveNode: saveNode,
			removeNode: removeNode,
            addNewChildToNode: addNewChildToNode,
            addNewSiblingNode: addNewSiblingNode,
            initNodes: initNodes
        }

        function initNodes(startingNodes) {
            _.forEach(startingNodes, function(node) {
                nodeHash[node.id] = node;
            });
        }


        function removeNode(nodeToRemove) {
            var parentNodes = getParentsFromNode(nodeToRemove);
            _.forEach(parentNodes, function (parentNode) {
                var childLink = _.find(parentNode.links, function(link) {
                    return link.id === nodeToRemove.id && link.linkType === "child";
                });
                parentNode.links.pop(childLink);
                nodePersistence.saveNode(parentNode);
            });
		    return nodePersistence.removeNode(nodeToRemove);
        }

        function getParentsFromNode(childNode) {
            var parentLinks = _.where(childNode.links, { linkType: "parent" });
            var parentNodes = [];
            _.forEach(parentLinks, function (link) {
                parentNodes.push(nodeHash[link.id]);
            });
            return parentNodes;
        }

        function addNewSiblingNode(currentLink, parentNode) {
            var newSequence = currentLink.sequence + 1;
            return service.addNewChildToNode(parentNode, newSequence);
        }

        function addNewChildToNode(parentNode, newSequence) {
            newSequence = newSequence || parentNode.links.length;
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
                node: newNode,
                linkType: "child"
            });
            newNode.links.push({
                id: parentNode.id,
                sequence: parentNode.links.length,
                linkType: "parent"
            });
            for (var i = 0; i < parentNode.links.length; i++) {
                var link = parentNode.links[i];
                if (link.sequence >= newSequence && link.id !== newNode.id) {
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
            return nodePersistence.getNode(defaultRootId)
                .then(function (root) {
                    nodeHash[defaultRootId] = root.data;
                    return root.data;
                }).catch(function (err) {
                    if (err.status === 404) {
                        return createRoot();
                    }
                    throw err;
                });
        }
        function getNode(id) {
            return nodePersistence.getNode(id).then(function (result) {
                nodeHash[id] = result.data;
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
                id: defaultRootId,
                title: "Root",
                description: "",
                links: [],
                createdTime: new Date().getTime(),
                modifiedTime : new Date().getTime()
            }
            nodeHash[defaultRootId] = newNode;
            return nodePersistence.saveNode(newNode).then(function() {
                return newNode;
            });
        }

	    return service;
	}
})(angular.module('app'));