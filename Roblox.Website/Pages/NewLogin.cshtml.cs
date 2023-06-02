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

        [BindProperty] public string? Username { get; set; }
        [BindProperty] public string? Password { get; set; }

        public string ReturnUrl { get; set; } = "/";

        public NewLoginModel(IWebAuthenticator webAuthenticator,
            IStringLocalizer<Login> loginLangResources, IStringLocalizer<Controls> controlsLangResources)
        {
            _authenticator = webAuthenticator;

            LoginLangResources = loginLangResources;
            ControlsLangResources = controlsLangResources;
        }

        private void SetErrorMessage(string? message)
        {
            if (!string.IsNullOrEmpty(message))
                ModelState.AddModelError("ErrorMessage", message);
        }

        /// <summary>
        /// Self-validates the model and returns the resulting validation message (if any)
        /// </summary>
        /// <returns>The validation message</returns>
        public string? GetValidationMessage()
        {
            string? message = null;
            if (string.IsNullOrEmpty(Username) || string.IsNullOrEmpty(Password))
                message = LoginLangResources["Message.UsernameAndPasswordRequired"];

            return message;
        }

        public void OnGet()
        {
            if (_authenticator.IsAuthenticated())
                Redirect("/");
        }

        public void OnPost()
        {
            SetErrorMessage(GetValidationMessage());

            if (ModelState.IsValid)
            {
                var result = _authenticator.AuthenticateUser(Username, Password);
                switch (result)
                {
                    case AuthenticationResultCode.Success:
                        Redirect(ReturnUrl);
                        break;
                    case AuthenticationResultCode.InvalidUsername:
                        // Unknown user
                        SetErrorMessage(string.Format(LoginLangResources["Label.GreetingForNewAccount"], Username));
                        break;
                    case AuthenticationResultCode.InvalidPassword:
                        // Incorrect username or password
                        SetErrorMessage(LoginLangResources["Response.IncorrectUsernamePassword"]);
                        break;
                    default:
                        SetErrorMessage(LoginLangResources["Response.UnknownLoginError"]);
                        break;
                }
            }
        }
    }
}
