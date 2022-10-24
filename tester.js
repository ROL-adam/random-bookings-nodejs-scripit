const {   
  deleteBooking,
  createBooking,
  updateBooking,
} = require('./api');

const { log } = require('./logger');

const { RIO_API_USER }  = require('./const');
const ONE_HOUR_MILI = 3600000

const subjectNames = [
  'Information Meeting',
  'Brainstorming',
  'Catch up',
  'Sprint Planning',
  'UX/UI Meeting',
  'Board Meeting',
  'Meeting with Client',
  'Customer Meeting',
  'Training Session',
  'Revenues Review',
  'Roadmap Planning',
  'Strategy Recap',
  'Release v2',
  'Demo for Customer',
  'One-on-One',
  'Teamwork Exercise',
  'Mist - Hackathon',
  'Mist Specification',
  'Project X - Naming Ideas',
  'Budget Meeting',
  'Veil - What\'s next',
  'The A,B,Cs of Teamwork',
  'Relocating of Software',
  'Meeting with new Client',
  'Quick Booking',
  'Actionable Analytics',
  'Collaboration Games',
  'Story Mapping',
  'Customer Test',
  'Backlog Meeting',
  'Burnup Chart Presentation',
  'Daily Meeting',
  'Lean Development Learning',
  'More Than A Meeting',
  'Name It Do It',
  'The Leadership Insider',
  'Conference Reconstruction',
  'Better Business',
  'Banquets And More',
  'Preach Your Pitch',
  'The Fortitude Forum',
  'Sessions For Success',
  'Contact High',
  'The Scholar\'s Conference',
  'Discuss Success',
  'Prose And Pros',
  'Conference Offense',
  'Fully Immersive',
  'She Leads Conference',
  'Diversity Conferences',
  'The Filing Cabinet',
  'Build Your Base',
  'Total Bionics',
  'Math Of It All',
  'Seismic Opportunities',
  'Formulation Plan',
  'The Success Schematic',
  'Reinforcement Sphere',
  'The Hot Air Meeting',
  'Pitch Place Toe',
  'Just Do Meeting',
  'Deep Learning Meeting',
  'Antipatterns',
  'Digital Divide',
];

const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

const getRandomInt = (max) => Math.floor(Math.random() * max);

const getRandomIntBetween = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const dateAtHour = (date, hour) => new Date(date).setHours(0,0,0,0) + ONE_HOUR_MILI * hour

const getRandomDateBetween = (start, end) =>  new Date(start + Math.random() * (end - start));

const getFromUntil = (start, end, startHour, endHour) => {

  const _date = getRandomDateBetween(start, end);
  const hour1 = getRandomIntBetween(startHour, endHour - 2);
  const hour2 = getRandomIntBetween(hour1 + 1, endHour);

  const from = dateAtHour(_date, hour1)
  const until = dateAtHour(_date, hour2);

  return { from, until };
}

class Tester{
  constructor(startDay, endDay, startTime, endTime,  actions, bookings, resources, users){
    this.startDay = startDay;
    this.endDay = endDay;
    this.startTime = startTime;
    this.endTime = endTime;
    this.actions = actions;
    this.bookings = bookings;
    this.resources = resources;
    this.users = users;
    this.subjectNames = shuffleArray(subjectNames);
  }

  run = async () => {
    for (let action of this.actions) {
      await this.bookResource();
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
    log(0, 'tester.js', `trying to book resource`);
    try {
      const resource = this.resources[getRandomInt(this.resources.length)];
      const user = this.users[getRandomInt(this.users.length)];
      const { from, until } = getFromUntil(this.startDay, this.endDay, this.startTime, this.endTime);
      const { data } = await createBooking(this.getBookingBody(resource, from, until, user));
      log(0, 'tester.js', `booking created on ${resource.Zid} \n date: ${from} - ${until} \n by: ${user.email}`);
      // TODO: Log to db
      this.bookings.push(data);
    } catch(e) {
      log(2, 'tester.js -> createBooking', e.message, e.extra, e.stack);
    }
  }

  // modifyBooking = async (booking) => {
  //   log(0, 'tester.js', `trying to modify booking with id ${booking.Bid}`);
  //   try {
  //     const body = this.getBookingBody(booking.Zid, this.from + ONE_HOUR_MILI, this.until + ONE_HOUR_MILI);
  //     const { data } = await updateBooking(booking.Bid, body);
  //     log(0, 'tester.js', `modified booking with id ${booking.Bid}`);
  //     // TODO: Log to db
  //   } catch(e) {
  //     log(2, 'tester.js -> modifyBooking', e.message, e.extra, e.stack);
  //   }
  // }

  // deleteBooking = async (booking) => {
  //   log(0, 'tester.js', `trying to delete booking with id ${booking.Bid}`);
  //   try {
  //     const { data } = await deleteBooking(booking.Bid);
  //     log(0, 'tester.js', `deleted booking with id ${booking.Bid}`);
  //     const bid = data.Bid;
  //     const bookingToRemove = this.bookings.find((booking) => booking.Bid === bid);
  //     const index = this.bookings.indexOf(bookingToRemove);
  //     this.bookings.splice(index, 1)
  //     // TODO: Log to db
  //   } catch(e) {
  //     log(2, 'tester.js -> deleteBooking', e.message, e.extra, e.stack);
  //   }
  // }

  getBookingBody(resource, from, until, user){
    return {
      Attendees: [],
      CheckIn: from,
      Desc: null,
      From: from,
      Owner: user.email,
      Private: false,
      Source: "tester:script",
      Subject: (resource.Type === 'ROOM' || resource.Type === 'OFFICE') && this.subjectNames.length ?  this.subjectNames.pop() : "Quick Booking",
      Until: until,
      Zid: resource.Zid,
    }
  }
}


module.exports = Tester;