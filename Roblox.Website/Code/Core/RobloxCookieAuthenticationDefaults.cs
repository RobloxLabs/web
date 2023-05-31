namespace Roblox.Website
{
    /// <summary>
    /// Default values related to cookie-based authentication handler
    /// </summary>
    internal static class RobloxCookieAuthenticationDefaults
    {
        /// <summary>
        /// The default value used for RobloxCookieAuthenticationOptions.AuthenticationScheme
        /// </summary>
        public const string AuthenticationScheme = "RobloxCookies";

        /// <summary>
        /// The prefix used to provide a default RobloxCookieAuthenticationOptions.CookieName
        /// </summary>
        public static readonly string CookiePrefix = ".RBX.";

        /// <summary>
        /// The default value used by CookieAuthenticationMiddleware for the
        /// CookieAuthenticationOptions.LoginPath
        /// </summary>
        public static readonly PathString LoginPath = new PathString("/NewLogin");

        /// <summary>
        /// The default value used by CookieAuthenticationMiddleware for the
        /// CookieAuthenticationOptions.LogoutPath
        /// </summary>
        public static readonly PathString LogoutPath = new PathString("/Authentication/Logout");

        /// <summary>
        /// The default value used by CookieAuthenticationMiddleware for the
        /// CookieAuthenticationOptions.AccessDeniedPath
        /// </summary>
        public static readonly PathString AccessDeniedPath = new PathString("/Error");

        /// <summary>
        /// The default value of the RobloxCookieAuthenticationOptions.ReturnUrlParameter
        /// </summary>
        public static readonly string ReturnUrlParameter = "ReturnUrl";
    }
}
