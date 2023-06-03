using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Roblox.Website.Controllers
{
    public class AuthenticationController : Controller
    {
        // GET: Authentication/Logout
        [Authorize]
        public IActionResult Logout()
        {
            HttpContext.SignOutAsync();
            return LocalRedirect("/");
        }
    }
}
