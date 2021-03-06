﻿(function(module) {
    module.controller('treeChildController', treeChildController);

    function treeChildController($scope, nodeMgmtService, nodeKeyboardActions, $document) {
        $scope.collapsed = true;
        $scope.hasBeenExpanded = false;
        $scope.hasChildren = function () {
            return $scope.link.node && $scope.link.node.links && $scope.link.node.links.length > 0;
        }
        $scope.workItemTextChange = function () {
            nodeMgmtService.saveNode($scope.link.node);
        }
        $scope.addChild = function () {
            nodeMgmtService.addNewChildToNode($scope.link.node);
            if (!$scope.hasBeenExpanded) {
                $scope.addTree(); // Dom manipulation is in the directive.
                $scope.hasBeenExpanded = true;
            }
            $scope.collapsed = false;
        }
        $scope.toggleNodeExpansion = function () {
            $scope.collapsed = !$scope.collapsed;
            if (!$scope.collapsed && !$scope.hasBeenExpanded) {

                $scope.addTree(); // Dom manipulation is in the directive.
                $scope.hasBeenExpanded = true;
            }
        }
        $scope.titleKeyPress = function (keyEvent) {
            nodeKeyboardActions.keypress($scope, keyEvent);
        };
        // If this link is a new link, the app will have given it
        // a node.  Otherwise, get the node using the ID.
        if (!$scope.link.node) {
            nodeMgmtService.getNode($scope.link.id).then(function(result) {
                $scope.link.node = result;
            });
        }
		$scope.focus = function(nodeToFocus){
		    var nodeElement = angular.element($document[0].querySelector('#input' + nodeToFocus.id));
		    nodeElement.focus();
		};
    }
})(angular.module('app'));