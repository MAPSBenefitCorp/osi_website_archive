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
