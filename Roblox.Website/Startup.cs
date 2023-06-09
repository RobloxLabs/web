using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Rewrite;

using Roblox.EventLog;

using Roblox.Platform.Membership;
using Roblox.Platform.Roles;
using Roblox.Platform.Email;
using Roblox.Platform.Authentication;
using Roblox.Platform.Security;

using Roblox.Web.StaticContent;
using Roblox.Web.Maintenance;
using Roblox.Web.Mvc;

namespace Roblox.Website
{
    public class Startup
    {
        private readonly IConfiguration _Configuration;

        /// <summary>
        /// Initializes a new instance of the <see cref="Startup"/> class.
        /// </summary>
        /// <param name="configuration"><see cref="IConfiguration"/></param>
        /// <exception cref="ArgumentNullException"><paramref name="configuration"/> is null.</exception>
        public Startup(IConfiguration configuration)
        {
            _Configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }


        /// <summary>
        /// Configures the services
        /// </summary>
        /// <param name="services">The services. <seealso cref="IServiceCollection"/></param>
        public void ConfigureServices(IServiceCollection services)
        {
            //var connectionString = _Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
            //services.AddDbContext<ApplicationDbContext>(options =>
            //    options.UseSqlServer(connectionString));
            //services.AddDatabaseDeveloperPageExceptionFilter();

            //services.AddDefaultIdentity<Account>(options => options.SignIn.RequireConfirmedAccount = true)
            //    .AddEntityFrameworkStores<RobloxDbContext<Account, long, RobloxAccounts>>();

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.Configure<CookiePolicyOptions>(options =>
            {
                options.CheckConsentNeeded = (HttpContext context) => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            services.AddAuthentication()
                .AddCookie(RobloxCookieAuthenticationDefaults.AuthenticationScheme, options =>
                {
                    options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
                    options.LoginPath = RobloxCookieAuthenticationDefaults.LoginPath;
                });
            services.AddSingleton<IWebAuthenticator, WebAuthenticator>();

            services.AddAuthorization(options =>
            {
                // By default, all incoming requests will be authorized according to the default policy.
                //options.FallbackPolicy = options.GetPolicy("Restricted");

                // Only allows access to the site if the user is authenticated.
                options.AddPolicy("Restricted", 
                    new AuthorizationPolicyBuilder()
                        .RequireAuthenticatedUser()
                        .Build()
                );
                // Only allows access to the site if the user is an employee.
                options.AddPolicy("EmployeesOnly", 
                    new AuthorizationPolicyBuilder()
                        .RequireAuthenticatedUser()
                        .RequireClaim("IsAdmin", true.ToString())
                        .Build()
                );
            });

            services.AddLocalization();

            services.AddControllersWithViews(options =>
            {
                options.Filters.AddService<CookieConstraintActionFilter>();
                options.Filters.AddService<CookieConstraintPageFilter>();
            });

            services.AddRazorPages(options =>
            {
                // TODO: This is not all-good; do some role-checking
                options.Conventions.AuthorizeFolder("/Admi/", "EmployeesOnly")
                    .AllowAnonymousToFolder("/");
            });

            ConfigureLogger(services);
            ConfigureBundles(services);
            ConfigureCookieConstraint(services);
            ConfigureDomainFactories(services);
        }

        /// <summary>
        /// Configures the specified application.
        /// </summary>
        /// <param name="app">The application <seealso cref="IApplicationBuilder"/></param>
        /// <param name="env">The env. <see cref="IWebHostEnvironment"/></param>
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Configure the HTTP request pipeline.

            // Configure error pages
            const string errorPageUrl = "/RobloxDefaultErrorPage.aspx";
            app.UseExceptionHandler(errorPageUrl);
            app.UseStatusCodePages(context => {
                var request = context.HttpContext.Request;
                var response = context.HttpContext.Response;

                response.Redirect(errorPageUrl + "?code=" + response.StatusCode);

                return Task.CompletedTask;
            });

            if (!env.IsDevelopment())
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoint =>
            {
                endpoint.MapRazorPages();
                //endpoint.MapControllers();
                endpoint.MapDefaultControllerRoute();
            });

            var rewriteOptions = new RewriteOptions()
                .AddRedirect("(.*)Default.aspx", "$1");
            app.UseRewriter(rewriteOptions);

            app.UseRequestLocalization();

            app.UseWebOptimizer();
            var bundleConfig = app.ApplicationServices.GetService<BundleConfig>();
            bundleConfig?.RegisterBundles();
        }

        /// <summary>
        /// Sets up and configures the logger for the current application.
        /// </summary>
        /// <param name="services"></param>
        private void ConfigureLogger(IServiceCollection services)
        {
            // Construct application event logger
            var logger = new ConsoleLogger(
                () =>
                {
                    var logLevel = EventLog.LogLevel.Information;
                    var logLevelStr = _Configuration["LogLevel"];
                    if (!string.IsNullOrEmpty(logLevelStr))
                        logLevel = Enum.Parse<EventLog.LogLevel>(logLevelStr);
                    return logLevel;
                },
                logThreadId: false
            );

            services.AddSingleton<EventLog.ILogger>(logger);
        }

        private void ConfigureBundles(IServiceCollection services)
        {
            services.AddSingleton<IStaticUrlResolver, StaticUrlResolver>();
            services.AddSingleton<IScriptManager, RobloxScripts>()
                    .AddSingleton<IStyleManager, RobloxCSS>();

            services.AddSingleton<BundleConfig>();

            services.AddWebOptimizer();
        }

        private void ConfigureCookieConstraint(IServiceCollection services)
        {
            var settings = new CookieConstraintSettings(
                () => Roblox.Web.Maintenance.Properties.Settings.Default.IsCookieConstraintEnabled,
                () => Roblox.Web.Maintenance.Properties.Settings.Default.CookieConstraintCookieName,
                () => Roblox.Web.Maintenance.Properties.Settings.Default.CookieConstraintPassword,
                () => Roblox.WebsiteSettings.Properties.Settings.Default.CookieConstraint_RedirectDomain,
                () => Roblox.WebsiteSettings.Properties.Settings.Default.CookieConstraint_RedirectURL,
                () => Roblox.WebsiteSettings.Properties.Settings.Default.CookieConstraint_ProtectedPageExtension,
                () => Roblox.Web.Maintenance.Properties.Settings.Default.CookieConstraintIpBypassRangeCsv,
                () => Roblox.Web.Code.Properties.Settings.Default.CookieConstraint_AllowedButtonValuesCSV
            );
            services.AddSingleton<ICookieConstraintSettings>(settings);
            services.AddSingleton<IConstraintVerifier, CookieConstraintVerifier>();
            services.AddSingleton<CookieConstraintActionFilter>();
            services.AddSingleton<CookieConstraintPageFilter>();
        }

        /// <summary>
        /// Initializes and configures all platform domain-factories used by the current application.
        /// </summary>
        /// <param name="services"></param>
        private void ConfigureDomainFactories(IServiceCollection services)
        {
            services.AddSingleton<MembershipDomainFactories>()
            .AddSingleton<RoleDomainFactories>()
            .AddSingleton<EmailDomainFactories>()
            .AddSingleton<AuthenticationDomainFactories>()
            .AddSingleton<SecurityDomainFactories>();
        }
    }
}
