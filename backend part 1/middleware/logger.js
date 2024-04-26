const { format } = require('date-fns');// Importing the 'format' function from the 'date-fns' library to format dates
const { v4: uuid } = require('uuid');// Importing the 'uuid' function from the 'uuid' library to generate unique identifiers
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;


// Helper function for logging events with a timestamp, unique identifier, message, and saving it to a file
const logEvents = async (message, logFileName) => {
    // Generating a timestamp in the format 'yyyyMMdd\tHH:mm:ss'
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;

    // Creating a log entry with timestamp, unique identifier, message, and a newline character
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        // Checking if the 'logs' directory exists, creating it if it doesn't
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }

        // Appending the log entry to the specified log file
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem);
    } catch (error) {
        // Handling and logging errors if any occur during the file system operations
        console.log(error);
    }
};

// Custom middleware function for logging incoming HTTP requests
const logger = (req, res, next) => {
    // Logging the request method, URL, and origin headers using the logEvents helper function
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log');  
    // add conditions like log only from our url, or only specific request methods to avoid making it too full too quick.

    console.log(`${req.method}  ${req.path}`);

    // Passing control to the next middleware or route handler in the chain
    next();
};


module.exports = { logEvents, logger };
