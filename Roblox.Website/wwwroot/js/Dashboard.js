// Dashboard.js

function RBX_Update_Dashboard() {
    Roblox.Website.Reporting.DashboardService.GetGridStatus(
        function (gridStatus) {
            for (prop in gridStatus) {
                var element = document.getElementById(prop);
                if (element) {
                    element.innerHTML = gridStatus[prop];
                }
            }
        }
    );
}