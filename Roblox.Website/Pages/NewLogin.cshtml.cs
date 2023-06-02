using Microsoft.AspNetCore.Mvc;

using Roblox.TranslationResources.Authentication;
using Roblox.TranslationResources.CommonUI;

namespace Roblox.Website.Pages
{
    public class NewLoginModel : PageModel
    {
        private readonly IWebAuthenticator _authenticator;

        public IStringLocalizer<Login> LoginLangResources { get; }
        public IStringLocalizer<Controls> ControlsLangResources { get; }

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
            IStringLocalizer<Login> loginLangResources, IStringLocalizer<Controls> controlsLangResources)
        {
            _authenticator = webAuthenticator;

            LoginLangResources = loginLangResources;
            ControlsLangResources = controlsLangResources;
        }

        public void OnGet()
        {
            if (_authenticator.IsAuthenticated())
                Redirect(ReturnUrl ?? "/");
        }

        public void OnPost()
        {
            if (ModelState.IsValid)
            {
                var result = _authenticator.AuthenticateUser(Username, Password);
                switch (result)
                {
                    case AuthenticationResultCode.Success:
                        Redirect(ReturnUrl ?? "/");
                        break;
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
        }
    }
}
