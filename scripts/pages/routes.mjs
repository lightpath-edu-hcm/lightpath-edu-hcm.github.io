import { programManifest } from '../../src/data/programManifest.js';
import { loadRelease } from './policy.mjs';
export function releaseRoutes(){const{lessons,modules}=loadRelease();return[...new Set(['/',...programManifest.map(p=>'/'+p.slug),...modules.map(m=>'/hanh-trang-vao-lop-1/'+m.slug),...lessons.map(l=>'/hanh-trang-vao-lop-1/'+l.slug)])]}
