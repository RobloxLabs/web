import { httpService } from 'core-utilities';

const inProd = window.location.hostname && window.location.hostname.indexOf('test') === -1;
const recipeApi = inProd
  ? 'https://lms.roblox.com/recipe'
  : 'https://lms.simulpong.com/recipe?maxTargets=4';

const reportApi = inProd ? 'https://lms.roblox.com/report' : 'https://lms.simulpong.com/report';

// function to be called with Probnik test report
function onComplete(report) {
  const urlConfig = {
    url: reportApi
  };
  return httpService.post(urlConfig, report).catch(e => {
    console.error(e);
  });
}

const probnik = require('../../../ts/probnik/probnik');
// recipe provider to handout test recipe to probe
const recipeProvider = new probnik.RestRecipeProvider(recipeApi);

// set up a browser probe
const probe = new probnik.BrowserProbe(recipeProvider, onComplete);
probe.start();
