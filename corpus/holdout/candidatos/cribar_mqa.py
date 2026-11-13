import gzip,json,re,sys,collections
src=sys.argv[1]; out=sys.argv[2]
# criterio congelado del 3-nov (mismo que oasst y chats propios) + señal de registro: números de la vida propia o del entorno cercano
vida=re.compile(r"\b(cu[aá]nt[oa]s?|gast[oé]|gastos?|me sale|me cuesta|al mes|a la semana|al d[ií]a|al a[ñn]o|mensual|sueldo|ingresos?|ahorr|presupuesto|cuenta de (la )?luz|cuenta del agua|boleta|cartola|factura|recibo|planilla|excel|mi curso|mis alumnos|los alumnos|mi hijo|mi hija|mis hijos|en casa|en mi casa|kilos?|calor[ií]as|pasos|consumo|me conviene|rinde|rendimiento|promedio|notas?)\b", re.I)
no=re.compile(r"\b(python|java|javascript|php|sql|html|css|c\+\+|código|codigo|script|android|iphone|wifi|router|driver|windows|linux|excel vba|macro)\b|\?{3,}", re.I)
pregunta=re.compile(r"\?")
n=0; cand=0; dom=collections.Counter(); keep=[]
with gzip.open(src,'rt') as f, open(out,'w') as g:
    for line in f:
        d=json.loads(line)
        if d.get('language')!='es': continue
        for q in d.get('questions',[]):
            n+=1
            t=(q.get('name') or '').strip()+'\n'+(q.get('text') or '').strip()
            t=re.sub(r'\s+',' ',t).strip()
            if len(t)<25 or len(t)>900: continue
            if not pregunta.search(t): continue
            if no.search(t): continue
            if not vida.search(t): continue
            cand+=1
            site=re.sub(r'^https?://','',d.get('domain') or d.get('url') or d.get('sub_bucket','')).split('/')[0]
            dom[site]+=1
            g.write(json.dumps({'id':f'mqa-{cand:06d}','texto':t,'bucket':d.get('bucket'),'fuente':site,'tiene_respuesta':bool(q.get('answers'))},ensure_ascii=False)+'\n')
print('preguntas es', n, '| candidatas', cand)
print(dom.most_common(15))
