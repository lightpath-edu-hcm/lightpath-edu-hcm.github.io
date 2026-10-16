import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
export const root=fileURLToPath(new URL('../../',import.meta.url));
export const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
export const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>{assert(!e.isSymbolicLink(),'Symlink denied');return e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]});
export const rel=p=>path.relative(root,p).split(path.sep).join('/');
export const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
export const stable=v=>JSON.stringify(v&&typeof v==='object'?Array.isArray(v)?v.map(x=>JSON.parse(stable(x))):Object.fromEntries(Object.keys(v).sort().map(k=>[k,JSON.parse(stable(v[k]))])):v);
export const sourceBase=['.gitattributes','.gitignore','.oxlintrc.json','.github/workflows/pages.yml','package.json','pnpm-lock.yaml','vite.config.js','index.html','src/App.jsx','src/App.css','src/index.css','src/main.jsx','src/data/programManifest.js','src/data/moduleManifest.js','src/data/lessonManifest.js','release-policy/lesson-allowlist.json','release-policy/published-baseline.json','release-policy/site-modules.json',...['common.mjs','policy.mjs','generate-manifests.mjs','routes.mjs','build.mjs','verify-source.mjs','verify.mjs','prepare-release.mjs','policy-test.mjs','qa.mjs','foundation-files.json','shared-source-hashes.json'].map(p=>'scripts/pages/'+p)];
export function cleanFiles(){const skip=new Set(['.git','node_modules','dist','qa-results']);return fs.readdirSync(root,{withFileTypes:true}).flatMap(e=>{if(skip.has(e.name))return[];assert(!e.isSymbolicLink(),'Root link denied');const p=path.join(root,e.name);return e.isDirectory()?walk(p):[p]}).map(rel).sort()}
export function writeResult(name,value){fs.mkdirSync(path.join(root,'qa-results'),{recursive:true});fs.writeFileSync(path.join(root,'qa-results',name),JSON.stringify(value,null,2)+'\n')}

export function scanPublicText(paths){const findings=[];for(const p of paths){if(!/\.(?:html?|css|mjs|js|jsx|json|ya?ml|md)$/i.test(p))continue;const s=fs.readFileSync(p,'utf8').replace(/data:[^'"\s)<>]+/g,'[INLINE]');const contactScope=rel(p)==='src/App.jsx'||/^dist\/assets\/index-[\w-]+\.js$/.test(rel(p));const scanned=contactScope?s.replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,email=>email==='lightpath.edu.vn'+'@gmail.com'?'[OWNER-APPROVED-CONTACT]':email):s;for(const[type,re]of Object.entries({privateKey:/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,githubToken:/\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/,awsAccessKey:/\bAKIA[A-Z0-9]{16}\b/,localPath:/(?:[A-Z]:[\\/](?:Users|LIGHTPATH|HANHTRANG)|file:\/\/\/)/i,email:/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i}))if(re.test(scanned))findings.push({file:rel(p),type})}assert.equal(findings.length,0,'Sensitive pattern needs review: '+JSON.stringify(findings));return{findings,scope:'Known patterns only; not complete privacy/security certification'}}
