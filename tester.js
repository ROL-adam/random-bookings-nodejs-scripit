const {   
  deleteBooking,
  createBooking,
  updateBooking,
} = require('./api');

const { log } = require('./logger');

const { RIO_API_USER }  = require('./const');
const ONE_HOUR_MILI = 3600000

class Tester{
  constructor(from, until, actions, bookings, resources){
    this.from = from;
    this.until = until;
    this.actions = actions;
    this.bookings = bookings;
    this.resources = resources;
  }

  run = async () => {
    for (let action of this.actions) {
      if(!this.bookings.length && action !== 'create') continue;
      switch(action) {
        case 'create':
          await this.bookResource();
          break;
        case 'modify':
          await this.modifyBooking(this.bookings[Math.floor(Math.random() * this.bookings.length)]);
          break;
        case 'delete':
          await this.deleteBooking(this.bookings[Math.floor(Math.random() * this.bookings.length)]);
          break;
        default:
          continue;
      }
    }
  }
  
  bookResource = async () => {
    log(0, 'tester.js', `trying to book resource on ${this.getBookingBody().Zid}`);
    try {
      const { data } = await createBooking(this.getBookingBody());
      log(0, 'tester.js', `booking created on ${this.getBookingBody().Zid}`);
      // TODO: Log to db
      this.bookings.push(data);
    } catch(e) {
      log(2, 'tester.js -> createBooking', e.message, e.extra, e.stack);
    }
  }

  modifyBooking = async (booking) => {
    log(0, 'tester.js', `trying to modify booking with id ${booking.Bid}`);
    try {
      const body = this.getBookingBody(booking.Zid, this.from + ONE_HOUR_MILI, this.until + ONE_HOUR_MILI);
      const { data } = await updateBooking(booking.Bid, body);
      log(0, 'tester.js', `modified booking with id ${booking.Bid}`);
      // TODO: Log to db
    } catch(e) {
      log(2, 'tester.js -> modifyBooking', e.message, e.extra, e.stack);
    }
  }

  deleteBooking = async (booking) => {
    log(0, 'tester.js', `trying to delete booking with id ${booking.Bid}`);
    try {
      const { data } = await deleteBooking(booking.Bid);
      log(0, 'tester.js', `deleted booking with id ${booking.Bid}`);
      const bid = data.Bid;
      const bookingToRemove = this.bookings.find((booking) => booking.Bid === bid);
      const index = this.bookings.indexOf(bookingToRemove);
      this.bookings.splice(index, 1)
      // TODO: Log to db
    } catch(e) {
      log(2, 'tester.js -> deleteBooking', e.message, e.extra, e.stack);
    }
  }

  getBookingBody(zid = this.resources[Math.floor(Math.random() * this.resources.length)].Zid, from = this.from, until = this.until){
    return {
      Attendees: [],
      CheckIn: from,
      Desc: null,
      From: from,
      Owner: RIO_API_USER,
      Private: false,
      Source: "tester:adams",
      Subject: "Test from Adam",
      Until: until,
      Zid: zid,
    }
  }
}


module.exports = Tester;