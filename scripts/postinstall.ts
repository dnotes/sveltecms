import copy from 'gently-copy'
const files = [ 'src/routes/admin' ]
const path = process.env.INIT_CWD

copy(files,path)
