import { exec } from 'node:child_process';
(async () => {
  exec(
    'npx sta -p ./public/swagger.json  -o ./__generated__ --modular --axios --single-http-client --add-readonly',
  );
})();
