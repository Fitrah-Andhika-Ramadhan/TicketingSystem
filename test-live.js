const http = require('http');

async function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/`, (res) => {
      resolve(true);
    }).on('error', () => {
      resolve(false);
    });
  });
}

async function main() {
  const isRunning = await checkPort(3000);
  console.log("Server running on 3000:", isRunning);
}

main();
