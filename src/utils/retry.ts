import { duration } from './duration';

export const retry = async <T>({
  fn,
  retriesLeft = 3,
  interval = duration({ seconds: 10 }),
}: {
  fn?: (retriesLeft?: number) => Promise<T>;
  retriesLeft?: number;
  interval?: number;
}): Promise<T> => {
  return new Promise((resolve, reject) => {
    fn?.(retriesLeft)
      .then(resolve)
      .catch((error) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            // reject('maximum retries exceeded');
            reject(error);
            return;
          }
          // Passing on "reject" is the important part
          retry<T>({
            fn,
            retriesLeft: retriesLeft - 1,
            interval,
          }).then(resolve, reject);
        }, interval);
      });
  });
};
