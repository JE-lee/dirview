#!/usr/bin/env node
import { walk } from './action';
import { program } from 'commander';

program
  .version('0.0.1')
  .option('-d, --deep <depth>', '遍历文件夹深度')
  .option('-i, --ignore <igs>', '忽略的文件夹，用 , 隔开');

program.parse(process.argv);

const options = program.opts();
walk(process.cwd(), {
  deep: options.deep ? parseInt(options.deep) : Infinity,
  ignores: (options.ignore || '')
    .trim()
    .split(',')
    .filter((_: any) => !!_)
    .map((pattern: string) => `!${pattern}`),
}).then((struct) => {
  console.log(struct);
});
