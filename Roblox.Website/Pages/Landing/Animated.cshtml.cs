using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Roblox.TranslationResources.CommonUI;

namespace Roblox.Website.Pages.Landing
{
    public class AnimatedModel : PageModel
    {
        private readonly SignupHelper _helper;
        private readonly IWebAuthenticator _authenticator;

        public bool IsAnimated { get; set; } = true;
        public SelectList Months { get; set; }
        public SelectList Days { get; set; }
        public SelectList Years { get; set; }

        public AnimatedModel(IStringLocalizer<Controls> resources, IWebAuthenticator authenticator)
        {
            if (resources == null) throw new ArgumentNullException(nameof(resources));
            _authenticator = authenticator ?? throw new ArgumentNullException(nameof(authenticator));

            _helper = new SignupHelper(resources);
            Months = new SelectList(_helper.GetMonths(), "Key", "Value");
            Days = new SelectList(_helper.GetDays(), "Key", "Value");
            Years = new SelectList(_helper.GetYears(), "Key", "Value");
        }

        public IActionResult OnGet()
        {
            if (_authenticator.IsAuthenticated())
                return LocalRedirect("/");

            return Page();
        }
    }
}
