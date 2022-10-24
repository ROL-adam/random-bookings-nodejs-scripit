const {   
  getCompanyZones,
  getUserBookings,
  deleteBooking,
} = require('./api');

const { log } = require('./logger');

const { RIO_API_USER, COMPANY_ID }  = require('./const');

class Data{
  constructor(){
    this.companyId = COMPANY_ID;
    this.bookableZones = [];
    this.userBookings = [];
  }

  async fetchZones(){
    log(0, 'data.js', `fetching zones for company with ${COMPANY_ID}`);
    const { data: zones } = await getCompanyZones(COMPANY_ID);
    this.bookableZones = zones.filter((zone) => zone.Bookable);
  }

  async fetchBookings(from, until){
    log(0, 'data.js', `fetching user bookings for user ${RIO_API_USER}`);
    const {data: bookings } = await getUserBookings(RIO_API_USER, from, until);
    this.userBookings = bookings;
  }

  /* Not being used */
  async deleteAllUserBookings(){
    await this.fetchBookings();
    log(0, 'data.js', `deleting user bookings for user ${RIO_API_USER}`);
    bookableZones.forEach((booking) => {
      log(0, 'data.js', `deleting user bookings with id ${booking.Bid}`);
      deleteBooking(booking.Bid);
    })
  }

}

module.exports = new Data();