/** Small, local Markdown renderer. No CDN or build step required.
 * Supports the roadmap's headings, tables, links, images, lists, blockquotes and fenced code.
 * Source HTML is escaped deliberately; keep instructor notes in Markdown.
 */
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

export function safeHref(href) {
  let url=String(href||'').trim().replace(/&amp;/g,'&');
  if (!url || /[\u0000-\u001f]/.test(url) || /^(?:javascript|data|vbscript|file):/i.test(url) || url.startsWith('//')) return '#';
  return url;
}
function inline(text) {
  const tokens=[];
  const token=html => {tokens.push(html);return `@@MDTOKEN${tokens.length-1}@@`;};
  let str=String(text??'');
  str=str.replace(/!\[([^\]]*)\]\((<[^>]+>|[^\s)]+)(?:\s+"([^"]*)")?\)/g,(_,alt,url,title)=> {
    const href=safeHref(url.replace(/^<|>$/g,''));
    if(href==='#') return token('<span class="broken-asset">Imagen no disponible</span>');
    return token(`<img src="${escapeHTML(href)}" alt="${escapeHTML(alt)}" title="${escapeHTML(title||'')}" loading="lazy" class="md-image" />`);
  });
  str=str.replace(/\[([^\]]+)\]\((<[^>]+>|[^\s)]+)(?:\s+"([^"]*)")?\)/g,(_,label,url,title)=> {
    const href=safeHref(url.replace(/^<|>$/g,''));
    const external=/^https?:/i.test(href);
    return token(`<a href="${escapeHTML(href)}" ${title?`title="${escapeHTML(title)}"`:''} ${external?'target="_blank" rel="noopener noreferrer"':''}>${escapeHTML(label)}</a>`);
  });
  str=str.replace(/`([^`]+)`/g,(_,code)=>token(`<code>${escapeHTML(code)}</code>`));
  str=escapeHTML(str)
     .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
     .replace(/__(.+?)__/g,'<strong>$1</strong>')
     .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g,'<em>$1</em>')
     .replace(/(?<!_)_([^_\n]+)_(?!_)/g,'<em>$1</em>')
     .replace(/~~([^~]+)~~/g,'<del>$1</del>');
  return str.replace(/@@MDTOKEN(\d+)@@/g,(_,n)=>tokens[Number(n)]||'');
}
export const inlineMarkdown=inline;
export function renderMarkdown(markdown) {
  const lines=String(markdown||'').replace(/\r\n?/g,'\n').split('\n');
  const result=[]; let i=0;
  const blank=l=>/^\s*$/.test(l||'');
  const isTableSep=l=>/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(l||'');
  const cells=l=>l.trim().replace(/^\|/,'').replace(/\|$/,'').split(/(?<!\\)\|/).map(x=>x.replace(/\\\|/g,'|').trim());
  const special=l=>/^\s*(?:#{1,6}\s|[-*_]{3,}\s*$|>\s?|[-+*]\s+|\d+[.)]\s+|```|~~~)/.test(l||'');
  while(i<lines.length){
    const line=lines[i];
    if(blank(line)){i++;continue;}
    const fence=line.match(/^\s*(```|~~~)(.*)$/);
    if(fence){const code=[];i++;while(i<lines.length&&!lines[i].trim().startsWith(fence[1]))code.push(lines[i++]);i++;result.push(`<pre><code>${escapeHTML(code.join('\n'))}</code></pre>`);continue;}
    const head=line.match(/^\s*(#{1,6})\s+(.+?)\s*#*\s*$/);
    if(head){const n=head[1].length;result.push(`<h${n}>${inline(head[2])}</h${n}>`);i++;continue;}
    if(/^\s*(?:---+|\*\*\*+|___+)\s*$/.test(line)){result.push('<hr/>');i++;continue;}
    if(i+1<lines.length && line.includes('|') && isTableSep(lines[i+1])){
      const header=cells(line), rows=[];i+=2;
      while(i<lines.length&&!blank(lines[i])&&lines[i].includes('|'))rows.push(cells(lines[i++]));
      result.push(`<div class="md-table-scroll"><table><thead><tr>${header.map(c=>`<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${header.map((_,j)=>`<td>${inline(r[j]||'')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);continue;
    }
    if(/^\s*>/.test(line)){
      const linesIn=[];while(i<lines.length&&/^\s*>/.test(lines[i]))linesIn.push(lines[i++].replace(/^\s*>\s?/,''));
      result.push(`<blockquote>${renderMarkdown(linesIn.join('\n'))}</blockquote>`);continue;
    }
    if(/^\s*[-+*]\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line)){
      const ordered=/^\s*\d+[.)]\s+/.test(line);let items=[];
      while(i<lines.length && (/^\s*[-+*]\s+/.test(lines[i])||/^\s*\d+[.)]\s+/.test(lines[i]))) {
        items.push(lines[i++].replace(/^\s*(?:[-+*]|\d+[.)])\s+/,''));
      }
      result.push(`<${ordered?'ol':'ul'}>${items.map(x=>`<li>${inline(x)}</li>`).join('')}</${ordered?'ol':'ul'}>`);continue;
    }
    if(/^\s*\*\*(?:Respuestas?|Soluci[oó]n)(?:\s+correcta)?\s*:?(?:\*\*)?/i.test(line)){
      const content=line.trim().replace(/^\*\*(Respuestas?|Soluci[oó]n)(?:\s+correcta)?\s*:?\*\*\s*/i,'');
      result.push(`<details class="answer-reveal"><summary>Ver respuesta</summary><p>${inline(content)}</p></details>`);i++;continue;
    }
    const paragraph=[line.replace(/^\s+/,'')];i++;
    while(i<lines.length&&!blank(lines[i])&&!special(lines[i])&&!(i+1<lines.length&&lines[i].includes('|')&&isTableSep(lines[i+1]))){paragraph.push(lines[i++].replace(/^\s+/,''));}
    result.push(`<p>${paragraph.map((part,j)=>`${j?(/\s{2,}$/.test(paragraph[j-1])||/\\$/.test(paragraph[j-1])?'<br/>':' '):''}${inline(part.trim())}`).join('')}</p>`);
  }
  return result.join('\n');
}
