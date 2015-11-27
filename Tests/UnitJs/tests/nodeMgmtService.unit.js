// ReSharper disable UseOfImplicitGlobalInFunctionScope
// ReSharper disable InconsistentNaming
describe("nodeMgmtService", function () {
    var nodeMgmtService;
    var mockDefer;
    var $q;
    var $scope;
    beforeEach(function() {
        module("app", function ($provide) {
            var nodePersistenceMock = {
                saveNode: function (node) {
                    mockDefer.resolve(node);
                    return mockDefer.promise;
                }
            }
            $provide.value("nodePersistence", nodePersistenceMock);
        });

        inject(function(_nodeMgmtService_, _$q_, $rootScope) {
            nodeMgmtService = _nodeMgmtService_;
            $q = _$q_;
            $scope = $rootScope;
        });

        mockDefer = $q.defer();
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
            };;
        });
        it("should add new link with current sibling sequence + 1", function () {
            nodeMgmtService.addNewSiblingNode(currentLink, parentNode);
            $scope.$apply()
            expect(_.any(parentNode.links, function(link) {
                return link.sequence === 89;
            })).toBe(true);
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