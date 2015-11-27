(function () {
    angular.module("tree", []);
	var module = angular.module("app", ["ui.router", "tree"]);
	module.config(function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise("/workspace");
		$stateProvider
			.state("workspace", { url: "/workspace", templateUrl: "src/templates/workspace.html" });
		//    .state("overall", { parent: "dashboard", url: "/overall", templateUrl: "templates/overall.html" })
		//    .state("customers", { parent: "dashboard", url: "/customers", templateUrl: "templates/customers.html" })
		//    .state("injuries", { parent: "dashboard", url: "/injuries", templateUrl: "templates/injuries.html" })
		//    .state("costs", { parent: "dashboard", url: "/costs", templateUrl: "templates/costs.html" })
		//.state("admin", { url: "/admin", templateUrl: "templates/admin.html" });
	});
	module.constant("defaultRoot", "563d154bb10aed3128486786");
})();