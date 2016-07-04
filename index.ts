import {existsSync,unlinkSync} from 'fs';
import {createServer,IncomingMessage,ServerResponse} from 'http';

import {parallel} from 'async';
import {getPort} from 'portfinder';


// Same type as the first argument of `http.createServer`.
export interface RequestListener {
  (request: IncomingMessage, response: ServerResponse): void;
}

export function devlisten(name: string, requestListener: RequestListener, cb: (err: Error, addresses: string[]) => void): any {
  parallel<string>([
    function(callback) {
      const host = '0.0.0.0';
      getPort({port: 8080, host: host}, function(err, port) {
        if (err) { throw err; }
        createServer(requestListener).listen(port, host, function(err: any) {
          callback(err, `http://${host}:${port}`);
        });
      });
    },
    function(callback) {
      if (process.env.BOXEN_SOCKET_DIR) {
        const socketPath = process.env.BOXEN_SOCKET_DIR + '/' + name;
        if (existsSync(socketPath)) {
          unlinkSync(socketPath);
        }
        createServer(requestListener).listen(socketPath, function(err: any) {
          callback(err, `http://${name}.dev`);
        });
      } else {
        callback(null, null);
      }
    },
  ], function(err, results) {
    if (err) {
        cb(err, null);
    } else {
        cb(null, results.filter(x => x !== null));
    }
  });
}
