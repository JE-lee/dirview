import * as globby from 'globby';
import * as path from 'path';
import { isFile } from './util';

interface Node {
  name: string;
  path: string;
  isFile: boolean;
  child: Array<Node>;
  level: number;
}
export async function walk(
  dir: string = process.cwd(),
  options?: {
    deep: number;
    ignores: string[];
  },
): Promise<string> {
  const paths = await globby(
    ['**', ...(options?.ignores || [])],
    Object.assign(
      {
        onlyFiles: false,
        cwd: dir,
      },
      options,
    ),
  );
  const rootName = path.parse(dir).name;
  const rNode: Node = {
    name: rootName,
    path: rootName,
    isFile: false,
    child: [],
    level: 0,
  };
  const nodeMap: { [prop: string]: Node } = {
    [rootName]: rNode,
  };
  paths.forEach((tpath) => {
    const struct = tpath.split(path.sep);
    struct.forEach((section, index) => {
      const abPath = path.join(...[rootName].concat(struct.slice(0, index + 1)));
      const parent = path.join(...[rootName].concat(struct.slice(0, index)));
      const node = {
        name: section,
        path: abPath,
        isFile: isFile(path.resolve(path.parse(dir).dir, abPath)),
        child: [],
        level: index + 1,
      };

      if (nodeMap[parent]) {
        const isExist = () => {
          return nodeMap[parent].child.some((item) => item.path === node.path);
        };
        if (!isExist()) {
          nodeMap[parent].child.push(node);
          nodeMap[abPath] = node;
        }
      } else {
        throw new Error(`不在${dir}内的文件/文件夹`);
      }
    });
  });
  // 输出
  function deepWalk(
    arr: Array<Node>,
    prefixs: boolean[],
    handler: (node: Node, prefixs: boolean[], last: boolean) => void,
  ) {
    arr.forEach((item, index) => {
      const isLast = index >= arr.length - 1;
      handler(item, prefixs, isLast);
      if (item.child.length) {
        deepWalk(item.child, [...prefixs, !isLast], handler);
      }
    });
  }

  const result: string[] = [];
  deepWalk([rNode], [], (node, prefixs, last) => {
    let line = '';
    // 输出前缀
    for (let i = 1; i < prefixs.length; i++) {
      line += prefixs[i] ? '│  ' : '   ';
    }
    // 输出名字
    if (node.level <= 0) {
      line += '';
    } else {
      line += last ? '└──' : '├──';
    }

    line += node.name;
    line += node.isFile ? '' : '/';
    result.push(line);
  });
  // console.log(result.join('\r\n'));
  // ├ └ ` └── ├── │
  return result.join('\r\n');
}
