const auth = require('./auth');
const env = require('../../env');
const request = require('request-promise');
const utility = require('../utility');

module.exports = {
  /**
   * Authentication headers are stored for subsequent requests
   * @type {Object}
   */
  headers: null,

  /**
   * Form digest is stored for subsequent requests
   * @type {String}
   */
  digest: null,

  /**
   * Authenticate and get context before continuing
   * @return {Promise}
   */
  auth() {
    const r = new Promise((resolve, reject) => {
      // Already authenticated
      if (this.headers) {
        resolve();
        return;
      }

      // Authenticate
      auth.authenticate().then((authData) => {
        // Set headers
        this.headers = authData.headers;
        this.headers.Accept = 'application/json;odata=verbose';
        this.headers['content-type'] = 'application/json;odata=verbose';

        // Get form digest
        this.getDigest().then((response) => {
          // Set digest header
          this.digest = response.d.GetContextWebInformation.FormDigestValue;
          this.headers['X-RequestDigest'] = this.digest;
          resolve(response);
        }).catch((response) => {
          reject(response);
        });
      }).catch((response) => {
        reject(response);
      });
    });
    return r;
  },

  /**
   * Execute API request to SharePoint
   * @param  {Object} config
   * @return {Promise}
   */
  request(config = {}) {
    // Options
    const options = utility.config.options({
      body: {},
      headers: {},
      json: true,
      method: 'GET',
      site: '',
      uri: '',
    }, config);

    // Build request URI
    options.site = utility.url.trim(options.site);
    options.uri = utility.url.trim(options.uri);
    const segments = [env.site];
    if (options.site.length) segments.push(options.site);
    segments.push(options.uri);
    const uri = segments.join('/');

    // Request
    const r = new Promise((resolve, reject) => {
      this.auth().then(() => {
        request({
          body: options.body,
          headers: utility.config.options(this.headers, options.headers),
          json: options.json,
          method: options.method,
          uri,
        }).then((response) => {
          resolve(response);
        }).catch((response) => {
          utility.error.handle(response);
          reject(response);
        });
      }).catch((response) => {
        reject(response);
      });
    });
    return r;
  },

  /**
   * Execute GET request
   * @param  {Object} config
   * @return {Promise}
   */
  get(config = {}) {
    // Options
    const options = utility.config.options({
      headers: {},
      site: '',
      uri: '',
    }, config);

    // Request
    const r = new Promise((resolve, reject) => {
      this.request(options).then((response) => {
        resolve(response);
      }).catch((response) => {
        reject(response);
      });
    });
    return r;
  },

  /**
   * Execute POST request
   * @param  {Object} config
   * @return {Promise}
   */
  post(config = {}) {
    // Options
    const options = utility.config.options({
      body: {},
      headers: {},
      method: 'POST',
      site: '',
      uri: '',
    }, config);

    // Request
    const r = new Promise((resolve, reject) => {
      this.request(options).then((response) => {
        resolve(response);
      }).catch((response) => {
        reject(response);
      });
    });
    return r;
  },

  /**
   * Execute MERGE request
   * @param  {Object} config
   * @return {Promise}
   */
  update(config = {}) {
    // Options
    const options = utility.config.options({
      body: {},
      headers: {
        'IF-MATCH': '*',
        'X-HTTP-Method': 'MERGE',
      },
      method: 'POST',
      site: '',
      uri: '',
    }, config);

    // Request
    const r = new Promise((resolve, reject) => {
      this.request(options).then((response) => {
        resolve(response);
      }).catch((response) => {
        reject(response);
      });
    });
    return r;
  },

  /**
   * Execute DELETE request
   * @param  {Object} config
   * @return {Promise}
   */
  delete(config = {}) {
    // Options
    const options = utility.config.options({
      headers: {
        'IF-MATCH': '*',
        'X-HTTP-Method': 'DELETE',
      },
      method: 'POST',
      site: '',
      uri: '',
    }, config);

    // Request
    const r = new Promise((resolve, reject) => {
      this.request(options).then((response) => {
        resolve(response);
      }).catch((response) => {
        reject(response);
      });
    });
    return r;
  },

  /**
   * Get form digest value
   * @return {Promise}
   */
  getDigest() {
    const p = new Promise((resolve, reject) => {
      // Existing digest
      if (this.digest) {
        resolve();
        return;
      }

      // Get digest value
      utility.log.info('Getting context...');
      this.post({
        uri: '_api/contextinfo',
      }).then((response) => {
        utility.log.success('done.\n');
        resolve(response);
      }).catch((response) => {
        utility.error.handle(response);
        reject(response);
      });
    });
    return p;
  },
};
