using Microsoft.AspNetCore.Authorization;

namespace Roblox.Website
{
    internal class AuthorizationOptions : IAuthorizeData
    {
        public string? Policy { get; set; }

        public string? Roles { get; set; }

        public string? AuthenticationSchemes { get; set; }
    }
}
