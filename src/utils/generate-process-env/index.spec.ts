import { logic } from '.';

describe('generate-process-env', () => {
  it('should correctly process a .env string and an empty process.d.ts string', () => {
    const env = 'VAR1=value1\nVAR2=value2\n# VAR3=value3';
    const processEnvs = '';
    const expected = [
      'declare namespace NodeJS {',
      '  export interface ProcessEnv {',
      '    VAR1: string;',
      '    VAR2: string;',
      '  }',
      '}',
      '',
    ];
    expect(logic(env, processEnvs)).toEqual(expected);
  });

  it('should correctly process a .env string and a process.d.ts string', () => {
    const env = 'VAR1=value1\nVAR2=value2';
    const processEnvs = 'VAR3: string;\nVAR4: string;';
    const expected = [
      'declare namespace NodeJS {',
      '  export interface ProcessEnv {',
      '    VAR1: string;',
      '    VAR2: string;',
      '  }',
      '}',
      '',
    ];
    expect(logic(env, processEnvs)).toEqual(expected);
  });

  it('should correctly ignore comments in the .env string', () => {
    const env =
      '# This is a comment\nVAR1=value1\n# Another comment\nVAR2=value2';
    const processEnvs = '';
    const expected = [
      'declare namespace NodeJS {',
      '  export interface ProcessEnv {',
      '    VAR1: string;',
      '    VAR2: string;',
      '  }',
      '}',
      '',
    ];
    expect(logic(env, processEnvs)).toEqual(expected);
  });

  it('should correctly handle an empty .env string and an empty process.d.ts string', () => {
    const env = '';
    const processEnvs = '';
    const expected = [
      'declare namespace NodeJS {',
      '  export interface ProcessEnv {',
      '  }',
      '}',
      '',
    ];
    expect(logic(env, processEnvs)).toEqual(expected);
  });
});
