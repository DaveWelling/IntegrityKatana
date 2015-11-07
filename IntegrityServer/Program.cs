using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http.Formatting;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Microsoft.Owin.FileSystems;
using Microsoft.Owin.Hosting;
using Microsoft.Owin.StaticFiles;
using Newtonsoft.Json.Serialization;
using Owin;

namespace IntegrityServer
{
	class Program
	{
		static void Main(string[] args)
		{

			var startupUrl = "http://localhost:3002";
			using (WebApp.Start<Startup>(startupUrl))
			{
				Console.WriteLine("Starting web services to Integrity.");
				Console.WriteLine("Type any key when finished with Integrity.");
				//Process.Start(startupUrl);
				Console.ReadKey();
			}
		}

	}

	public class ExternalStartup	 : IDisposable
	{
		private static IDisposable _server;

		public void Start(string url)
		{
			if (_server == null)
			{
				_server = WebApp.Start<Startup>(url);
			}
			else
			{
				throw new Exception("A server has already been started.");
			}
			
		}

		public void Close()
		{
			_server.Dispose();
			_server = null;
		}

		public void Dispose()
		{
			_server.Dispose();
			_server = null;
		}
	}

    internal class Startup
	{
		public void Configuration(IAppBuilder app)
		{
			ConfigureStaticFileServer(app);
		    ConfigureWebApi(app);
            // Anything not handled will land at the welcome page.
            app.UseWelcomePage();
        }

	    private void ConfigureWebApi(IAppBuilder app)
	    {
	        HttpConfiguration config = new HttpConfiguration();
	        config.Routes.MapHttpRoute(
	            name: "DefaultApi",
	            routeTemplate: "api/{controller}/{id}",
	            defaults: new {id = RouteParameter.Optional}
	            );
            var jsonFormatter = new JsonMediaTypeFormatter();
            //optional: set serializer settings here
            config.Services.Replace(typeof(IContentNegotiator), new JsonContentNegotiator(jsonFormatter));
            app.UseWebApi(config);
	    }

	    private static void ConfigureStaticFileServer(IAppBuilder app)
		{

#if DEBUG
			app.UseErrorPage();
#endif
			// Remap '/' to '.\defaults\'.
			// Turns on static files and default files.
			var integrityUiPath = @"..\..\..\Integrity";
			
			string currentDirectory = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location);
			integrityUiPath = Path.Combine(currentDirectory, integrityUiPath);
			integrityUiPath = Path.GetFullPath((new Uri(integrityUiPath)).LocalPath);
			if (!Directory.Exists(integrityUiPath))
			{
				throw new Exception(String.Format("Directory {0} does not exist", integrityUiPath));
			}
			var options = new FileServerOptions()
			{
				RequestPath = PathString.Empty,
				FileSystem = new PhysicalFileSystem(integrityUiPath)
			};
			//options.StaticFileOptions.ContentTypeProvider = new CustomContentTypeProvider();
			app.UseFileServer(options);

			//var hubConfiguration = new HubConfiguration();
			//hubConfiguration.EnableDetailedErrors = true;
			//app.MapSignalR(hubConfiguration);


			// Browse the root of your application (but do not serve the files).
			// NOTE: Avoid serving static files from the root of your application or bin folder,
			// it allows people to download your application binaries, config files, etc..
			app.UseDirectoryBrowser(new DirectoryBrowserOptions()
			{
				RequestPath = new PathString("/src"),
				FileSystem = new PhysicalFileSystem(@""),
			});

			
		}

	}
}
