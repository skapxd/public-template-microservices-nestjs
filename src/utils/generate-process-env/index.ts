import { readFile, writeFile } from 'node:fs/promises';

import { Logger } from '@nestjs/common';

import { getLoggerName } from '../get-logger-name';

const name = getLoggerName(__dirname);
const logger = new Logger(name);

export const logic = (fileEnv: string, fileProcessEnvs = '') => {
  const fileEnvAsArr = fileEnv
    .split(/\n|\r/)
    .map((line) => line.trim())
    .map((line) => (line.startsWith('#') ? '' : line))
    .filter(Boolean)
    .map((line) => line.split('=')[0] + ': string;');

  const fileProcessEnvsAsArr = fileProcessEnvs
    .split(/\n|\r/)
    .map((line) => line.trim())
    .filter((e) => e.match(':'));

  for (const line of fileEnvAsArr) {
    const hasLine = fileProcessEnvsAsArr.includes(line);
    if (!hasLine) fileProcessEnvsAsArr.push(line);
  }

  for (const line of [...fileProcessEnvsAsArr]) {
    const hasLine = fileEnvAsArr.includes(line);
    const index = fileProcessEnvsAsArr.indexOf(line);
    if (!hasLine) fileProcessEnvsAsArr.splice(index, 1);
  }

  const template = [
    'declare namespace NodeJS {',
    '  export interface ProcessEnv {',
    ...fileProcessEnvsAsArr.map((line) => '    ' + line),
    '  }',
    '}',
    '',
  ];

  return template;
};

(async () => {
  if (process.env.NODE_ENV === 'test') return;

  const fileEnv = await readFile('.env', 'utf8').catch(() => {
    logger.error('Error: .env file not found');
    return '';
  });

  const fileExampleEnv = await readFile('process.d.ts', 'utf8').catch(() => {
    logger.error('Error: process.d.ts file not found');
    return '';
  });

  const template = logic(fileEnv, fileExampleEnv);

  if (template.length === 0) return;

  await writeFile('process.d.ts', template.join('\n')).catch(() => {
    logger.error('Error: process.d.ts file not created');
  });

  logger.log('process.d.ts file created');
})();
