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

const settings = LoadHelper.load('../package.json');

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

  private _port        : number;
  private _isProduction: boolean;

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
    
    // is application run in production mode?
    this._isProduction = process.env.NODE_ENV === 'production';

    // get port depending on environment
    this._port = this._isProduction ? settings.port : settings.devPort;

    // setup the express app
    this.app = express();

    // setup the Express config
    this._setupConfig();

    // setup the API routes and entry points
    this._setupAPI();

    // listen to to the server
    this.app.listen(this._port, () => {
      console.info(`Server is running under port ${this._port}.`);
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

    // Construct a schema, using GraphQL schema language
    const schema = buildSchema(`
      ${userController.schema}
      
      type Query {
        user: User
      }
    `);
    
    // The root provides a resolver function for each API endpoint
    const root = {
      user: userController.resolve,
    };

    this.app.use('/graphql', graphqlHTTP({
      schema   : schema,
      rootValue: root,
      pretty   : true,
      graphiql : true,
    }));
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
