/* eslint-env node */
import { existsSync, readFileSync } from 'node:fs';
import { rmdir, symlink } from 'node:fs/promises';
import * as path from 'path';
import chalk from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

/** Link build to User Data folder */

const argv = await yargs(hideBin(process.argv))
  .option('c', {
    alias: 'clean',
    describe: 'remove the link instead of creating one',
  })
  .help()
  .parse();
const config = JSON.parse(readFileSync('foundryconfig.json', 'utf-8'));
const name = 'xdy-dragonbane-workbench';
const destDir = 'modules';

let linkDir;
if (config.dataPath) {
  if (!existsSync(path.join(config.dataPath, 'Data'))) {
    throw Error('User Data path invalid, no Data directory found');
  }

  linkDir = path.join(config.dataPath, 'Data', destDir, name);
} else {
  throw Error('No User Data path defined in foundryconfig.json');
}
const linkDirExists = existsSync(linkDir);
if (argv.clean || argv.c) {
  if (linkDirExists) {
    console.log(chalk.green(`Removing link to ${chalk.blueBright(linkDir)}`));
    await rmdir(linkDir);
  } else {
    console.log(chalk.yellow('No directory to remove'));
  }
} else if (!linkDirExists) {
  console.log(chalk.green(`Creating link to ${chalk.blueBright(linkDir)}`));
  await symlink(path.resolve('./dist'), linkDir, 'dir');
}
