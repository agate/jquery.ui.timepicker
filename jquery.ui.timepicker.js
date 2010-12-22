/**
 * jQuery UI Timepicker
 *
 * Author: Hao Hong
 * Mail:   agate.hao@gmail.com
 * Blog:   http://agatezone.cn/code
 *
 * Depends:
 *	jquery.ui.core.js
 *
 * Document:
 *  Options:
 *    -> type
 *      1. 12 [DEFAULT]
 *        means this timepicker is using 12h format
 *        it will contains am/pm radios and hour selecter values from 00 to 11
 *      2. 24
 *        means this timepicker is using 24h format
 *        it will not contains am/pm radios and hour selecter values from 00 to 23
 *      3. 100
 *        means this timepicker is a pure time picker
 *        it will not contains am/pm radios and hour selecter values from 00 to 99
 *    -> second
 *      1. true
 *        means timepicker will show the second selectbox
 *      2. false [DEFAULT]
 *        means timepicker will not show the second selectbox
 */

(function ($) {
  var tpuuid = new Date().getTime();

  $.widget("ui.timepicker", {
    options: {
      type:   '12',
      second: false
    },

    _create: function () {
      tpuuid += 1;
      this.uuid = 'timepicker' + tpuuid;
      this.element.addClass(this.uuid);
      this._validateOptions();
      this._initHTML();
      this._registerEvents();
    },

    _validateOptions: function () {
      if ($.inArray(this.option('type'), ['12', '24', '100']) == -1) {
        this.option('type', '12');
      }
    },

    _initHTML: function () {
      this._buildElements();
      this.element.hide();
      this.$elements.insertAfter(this.element);

      this.$ampm     = this.$elements.find('.timepicker-ampm:first');
      this.$hour     = this.$elements.find('.timepicker-hour:first');
      this.$minute   = this.$elements.find('.timepicker-minute:first');
      this.$second   = this.$elements.find('.timepicker-second:first');
      this.$spliters = this.$elements.find('.timepicker-spliter');

      this._toggleElements();
      this._initValue();
    },

    _toggleElements: function () {
      if (this.option('type') != '12') {
        this.$ampm.hide();
      }
      if (!this.option('second')) {
        this.$spliters.eq(1).hide();
        this.$second.hide();
      }
    },

    _initValue: function () {
      var matchResult = this.element.val().match(/^(\d\d):(\d\d)(:(\d\d))?$/);
      if (matchResult) {
        this.$hour.val(matchResult[1]);
        this.$minute.val(matchResult[2]);
        if (matchResult[4]) {
          this.$second.val(matchResult[4]);
        }
      } else {
        this._updateElementValue();
      }
    },

    _registerEvents: function () {
      this.$ampm.click((function (self) {
        return function () {
          self._updateElementValue();
        }
      })(this));
      this.$hour.bind('click change blur', (function (self) {
        return function () {
          self._updateElementValue();
        }
      })(this));
      this.$minute.bind('click change blur', (function (self) {
        return function () {
          self._updateElementValue();
        }
      })(this));
      this.$second.bind('click change blur', (function (self) {
        return function () {
          self._updateElementValue();
        }
      })(this));
    },

    _buildElements: function () {
      var elements = [
        '<span>',
          '<span class="timepicker-ampm">',
            '<input type="radio" value="am" id="' + this.uuid + '-am" name="' + this.uuid + '-ampm" checked="checked"/>',
            '<label for="' + this.uuid + '-am">AM</label>',
            '<input type="radio" value="pm" id="' + this.uuid + '-pm" name="' + this.uuid + '-ampm" />',
            '<label for="' + this.uuid + '-pm">PM</label>',
          '</span>',
          '<select class="timepicker-hour">',
            this._getSelectOptions(parseInt(this.option('type'))).join(''),
          '</select>',
          '<span class="timepicker-spliter">:</span>',
          '<select class="timepicker-minute">',
            this._getSelectOptions(60).join(''),
          '</select>',
          '<span class="timepicker-spliter">:</span>',
          '<select class="timepicker-second">',
            this._getSelectOptions(60).join(''),
          '</select>',
        '</span>'
      ];
      this.$elements = $(elements.join(''));
    },

    _getSelectOptions: function (to) {
      var options = [];
      for (var i=0; i<to; i++) {
        var option = i < 10 ? '0' + i : i;
        options.push('<option value="'+ option +'">' + option + '</option>');
      }
      return options;
    },

    _updateElementValue: function () {
      var hour   = this.$hour.val();
      var minute = this.$minute.val();
      var second = this.$second.val();

      if (this.option('type') == '12' && this.$ampm.find('input:checked').val() == 'pm') {
        hour = parseInt(hour) + 12;
      }

      var value = hour + ':' + minute;
      if (this.option('second')) value += ':' + second;

      this.element.val(value);
    }
  });
})(jQuery);
