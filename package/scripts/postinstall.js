import copy from 'gently-copy';
const files = ['src/routes/admin', 'src/routes/[...path].ts', 'src/routes/[...path].svelte'];
const path = process.env.INIT_CWD;
copy(files, path);
