import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { build } from 'vite';
import { root } from './common.mjs';
import { loadRelease, permittedPublic } from './policy.mjs';
import { generate } from './generate-manifests.mjs';
import { releaseRoutes } from './routes.mjs';
loadRelease();generate();const{verifySource}=await import('./verify-source.mjs');verifySource();
await build({root,configFile:path.join(root,'vite.config.js'),publicDir:false});
for(const f of permittedPublic(loadRelease().lessons)){const dest=path.join(root,'dist',f.path);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(root,'public',f.path),dest)}
const entry=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');assert(entry.includes('<head>'));
for(const route of releaseRoutes()){assert(route==='/'||/^\/[a-z0-9/-]+$/.test(route)&&!route.includes('..'));const dest=route==='/'?path.join(root,'dist/index.html'):path.join(root,'dist',route.slice(1),'index.html');if(route!=='/')assert(!fs.existsSync(dest),'Route collision');const script=`<script data-pages-canonical>(function(){var c=${JSON.stringify(route)},p=location.pathname;if(p===(c==='/'?'/index.html':c+'/')||p===(c==='/'?'/index.html':c+'/index.html'))history.replaceState(history.state,'',c+location.search+location.hash)})();</script>`;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,entry.replace('<head>','<head>\n    '+script))}
await import('./verify.mjs');
