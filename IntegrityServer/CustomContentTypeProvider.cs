using Microsoft.Owin.StaticFiles.ContentTypes;

namespace IntegrityServer
{
    /// <summary>
    /// Get rid of error in Chrome
    /// </summary>
    public class CustomContentTypeProvider : FileExtensionContentTypeProvider
    {
        public CustomContentTypeProvider()
        {
            Mappings.Add(".woff2", "application/font-woff2");
        }
    }
}