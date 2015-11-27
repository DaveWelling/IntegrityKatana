(function(module) {
	module.directive("treeChild", treeChildDirective);
	
	function treeChildDirective($compile, nodeMgmtService, $window, $timeout) {
		return {
			templateUrl: "/src/tree/treeChildTemplate.html",
			scope: {
				link:"="
			},
			controller: "treeChildController",
			link: function (scope, element, attributes, controller) {
				scope.addTree = function() { addTree(scope, element); };
			    //setUpDragAndDrop(scope, element);
				scope.focus = function (nodeToFocusOn) {
				    $timeout(function () {
				        var element = $window.document.getElementById("input" + nodeToFocusOn.id);
				        if (element)
				            element.focus();
				    });
			    };
			}	
		}
		function setUpDragAndDrop(scope, element) {
			var dragSrcDropZone = null;
		    var target = element.find(".draggable"); //element.children()[1].children[1];
			target.addEventListener('dragstart', handleDragStart, false);
			target.addEventListener('dragend', handleDragEnd, false);

			var dropZone = element.children(".dropZone")[0];
			dropZone.addEventListener('dragenter', handleDragEnter, false);
			dropZone.addEventListener('dragover', handleDragOver, false);
			dropZone.addEventListener('dragleave', handleDragLeave, false);
			dropZone.addEventListener('drop', handleDrop, false);

			function handleDragEnd(event) {
				target.style.opacity = '1';	  
			}

			function handleDrop(event) {
				if (event.stopPropagation) {
					event.stopPropagation(); // stops the browser from redirecting.
				}

				this.classList.remove('dropZoneActive');

				// Don't do anything if dropping the same column we're dragging.
				if (dragSrcDropZone !== this) {
					var destinationScope = angular.element(this).scope();
					nodeMgmtService.moveNode(scope, destinationScope);
				}


				return false;
			}
			function handleDragStart(event) {
				target.style.opacity = '0.4';

				// Get this node's drop zone so that
				// we don't just drop it back in the 
				// same one later.
				dragSrcDropZone = this.parentElement.parentElement.children[0];

				event.dataTransfer.effectAllowed = 'move';
			};
			function handleDragOver(event) {
				if (event.preventDefault) {
					event.preventDefault();
				}
				event.dataTransfer.dropEffect = 'move';

				return false;
			} 
			function handleDragEnter(e) {
				// this / e.target is the current hover target.
				this.classList.add('dropZoneActive');
			}
			function handleDragLeave(event) {
				this.classList.remove('dropZoneActive');
			}
		}
		function addTree(scope,element) {
			var newTree = angular.element("<tree-group node='link.node' class='tree' ng-hide='collapsed'></tree-group>");
			$compile(newTree)(scope);
			element.append(newTree);
		}
	}
	
	function touchHandler(event) {
		var touch = event.changedTouches[0];

		var simulatedEvent = document.createEvent("MouseEvent");
		simulatedEvent.initMouseEvent({
			touchstart: "mousedown",
			touchmove: "mousemove",
			touchend: "mouseup"
		}[event.type], true, true, window, 1,
        touch.screenX, touch.screenY,
        touch.clientX, touch.clientY, false,
        false, false, false, 0, null);

		touch.target.dispatchEvent(simulatedEvent);
		event.preventDefault();
	}
	document.addEventListener("touchstart", touchHandler, true);
	document.addEventListener("touchmove", touchHandler, true);
	document.addEventListener("touchend", touchHandler, true);
	document.addEventListener("touchcancel", touchHandler, true);
})(angular.module('tree'));