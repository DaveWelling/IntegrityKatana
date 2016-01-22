// ReSharper disable UseOfImplicitGlobalInFunctionScope
// ReSharper disable InconsistentNaming
describe("nodeMgmtService", function () {
    var nodeMgmtService;
    var saveDeferMock;
	var removeDeferMock;
    var $q;
    var $scope;
    var nodePersistenceMock;
    var expectationsCalled;
    beforeAll(function() {
		// Monkey patch expect so that we can tell if an expectation
		// inside a promise was overlooked because the promise
		// did not resolve.
		var originalExpect = window.expect;
        window.expect = function(expectation) {
            expectationsCalled++;
            return originalExpect.call(this, expectation);
        }
    });
    beforeEach(function () {
        expectationsCalled = 0;
        module("app", function ($provide) {
            nodePersistenceMock = {
                saveNode: sinon.stub(),
                removeNode: sinon.stub(),

            };
            $provide.value("nodePersistence", nodePersistenceMock);
        });

        inject(function(_nodeMgmtService_, _$q_, $rootScope) {
            nodeMgmtService = _nodeMgmtService_;
            $q = _$q_;
            $scope = $rootScope;
        });

        saveDeferMock = $q.defer();
		removeDeferMock = $q.defer();
        nodePersistenceMock.saveNode.returns(saveDeferMock.promise);
        nodePersistenceMock.removeNode.returns(removeDeferMock.promise);
		// saveNode persistence promise resolved with input argument node;
		saveDeferMock.resolve(nodePersistenceMock.saveNode.args[0]);
		removeDeferMock.resolve();
    });
    afterEach(function() {
        if (expectationsCalled === 0) {
            throw new Error("An expect was not called.");
        }
    });
    
    describe("addNewChildToNode", function () {
        var currentLink;
        var parentNode;
        beforeEach(function () {
            currentLink = {
                node: { title: "child1" },
                sequence: 88
            };
            parentNode = {
				id: 2,
                title: "parent",
                links: [
                ]
            };
        });
        it("should add a parent link to new child", function() {
            var promise = nodeMgmtService.addNewChildToNode(parentNode);
            promise.then(function(newNode) {
                expect(newNode.links[0].linkType).toBe("parent");
            });
			$scope.$digest();
        });
        it("should add a new child link to parent", function() {
			var promise = nodeMgmtService.addNewChildToNode(parentNode);
			promise.then(function(newNode) {
				var found = _.any(parentNode.links, function(link){
					return link.id === newNode.id
					&& link.linkType === "child";
				});
				expect(found).toBe(true);
			});
			$scope.$digest();
        });
    });   
    fdescribe("removeNode", function () {
        var linkToRemove;
        var parentNode;
		var secondParentNode;
        beforeEach(function () {
            var id = 1;
			var secondChildId = 2;
			var parentId = 0;
			var secondParentId = 3;
            linkToRemove = {
                id: id,
                node: { id: id, title: "child1", links:[ {
					id: parentId,
					linkType: "parent"
				}] },
                sequence: 88,
                linkType: "child"
            };
			var secondChildLink = {
				id: secondChildId,
				node: { id: secondChildId, title: "child2", links:[
					{
						id: parentId,
						linkType: "parent"
					},
					{
						id: secondParentId,
						linkType: "parent"
					}
				] },
				sequence: 88,
				linkType: "child"
			};
            parentNode = {
				id: parentId,
                title: "parent",
                links: [
                    linkToRemove,
					secondChildLink
                ]
            };
			secondParentNode  = {
				id: secondParentId,
				title: "parent",
				links: [
					linkToRemove
				]
			};

            nodeMgmtService.initNodes([linkToRemove.node, secondChildLink.node, parentNode]);
        });
        it("should remove the given node from its parent", function() {
			nodeMgmtService.removeNode(linkToRemove.node).then(function() {
				expect(_.any(parentNode.links, function(link){
					return link.id === linkToRemove.id;
				})).toBe(false);
				expect(nodePersistenceMock.saveNode.calledWith(parentNode)).toBe(true);
			});
			$scope.$apply();
        });
        it("should remove the given node from multiple parents if they exist", function() {

            nodeMgmtService.initNodes([secondChildLink.node, parentNode]);

        });
        it("should remove children that do not have other parents", function() {
            throw new Error("Not implemented");
            
        });
        it("should remove self from children that have other parents", function() {
            throw new Error("Not implemented");
            
        });
        it("should call remove of nodePersistence", function() {
            nodeMgmtService.removeNode(linkToRemove.node).then(function() {
                expect(nodePersistenceMock.removeNode.calledOnce)
                    .toBe(true);
            });
            $scope.$apply();
        });
    });   
    describe("addNewSiblingNode", function () {
        var currentLink;
        var parentNode;
        beforeEach(function() {
            currentLink = {
                node: { title: "child1" },
                sequence: 88
            };
            parentNode = {
                title: "parent",
                links: [
                    currentLink
                ]
            };
        });
        it("should add new link with current sibling sequence + 1", function () {
            nodeMgmtService.addNewSiblingNode(currentLink, parentNode);
            expect(_.any(parentNode.links, function(link) {
                return link.sequence === 89;
            })).toBe(true);
			$scope.$apply();
        });
        it("should sequence a new sibling directly after current sibling even when other siblingss follow", function () {
            parentNode.links.push({
                node: { title: "child2" },
                sequence: 89
            });
            nodeMgmtService.addNewSiblingNode(currentLink, parentNode);

            var newLink = _.find(parentNode.links, function(link) {
                return (link.node.title === "");
            });
            expect(newLink.sequence).toBe(89);

            var oldLink = _.find(parentNode.links, function(link) {
                return (link.node.title === "child2");
            });
            expect(oldLink.sequence).toBe(90);
            
        });
    });
});
// ReSharper restore UseOfImplicitGlobalInFunctionScope
// ReSharper restore InconsistentNaming