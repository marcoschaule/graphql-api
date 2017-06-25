// *****************************************************************************
// Imports
// *****************************************************************************

import { graphql }         from 'graphql';
import { buildSchema }     from 'graphql';
import { GraphQLSchema }   from 'graphql';
import { Application }     from 'express';

import * as graphqlHTTP    from 'express-graphql';
import * as bodyParser     from 'body-parser';

import { UserService }     from './';
import { Settings }        from '../../settings';
import { LoadHelper }      from '../../helpers';

// *****************************************************************************
// Class
// *****************************************************************************

export class UserController {

  // ***************************************************************************
  // Public properties
  // ***************************************************************************

  // ***************************************************************************
  // Private properties
  // ***************************************************************************

  private _appRef     : Application;
  private _schema     : GraphQLSchema;
  private _settings   : Settings;
  private _userService: UserService;
  private _apiURL  = '/graphql/users';

  // ***************************************************************************
  // Public methods
  // ***************************************************************************

  constructor(_appRef: Application) {
    this._appRef   = _appRef;
    this._settings = Settings.getInstance();
    this._userService = UserService.getInstance();

    this._setupSchema();
    this._setupQuery();
    this._setupMutation();
  }

  // ***************************************************************************
  // Private methods
  // ***************************************************************************

  private _setupSchema() {
    const schemaUser = LoadHelper.load('api/user/user.schema.gql');
    const schema = buildSchema(`
      ${schemaUser}

      type Query {
        user(find: User, sort: User, limit: number = 0, offset: number = 0): User
      }
    `);

    this._schema = schema;
  }

  // ***************************************************************************
  
  public _setupQuery() {
    this._appRef.get(this._apiURL, graphqlHTTP({
      schema   : this._schema,
      rootValue: { user: this._userService.queryUsers },
      graphiql : !this._settings.isProduction,
    }));
  }

  // ***************************************************************************
  
  public _setupMutation() {
    this._appRef.post(this._apiURL, graphqlHTTP({
      schema   : this._schema,
      rootValue: { user: this._userService.mutateUsers },
    }));
  }

  // ***************************************************************************
}

// *****************************************************************************
