import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
const read = file => readFile(new URL(file, root),'utf8');
const manifest = JSON.parse(await read('package.json'));
const css = await read('themes/kujo.css');
const code = JSON.parse(await read('themes/kujo-code.json'));
const p = JSON.parse(await read('themes/palette.json'));
const luminance = hex => {
 const rgb = hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);
 return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
};
const contrast=(a,b)=>(Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);
test('manifest has canonical, unique native theme and existing local assets',async()=>{
 assert.equal(manifest.bb.name,'Kujo');
 assert.equal(new Set(manifest.bb.themes.map(t=>t.id)).size,manifest.bb.themes.length);
 const t=manifest.bb.themes[0]; assert.equal(t.id,'kujo');
 for(const f of [manifest.bb.server,manifest.bb.app,manifest.bb.branding.icon,t.css,t.codeTheme.dark]) assert.ok((await stat(new URL(f,root))).isFile());
 assert.deepEqual(Object.keys(t.codeTheme),['dark']);
 assert.ok(css.length<256000);
});
test('all core text and syntax clears WCAG AA on every neutral surface',()=>{
 for(const fg of ['text','text-muted','text-faint','interactive','success','warning','danger','info','syntax-string','syntax-number','syntax-type','syntax-magenta'])
  for(const bg of ['canvas','surface-1','surface-2','surface-3']) assert.ok(contrast(p[fg],p[bg])>=4.5,`${fg}/${bg}: ${contrast(p[fg],p[bg])}`);
 assert.ok(contrast(p['border-strong'],p['surface-3'])>=3);
});
test('all ANSI and readable ANSI background foregrounds declared',()=>{
 for(let i=0;i<16;i++){ assert.ok(css.includes(`--ansi-${i}:`)); assert.ok(css.includes(`--ansi-bg-fg-${i}:`)); }
});
test('code theme has TextMate and Monarch scopes plus error, selection and diff colors',()=>{
 assert.equal(code.type,'dark'); assert.equal(code.colors['editor.background'],p.canvas);
 const scopes=code.tokenColors.flatMap(t=>t.scope);
 for(const s of ['keyword','comment','string','number','constant.numeric','type.identifier','entity.name.function','invalid']) assert.ok(scopes.includes(s),s);
 for(const t of code.tokenColors) assert.match(t.settings.foreground,/^#[\da-f]{6}$/i);
 for(const s of ['editorError.foreground','editor.selectionBackground','diffEditor.insertedTextBackground','diffEditor.removedTextBackground']) assert.ok(code.colors[s]);
});
test('offline distribution and motion safeguards',async()=>{
 assert.doesNotMatch(css,/@import|url\(\s*["']?https?:/);
 assert.match(css,/prefers-reduced-motion: reduce/); assert.match(css,/forced-colors: active/);
 const script=await read('src/effects.ts');
 assert.doesNotMatch(script,/setInterval|setTimeout|requestAnimationFrame|MutationObserver|fetch\(|innerHTML|eval\(/);
 assert.match(script,/aria-hidden/); assert.match(css,/pointer-events: none/);
});
test('mark is a local safe SVG without XML processing instructions',async()=>{
 const svg=await read('assets/kujo-mark.svg');
 assert.match(svg,/^<svg/); assert.doesNotMatch(svg,/<\?|<script|<foreignObject|\son\w+=|href=/i);
});

test('text remains AA over the brightest combined background decoration',()=>{
 // Sidebar base + 5% rail + 8.5% art + 2.5% glitch rounds below #363636.
 for(const fg of ['text','text-muted','text-faint','interactive','success','warning','danger','info','syntax-string','syntax-number','syntax-type','syntax-magenta'])
  assert.ok(contrast(p[fg],'#363636')>=4.5,`${fg} on decorative composite`);
});
test('Tabler mappings bundle safe local 24px outline artwork and preserve brand marks',async()=>{
 const icons=JSON.parse(await read('themes/icons.json'));
 assert.equal(Object.keys(icons).length,149);
 for(const name of ['Github','GithubLogo','Discord','DiscordLogo']) assert.equal(icons[name],undefined);
 for(const name of new Set(Object.values(icons))) {
  const svg=await read(`assets/tabler/${name}.svg`);
  assert.match(svg,/viewBox="0 0 24 24"/);
  assert.doesNotMatch(svg,/<script|<foreignObject|href=|\son\w+=/i);
 }
 const adapter=await read('src/icons.ts');
 assert.match(adapter,/experimental_icons.register/);
 assert.match(adapter,/mode !== 'dark'/);
 assert.doesNotMatch(adapter,/MutationObserver|querySelector|innerHTML|fetch\(/);
});
test('Departure is the technical font while ordinary prose retains the sans stack',()=>{
 assert.match(css,/--font-mono: "Kujo Departure Mono"/);
 assert.match(css,/--font-sans: "Inter Variable"/);
 assert.match(css,/font-synthesis: none/);
});
