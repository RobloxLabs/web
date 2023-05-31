namespace Roblox.Website.Pages.Shared
{
    public class StructuredDataTags
    {
        public string StructuredDataContext => "http://schema.org";
        public string StructuredDataType => "Organization";
        public string StructuredDataName => "ROBLOX";
        public string RobloxUrl => "https://www.roblox.com/";
        public string RobloxLogoUrl => "~/Images/Logo/RobloxIcon.png"; // TODO: StaticContent.GetUrl("~/Images/Logo/RobloxIcon.png")
        public string RobloxFacebookUrl => "https://www.facebook.com/ROBLOX/";
        public string RobloxTwitterUrl => "https://twitter.com/roblox";
        public string RobloxLinkedInUrl => "https://www.linkedin.com/company/147977";
        public string RobloxInstagramUrl => "https://www.instagram.com/roblox/";
        public string RobloxYouTubeUrl => "https://www.youtube.com/user/roblox";
        public string RobloxGooglePlusUrl => "https://plus.google.com/+roblox";
        public string RobloxTwitchTvUrl => "https://www.twitch.tv/roblox";
        public string Title => "ROBLOX";
        public string? Description { get; set; }
        public string? Images { get; set; }
        public string? ImageWidth { get; set; }
        public string? ImageHeight { get; set; }
    }

    public class MetaTagListViewModel
    {
        public IDictionary<string, string>? FacebookMetaTags { get; set; }
        public IDictionary<string, string>? TwitterMetaTags { get; set; }
        public StructuredDataTags StructuredDataTags { get; } = new StructuredDataTags();
        public string Description { get; } = "User-generated MMO gaming site for kids, teens, and adults. Players architect their own worlds. Builders create free online games that simulate the real world. Create and play amazing 3D games. An online gaming cloud and distributed physics engine.";
        public string Keywords { get; } = "free games, online games, building games, virtual worlds, free mmo, gaming cloud, physics engine";
        public bool NoIndexNoFollow => false;
        public bool NoIndex => false;
        public bool NoFollow => false;
        public bool IncludeReferrerOriginTag => false;
        public string? GoogleSiteVerificationTag { get; set; }

        public IDictionary<string, string> GetMetaTags()
        {
            var metaTags = new Dictionary<string, string>
            {
                { "author", "ROBLOX Corporation" },
                { "description", this.Description },
                { "keywords", this.Keywords},
                { "robots", "all" }
            };
            return metaTags;
        }
    }
}
