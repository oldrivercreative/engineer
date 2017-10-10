const amp = require('amp-utils');
const bus = require('../bus');
const sharepoint = require('../../sharepoint');
const Task = require('../task');
const utility = require('../../utility');

/**
 * View field resource methods
 * https://msdn.microsoft.com/en-us/library/dn531433.aspx#ViewFieldCollection resource
 */
module.exports = {
  /**
   * Add a view field
   * @param  {Object} params
   * @return {void}
   */
  add(params = {}) {
    // Options
    const options = amp.options({
      field: '',
      list: '',
      onError: (response) => {
        utility.log.error('error.failed');
        utility.error.handle(response);
      },
      onStart: () => {
        utility.log.info('viewField.add', {
          field: options.field,
          list: options.list,
          view: options.view,
        });
      },
      onSuccess: () => {
        utility.log.success('success.done');
      },
      site: bus.site,
      view: '',
    }, params);

    // Override: field
    if (typeof params === 'string') options.field = params;

    // Task
    const task = new Task((resolve) => {
      sharepoint.request.post({
        onError: options.onError,
        onStart: options.onStart,
        onSuccess: options.onSuccess,
        site: options.site,
        uri: `_api/web/lists/getbytitle('${options.list}')/views/getbytitle('${options.view}')/viewfields/addviewfield('${options.field}')`,
      }).then((response) => {
        resolve(response);
      });
    });
    bus.load(task);
  },

  /**
   * Remove a view field
   * @param  {Object} params
   * @return {void}
   */
  remove(params = {}) {
    // Options
    const options = amp.options({
      field: '',
      list: '',
      onError: (response) => {
        utility.log.error('error.failed');
        utility.error.handle(response);
      },
      onStart: () => {
        utility.log.info('viewField.remove', {
          field: options.field,
          list: options.list,
          view: options.view,
        });
      },
      onSuccess: () => {
        utility.log.success('success.done');
      },
      site: bus.site,
      view: '',
    }, params);

    // Override: field
    if (typeof params === 'string') options.field = params;

    // Task
    const task = new Task((resolve) => {
      sharepoint.request.post({
        onError: options.onError,
        onStart: options.onStart,
        onSuccess: options.onSuccess,
        site: options.site,
        uri: `_api/web/lists/getbytitle('${options.list}')/views/getbytitle('${options.view}')/viewfields/removeviewfield('${options.field}')`,
      }).then((response) => {
        resolve(response);
      });
    });
    bus.load(task);
  },

  /**
   * Move a view field
   * @param  {Object} params
   * @return {void}
   */
  move(params = {}) {
    // Options
    const options = amp.options({
      field: '',
      index: 0,
      list: '',
      onError: (response) => {
        utility.log.error('error.failed');
        utility.error.handle(response);
      },
      onStart: () => {
        utility.log.info('viewField.move', {
          field: options.field,
          list: options.list,
          view: options.view,
        });
      },
      onSuccess: () => {
        utility.log.success('success.done');
      },
      site: bus.site,
      view: '',
    }, params);

    // Override: field
    if (typeof params === 'string') options.field = params;

    // Task
    const task = new Task((resolve) => {
      sharepoint.request.post({
        body: {
          field: options.field,
          index: options.index,
        },
        onError: options.onError,
        onStart: options.onStart,
        onSuccess: options.onSuccess,
        site: options.site,
        uri: `_api/web/lists/getbytitle('${options.list}')/views/getbytitle('${options.view}')/viewfields`,
      }).then((response) => {
        resolve(response);
      });
    });
    bus.load(task);
  },
};
