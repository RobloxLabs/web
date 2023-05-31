typeof Roblox == "undefined" && (Roblox = {}), (Roblox.DropDownNav = function() {
  /**
   * @param {!Event} event
   * @return {undefined}
   */
  function update(event) {
    var i = $(event.target);
    var f;
    var u;
    if (!i.attr("drop-down-nav-button")) {
      i = i.parents("[drop-down-nav-button]");
    }
    i.addClass("active");
    f = i.attr("drop-down-nav-button");
    u = t.filter('[drop-down-nav-container="' + f + '"]');
    u.show();
    t.not(u).hide();
    r.not(i).removeClass("active");
    event.stopPropagation();
    i.trigger("showDropDown");
  }
  /**
   * @param {!Event} message
   * @return {undefined}
   */
  function SnackbarInstance(message) {
    $("[drop-down-nav-button]").unbind("click", f);
    update(message);
    $("[drop-down-nav-button]").bind("mouseleave", initializeContentAddingMenu);
  }
  /**
   * @return {undefined}
   */
  function initializeContentAddingMenu() {
    click();
    $("[drop-down-nav-button]").unbind("mouseleave", initializeContentAddingMenu);
  }
  /**
   * @param {!Event} t
   * @return {undefined}
   */
  function f(t) {
    $("[drop-down-nav-button]").unbind("mouseenter", SnackbarInstance);
    update(t);
    $(document).bind("click", function() {
      click();
    });
    $("[drop-down-nav-button]").bind("click", o);
  }
  /**
   * @return {undefined}
   */
  function o() {
    $(document).unbind("click", function() {
      click();
    });
    click();
    $("[drop-down-nav-button]").bind("click", update);
  }
  /**
   * @return {undefined}
   */
  function click() {
    t.hide();
    r.removeClass("active");
  }
  var t;
  var r;
  $(function() {
    t = $("[drop-down-nav-container]");
    r = $("[drop-down-nav-button]");
    $("[drop-down-nav-button]").bind("click", f);
    $("[drop-down-nav-button]").bind("mouseenter", SnackbarInstance);
  });
})();
