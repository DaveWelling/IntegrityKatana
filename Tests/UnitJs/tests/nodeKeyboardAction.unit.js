describe("nodeKeyboardAction", function () {
    var nodeMgmtServiceStub;
    var treeChildController;
    var controllerScope;
    var parentScope;
    var angularInput;
    var $q;
    var $document;

    var condition = {
        endOfLine: function endOfLine(input) {
            setCaretPosition(input, 0);
        },
        beginningOfLine: function beginningOfLine(input) {
            setCaretPosition(input, 999);
        },
        lineHasText: function lineHasText(input) {
			controllerScope.link.node.title = "xxxxx";
        },
        lineHasNoText: function lineHasNoText(input) {
			controllerScope.link.node.title = "";
		},
        previousSiblingExists: function previousSiblingExists(input) {
            parentScope.links = [
                {
                    title: "previousSibling"
                },
                controllerScope.link
            ];
        }
    };

    var keystrokes = {
        enter: 13,
        tab: 0,
        shiftTab: 0,
        upArrow: 0,
        downArrow: 0
    }

    var actions = {
        newSiblingNode: function newSiblingNode() {
            expect(nodeMgmtServiceStub.addNewSiblingNode.calledOnce).toBe(true);
        },
        promoteNode: function promoteNode() {
            expect(nodeMgmtServiceStub.promoteNode.calledOnce).toBe(true);
        },
        demoteNode: function demoteNode() {
            expect(nodeMgmtServiceStub.demoteNode.calledOnce).toBe(true);
        },
        removeNode: function removeNode() {
			expect(nodeMgmtServiceStub.removeNode.calledOnce).toBe(true);
		},
        focusOnPrevious: function focusOnPrevious() {
            var focused = $document[0].activeElement;
        },
        focusOnNext: function focusOnNext() {
            throw "Not implemented";
        }
    };


    // Structure tests using meta data
	var tests =
		[{
			conditions: [condition.lineHasText, condition.endOfLine],
			keystroke: keystrokes.enter,
			action: [actions.newSiblingNode, actions.focusOnNext]
		}, {
			conditions: [condition.lineHasNoText, condition.previousSiblingExists],
			keystroke: keystrokes.enter,
			action: [actions.removeNode, actions.focusOnPrevious]
		}];



	beforeEach(function() {
        module("app", function($provide) {
            nodeMgmtServiceStub = {
                getRoot: sinon.stub(),
                getNode: sinon.stub(),
                saveNode: sinon.stub(),
				removeNode: sinon.stub(),
                addNewChildToNode: sinon.stub(),
                addNewSiblingNode: sinon.stub()
            }
            $provide.value("nodeMgmtService", nodeMgmtServiceStub);
        });
        inject(function ($controller, $rootScope, $compile, _$q_, _$document_) {
            parentScope = $rootScope.$new();
            controllerScope = parentScope.$new();
			controllerScope.link = {node:{}};
            treeChildController = $controller("treeChildController", {$scope: controllerScope});
            angularInput = angular.element("<input type='text' ng-model='link.node.title' ng-keypress='titleKeyPress($event)'>");
            $compile(angularInput)(controllerScope);
            $q = _$q_;
            $document = _$document_;
        });
        var addNewSiblingNodeDefer = $q.defer();
		nodeMgmtServiceStub.addNewSiblingNode.returns(addNewSiblingNodeDefer.promise);
        addNewSiblingNodeDefer.resolve({});
	});

    // Run each test
	_.forEach(tests, function (test) {
    	it(getTestName(test), function () {
            var input = getTextInput();

            // apply conditions to input
            _.forEach(test.conditions, function (applyCondition) {
                applyCondition(input);
            });

            sendKeyStroke(input, test.keystroke);

            _.forEach(test.action, function(testActionOccurred) {
                testActionOccurred();
            });
        });
	});

    function getTestName(test) {
        var testName = "given ";
        for (var i = 0; i < test.conditions.length; i++) {
            if (i !== 0) {
                testName += " and ";
            }
            testName += functionName(test.conditions[i]);
        }
        testName += (" | when key: " + propertyName(keystrokes, test.keystroke));
        testName += (" | then ");
        for (var j = 0; j < test.action.length; j++) {
            if (j !== 0) {
                testName += " and ";
            }
            testName += functionName(test.action[j]);
        }
        return testName;
    }
    function propertyName(object, propertyValue) {
        for (var name in object ) {
            if (object.hasOwnProperty(name))
                if (object[name] === propertyValue) return name;
        }
        return "unknown name";
    }
	function functionName(fun) {
	    var ret = fun.toString();
	    ret = ret.substr('function '.length);
	    ret = ret.substr(0, ret.indexOf('('));
	    return ret;
	}

    // HELPERS

    function sendKeyStroke(input, keystroke){
        var press = $.Event("keypress");
        press.bubbles = true;
        press.cancelable = true;
        press.charCode = keystroke;
        press.currentTarget = input;
        press.eventPhase = 2;
        press.keyCode = keystroke;
        press.returnValue = true;
        press.srcElement = input;
        press.target = input;
        press.type = "keypress";
        press.view = Window;
        press.which = keystroke;

        $(input).trigger(press);
    }

    function getTextInput() {
        return angularInput[0];
    };

    function setCaretPosition(elem, caretPos) {
        if (elem != null) {
            if (elem.createTextRange) {
                var range = elem.createTextRange();
                range.move('character', caretPos);
                range.select();
            }
            else {
                if (elem.selectionStart) {
                    elem.focus();
                    elem.setSelectionRange(caretPos, caretPos);
                }
                else
                    elem.focus();
            }
        }
    }
});