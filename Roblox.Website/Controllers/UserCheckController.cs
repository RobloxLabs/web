using Roblox.Platform.Membership;
using Roblox.Platform.Email;

using Roblox.Web.WebAPI.Models;

namespace Roblox.Website.Controllers
{
    public class UserCheckController : Controller
    {
        private readonly IUserFactory _userFactory;
        private readonly IEmailAddressFactory _emailAddressFactory;

        public UserCheckController(MembershipDomainFactories membershipDomainFactories, EmailDomainFactories emailDomainFactories)
        {
            _userFactory = membershipDomainFactories.UserFactory;
            _emailAddressFactory = emailDomainFactories.EmailAddressFactory;
        }

        // UserCheck/CheckIfEmailIsBlacklisted
        public ApiSuccessResponse CheckIfEmailIsBlacklisted(string email)
        {
            var success = false;
            if (!string.IsNullOrWhiteSpace(email))
            {
                var emailAddress = _emailAddressFactory.GetByAddress(email);
                if (emailAddress != null)
                    success = emailAddress.IsBlacklisted;
            }

            return new ApiSuccessResponse(success);
        }

        // UserCheck/CheckIfInvalidUserNameForSignup
        public object CheckIfInvalidUserNameForSignup(string username)
        {
            byte result = 0;
            if (_userFactory.GetUserByName(username) != null)
                result = 1;
            // TODO: Platform.Membership.UsernameValidator
            /*else if (!Signup.ValidateUserName(username))
                result = 2;*/

            // This isn't any real model for some reason
            return new { Data = result };
        }

        // UserCheck/DoesUsernameExist
        public ApiSuccessResponse DoesUsernameExist(string username)
        {
            var account = _userFactory.GetUserByName(username);
            var success = account != null;

            return new ApiSuccessResponse(success);
        }

        public void GetRecommendedUsername(string usernameToTry)
        {
            Response.StatusCode = 501;
        }

        public void GetSocialNetworkUserName(byte socialNetworkTypeId, string sessionData)
        {
            Response.StatusCode = 501;
        }

        public void GetSocialNetworkUserNameBySocialNetworkId(byte socialNetworkTypeId, string sessionData, int socialNetworkId)
        {
            Response.StatusCode = 501;
        }

        public void UpdatePersonalInfo(byte genderId, int birthYear, int birthMonth, int birthDay)
        {
            Response.StatusCode = 501;
        }

        public void ValidatePasswordForSignup(string username, string password)
        {
            Response.StatusCode = 501;
        }
    }
}
