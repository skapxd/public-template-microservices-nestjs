import { readFile, writeFile } from 'node:fs/promises';

import { Logger } from '@nestjs/common';

import { getLoggerName } from '../get-logger-name';

const name = getLoggerName(__dirname);
const logger = new Logger(name);

export const logic = (fileEnv: string, fileExampleEnv = '') => {
  const fileEnvAsArr = fileEnv
    .split(/\n|\r/)
    .map((line) => line.trim())
    .map((line) => (line.startsWith('#') ? '' : line))
    .filter(Boolean)
    .map((line) => line.split('=')[0].trim() + '=""');

  const fileExampleEnvAsArr = fileExampleEnv
    .split(/\n|\r/)
    .map((line) => line.trim())
    .filter((e) => e.match('='))
    .filter(Boolean)
    .map((line) => line.split('=')[0].trim() + '=""');

  for (const line of fileEnvAsArr) {
    const hasLine = fileExampleEnvAsArr.includes(line);
    if (!hasLine) fileExampleEnvAsArr.push(line);
  }

  for (const line of [...fileExampleEnvAsArr]) {
    const hasLine = fileEnvAsArr.includes(line);
    const index = fileExampleEnvAsArr.indexOf(line);
    if (!hasLine) fileExampleEnvAsArr.splice(index, 1);
  }

  return fileExampleEnvAsArr;
};

(async () => {
  if (process.env.NODE_ENV === 'test') return;

  const fileEnv = await readFile('.env', 'utf8').catch(() => {
    logger.error('Error: .env file not found');
    return '';
  });

  const fileExampleEnv = await readFile('.example.env', 'utf8').catch(() => {
    logger.error('Error: .example.env file not found');
    return '';
  });

  const arr = logic(fileEnv, fileExampleEnv);

  await writeFile('.example.env', arr.join('\n')).catch(() => {
    logger.error('Error: .example.env file not created');
  });

  logger.log('.example.env file created');
})();
