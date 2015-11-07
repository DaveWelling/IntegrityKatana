(function (module) {
	module.directive("treeGroup", treeGroupDirective);

	function treeGroupDirective() {
		return {
			templateUrl: "/src/tree/treeGroupTemplate.html",
			scope: {
				node: "="
			}
		}
	}
})(angular.module("app"));