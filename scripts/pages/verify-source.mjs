import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { root, cleanFiles, sourceBase, hash, read, writeResult, scanPublicText } from './common.mjs';
import { loadRelease, permittedPublic } from './policy.mjs';
import { manifestText } from './generate-manifests.mjs';
export function verifySource(){const release=loadRelease(),files=permittedPublic(release.lessons),expected=[...sourceBase,...files.map(f=>'public/'+f.path)].sort();assert.deepEqual(cleanFiles(),expected,'Unapproved/missing public source file');for(const f of files)assert.equal(hash(path.join(root,'public',f.path)),f.sha256,'Approved file hash mismatch '+f.path);for(const[p,sha]of Object.entries(read('scripts/pages/shared-source-hashes.json')))assert.equal(hash(path.join(root,p)),sha,'Shared source changed '+p);for(const[p,text]of Object.entries(manifestText()))assert.equal(fs.readFileSync(path.join(root,p),'utf8'),text,'Manifest contains unapproved mapping/catalog');const scan=scanPublicText(expected.map(p=>path.join(root,p)));const result={scan,status:'PASS',approvedLessonIds:release.lessons.map(l=>l.id),baselineLessonIds:release.baseline.lessons.map(l=>l.id),sourceFiles:expected.map(p=>({path:p,sha256:hash(path.join(root,p)),bytes:fs.statSync(path.join(root,p)).size})),publicFiles:files};writeResult('source-files.json',result);return result}
verifySource();
