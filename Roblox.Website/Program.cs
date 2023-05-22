using Microsoft.AspNetCore;

namespace Roblox.Website
{
    /// <summary>
    /// Program
    /// </summary>
    public class Program
    {
        /// <summary>
        /// Builds the web host.
        /// </summary>
        /// <param name="args">The arguments.</param>
        /// <returns>
        ///   <seealso cref="IWebHost" />
        /// </returns>
        public static IWebHost BuildWebHost(string[] args)
            => WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .Build();

        /// <summary>
        /// Defines the entry point of the application.
        /// </summary>
        /// <param name="args">The arguments. <seealso cref="string" /></param>
        public static void Main(string[] args) => BuildWebHost(args).Run();
    }
}