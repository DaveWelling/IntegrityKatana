(function(module) {
    module.service('nodeKeyboardActions', nodeKeyboardActions);


    var keystrokes = {
        enter: 13,
        tab: 0,
        shiftTab: 0,
        upArrow: 0,
        downArrow: 0
    }

    function nodeKeyboardActions(nodeMgmtService) {
        return {
            keypress: keypress
        }
        function keypress($scope, keyEvent) {
            switch (keyEvent.which) {
                case keystrokes.enter:
                    keyEvent.preventDefault();
                    if ($scope.link.node.title && $scope.link.node.title.length > 0) {
                        nodeMgmtService.saveNode($scope.link.node);
                        nodeMgmtService.addNewSiblingNode($scope.link, $scope.$parent.$parent.node)
                            .then(function(newNode) {
                                $scope.focus(newNode);
                            });
                    } else {
                        nodeMgmtService.removeNode($scope.link.node);
                    }
                    break;
            default:
            }
            
        }

    }
})(angular.module('app'));