using Microsoft.AspNetCore.Authorization;

using Roblox.Web.Responses.Authentication;

namespace Roblox.Website.Controllers
{
    public class AuthenticationController : Controller
    {
        private readonly IWebAuthenticator _authenticator;

        public AuthenticationController(IWebAuthenticator authenticator)
        {
            _authenticator = authenticator;
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
                    response = new LoginResponse(true, string.Format("Welcome {0} to ROBLOX!", userName));
                    break;
                case AuthenticationResultCode.InvalidPassword:
                    response = new LoginResponse(false, "Invalid username or password.");
                    response.ThrowError(LoginErrorCode.IncorrectCredential);
                    break;
                default:
                    response = new LoginResponse(false, "An unknown error occurred!");
                    response.ThrowError(LoginErrorCode.ErrorOccurred);
                    break;
            }

            return response;
        }
    }
}
