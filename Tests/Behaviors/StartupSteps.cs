using System;
using Behaviors.Selenium;
using NUnit.Framework;
using TechTalk.SpecFlow;

namespace Behaviors
{
	[Binding, Scope(Feature = "Startup")]
	public class StartupSteps : BaseSeleniumTest
	{
		[Given(@"I am opening the application")]
		public void GivenIAmOpeningTheApplication()
		{
			// nothing required here
		}

		[When(@"it opens")]
		public void WhenItOpens()
		{
			// nothing required here
		}

		[Then(@"the workitem tree should be visible")]
		public void ThenTheWorkitemTreeShouldBeVisible()
		{
			Context.Workspace.WorkItemTree.Exists();
		}
	}
}
