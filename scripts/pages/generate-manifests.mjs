import fs from 'node:fs';
import path from 'node:path';
import { root } from './common.mjs';
import { loadRelease } from './policy.mjs';
export function manifestText(){const{lessons,modules}=loadRelease();const manifest=lessons.map(({htmlSHA256:_htmlSHA256,assets:_assets,approvalRef:_approvalRef,...m})=>({...m,programId:'school-readiness',status:'published'}));return{'src/data/lessonManifest.js':'// Generated from the explicit release allowlist.\nexport const lessonManifest = '+JSON.stringify(manifest,null,2)+';\nexport const publishedLessons = lessonManifest;\n','src/data/moduleManifest.js':'// Generated from site metadata and release allowlist.\nexport const moduleManifest = '+JSON.stringify(modules.map(m=>({...m,lessonIds:manifest.filter(l=>l.moduleId===m.id).map(l=>l.id)})),null,2)+';\n'}}
export function generate(){for(const[p,s]of Object.entries(manifestText()))fs.writeFileSync(path.join(root,p),s)}
