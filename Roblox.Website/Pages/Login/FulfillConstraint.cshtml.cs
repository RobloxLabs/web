using Roblox.Web.Maintenance;

namespace Roblox.Website.Pages.Login
{
    public class FulfillConstraintModel : PageModel
    {
        private readonly IConstraintVerifier _constraintVerifier;

        [BindProperty] public string ReturnUrl { get; set; } = "/";
        [BindProperty] public string? ConstraintPassword { get; set; }
        [BindProperty(Name = "button")] public string? ButtonValue { get; set; }

        public FulfillConstraintModel(IConstraintVerifier constraintVerifier)
        {
            _constraintVerifier = constraintVerifier;
        }

        public IActionResult OnGet()
        {
            if (_constraintVerifier.IsVerified())
                return LocalRedirect(ReturnUrl);

            return Page();
        }

        public IActionResult OnPost()
        {
            // Attempt to lift constraint
            var result = _constraintVerifier.LiftConstraint(ConstraintPassword, ButtonValue);
            if (result)
                return LocalRedirect(ReturnUrl);

            return Page();
        }
    }
}
