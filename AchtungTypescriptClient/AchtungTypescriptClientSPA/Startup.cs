using Owin;
using Microsoft.Owin;

[assembly: OwinStartup(typeof(AchtungTypescriptClientSPA.Startup))]
namespace AchtungTypescriptClientSPA
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {

        }
    }
}