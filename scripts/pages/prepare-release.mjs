import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { root, hash, walk, writeResult } from './common.mjs';
import { verifySource } from './verify-source.mjs';
const result=verifySource(),destination=path.join(root,'qa-results/release-source');
assert(destination.startsWith(path.join(root,'qa-results')+path.sep));
if(fs.existsSync(destination))assert.deepEqual(walk(destination).map(p=>path.relative(destination,p).split(path.sep).join('/')).sort(),result.sourceFiles.map(f=>f.path).sort(),'Stale release staging: use a new Candidate staging directory');
for(const file of result.sourceFiles){const target=path.join(destination,file.path);assert(target.startsWith(destination+path.sep));fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(root,file.path),target);assert.equal(hash(target),file.sha256)}
writeResult('release-copy-verification.json',{status:'PASS',sourceFiles:result.sourceFiles.length,approvedLessonIds:result.approvedLessonIds,files:result.sourceFiles});
console.log(`Prepared exact public source: ${result.sourceFiles.length} files, ${result.approvedLessonIds.length} lessons`);
