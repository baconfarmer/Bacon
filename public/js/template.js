jQuery("body").delegate("a", "click", function () {
    track('a_click_class', jQuery(this).attr('class'));
});