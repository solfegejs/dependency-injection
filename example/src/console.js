import Application from "solfegejs-application"
import DIBundle from "../../lib/Bundle"
import MyBundle from "./Bundle";

// Create application instance
let application = new Application;
application.addBundle(new DIBundle);
application.addBundle(new MyBundle);

// Load configuration file
//application.loadConfigurationFile(`${__dirname}/config/production.yml`, "yaml");

// Start the application
let parameters = process.argv.slice(2);
application.start(parameters);
