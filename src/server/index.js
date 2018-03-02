const Logger = require('ocbesbn-logger'); // Logger
const server = require('@opuscapita/web-init'); // Web server
const dbInit = require('@opuscapita/db-init'); // Database

const logger = new Logger({
    context: {
        serviceName: '{{your-service-name}}'
    }
});

if(process.env.NODE_ENV !== 'develop')
    logger.redirectConsoleOut(); // Force anyone using console.* outputs into Logger format.

// Basic database and web server initialization.
// See database : https://github.com/OpusCapita/db-init
// See web server: https://github.com/OpusCapita/web-init
// See logger: https://github.com/OpusCapita/logger
async function init()
{
    const db = await dbInit.init({
        retryTimeout : 1000,
        retryCount : 50,
        consul : {
            host: 'consul'
        }
    });

    await server.init({
        server : {
            port : process.env.port || {{your-port}},
            enableBouncer : true,
            events : {
                onStart: () => logger.info('Server ready. Allons-y!')
            }
        },
        routes : {
            dbInstance : db
        }
    });
}

(() => init().catch(console.error))();
