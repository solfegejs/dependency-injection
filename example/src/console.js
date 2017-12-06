import solfege from "solfegejs"
import DIBundle from "../../lib/Bundle"
import MyBundle from "./Bundle";

// Create application instance
let application = new solfege.Application;
application.addBundle(new DIBundle);
application.addBundle(new MyBundle);

// Load configuration file
//application.loadConfigurationFile(`${__dirname}/config/production.yml`, "yaml");

// Start the application
let parameters = process.argv.slice(2);
application.start(parameters);
