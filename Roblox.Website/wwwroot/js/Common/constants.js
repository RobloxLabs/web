/*

Module defines site-wide constants. Hierarchy of the 
returned object structure is useful to 
group the constants.

Author: Achint Verma
Date: April 06, 2017

*/

var Roblox = Roblox || {};

Roblox.Constants = (function () {
    return {
       http: {
           contentType: "application/json; charset=utf-8",
           dataType: "json",
           successStatus: "Success"
       },
       realTimeNotifications: {
           friendshipNotifications: {
               name: "FriendshipNotifications",
               types: {
                   friendshipCreated: "FriendshipCreated",
                   friendshipDestroyed: "FriendshipDestroyed",
                   friendshipDeclined: "FriendshipDeclined",
                   friendshipRequested: "FriendshipRequested"
               }
           },
           presenceBulkNotifications: {
               name: "PresenceBulkNotifications",
               types: {
                   presenceChanged: "PresenceChanged"
               }
           }
       },
       presenceTypes: {
           offline: 0,
           online: 1,
           inGame: 2, 
           inStudio: 3
       },
       keyCodes: {
           enter: 13
       },
       events: {
           ClickShareGameToChat: {
               name: "ShareGameToChat",
               context: "ClickShareIcon"
           }
       }
    };

})();