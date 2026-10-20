import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'catalog.json'), 'utf8'));
const asn = JSON.parse(fs.readFileSync(path.join(root, 'asn-prefixes.json'), 'utf8'));
const check = process.argv.includes('--check');
const fields = { DOMAIN: 'domain', 'DOMAIN-SUFFIX': 'domain_suffix', 'DOMAIN-KEYWORD': 'domain_keyword', 'DOMAIN-REGEX': 'domain_regex', 'IP-CIDR': 'ip_cidr', 'IP-CIDR6': 'ip_cidr', 'PROCESS-NAME': 'process_name', 'PROCESS-PATH': 'process_path', 'PROCESS-PATH-REGEX': 'process_path_regex', NETWORK: 'network' };
function split(text) {
  let depth = 0, start = 0; const result = [];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '(') depth++;
    if (text[i] === ')') depth--;
    if (text[i] === ',' && depth === 0) { result.push(text.slice(start, i)); start = i + 1; }
    if (depth < 0) throw Error('Unbalanced rule: ' + text);
  }
  if (depth) throw Error('Unbalanced rule: ' + text);
  return [...result, text.slice(start)];
}
function classical(text) {
  const [type, value, ...options] = split(text);
  if (options.some(option => option !== 'no-resolve')) throw Error('Unexpected rule options: ' + text);
  if (['AND', 'OR', 'NOT'].includes(type)) {
    const children = split(value.slice(1, -1)).map(child => classical(child.slice(1, -1)));
    if (!children.length || (type === 'NOT' && children.length !== 1)) throw Error('Invalid logical rule: ' + text);
    return { type: 'logical', mode: type === 'OR' ? 'or' : 'and', rules: children, ...(type === 'NOT' ? { invert: true } : {}) };
  }
  if (type === 'IP-ASN') {
    if (!asn.prefixes[value]?.length) throw Error('Missing ASN snapshot: ' + value);
    return { ip_cidr: asn.prefixes[value] };
  }
  if (type === 'PROCESS-NAME-REGEX') {
    const match = value.match(/^(\(\?i\))?\^(.*)\$$/);
    if (!match) throw Error('Only anchored process-name regexes can be converted: ' + value);
    return { process_path_regex: [`${match[1] || ''}(?:^|[\\\\/])${match[2]}$`] };
  }
  if (type === 'DST-PORT') {
    return value.includes('-') ? { port_range: [value.replace('-', ':')] } : { port: [Number(value)] };
  }
  if (!fields[type] || !value) throw Error('Unsupported rule: ' + text);
  return { [fields[type]]: [type === 'NETWORK' ? value.toLowerCase() : value] };
}
const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function domain(text) {
  if (text.startsWith('+.')) return { domain_suffix: [text.slice(2)] };
  if (text.startsWith('.')) return { domain_suffix: [text] };
  if (text.includes('*')) return { domain_regex: ['^' + text.split('*').map(escape).join('[^.]*') + '$'] };
  return { domain: [text] };
}
const expectedFiles = new Set(Object.values(catalog).map(item => path.basename(item.file)));
for (const file of fs.readdirSync(path.join(root, 'clash')).filter(file => /\.(yaml|list)$/.test(file))) {
  if (!expectedFiles.has(file)) throw Error('Rule file missing from catalog: ' + file);
}
let total = 0;
const outputDir = path.join(root, 'sing-box');
const manifestFile = path.join(root, 'sing-box-generated.json');
const generatedFiles = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
const validName = name => /^[a-z0-9]+(?:-[a-z0-9]+)*\.json$/.test(name);
function generatedPath(file) {
  const target = path.resolve(outputDir, file);
  if (!validName(file) || path.dirname(target) !== outputDir) throw Error('Unsafe generated-file path: ' + file);
  return target;
}
if (!Array.isArray(generatedFiles) || !generatedFiles.every(file => typeof file === 'string' && validName(file)) || new Set(generatedFiles).size !== generatedFiles.length) throw Error('Invalid generated-file manifest');
const outputFiles = Object.keys(catalog).map(name => name + '.json');
if (!outputFiles.every(validName)) throw Error('Invalid catalog category name');
const expectedOutputs = new Set(outputFiles);
for (const file of fs.existsSync(outputDir) ? fs.readdirSync(outputDir).filter(file => file.endsWith('.json')) : []) {
  if (!expectedOutputs.has(file) && (check || !generatedFiles.includes(file))) throw Error('Unexpected generated directory JSON: ' + file);
}
if (check) {
  if (JSON.stringify(generatedFiles) !== JSON.stringify(outputFiles)) throw Error('Stale generated-file manifest');
} else fs.mkdirSync(outputDir, { recursive: true });
for (const [name, entry] of Object.entries(catalog)) {
  const text = fs.readFileSync(path.join(root, entry.file), 'utf8');
  const payload = entry.file.endsWith('.yaml') ? Bun.YAML.parse(text)?.payload : text.split(/\r?\n/).map(line => line.trim()).filter(line => line && !line.startsWith('#'));
  if (!Array.isArray(payload) || !payload.length || !payload.every(rule => typeof rule === 'string')) throw Error('Invalid payload: ' + name);
  const groups = new Map(), logical = [];
  for (const item of payload) {
    const rule = entry.behavior === 'classical' ? classical(item) : entry.behavior === 'domain' ? domain(item) : entry.behavior === 'ipcidr' ? { ip_cidr: [item] } : null;
    if (!rule) throw Error('Unsupported behavior: ' + name);
    if (rule.type) logical.push(rule);
    else for (const [key, values] of Object.entries(rule)) {
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(...values);
    }
  }
  const rules = [...groups].map(([key, values]) => ({ [key]: [...new Set(values)] })).concat(logical);
  const output = JSON.stringify({ version: 3, rules }, null, 2) + '\n';
  const file = generatedPath(name + '.json');
  if (check) { if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== output) throw Error('Stale generated rules: ' + name); }
  else fs.writeFileSync(file, output);
  total += payload.length;
}
if (!check) {
  for (const file of generatedFiles.filter(file => !expectedOutputs.has(file))) fs.rmSync(generatedPath(file), { force: true });
  fs.writeFileSync(manifestFile, JSON.stringify(outputFiles, null, 2) + '\n');
}
console.log(`${check ? 'Checked' : 'Generated'} ${Object.keys(catalog).length} categories (${total} source entries).`);
