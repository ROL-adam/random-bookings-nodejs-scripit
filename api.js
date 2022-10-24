const axios = require('axios');
const { RIO_API_USER, RIO_API_USER_PASSWORD, COMPANY_ID }  = require('./const');

const baseUrl = 'https://dev-api.riocompanion.com'
const coreClient = axios.create({
  responseType: 'json',
});
coreClient.interceptors.request.use((config) => {
  const headers = {
    'idesk-auth-method': 'up',
    'idesk-auth-username': RIO_API_USER,
    'idesk-auth-password': RIO_API_USER_PASSWORD,
    Accept: 'application/vnd.idesk-v5+json',
    'Content-Type': 'application/vnd.idesk-v5+json',
  };
  const errorContext = new Error("Thrown at:");
  Object.assign(config, { headers, errorContext });
  return config;
})

coreClient.interceptors.response.use(undefined, async error => {
  const originalStackTrace = error.config?.errorContext?.stack;
  if (originalStackTrace) {
    error.stack = `${originalStackTrace}`;
  }
  error.extra = error.response.data;
  // console.log(error.response.data);
  // data: {
  //   ICode: 0,
  //   Code: 'E_GENERAL_ERROR',
  //   Message: 'Could not create/update/delete booking in external system'
  // }

  throw error;
});

const updateBooking = (bid, booking) => coreClient.put(`${baseUrl}/booking/booking/${bid}`, booking);
const deleteBooking = (bid) => coreClient.delete(`${baseUrl}/booking/booking/${bid}`);
const createBooking = (booking) => coreClient.post(`${baseUrl}/booking/booking`, booking);
const getZone = (zid) => coreClient.get(`${baseUrl}/core/zone/${zid}`);
const getCompanyZones = () => coreClient.get(`${baseUrl}/core/zone?realm=true&parent=${COMPANY_ID}`);
const getCompanyBookings = (realm, parent, from, until) => coreClient.get(`${baseUrl}/booking/booking/merged?realm=${realm}&parent=${parent}&from=${from}&until=${until}&&attendee=false`);
const getZoneBookings = (zid, from, until) => coreClient.get(`${baseUrl}/booking/booking?zid=${zid}&from=${from}&until=${until}`);
const getUserBookings = (username, from, until) => coreClient.get(`${baseUrl}/booking/booking?attendee=true&from=${from}&until=${until}&username=${username}`);

module.exports = {
  deleteBooking,
  createBooking,
  updateBooking,
  getZone,
  getCompanyBookings,
  getCompanyZones,
  getZoneBookings,
  getUserBookings,
};