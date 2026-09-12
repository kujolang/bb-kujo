import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const read = p => readFile(join(root,p),'utf8');
const outputs = [];
let tokens = '';
let marks = '';
for (const mode of ['light','dark']) {
const p = JSON.parse(await read(mode === 'dark' ? 'themes/palette.json' : 'themes/palette-light.json'));
const v = key => `var(--kujo-${key})`;
const map = {};
const assign = (keys,value) => keys.split(' ').forEach(k => map[k]=value);
assign('canvas background surface-recessed-solid',v('canvas'));
assign('ink foreground card-foreground popover-foreground secondary-foreground accent-foreground sidebar-foreground sidebar-accent-foreground pill-foreground pill-icon',v('text'));
assign('card popover sidebar surface-raised-solid surface-recessed-soft-solid',v('surface-1'));
assign('secondary accent muted sidebar-accent',v('surface-3'));
assign('muted-foreground readback-foreground',v('text-muted'));
assign('subtle-foreground',v('text-faint'));
assign('primary ring sidebar-ring version-upgrade timeline-accent file-accent',v('interactive'));
assign('primary-foreground destructive-foreground',v('canvas'));
assign('destructive destructive-text diff-removed',v('danger'));
assign('warning warning-text attention',v('warning'));
assign('success success-foreground diff-added',v('success'));
assign('border border-hairline border-seam border-seam-vertical sidebar-border pill-surface-border',v('border'));
assign('input surface-selected-border pill-surface-selected-border',v('border-strong'));
assign('state-hover surface-raised',`color-mix(in srgb, ${v('interactive')} 6%, transparent)`);
assign('state-active surface-selected sidebar-search-match',`color-mix(in srgb, ${v('interactive')} 12%, transparent)`);
assign('sidebar-search-match-border',v('border-strong'));
assign('surface-recessed',v('canvas'));
assign('surface-scrim',`color-mix(in srgb, ${v('canvas')} 94%, transparent)`);
assign('surface-destructive',`color-mix(in srgb, ${v('danger')} 12%, ${v('canvas')})`);
assign('surface-destructive-border',v('danger'));
assign('surface-attention',`color-mix(in srgb, ${v('warning')} 12%, ${v('canvas')})`);
assign('pill-surface',v('surface-1')); assign('pill-surface-selected',v('surface-3'));
assign('pill-shadow shadow-2xs shadow-xs shadow-sm shadow shadow-md shadow-lg shadow-xl shadow-2xl shadow-lift','none');
assign('font-sans','"Inter Variable", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif');
assign('font-mono','"Kujo Departure Mono", "SFMono-Regular", "Cascadia Code", "Roboto Mono", "Liberation Mono", Menlo, Consolas, monospace');
assign('diffs-font-family','var(--font-mono)');
assign('radius','4px'); assign('radius-sm','2px'); assign('radius-md','2px'); assign('radius-lg','4px'); assign('radius-xl','4px');
assign('spacing','0.25rem');
const ansi = ['text-faint','danger','success','warning','info','syntax-magenta','syntax-type','text','text-muted','danger','success','warning','info','syntax-magenta','syntax-type','interactive'];
ansi.forEach((key,i)=>{map[`ansi-${i}`]=v(key);map[`ansi-bg-fg-${i}`]=v('canvas');});
for(const [role,key] of Object.entries({'addition-color':'success','deletion-color':'danger','modified-color':'warning','bg-context':'canvas','bg-context-gutter':'surface-1','bg-buffer':'surface-1','bg-separator':'surface-2','bg-addition-number':'surface-1','bg-deletion-number':'surface-1','fg-number':'text-faint','fg-number-addition':'success','fg-number-deletion':'danger','fg-conflict-marker':'warning','bg-selection':'surface-3','bg-selection-number':'surface-3','bg-hover':'surface-2'})) map[`diffs-${role}-override`]=v(key);
for(const [role,key] of [['addition','success'],['deletion','danger']]) {
 map[`diffs-bg-${role}-override`]=`color-mix(in srgb, ${v(key)} 12%, ${v('canvas')})`;
 map[`diffs-bg-${role}-emphasis-override`]=`color-mix(in srgb, ${v(key)} 24%, ${v('canvas')})`;
}
assign(`diffs-${mode}-bg`,v('canvas')); assign(`diffs-${mode}`,v('text')); assign(`diffs-${mode}-addition-color`,v('success')); assign(`diffs-${mode}-deletion-color`,v('danger'));
const props = obj => Object.entries(obj).map(([k,value])=>`  --${k}: ${value};`).join('\n');
tokens += `/* Generated from palette${mode === 'light' ? '-light' : ''}.json. SiteKit provenance: docs/research.md. */
${mode === 'dark' ? ':root.dark' : ':root:not(.dark)'} {
${props(Object.fromEntries(Object.entries(p).map(([k,value])=>[`kujo-${k}`,value])))}
  --kujo-label-font: "Kujo Departure Mono", var(--font-mono);
  --kujo-art-filter: ${mode === 'dark' ? 'invert(1)' : 'none'};
${props(map)}
  color-scheme: ${mode};
}
`;
const mark = Buffer.from((await read('assets/kujo-mark.svg')).replaceAll('currentColor',p.text)).toString('base64');
marks += `${mode === 'dark' ? ':root.dark' : ':root:not(.dark)'} { --kujo-mark: url(data:image/svg+xml;base64,${mark}); }\n`;
const colors = {'editor.background':p.canvas,'editor.foreground':p.text,'editorCursor.foreground':p.interactive,'editor.selectionBackground':p['surface-3'],'editor.inactiveSelectionBackground':p['surface-2'],'editor.lineHighlightBackground':p['surface-1'],'editorLineNumber.foreground':p['text-faint'],'editorLineNumber.activeForeground':p.text,'editorIndentGuide.background1':p.border,'editorIndentGuide.activeBackground1':p['border-strong'],'editorWhitespace.foreground':p.border,'editorWidget.background':p['surface-1'],'editorWidget.border':p['border-strong'],'editorSuggestWidget.background':p['surface-1'],'editorSuggestWidget.foreground':p.text,'editorSuggestWidget.selectedBackground':p['surface-3'],'editorError.foreground':p.danger,'editorWarning.foreground':p.warning,'editorInfo.foreground':p.info,'focusBorder':p.interactive,'diffEditor.insertedTextBackground':p.success+'30','diffEditor.removedTextBackground':p.danger+'30','diffEditor.insertedLineBackground':p.success+'18','diffEditor.removedLineBackground':p.danger+'18','merge.currentHeaderBackground':p.success+'40','merge.currentContentBackground':p.success+'18','merge.incomingHeaderBackground':p.info+'40','merge.incomingContentBackground':p.info+'18'};
for(let i=1;i<=6;i++) colors[`editorBracketHighlight.foreground${i}`]=i%2?p['text-muted']:p['syntax-type'];
colors['editorBracketHighlight.unexpectedBracket.foreground']=p.danger;
const rules = [
 ['Comments',['comment','punctuation.definition.comment'],'text-faint'],
 ['Keywords',['keyword','storage','storage.type'],'interactive'],
 ['Strings',['string','string.quoted','string.template','string.escape'],'syntax-string'],
 ['Numbers',['constant.numeric','number','number.hex','number.float'],'syntax-number'],
 ['Types',['entity.name.type','support.type','support.class','type','type.identifier','class'],'syntax-type'],
 ['Functions',['entity.name.function','support.function','function'],'interactive'],
 ['Identifiers',['variable','identifier','variable.other','meta.object-literal.key'],'text'],
 ['Punctuation',['punctuation','delimiter','operator'],'text-muted'],
 ['Constants',['constant.language','constant','boolean'],'syntax-number'],
 ['Invalid',['invalid','invalid.illegal'],'danger'],
 ['Markup',['entity.name.tag','tag'],'syntax-type'],
 ['Attributes',['entity.other.attribute-name','attribute.name'],'text'],
 ['Diff added',['markup.inserted'],'success'],['Diff removed',['markup.deleted'],'danger'],['Diff changed',['markup.changed'],'warning']
];
const code = {name:mode === 'dark' ? 'Kujo' : 'Kujo Light',type:mode,colors,tokenColors:rules.map(([name,scope,key])=>({name,scope,settings:{foreground:p[key]}}))};
outputs.push([mode === 'dark' ? 'themes/kujo-code.json' : 'themes/kujo-code-light.json',JSON.stringify(code,null,2)+'\n']);
}
const font = (await readFile(join(root,'assets/DepartureMono-Regular.woff2'))).toString('base64');
const workflow = (await readFile(join(root,'assets/kujo-workflow.webp'))).toString('base64');
const css = `/* Generated by scripts/generate.mjs. Edit palettes, surfaces.css, signal.css. */
@font-face { font-family: "Kujo Departure Mono"; src: url(data:font/woff2;base64,${font}) format("woff2"); font-display: swap; font-weight: 400; }
${tokens}
:root { --kujo-workflow: url(data:image/webp;base64,${workflow}); }
${marks}
${await read('themes/surfaces.css')}
${await read('themes/signal.css')}`;
outputs.push(['themes/tokens.css',tokens],['themes/kujo.css',css]);
for(const [file,content] of outputs) {
 if(process.argv.includes('--check')) { if(await read(file)!==content) throw new Error(`${file} is stale; npm run generate`); }
 else await writeFile(join(root,file),content);
}
console.log(`Kujo: ${css.length} CSS characters; dark and light code themes.`);
// Only a pinned, audited subset of Tabler's local SVGs enters the runtime bundle.
const iconMap=JSON.parse(await read('themes/icons.json'));
const artwork={};
for(const name of [...new Set(Object.values(iconMap))].sort()) {
 const svg=await read(`assets/tabler/${name}.svg`);
 if(/<script|<foreignObject|href=|\son\w+=/i.test(svg)) throw new Error(`Unsafe SVG: ${name}`);
 const body=svg.replace(/^[\s\S]*?<svg\b[^>]*>/,'').replace(/<\/svg>\s*$/,'');
 const nodes=[];
 const rest=body.replace(/<(path|circle|rect|line|polyline|polygon|ellipse)\b([^>]*?)\/>/g,(_,tag,raw)=>{
  const attrs={};
  for(const [,key,value] of raw.matchAll(/([\w:-]+)="([^"]*)"/g)) attrs[key.replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase())]=value;
  if(!(attrs.stroke==='none'&&attrs.fill==='none')) nodes.push([tag,attrs]);
  return '';
 });
 if(rest.trim()||!nodes.length) throw new Error(`Unsupported SVG structure: ${name}`);
 artwork[name]=nodes;
}
const iconSource=`/* Generated from Tabler Icons 3.46.0 (MIT); assets/Tabler-LICENSE.txt. */\nexport const iconMap: Readonly<Record<string,string>> = ${JSON.stringify(iconMap)};\nexport const artwork: Readonly<Record<string,readonly (readonly [string, Readonly<Record<string,string>>])[]>> = ${JSON.stringify(artwork)};\n`;
if(process.argv.includes('--check')) { if(await read('src/tabler.generated.ts')!==iconSource) throw new Error('Tabler artwork is stale; npm run generate'); }
else await writeFile(join(root,'src/tabler.generated.ts'),iconSource);
console.log(`Tabler: ${Object.keys(iconMap).length} bb names; ${Object.keys(artwork).length} local SVGs.`);
