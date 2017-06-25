// *****************************************************************************
// Imports
// *****************************************************************************

import * as express             from 'express';
import * as graphqlHTTP         from 'express-graphql';
import * as bodyParser          from 'body-parser';

import { graphql }              from 'graphql';
import { buildSchema }          from 'graphql';
import { LoadHelper }           from './helpers';
import { UserController }       from './api/user';
import { Settings }             from './settings';

// *****************************************************************************
// Class
// *****************************************************************************

class Server {

  // ***************************************************************************
  // Public properties
  // ***************************************************************************
  
  public app: express.Application;

  // ***************************************************************************
  // Private properties
  // ***************************************************************************

  private _settings: Settings;

  // ***************************************************************************
  // Public methods
  // ***************************************************************************

  /**
   * Constructor of the server.
   *
   * @public
   * @constructor
   * @return {<Server>Object} - returns an instance of the Server class
   */
  constructor() {

    // get instance of settings singleton
    this._settings = Settings.getInstance();

    // setup the express app
    this.app = express();

    // setup the Express config
    this._setupConfig();

    // setup the API routes and entry points
    this._setupAPI();

    // listen to to the server
    this.app.listen(this._settings.port, () => {
      console.info(`Server is running under port ${this._settings.port}.`);
    });
  }

  // ***************************************************************************
  // Private methods
  // ***************************************************************************

  /**
   * Private method to setup the Express configuration.
   *
   * @private
   */
  private _setupConfig() {
    this.app.use(/\/((?!graphql).)*/, bodyParser.urlencoded({ extended: true }));
    this.app.use(/\/((?!graphql).)*/, bodyParser.json());
  }

  // ***************************************************************************
  
  /**
   * Private method to setup API routes and entry points.
   *
   * @private
   */
  private _setupAPI() {
    const userController = new UserController(this.app);
  }

  // ***************************************************************************
  
  /**
   * Private method to setup the error handler.
   *
   * @private
   */
  private _setupErrorHandling() {
    this.app.use((
        err : Error,
        req : express.Request,
        res : express.Response,
        next: express.NextFunction,
      ) => {
      console.error(err);
      return res.json({ errors: ['Some error occurred!'] });
    });
  }

  // ***************************************************************************
}

// *****************************************************************************
// Start server
// *****************************************************************************

const server = new Server();

// *****************************************************************************
