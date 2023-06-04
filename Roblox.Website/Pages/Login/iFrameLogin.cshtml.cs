using System.Web;

using LoginResources = Roblox.TranslationResources.Authentication.Login;

namespace Roblox.Website.Pages.Login
{
    public class iFrameLoginModel : PageModel
    {
        private readonly IWebAuthenticator _authenticator;

        public bool CaptchaOn { get; set; } = false;
        public string ClientIPAddress { get; set; } = string.Empty;
        public string ParentURL { get; set; } = string.Empty;

        public IStringLocalizer<LoginResources> LoginLangResources { get; }

        public iFrameLoginModel(IWebAuthenticator authenticator,
            IStringLocalizer<LoginResources> loginLangResources)
        {
            _authenticator = authenticator;
            LoginLangResources = loginLangResources;
        }

        /// <summary>
        /// Redirects the user to the given return URL
        /// </summary>
        /// <returns>The <see cref="IActionResult"/> for the redirect</returns>
        private IActionResult Redirect()
        {
            return LocalRedirect(ParentURL ?? "/");
        }

        private IActionResult OnRequest()
        {
            var parentUrl = Request.Query["parentUrl"].FirstOrDefault();
            if (!string.IsNullOrEmpty(parentUrl))
                ParentURL = HttpUtility.HtmlEncode(parentUrl);

            if (_authenticator.IsAuthenticated())
                return Redirect();

            return Page();
        }

        public IActionResult OnGet() => OnRequest();

        public IActionResult OnPost() => OnRequest();
    }
}
