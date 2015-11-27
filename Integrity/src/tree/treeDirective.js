(function(module) {
	module.directive("tree", treeDirective);

	function treeDirective(nodeMgmtService) {
		return {
			templateUrl: "/src/tree/treeTemplate.html",
			scope: {
				node:"="	
			},
			link: linkTree
		}
		function linkTree(scope, element, attributes) {
		    scope.addNewChild = function () {
		        nodeMgmtService.addNewChildToNode(scope.node);
            }
			//var dragClone;
			//interact('.draggable').draggable({
			//	inertia: true,
			//	restrict: {
			//		restriction: ".treeBoundary",
			//		endOnly: true,
			//		elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
			//	},
			//	onmove: dragMoveListener,
			//	onend: dragEnd
			//}).on('dragstart', dragStart);
			//function dragStart(event) {
			//	var target = event.target;
			//	dragClone = target.cloneNode(true);
			//	element.children()[0].appendChild(dragClone);
			//	x = (parseFloat(target.getAttribute('data-x')) || 0) + event.x0,
			//	y = (parseFloat(target.getAttribute('data-y')) || 0) + event.y0;

			//	// translate the element
			//	dragClone.style.webkitTransform =
			//	dragClone.style.transform =
			//		'translate(' + x + 'px, ' + y + 'px)';
			//	// update the posiion attributes
			//	dragClone.setAttribute('data-x', x);
			//	dragClone.setAttribute('data-y', y);
			//}
			//function dragMoveListener(event) {
			//	// keep the dragged position in the data-x/data-y attributes
			//	x = (parseFloat(dragClone.getAttribute('data-x')) || 0) + event.dx,
			//	y = (parseFloat(dragClone.getAttribute('data-y')) || 0) + event.dy;

			//	// translate the element
			//	dragClone.style.webkitTransform =
			//	dragClone.style.transform =
			//		'translate(' + x + 'px, ' + y + 'px)';

			//	// update the posiion attributes
			//	dragClone.setAttribute('data-x', x);
			//	dragClone.setAttribute('data-y', y);
			//}
			//function dragEnd(event) {
				
			//}
		}
	}
})(angular.module("tree"));