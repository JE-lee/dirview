> 在终端中通过简单的命令输出目录结构视图

## usage
```bash
npm install -g dirview
cd src
dirview -d 4 -i node_modules
```

输出
```
dv/
├──LICENSE
├──README.md
├──__tests__/
├──lib/
│  ├──action.d.ts
│  ├──action.js
│  ├──cli.d.ts
│  ├──cli.js
│  ├──index.d.ts
│  ├──index.js
│  ├──util.d.ts
│  └──util.js
├──package-lock.json
├──package.json
├──src/
│  ├──action.ts
│  ├──cli.ts
│  ├──index.ts
│  └──util.ts
├──tree.md
├──tsconfig.json
└──yarn.lock
```