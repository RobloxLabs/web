using System.Diagnostics;
using System.Net;

using Microsoft.AspNetCore.Diagnostics;

using MessagesResources = Roblox.TranslationResources.CommonUI.Messages;

namespace Roblox.Website.Pages
{
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    [IgnoreAntiforgeryToken]
    public class ErrorModel : PageModel
    {
        private readonly ILogger<ErrorModel> _logger;

        public IStringLocalizer<MessagesResources> Resources { get; }

        public string? RequestId { get; set; }

        public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);

        public string? ErrorTitle { get; set; }

        public string? ErrorDescription { get; set; }

        public string? ErrorMessage { get; set; }

        public int ResponseCode { get; set; }


        public ErrorModel(ILogger<ErrorModel> logger, IStringLocalizer<MessagesResources> resources)
        {
            _logger = logger;
            Resources = resources;

            // If shit really hits the fan and we can't translate, we can always fallback to this
            ResponseCode = 500;
            ErrorTitle = "Unexpected error with your request";
            ErrorDescription = "Please try again after a few moments.";
        }

        private void SetErrorInfo(HttpStatusCode? statusCode, Exception? exception = null)
        {
            switch (statusCode)
            {
                case HttpStatusCode.BadRequest:
                    ResponseCode = 400;
                    ErrorTitle = Resources["Response.BadRequest"];
                    ErrorDescription = Resources["Response.BadRequestDescription"];
                    break;
                case HttpStatusCode.Forbidden:
                    ResponseCode = 403;
                    ErrorTitle = Resources["Response.AccessDenied"];
                    ErrorDescription = Resources["Response.AccessDeniedDescription"];
                    break;
                case HttpStatusCode.NotFound:
                    ResponseCode = 404;
                    ErrorTitle = Resources["Response.PageNotFound"];
                    ErrorDescription = Resources["Response.PageNotFoundDescription"];
                    break;
                case HttpStatusCode.InternalServerError:
                    ResponseCode = 500;
                    ErrorTitle = Resources["Response.InternalServerError"];
                    ErrorDescription = Resources["Response.InternalServerErrorDescription"];
                    break;
                default: // Covers any other error codes the user might throw at us
                    ResponseCode = 500;
                    ErrorTitle = Resources["Response.SomethingWentWrong"];
                    ErrorDescription = Resources["Response.UnexpectedError"];
                    break;
            }

            if (exception != null)
                ErrorMessage = exception.ToString();
        }

        private IActionResult OnRequest()
        {
            try
            {
                // HACK: Clear HttpContext items to prevent script and CSS files from bleeding over from errored page
                HttpContext.Items.Clear();

                RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
                var codeStr = Request.Query["code"].FirstOrDefault();
                HttpStatusCode? statusCode = null;
                if (Enum.TryParse<HttpStatusCode>(codeStr, out var codeOut))
                    statusCode = codeOut;

                Exception? exception = null;
                var feature =
                    HttpContext.Features.Get<IExceptionHandlerPathFeature>();
                if (feature != null && feature.Error != null)
                {
                    exception = feature.Error;
                    // All exceptions give 500s by default
                    statusCode = HttpStatusCode.InternalServerError;
                }

                SetErrorInfo(statusCode, exception);
                HttpContext.Response.StatusCode = ResponseCode;
            }
            catch { }

            try
            {
                return Page();
            }
            catch { }

            // If everything's imploded, fallback to plaintext
            return Content("The site is currently offline for maintenance and upgrades.\r\nPlease check back soon!");
        }

        public IActionResult OnGet() => OnRequest();

        public IActionResult OnPost() => OnRequest();
    }
}