const { spawn, spawnSync, exec, execSync, fork } = require('node:child_process');

const $e = function(bashscript) {
  return new ExecCommand(bashscript);
}

const $s = function(command, args) {
  return new SpawnCommand(command, args);
}

const $f = function(childFile) {
  return new ForkCommand(childFile);
}

class BaseBashCommand {}

class ExecCommand extends BaseBashCommand {
  #processPromise = undefined;
  #process = undefined;
  #stdinBuffer = [];
  constructor(bashscript) {
    super();
    this.bashscript = bashscript;
  }

  offerstdin(stdin) {
    let stdinElement = `${stdin}\n`;
    this.#stdinBuffer.push(stdinElement);
    this.#pushTostdin();
    return this;
  }

  offerstdinFile(filePath) {
    return; //not implemented
  }

  offerEnd() {
    this.#stdinBuffer.push(0);
    this.#pushTostdin();
    return this;
  }

  #pushTostdin() {
    if(this.#process === undefined) return;
    this.#stdinWrite(this.#stdinBuffer.shift());
  }

  #stdinWrite(stdin) {
    if (stdin === 0) this.#process.stdin.end();
    else this.#process.stdin.write(stdin);
  }

  execute() {
    let classScope = this;
    this.#processPromise = new Promise(function(resolve) {
      classScope.stdout = '';
      classScope.stderr = '';
      classScope.#process = exec(classScope.bashscript, {maxBuffer: 10485760}); //max buffer 10mb
      while(classScope.#stdinBuffer.length !== 0) {
        classScope.#stdinWrite(classScope.#stdinBuffer.shift());
      }
      classScope.#process.stdout.on('data', (data) => {
        classScope.stdout += data;
      });
      classScope.#process.stderr.on('data', (data) => classScope.stderr += data);
      classScope.#process.on('exit', (code) => {
        classScope.exitCode = code;
        resolve();
      });
    });
    return this;
  }

  pipeOutputTo() {
    return; //not implemented
  }

  pipeOutputToFile() {
    return; //not implemented
  }

  async waitUntilFinished() {
    if(this.#processPromise === undefined) return this;
    await this.#processPromise;
    return this;
  }
}

class SpawnCommand extends BaseBashCommand {
  

  execute() {

  }

}

class ForkCommand extends BaseBashCommand {

}

module.exports = { $e, $s, $f };