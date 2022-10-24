const LOG = 0;
const WARNING = 1;
const ERROR = 2;

const ALL_TYPES = [LOG, WARNING, ERROR]

const isValidType = (type) => ALL_TYPES.includes(type);
const getTypeString = (type) => {
  switch(type) {
    case 0: return 'LOG'
    case 1: return 'WARNING'
    case 2: return 'ERROR'
  }
}

const getStackMessage = (stack) => { 
  if(stack) 
    return `\nSTACK: \n${stack}\n`; 
  return '';
}

const writeToDbMesage = (writeToDB) => { 
  if(writeToDB) 
    return '\nWRITING TO DATABASE\n';
  return'';
}

const log = (type = 0, file, message, errMessage, stack = '', writeToDB = false) => {
  if (!isValidType(type)) return;

  console.log(
  `-------------------------
${getTypeString(type)}
${file}:
${message}
${errMessage ? JSON.stringify(errMessage) : '\n'}
${getStackMessage(stack)}
${writeToDbMesage(writeToDB)}
-------------------------`
);
  
}

module.exports = { log };