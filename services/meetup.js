const axios = require('axios');
require('dotenv').config({ path: './variables.env' });

const parser = params => {
  const paramsObject = params;
  const { group, endpoint } = params;

  delete paramsObject.group;
  delete paramsObject.endpoint;

  const queryString = Object.keys(paramsObject)
    .map(key => `${key}=${paramsObject[key]}`)
    .join('&');

  return `https://api.meetup.com/${group}/${endpoint}?&${queryString}&key=${
    process.env.MEETUP_API_KEY
  }&sign=true`;
};

const meetup = (querystrings, method) => {
  const validEndpointsSeparatedByCommas = process.env.VALID_ENDPOINTS;
  const splitEndpoints = validEndpointsSeparatedByCommas.split(',');

  if (
    querystrings.group === process.env.VALID_MEETUP_GROUP &&
    splitEndpoints.indexOf(querystrings.endpoint) >= 0
  ) {
    return axios[method.toLowerCase()](parser(querystrings)).catch(error => {
      if (error.response.data.errors) {
        return Promise.reject(error.response.data.errors);
      }

      return Promise.reject('Meetup API error');
    });
  }

  return Promise.reject('Invalid querystrings');
};

module.exports = meetup;
