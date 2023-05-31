using Roblox.Platform.Membership;

namespace Roblox.Website.Pages.Shared.Navigation
{
    public class AlertsAndOptionsModel
    {
        public bool IsUserAuthenticated { get; }

        public string? UserName { get; }
        public int RobuxBalance { get; } = 0;
        public int TicketsBalance { get; } = 0;
        public int Friends { get; } = 0;
        public int Messages { get; } = 0;
        public bool IsAge13OrOver { get; } = false;

        public string? FriendsMessage { get; set; }
        public string? MessagesMessage { get; set; }


        public AlertsAndOptionsModel(IUser user)
        {
            IsUserAuthenticated = user != null;
            if (IsUserAuthenticated)
            {
                UserName = user.Name;
                RobuxBalance = 0;
                TicketsBalance = 0;
                Friends = 0;
                Messages = 0;
                IsAge13OrOver = user.AgeBracket == Platform.Membership.AgeBracket.Age13OrOver;
            }
        }
    }
}
