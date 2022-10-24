const Data = require('./data');
const { log } = require('./logger');
const Tester = require('./tester');

const { USERS }  = require('./const');


/*--- Helper ---*/
const getRandomInt = (max) => Math.floor(Math.random() * max)

/*--- Time stuff ---*/
const ONE_HOUR_MILI = 3600000
const today = new Date();
const tomorrow = new Date(today).setDate(today.getDate() + 1);
const nextWeekToday = new Date(today).setDate(today.getDate() + 7);
const dayNextMonth = new Date(today).setDate(today.getDate() + 32);

const dateAtHour = (date, hour) => new Date(date).setHours(0,0,0,0) + ONE_HOUR_MILI * hour
const getRandomDateInFuture = (maxDaysInFuture = 7) => new Date(today).setDate(today.getDate() + getRandomInt(maxDaysInFuture))
const randomActions = (maxValue = 5) => {
  const actions = [];
  for(let i = 0; getRandomInt(maxValue); i+=1) {
    const value = getRandomInt(3)
    if(value === 0) actions.push('create')
    if(value === 1) actions.push('modify')
    if(value === 2) actions.push('delete')
  }
  return actions;
} 

const main = async () => {
  log(0, 'index.js', 'UP AND RUNNING');
  await Data.fetchZones();

  log(0, 'index.js', 'Running tests');
  // const dayOfBooking = getRandomDateInFuture();
  const startDay = new Date(today).setDate(today.getDate());
  const endDay = nextWeekToday;
  const startTime = 8;
  const endTime = 17;
  // const from = dateAtHour(dayOfBooking, 12);
  // const until = dateAtHour(dayOfBooking, 16);
  const actions = Array(50).fill('create'); // randomActions();
  const users = USERS;
  // await Data.fetchBookings(today.getTime(), dayNextMonth);
  try{ 
    await new Tester(startDay, endDay, startTime, endTime, actions, [], Data.bookableZones, users).run();
  } catch(e) {
    console.log(e);
    log(2, 'index.js', `Encoutered an error when running actions ${actions} from ${from} until ${until}`)
  }
}

main();