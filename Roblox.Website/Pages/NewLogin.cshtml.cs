using LoginResources = Roblox.TranslationResources.Authentication.Login;
using ControlsResources = Roblox.TranslationResources.CommonUI.Controls;

namespace Roblox.Website.Pages
{
    public class NewLoginModel : PageModel
    {
        private readonly IWebAuthenticator _authenticator;

        public IStringLocalizer<LoginResources> LoginLangResources { get; }
        public IStringLocalizer<ControlsResources> ControlsLangResources { get; }

        [BindProperty] public string Username { get; set; } = string.Empty;
        [BindProperty] public string Password { get; set; } = string.Empty;

        [BindProperty] public string? ReturnUrl { get; set; }

        public string? ErrorMessage
        {
            set
            {
                ModelState.Clear();
                if (value != null)
                    ModelState.AddModelError(string.Empty, value);
            }
        }

        public NewLoginModel(IWebAuthenticator webAuthenticator,
            IStringLocalizer<LoginResources> loginLangResources, IStringLocalizer<ControlsResources> controlsLangResources)
        {
            _authenticator = webAuthenticator;

            LoginLangResources = loginLangResources;
            ControlsLangResources = controlsLangResources;
        }

        /// <summary>
        /// Redirects the user to the given return URL
        /// </summary>
        /// <returns>The <see cref="IActionResult"/> for the redirect</returns>
        private IActionResult Redirect()
        {
            return LocalRedirect(ReturnUrl ?? "/");
        }

        private IActionResult? OnRequest()
        {
            if (_authenticator.IsAuthenticated())
                return Redirect();

            return null;
        }

        public IActionResult OnGet() => OnRequest() ?? Page();

        public IActionResult OnPost()
        {
            var onRequestResult = OnRequest();
            if (onRequestResult != null) return onRequestResult;

            if (ModelState.IsValid)
            {
                var result = _authenticator.AuthenticateUser(Username, Password);
                switch (result)
                {
                    case AuthenticationResultCode.Success:
                        return Redirect();
                    case AuthenticationResultCode.InvalidUsername:
                        // Unknown user
                        ErrorMessage = string.Format(LoginLangResources["Label.GreetingForNewAccount"], Username);
                        break;
                    case AuthenticationResultCode.InvalidPassword:
                        // Incorrect username or password
                        ErrorMessage = LoginLangResources["Response.IncorrectUsernamePassword"];
                        break;
                    default:
                        ErrorMessage = LoginLangResources["Response.UnknownLoginError"];
                        break;
                }
            }

            return Page();
        }
    }
}
