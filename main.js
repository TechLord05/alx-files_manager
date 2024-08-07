import dbClient from './utils/db';

const waitConnection = () => new Promise((resolve, reject) => {
  let i = 0;
  const repeatFct = async () => {
    setTimeout(async () => {
      i += 1;
      if (i >= 10) {
        reject(new Error('Connection timeout'));
      } else if (!dbClient.isAlive()) {
        repeatFct();
      } else {
        resolve();
      }
    }, 1000);
  };
  repeatFct();
});

(async () => {
  console.log(dbClient.isAlive());
  try {
    await waitConnection();
    console.log(dbClient.isAlive());
    console.log(await dbClient.nbUsers());
    console.log(await dbClient.nbFiles());
  } catch (error) {
    console.error('Error occurred:', error);
  }
})();
