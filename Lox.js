const fs = require('fs');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const Scanner = require('./Scanner');

var hadError = false;

exports.error = function (line, message) {
  report(line, '', message);
};

function report(line, where, message) {
  console.error(`[line ${line}] Error${where}: ${message}`);
  hadError = true;
}

function runFile(path) {
  const data = fs.readFileSync(path, 'utf8');
  //   console.log(data);
  run(data);
  if (hadError) process.exit(65);
}

function run(source) {
  const scanner = new Scanner(source);
  const tokens = scanner.scanTokens();

  tokens.forEach((t) => console.log(t));
}

async function runPrompt() {
  const rl = readline.createInterface({ input, output });

  rl.prompt();
  for await (const line of rl) {
    // Each line in the readline input will be successively available here as
    // `line`.
    if (!line) break;
    run(line);
    hadError = false;
    rl.prompt();
  }
}

(function main(args = process.argv.slice(2)) {
  if (args.length > 1) {
    process.exit(64);
  } else if (args.length === 1) {
    runFile(args[0]);
  } else {
    runPrompt();
  }
})();
