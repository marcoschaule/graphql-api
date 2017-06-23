// *****************************************************************************
// Imports
// *****************************************************************************

import * as fs   from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

// *****************************************************************************
// Class
// *****************************************************************************

export class LoadHelper {

  // ***************************************************************************
  // Static methods
  // ***************************************************************************

  /**
   * Static method to load any file base on the file extension.
   *
   * @static
   * @param  { string } file - string of the name of the file to be load
   * @return { any }         - any type of the content of the file
   */
  static load(file: string): any {
    const ext = path.extname(file);

    switch (ext) {
      case '.js':
        return require(file);
      case '.json':
        return JSON.parse(_readFileSync(file));
      case '.yaml':
      case '.yml':
        return yaml.safeLoad(_readFileSync(file));
      case '.graphql':
      case '.gql':
        return _readFileSync(file);
      default:
        return _readFileSync(file);
    }
  }

  // ***************************************************************************
}

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Private helper function to load a file synchronous with options.
 *
 * @static
 * @param  { String } file - string of the name of the file to be loaded
 * @return { String }      - string of the content of the file
 */
function _readFileSync(file: string): string {
  return fs.readFileSync(path.join(__dirname, '../', file), { encoding: 'utf8', flag: 'r' });
}

// *****************************************************************************
