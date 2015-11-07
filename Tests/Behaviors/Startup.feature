Feature: Startup
	


Scenario: Starting screen has a workitem tree
	Given I am opening the application
	When it opens
	Then the workitem tree should be visible
