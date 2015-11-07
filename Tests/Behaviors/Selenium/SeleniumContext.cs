using System;
using System.Collections.Generic;
using IntegrityServer;
using OpenQA.Selenium;
using OpenQA.Selenium.Firefox;

namespace Behaviors.Selenium
{
	internal class SeleniumContext
	{
		private readonly ExternalStartup _owin;
		private CleanupQueue _cleanupQueue;
		private IWebDriver _driver;
		private Workspace _workspace;

		public SeleniumContext()
		{
			//Driver.Navigate().GoToUrl(Settings.Default.DefaultUrl);
			Driver.Manage().Timeouts().ImplicitlyWait(TimeSpan.FromSeconds(2));
			_owin = new ExternalStartup();
			_owin.Start("http://localhost:3003");
		}

		internal IWebDriver Driver
		{
			get { return _driver ?? (_driver = new FirefoxDriver()); }
		}

		internal Workspace Workspace
		{
			get { return _workspace ?? (_workspace = new Workspace(this)); }
		}

		protected CleanupQueue CleanupQueue
		{
			get { return _cleanupQueue ?? (_cleanupQueue = new CleanupQueue()); }
		}

		public void Cleanup()
		{
			while (CleanupQueue.Count > 0)
			{
				var action = CleanupQueue.Dequeue();
				action();
			}
			Driver.Quit();
			_owin.Close();
		}
	}

	internal class CleanupQueue : Queue<Action>
	{
	}
}