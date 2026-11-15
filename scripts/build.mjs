import {cp,rm,mkdir,writeFile} from 'node:fs/promises';
import sharp from 'sharp';
const root=new URL('../',import.meta.url),dist=new URL('dist/',root);
await rm(dist,{recursive:true,force:true});await mkdir(dist,{recursive:true});
await cp(new URL('public/',root),dist,{recursive:true});
for(const [name,size] of [['favicon.png',32],['apple-touch-icon.png',180],['icon-192.png',192],['icon-512.png',512]])await sharp(new URL('public/assets/logo.svg',root).pathname).resize(size,size).png().toFile(new URL(`assets/${name}`,dist).pathname);
await writeFile(new URL('.nojekyll',dist),'');console.log('Built static word-house into dist/');
