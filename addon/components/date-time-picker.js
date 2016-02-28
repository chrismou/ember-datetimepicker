import Ember from 'ember';
import moment from 'moment';

const {
  Component,
  get,
  on,
  observer,
  computed,
  run,
  run: { scheduleOnce },
  $: { proxy }
} = Ember;

function formatDate(date) {
  return moment(date).format('YYYY/MM/DD H:mm');
}

const MyComponent = Component.extend({
  tagName: 'input',
  classNames: ['date-time-picker'],

  _changeHandler(event) {
    run(() => {
      let newValue = Ember.$(event.target).val(),
          oldValue = get(this, 'datetime'),
          newDatetime, newDatetimeFormat, oldDatetimeFormat;
      if (newValue) {
        newDatetime = new Date(newValue);
        newDatetimeFormat = formatDate(newDatetime);
      }
      if (oldValue) {
        oldDatetimeFormat = formatDate(oldValue);
      }

      if (newDatetimeFormat === oldDatetimeFormat) {
        return;
      }

      this.sendAction('action', newDatetime);
    });
  },
  _changeHandlerProxy: computed(function() {
    return proxy(this._changeHandler, this);
  }),

  _datetimeChanged: observer('datetime', function() {
    this._updateValue();
  }),

  _updateValue() {
    let value, datetime = get(this, 'datetime');
    if (datetime) {
      value = formatDate(datetime);
    } else {
      value = '';
    }
    this.$().val(value);
  },

  setUp: on('didInsertElement', function() {
    let changeHandler = get(this, '_changeHandlerProxy');
    let options = get(this, 'options') || {};

    this._updateValue();

    scheduleOnce('afterRender', () => {
      this.$()
        .datetimepicker(options)
        .on('change', changeHandler);
    });
  }),

  tearDown: on('willDestroyElement', function() {
    let changeHandler = get(this, '_changeHandlerProxy');

    this.$()
      .off('change', changeHandler)
      .datetimepicker('destroy');
  })
});

MyComponent.reopenClass({
  positionalParams: ['datetime']
});

export default MyComponent;
