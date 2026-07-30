import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function runCLI(...参数) {
  return new Promise((resolve) => {
    const indexPath = path.resolve(__dirname, '../src/index.js');
    const 命令 = `node "${indexPath}" ${参数.join(' ')}`;

    exec(命令, { timeout: 10000, cwd: __dirname }, (err, stdout, stderr) => {
      resolve({
        stdout: stdout || '',
        stderr: stderr || '',
        exitCode: err ? (err.code || 1) : 0,
      });
    });
  });
}
