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


        public ErrorModel(ILogger<ErrorModel> logger, IStringLocalizer<MessagesResources> resources)
        {
            _logger = logger;
            Resources = resources;
        }

        private void SetErrorInfo(HttpStatusCode statusCode, Exception? exception)
        {
            switch (statusCode)
            {
                case HttpStatusCode.Forbidden:
                    ErrorTitle = Resources["Response.AccessDenied"];
                    ErrorDescription = Resources["Response.AccessDeniedDescription"];
                    break;
                case HttpStatusCode.NotFound:
                    ErrorTitle = Resources["Response.PageNotFound"];
                    ErrorDescription = Resources["Response.PageNotFoundDescription"];
                    break;
                case HttpStatusCode.InternalServerError:
                    ErrorTitle = Resources["Response.InternalServerError"];
                    ErrorDescription = Resources["Response.InternalServerErrorDescription"];
                    break;
                default: // Covers HttpStatusCode.BadRequest & anything else the user might throw at us
                    ErrorTitle = Resources["Response.BadRequest"];
                    ErrorDescription = Resources["Response.BadRequestDescription"];
                    break;
            }

            if (exception != null)
                ErrorMessage = exception.ToString();
        }

        private IActionResult OnRequest()
        {
            // HACK: Clear HttpContext items to prevent script and CSS files from bleeding over from errored page
            HttpContext.Items.Clear();

            RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            var codeStr = Request.Query["code"].FirstOrDefault();
            HttpStatusCode code;
            if (!Enum.TryParse(codeStr, out code))
                code = HttpStatusCode.BadRequest;
            HttpContext.Response.StatusCode = (int)code;

            Exception? exception = null;
            var feature =
                HttpContext.Features.Get<IExceptionHandlerPathFeature>();
            if (feature != null && feature.Error != null)
            {
                exception = feature.Error;
                // All exceptions give 403s by default
                code = HttpStatusCode.InternalServerError;
            }

            SetErrorInfo(code, exception);

            return Page();
        }

        public IActionResult OnGet() => OnRequest();

        public IActionResult OnPost() => OnRequest();
    }
}