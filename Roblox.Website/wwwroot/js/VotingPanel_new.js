var Roblox = Roblox || {};

Roblox.Voting = function () {
    /// <summary>
    /// Loads the voting service via ajax call.
    /// </summary>
    var loadVotingService = function (rootNode, placeId) {
        var url = "/games/votingservice/" + placeId;
        $.ajax({
            url: url,
            success: function (data) {
                rootNode.replaceWith(data);
            }
        });
    }

    /// <summary>
    /// Initializes the voting panel.
    /// </summary>
    var initialize = function () {
        // Initialize the voting buttons.
        $('.users-vote .upvote').unbind().click(function () {
            onVoteButtonClick($(this), true);
        });
        $('.users-vote .downvote').unbind().click(function () {
            onVoteButtonClick($(this), false);
        });

        // Initialize the vote bar.
        var totalUpVotes = parseInt($('.voting-panel').data('total-up-votes'));
        var totalDownVotes = parseInt($('.voting-panel').data('total-down-votes')); 
        updateVoteBar(totalUpVotes, totalDownVotes);
    };

    /// <summary>
    /// Handler function for clicking on one of the vote buttons.
    /// </summary>
    /// <param name="element">The element that was clicked on.</param>
    /// <param name="voteType">The type of vote as a bool where true is upvote and false is downvote.</param>
    var onVoteButtonClick = function (element, voteType) {
        var userIsAuthenticated = $('.voting-panel').data('user-authenticated');
        if(!userIsAuthenticated) {
            displayModal("GuestUser");
            return;
        }

        var targetId = $('.voting-panel').data('target-id');
        var voteUrl = "/voting/vote?assetId=" + targetId + "&vote=";

        var altVoteUrl = $('.voting-panel').data('vote-url');
        if (altVoteUrl) {
            voteUrl = altVoteUrl;
        }

        // If the element is selected then it's already been voted for.
        // In this case, we want to unvote.
        if (element.hasClass('selected')  || element.find("i").hasClass("selected") || element.find(".icon-like, .icon-dislike").hasClass("selected")) {
            vote(voteUrl, null);
        } else { // Otherwise, vote normally.
            vote(voteUrl, voteType);
        }
    };
    
    /// <summary>
    /// Votes for an asset with the specified ID.
    /// </summary>
    /// <param name="assetId">The ID of the asset to vote for as a long.</param>
    /// <param name="vote">The type of vote as a bool where true is upvote, 
    /// false is downvote, and null is no vote.</param>
    var vote = function (voteUrl, voteType) {
        $('.voting-panel .loading').show();
        $.ajax({
            type: "POST",
            url: voteUrl + voteType,
            success: onVoteSuccess,
            error: onVoteError
        });
    };

    /// <summary>
    /// Callback function for a successful ajax request from vote.
    /// </summary>
    /// <param name="response">The JSON result from the ajax request.</param>
    var onVoteSuccess = function (result) {
        var hasRBXIcon = $(".icon-like").length;

        $('.voting-panel .loading').hide();

        if (result.Success) { // Vote was successfully applied. Need to redraw panel.
            setVotes(result.Model.UpVotes, result.Model.DownVotes);

            var upvoteButton = $('.voting-panel .upvote');
            var downvoteButton = $('.voting-panel .downvote');
            var usersVote = $('.users-vote');
            if(hasRBXIcon) {
                upvoteButton = $('.voting-panel .upvote .icon-like');
                downvoteButton = $('.voting-panel .downvote .icon-dislike');
            }


            // Add or remove the has-voted class from the button's parent div
            // depending on whether the user voted or unvoted.
            if (result.Model.UserVote !== null) {
                if (!usersVote.hasClass('has-voted')) {
                    usersVote.addClass('has-voted');
                }
            }
            else {
                usersVote.removeClass('has-voted');
            }

            // Removing the selected tag removes the green or red
            // highlighting on the thumbgs.
            if (upvoteButton.hasClass('selected')) {
                upvoteButton.removeClass('selected');
            }

            if (downvoteButton.hasClass('selected')) {
                downvoteButton.removeClass('selected');
            }

            // Add the selected tag to either button if needed.
            if (result.Model.UserVote !== null) {
                if (result.Model.UserVote) {
                    upvoteButton.addClass('selected');
                } else {
                    downvoteButton.addClass('selected');
                }
            }

            // And finally modify the bar.
            updateVoteBar(result.Model.UpVotes, result.Model.DownVotes);
        } else { // Vote was not successfully applied, display modal.
            displayModal(result.ModalType);
        }
    };

    /// <summary>
    /// Callback function for an erroneous ajax request from vote.
    /// </summary>
    /// <param name="response">The JSON result from the ajax request.</param>
    var onVoteError = function (result) {
        $('.voting-panel .loading').hide();
    };

    /// <summary>
    /// Updates the vote bar to reflect the current percentages.
    /// </summary>
    /// <param name="upvotes">The total number of upvotes.</param>
    /// <param name="downvotes">The total number of downvotes.</param>
    var updateVoteBar = function (upvotes, downvotes, target) {

        var elem = target || $("#voting-section"),
            percentUp;
        if (!isNaN(upvotes) && !isNaN(downvotes)) {
            if (upvotes === 0) {
                percentUp = 0;
            } else if (downvotes === 0) {
                percentUp = 100;
            } else {
                percentUp = Math.floor((upvotes / (upvotes + downvotes)) * 100);
            }

            if (percentUp > 100) {
                percentUp = 100;
            }

            var voteElem = elem.find(".vote-container");
            var voteBg = voteElem.find(".vote-background");
            voteElem.find(".vote-percentage").css("width", percentUp + "%");
            if (downvotes > 0) {
                voteBg.addClass("has-votes");
            }  else {
                voteBg.removeClass("has-votes");
            }
        }
    };

    var setVotes = function (upVotes, downVotes) {
        upVotes = Roblox.NumberFormatting.abbreviatedFormat(upVotes);
        downVotes = Roblox.NumberFormatting.abbreviatedFormat(downVotes);
        $('.voting-panel .total-upvotes-text').text(upVotes);
        $('.voting-panel .total-downvotes-text').text(downVotes);

        // new page
        $('.voting-panel #vote-up-text').text(upVotes);
        $('.voting-panel #vote-down-text').text(downVotes);

        updateVoteBar(upVotes, downVotes);
    }

    var getModalProperties = function (modalType) {
        var votingSection = $("#voting-section");
        var accountPageUrl = votingSection.data("accountPageUrl");
        var registerPageUrl = votingSection.data("registerUrl");

        // prepare links with labels to interpolate with message for localization
        var accountsPageLink = "<a href='" + accountPageUrl + "'>" + "Account" + "</a>";
        var registerPageLink = "<a href='" + registerPageUrl + "'>" + "login or register" + "</a>";

        var modalProperties = {
            "EmailIsVerified": {
                titleText: "Verify Your Email",
                bodyContent: "You must verify your email before you can vote. You can verify your email on the " + accountsPageLink + " page.",
                onAccept: function () {
                    window.location.href = accountPageUrl;
                },
                acceptColor: Roblox.Dialog.green,
                acceptText: "Verify",
                declineText: "Cancel",
                allowHtmlContentInBody: true
            },
            "PlayGame": {
                titleText: "Play Game",
                bodyContent: "You must play the game before you can vote on it.",
                showAccept: false,
                declineText: "OK"
            },
            "UseModel": {
                titleText: "Use Model",
                bodyContent: "You must use this model before you can vote on it.",
                showAccept: false,
                declineText: "OK"
            },
            "InstallPlugin": {
                titleText: "Install Plugin",
                bodyContent: "You must install this plugin before you can vote on it.",
                showAccept: false,
                declineText: "OK"
            },
            "BuyGamePass": {
                titleText: "Buy Game Pass",
                bodyContent: "You must own this game pass before you can vote on it.",
                showAccept: false,
                declineText: "OK"
            },
            "FloodCheckThresholdMet": {
                titleText: "Slow Down",
                bodyContent: "You're voting too quickly. Come back later and try again.",
                showAccept: false,
                declineText: "OK"
            },
            "GuestUser": {
                titleText: "Login to Vote",
                bodyContent: "<div>" + "You must login to vote." + "</div><div>" + "Please " + registerPageLink + " to continue." + "</div>",
                onAccept: function () {
                    window.location.href = registerPageUrl
                },
                acceptColor: Roblox.Dialog.green,
                acceptText: "Login",
                declineText: "Cancel",
                allowHtmlContentInBody: true
            },
            "Error": {
                titleText: "Something Broke",
                bodyContent: "There was an unknown problem voting. Please try again.",
                showAccept: false,
                declineText: "OK"
            },
            "AssetNotVoteable": {
                titleText: "Unable to Vote",
                bodyContent: "This asset may not be voted on at this time.",
                showAccept: false,
                declineText: "OK"
            }
        };

        return modalProperties[modalType] || modalProperties.Error;
    }
    /// <summary>
    /// Displays a modal window corresponding to the specified modal type.
    /// </summary>
    /// <param name="modalType">The modal type to display.</param>
    var displayModal = function (modalType) {
        if (!modalType) {
            return;
        }
        Roblox.Dialog.open(getModalProperties(modalType));
    };

    return {
        Vote: vote,
        Initialize: initialize,
        SetVotes: setVotes,
        UpdateVoteBar: updateVoteBar,
        LoadVotingService: loadVotingService
    };
} ();
