/** Parse original roadmap.md in the browser, so every commit updates the site automatically. */
const CLASS_RE=/^#{2,5}\s+(?:CLASE|Clase|Lecci[oó]n|LECCI[OÓ]N|Sesi[oó]n|SESI[OÓ]N)\s*(?:N[.º°o]?\s*)?(\d+[A-Za-z]?)\s*[-—–:.]\s*(.*?)\s*$/i;
const STAGE_RE=/^#{2,5}\s+((?:Etapa|Unidad|M[oó]dulo|Nivel|Fase|Bloque)\s*(?:\d+|[IVXLCDM]+|[A-C][012])?\s*[-—–:.]?\s*.+)$/i;
const headingDepth=l=>(l.match(/^(#+)\s/)||[])[1]?.length||0;
const textValue=s=>String(s||'').replace(/\*\*/g,'').replace(/\*/g,'').replace(/`/g,'').replace(/\s{2,}$/,'').trim();
const flatten=s=>textValue(s).replace(/\s+/g,' ').trim();
function field(body,...keys){
  const lines=body.split('\n');
  for (const key of keys) {
    const exp=new RegExp(`^\\s*(?:\\*\\*)?${key}\\s*:\\s*(?:\\*\\*)?\\s*(.*?)\\s*$`,'i');
    for(let i=0;i<lines.length;i++){
      let m=lines[i].match(exp);
      if(m){let v=flatten(m[1]);
        if(!v){let j=i+1;while(j<lines.length&&!lines[j].trim())j++;if(j<lines.length&&!/^#{1,6}\s/.test(lines[j]))v=flatten(lines[j]);}
        return v;
      }
    }
    const sub=new RegExp(`^#{3,6}\\s+${key}\\s*$`,'i');
    for(let i=0;i<lines.length;i++)if(sub.test(lines[i])){let j=i+1;while(j<lines.length&&!lines[j].trim())j++;return flatten(lines[j]||'');}
  }
  return '';
}
export const statusMeta = {
  completed:{label:'Vista',short:'Vista',color:'slate',icon:'check-circle'},
  progress:{label:'En progreso',short:'En progreso',color:'hunyadi',icon:'play-circle'},
  pending:{label:'Pendiente',short:'Pendiente',color:'neutral',icon:'clock'},
  review:{label:'Repaso pendiente',short:'Repaso',color:'auburn',icon:'refresh-cw'},
  unknown:{label:'Sin confirmar',short:'Sin confirmar',color:'neutral',icon:'help-circle'}
};
export function statusFrom(raw){
  if(!raw)return 'unknown';
  const s=raw.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  if(/repaso\s+pendiente|revision\s+pendiente/.test(s))return 'review';
  if(/en\s+progreso|en\s+curso|en\s+proceso/.test(s))return 'progress';
  if(/pendiente|planificad[ao]|por\s+ver/.test(s))return 'pending';
  if(/visto|completad[ao]|realizad[ao]|finalizad[ao]/.test(s))return 'completed';
  return 'unknown';
}
export function normalize(s){return String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function resourcesFor(body,lessonId){
  const found=[];const seen=new Set();
  const add=(type,url,label)=>{if(!url||/^(?:javascript|data|file):/i.test(url))return;let key=type+'|'+url;if(seen.has(key))return;seen.add(key);found.push({type,url,label:label||'Recurso',lessonId});};
  for(const m of body.matchAll(/!\[([^\]]*)\]\((<[^>]+>|[^\s)]+)(?:\s+"[^"]*")?\)/g))add('image',m[2].replace(/^<|>$/g,''),m[1]||'Imagen');
  for(const m of body.matchAll(/(?<!!)\[([^\]]+)\]\((<[^>]+>|[^\s)]+)(?:\s+"[^"]*")?\)/g)){
    const url=m[2].replace(/^<|>$/g,'');
    const type=/\.(png|jpe?g|webp|gif|svg)(?:[?#]|$)/i.test(url)?'image':/\.pdf(?:[?#]|$)/i.test(url)?'pdf':/\.(mp4|webm|mov)(?:[?#]|$)/i.test(url)?'video':/youtube\.com|youtu\.be|vimeo\.com/.test(url)?'video':'link';
    add(type,url,m[1]);
  }
  return found;
}
function parseMetadata(raw){
  const top=raw.slice(0,Math.min(raw.indexOf('## ')+1||raw.length,3500));
  const firstLine=(raw.match(/^#\s+(.+)$/m)||[])[1]||'Mi viaje por el español';
  const intro=raw.slice(0,Math.min(raw.indexOf('## ')>0?raw.indexOf('## '):1600,5000));
  const current=(intro.match(/(?:Resultado de prueba|Prueba de Preply|Preply).*?\*\*(A[012]|B[12]|C[12])\*\*/i)||[])[1] ||
    (intro.match(/(?:Nivel[^\n]{0,30}|nivel inicial).*?:[^\n]{0,40}\b(A[012]|B[12]|C[12])\b/i)||[])[1]||'';
  const statedName=(intro.match(/\*\*(?:Nombre|Estudiante)\s*:\*\*\s*([^\n|·]+)/i)||[])[1]?.trim()||'';
  return {sourceTitle:textValue(firstLine),currentLevel:current,studentName:statedName};
}
function parseLevels(l){return [...new Set((l||'').match(/(?:A0|A1|A2|B1|B2|C1|C2)/g)||[])];}
function extraSections(body){
  const matches=[...String(body||'').matchAll(/^#{3,6}\s+(.+)\s*$/gm)];
  const known={
    'lo que vimos en clase':'Lo que vimos en clase',
    'contenidos trabajados':'Lo que vimos en clase',
    'apuntes':'Apuntes y explicaciones',
    'apuntes y explicaciones':'Apuntes y explicaciones',
    'explicaciones':'Apuntes y explicaciones',
    'ejercicios':'Ejercicios realizados',
    'ejercicios realizados':'Ejercicios realizados',
    'tarea':'Tareas',
    'tareas':'Tareas',
    'materiales':'Materiales',
    'recursos':'Recursos complementarios',
    'recursos complementarios':'Recursos complementarios'
  };
  const out=[];
  for(let i=0;i<matches.length;i++){
    const heading=matches[i][1].trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    const title=known[heading];
    if(!title)continue;
    const start=matches[i].index+matches[i][0].length;
    const end=i+1<matches.length?matches[i+1].index:body.length;
    const content=body.slice(start,end).trim();
    if(content)out.push({title,content});
  }
  return out;
}
function buildLesson(id,title,body,stageId,order){
  const statusRaw=field(body,'Estado','Status');
  const level=field(body,'Nivel de referencia','Nivel MCER','Nivel')||'';
  const objective=field(body,'Objetivo comunicativo','Objetivos de aprendizaje','Objetivo');
  const grammar=field(body,'Gram[aá]tica','Contenidos gramaticales');
  const vocabulary=field(body,'Vocabulario(?: \\(repertorio concreto\\))?','Contenidos l[eé]xicos');
  const conversation=field(body,'Comunicaci[oó]n y conversaci[oó]n','Funciones comunicativas');
  const comprehension=field(body,'Comprensi[oó]n oral o escrita','Comprensi[oó]n');
  const result=field(body,'Resultado esperado \\/ evidencia','Resultado esperado');
  const connection=field(body,'Conexi[oó]n con la siguiente clase');
  const timing=field(body,'Distribuci[oó]n sugerida \\(50 min\\)','Distribuci[oó]n sugerida');
  const date=field(body,'Fecha de realizaci[oó]n','Fecha');
  const notes=field(body,'Observaciones','Notas');
  return {id:String(id),title:textValue(title),body,stageId,order,statusRaw,status:statusFrom(statusRaw),level,levels:parseLevels(level),objective,grammar,vocabulary,conversation,comprehension,result,connection,timing,date,notes,extras:extraSections(body),resources:resourcesFor(body,String(id))};
}
export function parseRoadmap(md){
  const source=String(md||'').replace(/\r\n?/g,'\n');
  const lines=source.split('\n');
  const meta=parseMetadata(source);const stages=[];const lessons=[];let currentStage=null,currentLesson=null;
  let currentSection=null;const sections=[];
  const closeLesson=()=>{if(currentLesson){const body=currentLesson.bodyLines.join('\n').trim();lessons.push(buildLesson(currentLesson.id,currentLesson.title,body,currentLesson.stageId,lessons.length));currentLesson=null;}};
  const closeStage=()=>{if(currentStage){const b=currentStage.headLines.join('\n').trim();currentStage.description=b;currentStage.goal=field(b,'Objetivo general','Objetivo')||'';currentStage.competences=field(b,'Competencias comunicativas')||'';currentStage.grammar=field(b,'Gram[aá]tica y repertorio principales','Contenidos gramaticales principales')||'';currentStage.vocab=field(b,'Campos de vocabulario')||'';currentStage.expected=field(b,'Resultado esperado de la etapa')||'';delete currentStage.headLines;}};
  for(let i=0;i<lines.length;i++){
    const line=lines[i],depth=headingDepth(line);
    const classMatch=line.match(CLASS_RE);
    if(classMatch){
      closeLesson();
      if(!currentStage){currentStage={id:`etapa-${stages.length+1}`,title:'Tu recorrido',depth:2,headLines:[]};stages.push(currentStage);}
      currentLesson={id:classMatch[1],title:classMatch[2],stageId:currentStage.id,depth,bodyLines:[]};
      continue;
    }
    const stageMatch=line.match(STAGE_RE);
    if(stageMatch && (!currentLesson || depth<=currentLesson.depth)){
      closeLesson();closeStage();
      const title=stageMatch[1].trim();const ordinal=(title.match(/(?:Etapa|Unidad|M[oó]dulo|Bloque|Fase)\s+(\d+)/i)||[])[1];
      currentStage={id:`etapa-${stages.length+1}`,title,ordinal:ordinal?Number(ordinal):stages.length+1,depth,headLines:[]};stages.push(currentStage);continue;
    }
    if(currentLesson){
      if(depth && depth<=2){closeLesson();closeStage();currentStage=null;}
      else {currentLesson.bodyLines.push(line);continue;}
    }
    if(currentStage){if(depth && depth<=currentStage.depth){closeStage();currentStage=null;}else{currentStage.headLines.push(line);continue;}}
    if(/^##\s/.test(line)) {currentSection={title:textValue(line.replace(/^##\s+/,'')),lines:[]};sections.push(currentSection);}
    else if(currentSection)currentSection.lines.push(line);
  }
  closeLesson();closeStage();
  if(!lessons.length){
    // Graceful fallback for a document organized by topics, not numbered sessions.
    const blocks=source.split(/(?=^#{2,4}\s+[^#\n]+)/m).filter(s=>s.trim());
    const fallback=stages.length?stages[0]:{id:'etapa-1',title:'Temas del documento',ordinal:1,description:'',goal:''};
    if(!stages.length)stages.push(fallback);
    for(const b of blocks){const h=b.match(/^#{2,4}\s+(.+)\n/);if(!h)continue;const name=textValue(h[1]);if(/^(?:[A-F]\.\s|fuentes|plantilla|introducci[oó]n)/i.test(name))continue;lessons.push(buildLesson('tema-'+(lessons.length+1),name,b.slice(h[0].length),fallback.id,lessons.length));}
  }
  const stageLessonIds=new Set(lessons.map(l=>l.stageId));
  const populated=stages.filter(s=>stageLessonIds.has(s.id));
  for(const st of populated){st.lessons=lessons.filter(l=>l.stageId===st.id);st.levels=[...new Set(st.lessons.flatMap(l=>l.levels))];if(!st.goal)st.goal=st.lessons[0]?.objective||'';}
  for(const s of sections)s.body=s.lines.join('\n').trim();
  return {...meta,source,stages:populated,lessons,sections};
}
