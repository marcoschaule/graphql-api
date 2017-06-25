'use strict';

// *****************************************************************************
// Imports
// *****************************************************************************

const mongojs = require('mongojs');

// *****************************************************************************
// Class
// *****************************************************************************

export class Database {

  // ***************************************************************************
  // Public properties
  // ***************************************************************************
  
  db: any;

  // ***************************************************************************
  // Private properties
  // ***************************************************************************

  private static _instance: Database;

  // ***************************************************************************
  // Public methods
  // ***************************************************************************

  public static getInstance(): Database {
    if (!Database._instance) {
      Database._instance = new Database();
    }
    return Database._instance;
  }

  // ***************************************************************************
  // Private methods
  // ***************************************************************************

  private constructor() {
    this.db = mongojs('mongodb://localhost:27017/hydra', ['users', 'roles'])
  }

  // ***************************************************************************
}

// *****************************************************************************