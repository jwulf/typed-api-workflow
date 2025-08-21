export function waitForAnyKey() {
  return new Promise(resolve => {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once('data', (data) => {
      process.stdin.setRawMode(false);
       // If Ctrl+C is pressed, exit
      if (data[0] === 3) process.exit();
      resolve(null);
    });
  });
}