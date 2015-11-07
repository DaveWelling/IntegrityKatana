using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Behaviors.Properties;

namespace Behaviors.Selenium
{
	internal class Workspace
	{
		private readonly SeleniumContext _context;

		public Workspace(SeleniumContext context)
		{
			_context = context;
			_context.Driver.Navigate().GoToUrl(Settings.Default.DefaultUrl + "/#/Workspace");
		}

		private WorkItemTree _workItemTree;

		internal WorkItemTree WorkItemTree
		{
			get { return _workItemTree ?? (_workItemTree = new WorkItemTree(_context)); }
		}
	}
}
