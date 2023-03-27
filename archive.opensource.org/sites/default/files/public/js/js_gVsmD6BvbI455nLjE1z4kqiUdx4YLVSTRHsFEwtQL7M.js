CRM.$(function () {
  'use strict';

  /**
   * The purpose of this script is to add the missing calendar addons to datepicker fields
   */

  /**
   * Adds an datepicker addon to the given input. It also removes the calendar icon displayed
   * as a placeholder for the input in favour of the add on button calendar icon.
   *
   * @param {Object} input The jQuery object for the input
   */
  function addDateAddonToInput (input) {
    var placeholderWithoutCalendar = input.attr('placeholder').replace('', '');

    CRM.$('<span class="addon fa fa-calendar"></span>')
      .insertAfter(input)
      .css('margin-top', input.css('margin-top'))
      .css('margin-bottom', input.css('margin-bottom'))
      .on('click', function () {
        input.focus();
      });

    input[0].style.setProperty('width', input.width() - 19 + 'px', 'important');
    input[0].style.setProperty('margin-right', 0, 'important');
    input.css('min-width', 'initial');
    input.attr('placeholder', placeholderWithoutCalendar);
  }

  /**
   * Moves the addon to the input's side
   * @param  {Object} input The jQuery object for the input
   * @param  {Object} addon The jQuery object for the addon
   */
  function moveAddonToInputsSide (input, addon) {
    input.after(addon);
    addon.css('margin-right', 10);
  }

  /**
   * We're debouncing the callback to avoid calling the plugin multiple times
   * during DOM changes
   */
  var observer = new MutationObserver(debounce(function () {
    CRM.$('.crm-container input.hasDatepicker').each(function () {
      var $this = CRM.$(this);
      var addon = $this.siblings('.addon');
      if (!addon.length && !$this.siblings('.input-group-addon').length) {
        addDateAddonToInput($this);
      } else if (addon.length && !$this.next('.addon').length) {
        moveAddonToInputsSide($this, addon);
      }
    });
  }, 500));

  observer.observe(document.querySelector('body'), {
    childList: true,
    subtree: true
  });

  function debounce (fn, delay) {
    var timer = null;
    return function () {
      var me = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(me, args);
      }, delay);
    };
  }
});
;
/**
 * This script is responsible for making the jQuery UI popups take full height
 * of the screen in fullscreen mode.
 */

(function ($) {
  $(document).on('dialogopen', function(e) {
    var $elem = $(e.target);
    var $elemParent = $elem.parent();

    if ($elemParent.hasClass('crm-container') && $elem.dialog('option', 'resizable')) {
      $('.crm-dialog-titlebar-resize', $elemParent).click(function(e) {
        if (!$elem.data('origSize')) {
          $elem.parent('.ui-dialog').removeClass('fullscreen');
        } else {
          var menuHeight = $('#civicrm-menu').outerHeight();
          var titleBarHeight = $elemParent.find('.ui-dialog-titlebar').outerHeight();
          var buttonContainerHeight = $elemParent.find('.ui-dialog-buttonpane').outerHeight();
          var windowHeight = $(window).outerHeight();
          var contentHeight = windowHeight - (titleBarHeight + menuHeight + buttonContainerHeight);

          $elem.parent('.ui-dialog').addClass('fullscreen');
          $elem[0].style.setProperty('height', contentHeight + 'px', 'important' );
        }
      });
    }
  });
})(CRM.$);
;
(function($) {
  function checkMemberThreshold() {
    var recur = $('input[name=is_recur_radio]:checked', '#Main').val();
    var amt = $('input[name=price_18]:checked', '#Main').val();
    //console.log('recur: ', recur);
    //console.log('amt: ', amt);

    //note: amt is the price field value ID, not the actual amount

    //one-time $25
    if (typeof recur != 'undefined' && recur.length === 0 && amt == 49) {
      $('div.join_osi_-section').hide();
    }
    //yearly $25
    else if (recur === 'year' && amt == 49) {
      $('div.join_osi_-section').hide();
    }
    else {
      $('div.join_osi_-section').show();
    }
  }

  checkMemberThreshold();

  $('input[name=is_recur_radio]').click(function() {
    checkMemberThreshold();
  });
  $('input[name=price_18]').click(function() {
    checkMemberThreshold();
  });

  plausible('Donate');
})(CRM.$);
;
(function($, _, ts) {

  /**
   * Make radio buttons more pretty.
   */
  CRM.radiobuttonsFormRadiosAsButtons = function(selector, options) {
    options = typeof options !== 'undefined' ? options : {};

    var button_width = options.button_width || '';
    var button_width_class = (button_width ? 'crm-radio-wrapper-' + button_width + 'px' : '');
    var hide_zero_value = options.hide_zero_value || false;
    var mandatory_field = options.mandatory_field || false;

    $(document).on('crmLoad', function(e) {
      if ($('.crm-form-radio', selector).size()) {
        var $new = $('<div>', {'class': 'content radiobuttons-form-radios-as-buttons'});

        $('.crm-form-radio', selector).each(function() {
          var $this = $(this);
          var $label = $('label[for=' + $(this).attr('id') + ']');
          var id = 'crm-radio-' + $this.attr('name') + '-wrapper';
          var $div = $('<div>', {id: id, 'class': 'crm-radio-wrapper ' + button_width_class});

          // On the Payment Type field "prop" did not work. Using "is" is said to be
          // slower, but should work everywhere.
          if ($this.is(':checked')) {
            $div.addClass('selected');
          }

          $this.removeClass('crm-form-radio');
          $div.append($this);
          $div.append($label);
          $new.append($div);

          if (hide_zero_value && $(this).val() == 0) {
            $div.hide();
          }
        });

        // Check for other non-radio divs, such as recurHelp
        $('*:not(.crm-form-radio)', selector).appendTo($new);

        // This is to make sure we do not have stray nbsps.
        $(selector).replaceWith($new);
      }

      // Add a 'selected' class on clicked labels
      $('.crm-radio-wrapper > label', selector).on('click', function(e) {
        $this = $(this);

        $tbody = $this.closest(selector);
        var already_selected = $this.parent().hasClass('selected');

        $('.crm-radio-wrapper', $tbody).removeClass('selected');

        // Allow deselecting
        if (already_selected && !mandatory_field) {
          $this.parent().find('input.crm-form-radio').prop('checked', false);
          e.preventDefault();
        }
        else {
          $this.parent().addClass('selected');
        }
      });

      // Add a class on the initial selector, for easier CSS theming, but do it only once
      $(selector).addClass('radiobuttons-form-radios-as-buttons');
    });
  };

})(CRM.$, CRM._, CRM.ts('radiobuttons'));
;
(function($, _, ts){

  // This is mostly to handle invoice payment
  // In most other cases, the JS is not loaded.
  if ($('#is_recur').size() == 0) {
    return;
  }

  // Hide the core checkbox, and move the recurring option above the priceset
  $('.crm-section.is_recur-section').hide();
  $('#priceset').before($('.crm-section.is_recur_radio-section'));

  // Move the help text next to the new radio buttons
  $('#recurHelp').appendTo($('.crm-section.is_recur_radio-section .content'));

  // Synchronize the values of the radio and checkbox
  $('input[name=is_recur_radio]').on('change', function() {
    var interval = $('input[name=is_recur_radio]:checked').val();
    var checked = (interval != '');
    $('#is_recur').prop('checked', checked).trigger('change');

    // Frequency unit, if enabled
    if ($('#frequency_unit').size() > 0) {
      $('#frequency_unit').val(interval).trigger('change');
    }
  });

  // Initial state - notably to help with the radiobuttons (extension) integration
  var recur_unit_default = CRM.vars.recurringbuttons.recur_unit_default;

  if ($('#is_recur').prop('checked')) {
    $('input[name="is_recur_radio"][value=""]').prop('checked', false);
    $('input[name="is_recur_radio"][value="' + recur_unit_default + '"]').trigger('click');
  }
  else {
    $('input[name="is_recur_radio"][value=""]').trigger('click');
    $('input[name="is_recur_radio"][value="' + recur_unit_default + '"]').prop('checked', false);
  }

})(CRM.$, CRM._, CRM.ts('recurringbuttons'));
;
