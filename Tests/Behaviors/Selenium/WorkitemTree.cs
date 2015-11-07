using OpenQA.Selenium;
using OpenQA.Selenium.Support.PageObjects;

namespace Behaviors.Selenium
{
	internal class WorkItemTree
	{
		private readonly SeleniumContext _context;

		public WorkItemTree(SeleniumContext context)
		{
			_context = context;
		}

		public bool Exists()
		{
			return _context.Driver.FindElement(By.Id("WorkItemTree")).Displayed;
		}
	}
}