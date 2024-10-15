export const getErrorDetail = (exception: Error) => {
  const errorDetail = exception?.stack
    ?.replace(/\\/g, '/')
    .split('\n')
    .map((line) => line.trim())
    .map((line) => line.replace(/.*\/src/, 'src'))
    .slice(0, 2)
    .join(' -> ');

  return errorDetail ?? 'default message';
};
