// *****************************************************************************
// Imports
// *****************************************************************************

import { graphql }         from 'graphql';
import { buildSchema }     from 'graphql';
import { Database }        from '../../database';
import { LoadHelper }      from '../../helpers';

// *****************************************************************************
// Class
// *****************************************************************************

export class UserService {

  // ***************************************************************************
  // Public properties
  // ***************************************************************************

  // ***************************************************************************
  // Private properties
  // ***************************************************************************

  private _db: any;
  private static _instance: UserService;

  // ***************************************************************************
  // Public methods
  // ***************************************************************************

  public static getInstance(): UserService {
    if (!UserService._instance) {
      UserService._instance = new UserService();
    }
    return UserService._instance;
  }

  // ***************************************************************************

  public queryUsers(args: any): Promise<any> {
    let find  = {};
    let query = this._db.collection('users');
    
    query = query.find(args.find   || {});
    query = query.sort(args.sort   || {});
    query = query.limit(args.limit || 0);

    return new Promise((resolve, reject) => {
      return query.exec((err: Error, users: any[]) => {
        if (err) {
          return reject(err);
        }
        return resolve(users);
      });
    });
  }

  // ***************************************************************************

  public mutateUsers() {
  }

  // ***************************************************************************
  // Private methods
  // ***************************************************************************

  private constructor() {
    this._db = Database.getInstance().db;
  }

  // ***************************************************************************

  private _populateUsers() {
    const users = [{
      _id: '1',
      username: 'jonDoe',
      password: 'doeTheJon',
      firstName: 'Jon',
      lastName: 'Doe',
    }, {
      _id: '2',
      username: 'janeDoe',
      password: 'doeTheJane',
      firstName: 'Jane',
      lastName: 'Doe',
    }, {
      _id: '3',
      username: 'justinDoe',
      password: 'doeTheJust',
      firstName: 'Justin',
      lastName: 'Doe',
    }];

    return this._db.collection('users').insert({}, (err: Error) => {
      if (err) {
        return console.error(err);
      }
    });
  }

  // ***************************************************************************
}

// *****************************************************************************
