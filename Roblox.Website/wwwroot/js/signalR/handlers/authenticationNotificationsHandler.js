import { Endpoints } from 'Roblox';
import realtimeFactory from '../lib/factory';

$(function() {
  realtimeFactory.GetClient().Subscribe('AuthenticationNotifications', function(data) {
    if (data.Type === 'SignOut') {
      let url = '/authentication/is-logged-in';
      if (Endpoints) {
        url = Endpoints.generateAbsoluteUrl(url, null, true);
      }
      $.ajax({
        url,
        method: 'GET',
        error(response) {
          if (response.status === 401) {
            window.location.reload();
          }
        }
      });
    }
  });
});
