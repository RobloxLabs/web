using Roblox.Web.Code.Util;

namespace Roblox.Website.Pages.Shared.Game
{
    public class ClientInstallerModel
    {
        public bool IsSupportedPlatform = false;
        public bool IsIE = false;
        public string? Platform;
        public string? Browser;
        public int BrowserVersion = 0; // [Xbox] [Windows] (Trident) (rv:0) | [Xbox] [Windows] (Chrome/32) // [ROBLOX iOS] [Intel Mac OS X] (Mozilla Safari AppleWebKit)
        public bool UseBrowserSwitch = true;
        public bool IsGameLaunchAttemptLoggingEnabled = true;
        public bool UseUpdatedModal = WebsiteSettings.Properties.Layout.Default.IsUpdatedInstallationInstructionsModalEnabled;

        public string? SkipUrl;
        public string? CLSID;
        public string? InstallHost;
        public bool ImplementsProxy = false;
        public bool SilentModeEnabled = false;

        public bool BringAppToFrontEnabled = false;
        public string? CurrentPluginVersion;
        public bool EventStreamLoggingEnabled = false;


        public ClientInstallerModel(string userAgent)
        {
            //UseBrowserSwitch = Roblox.WebsiteSettings.Properties.Settings.Default.UseClientInstallerBrowserSwitch;
            //IsGameLaunchAttemptLoggingEnabled = Roblox.WebsiteSettings.Properties.Settings.Default.IsGameLaunchAttemptLoggingEnabled;

            InitBrowserInfo(userAgent);
            InitPlatformInfo(userAgent);
            IsIE = BrowserUtils.IsIE(userAgent);
            IsSupportedPlatform = Platform != null;

            ConfigureClientSettings();
        }

        private void InitBrowserInfo(string userAgent)
        {
            Browser = BrowserUtils.GetBrowserStringFromUserAgent(userAgent);
            BrowserVersion = BrowserUtils.GetChromeVersion(userAgent);
        }

        private void InitPlatformInfo(string userAgent)
        {
            if (userAgent.Contains("Windows"))
                Platform = "Windows";
            else if (userAgent.Contains("Mac"))
                Platform = "Mac";
        }

        private void ConfigureClientSettings()
        {
            // TODO: [Xbox] [Windows] should give blanks and a /Download skip URL
            // Quick check to see if we were able to pull out any info from the user agent
            if (IsSupportedPlatform)
            {
                if (Browser != null)
                {
                    CLSID = WebsiteSettings.Properties.Settings.Default.CLSID32Bit;
                    InstallHost = WebsiteSettings.Properties.Settings.Default.ClientInstallHost;
                    ImplementsProxy = true;
                    SilentModeEnabled = true;
                    EventStreamLoggingEnabled = true;
                }
                else
                {
                    SkipUrl = "/Install/Download.aspx";
                }
            }
            else
            {
                SkipUrl = "/Install/Unsupported.aspx"; // TODO: Get from setting?
            }
        }
    }
}
