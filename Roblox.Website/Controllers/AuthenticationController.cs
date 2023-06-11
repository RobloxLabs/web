using Microsoft.AspNetCore.Authorization;

using Roblox.Web.Responses.Authentication;

namespace Roblox.Website.Controllers
{
    public class AuthenticationController : Controller
    {
        private readonly IWebAuthenticator _authenticator;
        private readonly IStringLocalizer<TranslationResources.Authentication.Login> _resources;

        public AuthenticationController(IWebAuthenticator authenticator, IStringLocalizer<TranslationResources.Authentication.Login> resources)
        {
            _authenticator = authenticator;
            _resources = resources;
        }

        // GET: Authentication/Logout
        [Authorize]
        public IActionResult Logout()
        {
            _authenticator.SignOutUser();
            return LocalRedirect("/");
        }

        [HttpPost]
        // POST: Authentication/ValidateLogin
        public LoginResponse ValidateLogin(string userName, string password, bool isCaptchaOn = false, string challenge = "", string captchaResponse = "")
        {
            LoginResponse response;

            var result = _authenticator.TryAuthenticateUser(userName, password);
            switch (result)
            {
                case AuthenticationResultCode.Success:
                    response = new LoginResponse(true);
                    break;
                case AuthenticationResultCode.InvalidPassword:
                    response = new LoginResponse(false, _resources["Response.IncorrectUsernamePassword"]);
                    response.ThrowError(LoginErrorCode.IncorrectCredential);
                    break;
                default:
                    response = new LoginResponse(false, _resources["Message.UnknownErrorTryAgain"]);
                    response.ThrowError(LoginErrorCode.ErrorOccurred);
                    break;
            }

            return response;
        }
    }
}
