/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as fs from 'fs';

export function isFile(file: string) {
  const stat = fs.statSync(file);
  return stat.isFile();
}
