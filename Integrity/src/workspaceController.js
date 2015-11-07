

(function (module) {
	module.controller("workspaceController", workspaceController);
	function workspaceController(nodeMgmtService) {
		var model = this;
	    nodeMgmtService.getRoot().then(function(result) {
	        model.workitem = result;
	        angular.forEach(result.links, function(link) {
	            nodeMgmtService.getNode(link.id).then(function(childResult) {
	                link.node = childResult;
	            });
	        });
	    });

	}
})(angular.module('app'));