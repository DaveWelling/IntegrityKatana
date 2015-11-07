using TechTalk.SpecFlow;

namespace Behaviors.Selenium
{
	public class BaseSeleniumTest
	{
		private SeleniumContext _context;

		internal SeleniumContext Context
		{
			get { return _context ?? (_context = new SeleniumContext()); }
		}

		[AfterScenario]
		internal void Cleanup()
		{
			if (_context != null)
			{
				_context.Cleanup();
			}
		}
	}
}