var Roblox = Roblox || {};
(function () {
    var cashoutKeys = Roblox.Lang.CashOutResources;
    var controlKeys = Roblox.Lang.ControlsResources;
    $(function () {
        var modal = $('#CashOutWidget').data('modal');
        switch (modal) {
            case 'obc':
                Roblox.Dialog.open({
                    titleText: cashoutKeys['Action.VerifyEmail'],
                    bodyContent: cashoutKeys['Label.VerifiedEmailForCashout'],
                    acceptText: controlKeys['Action.OK'],
                    showDecline: false
                });
                break;
            case 'robux':
                Roblox.Dialog.open({
                    titleText: cashoutKeys['Action.UpgradeMembership'],
                    bodyContent: cashoutKeys['Label.BuildersCludForCashout'],
                    acceptText: controlKeys['Action.OK'],
                    showDecline: false
                });
                break;
            case 'email':
                Roblox.Dialog.open({
                    titleText: cashoutKeys['Label.Robux'],
                    bodyContent: cashoutKeys['Label.NotEnoughRobuxForCashout'],
                    acceptText: controlKeys['Action.OK'],
                    showDecline: false
                });
                break;
        }
    });
})();