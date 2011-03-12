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
 *    -> format
 *      1. 'time' [DEFAULT]
 *        means the value set into input will be formated as 00:00:00
 *      2. 'number'
 *        means the value set into input will be converted into time number(ms)
 */

(function ($) {
  var tpuuid = new Date().getTime();

  var _i18n   = {};
  _i18n['default'] = {
    am:     'AM',
    pm:     'PM',
    hour:   'Hour(s)',
    minute: 'Minute(s)',
    second: 'Second(s)',
  }

  _i18n['zh_CN'] = {
    am:     '上午',
    pm:     '下午',
    hour:   '小时',
    minute: '分钟',
    second: '秒',
  }

  $.widget("ui.timepicker", {
    options: {
      type:      '12',
      second:    false,
      format:    'time',
      spliter:   ':',
      showUnits: false,
      i18n:      _i18n['default']
    },

    _create: function () {
      tpuuid += 1;
      this.uuid = 'timepicker' + tpuuid;
      this._validateOptions();
      this._populateI18N();
      this._initHTML();
      this._registerEvents();
    },

    _validateOptions: function () {
      if ($.inArray(this.option('type'), ['12', '24', '100']) == -1) {
        this.option('type', '12');
      }
    },

    _populateI18N: function () {
      var i18n = this.option('i18n');
      if (typeof(i18n) == 'string') {
        this.option('i18n', _i18n[i18n]);
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
      this.$units    = this.$elements.find('.timepicker-unit');

      this._toggleElements();
      this._initValue();
    },

    _toggleElements: function () {
      if (this.option('type') != '12') {
        this.$ampm.hide();
      }
      if (!this.option('second')) {
        this.$spliters.eq(1).hide();
        this.$units.eq(2).hide();
        this.$second.hide();
      }
      if (!this.option('spliter')) {
        this.$spliters.hide();
      }
      if (!this.option('showUnits')) {
        this.$units.hide();
      }
    },

    _initValue: function () {
      var value     = this.element.val();
      var matchTime = value.match(/^(\d\d):(\d\d)(:(\d\d))?$/);
      var matchNum  = value.match(/^\d+$/);

      if (matchTime) {
        var hour = parseInt(matchTime[1], 10);
        if (this.option('type') == '12') {
          this.$ampm.find('[value=am]').attr('checked', true);
          if (hour > 11) {
            this.$ampm.find('[value=pm]').attr('checked', true);
            hour = hour - 12;
          }
        }
        if (hour < 10) hour = '0' + hour;
        this.$hour.val(hour);
        this.$minute.val(matchTime[2]);
        if (matchTime[4]) {
          this.$second.val(matchTime[4]);
        }
      } else if (matchNum) {
        var hour = 0, minute = 0, second = 0;
        var time = Math.floor(parseInt(matchNum[0]) / 1000);
        if (time > 0) {
          second = time % 60;
          time   = Math.floor(time / 60);
          if (time > 0) {
            minute = time % 60;
            hour   = Math.floor(time / 60);
          }
        }
        if (this.option('type') == '12') {
          this.$ampm.find('[value=am]').attr('checked', true);
          if (hour > 11) {
            this.$ampm.find('[value=pm]').attr('checked', true);
            hour = hour - 12;
          }
        }
        if (hour   < 10) hour   = '0' + hour;
        if (minute < 10) minute = '0' + hour;
        if (second < 10) second = '0' + hour;

        this.$hour.val(hour);
        this.$minute.val(minute);
        this.$second.val(second);
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
        '<span id="' + this.uuid + '">',
          '<span class="timepicker-ampm">',
            '<input type="radio" value="am" id="' + this.uuid + '-am" name="' + this.uuid + '-ampm" checked="checked"/>',
            '<label for="' + this.uuid + '-am">' + this._i18n('am') + '</label>',
            '<input type="radio" value="pm" id="' + this.uuid + '-pm" name="' + this.uuid + '-ampm" />',
            '<label for="' + this.uuid + '-pm">' + this._i18n('pm') + '</label>',
          '</span>',
          '<select class="timepicker-hour">',
            this._getSelectOptions(parseInt(this.option('type'))).join(''),
          '</select>',
          '<span class="timepicker-unit">' + this._i18n('hour') + '</span>',
          '<span class="timepicker-spliter">' + this.option('spliter') + '</span>',
          '<select class="timepicker-minute">',
            this._getSelectOptions(60).join(''),
          '</select>',
          '<span class="timepicker-unit">' + this._i18n('minute') + '</span>',
          '<span class="timepicker-spliter">' + this.option('spliter') + '</span>',
          '<select class="timepicker-second">',
            this._getSelectOptions(60).join(''),
          '</select>',
          '<span class="timepicker-unit">' + this._i18n('second') + '</span>',
        '</span>'
      ];
      this.$elements = $(elements.join(''));
    },

    _i18n: function (key) {
      return this.option('i18n')[key];
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
        hour = parseInt(hour, 10) + 12;
      }

      var value = hour + ':' + minute;
      if (this.option('second')) value += ':' + second;
      if (this.option('format') == 'number') value = parseInt(second, 10) * 1000 + parseInt(minute, 10) * 60 * 1000 + parseInt(hour, 10) * 60 * 60 * 1000;

      this.element.val(value);
    }
  });
})(jQuery);
