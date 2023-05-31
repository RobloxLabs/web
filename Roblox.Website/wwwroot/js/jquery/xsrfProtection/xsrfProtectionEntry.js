import xsrfToken from './lib/xsrfToken';
import xsrfTokenHeaderInjector from './lib/xsrfTokenHeaderInjector';
import xsrfTokenFormInjector from './lib/xsrfTokenFormInjector';

window.Roblox = window.Roblox || {};
window.Roblox.XsrfToken = xsrfToken;
window.Roblox.XsrfTokenFormInjector = xsrfTokenFormInjector;

// Header injector is initialized by default to maintain parity with the behavior of the old XsrfToken.js
xsrfTokenHeaderInjector.initialize();