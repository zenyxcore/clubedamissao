"""Gera os PDFs usando os mesmos desafios do aplicativo (exportados via tsx)."""
import json, subprocess, math
from pathlib import Path
from PIL import Image
from io import BytesIO
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from pypdf import PdfReader, PdfWriter
ROOT=Path(__file__).resolve().parents[1]
raw=subprocess.check_output(['node','--import','tsx','--input-type=module','-e',"import {STEPS} from './src/lib/adventure.ts'; console.log(JSON.stringify(STEPS))"],cwd=ROOT)
steps=json.loads(raw)
OUT=ROOT/'public/materiais'; OUT.mkdir(exist_ok=True)
for name,file in [('Body','DejaVuSans.ttf'),('Bold','DejaVuSans-Bold.ttf'),('Display','DejaVuSerif-Bold.ttf')]:
 pdfmetrics.registerFont(TTFont(name,'/usr/share/fonts/truetype/dejavu/'+file))
W,H=A4; GREEN=HexColor('#103e35'); GOLD=HexColor('#ad7a2d'); CREAM=HexColor('#faf3e4'); INK=HexColor('#19342e')
logo_source=Image.open(ROOT/'public/assets/clube-da-missao.png').convert('RGB');logo_source.thumbnail((300,300));logo_bytes=BytesIO();logo_source.save(logo_bytes,format='JPEG',quality=88);logo=ImageReader(logo_bytes)
def para(c,text,x,y,width,size=11,color=INK,font='Body',leading=None):
 st=ParagraphStyle('p',fontName=font,fontSize=size,leading=leading or size*1.5,textColor=color)
 p=Paragraph(text.replace('\n','<br/>'),st);_,h=p.wrap(width,1000);p.drawOn(c,x,y-h);return y-h

def base(c,title,page,sub='O TESOURO PERDIDO',eco=False):
 c.setFillColor(white if eco else CREAM);c.rect(0,0,W,H,fill=1,stroke=0)
 c.setStrokeColor(INK if eco else GOLD);c.rect(24,25,W-48,H-50);c.rect(29,30,W-58,H-60)
 if not eco:c.drawImage(logo,43,H-112,78,78,mask='auto',preserveAspectRatio=True)
 para(c,'CLUBE DA MISSÃO',137 if not eco else 45,H-50,W-180,10,font='Bold')
 para(c,title,137 if not eco else 45,H-73,W-180,20,font='Display')
 para(c,sub,45,H-133,W-90,9,color=GOLD if not eco else INK,font='Bold')
 para(c,f'Missão Secreta  •  {page}  •  Imprima em A4, tamanho real (100%).',45,49,W-90,8)

def compass(c,x,y,r=28,eco=False):
 c.setStrokeColor(INK if eco else GOLD);c.setFillColor(INK if eco else GREEN);c.circle(x,y,r,fill=1)
 c.setFillColor(CREAM)
 for a in range(0,360,90):
  a=math.radians(a);p=c.beginPath();p.moveTo(x+math.sin(a)*r*.82,y+math.cos(a)*r*.82);p.lineTo(x+math.sin(a+.9)*r*.21,y+math.cos(a+.9)*r*.21);p.lineTo(x+math.sin(a-.9)*r*.21,y+math.cos(a-.9)*r*.21);p.close();c.drawPath(p,fill=1,stroke=0)

def cards(eco=False):
 path=OUT/('pistas-economicas.pdf' if eco else 'pistas-da-missao.pdf');c=canvas.Canvas(str(path),pagesize=A4)
 for page in range(3):
  base(c,'Pistas da missão',page+1,'RECORTE NAS LINHAS • NÃO MOSTRE AS OUTRAS PISTAS ANTES DA HORA',eco)
  for slot,s in enumerate(steps[page*2:page*2+2]):
   i=page*2+slot;y=H-165-slot*305;bottom=y-285
   c.setDash(4,3);c.setStrokeColor(INK if eco else GOLD);c.roundRect(44,bottom,W-88,285,9);c.setDash()
   para(c,f'CARTÃO {i+1:02d} / 06',62,y-15,W-124,9,font='Bold')
   para(c,s['title'],62,y-37,W-124,19,font='Display')
   if i==0:
    compass(c,W-100,y-126,25,eco)
    text='Olá, aventureiros! A bússola do Clube desapareceu. Precisamos de coragem e trabalho em equipe para encontrar o tesouro. Observem o símbolo desta carta e comecem a missão!'
    para(c,text,62,y-75,W-195,11)
   elif i==1:
    para(c,'Observe a sequência e descubra o próximo símbolo.',62,y-76,W-124,11)
    c.setStrokeColor(INK);c.setFillColor(INK)
    for k in range(5):
     x=85+k*92;cy=y-131
     if k==4:para(c,'?',x-10,cy+14,35,25,font='Bold')
     elif k%2:c.circle(x,cy,13,fill=0)
     else:
      p=c.beginPath();p.moveTo(x,cy+15);p.lineTo(x-16,cy-13);p.lineTo(x+16,cy-13);p.close();c.drawPath(p)
    para(c,'A floresta guarda o primeiro número: <b>4</b>.',62,y-170,W-124,12)
   else:para(c,s['print'],62,y-76,W-124,11 if i!=4 else 10)
   c.setFillColor(white if eco else GREEN);c.roundRect(62,bottom+23,W-124,35,5,fill=1,stroke=eco)
   para(c,f'CÓDIGO DO CARTÃO: <b>{s["token"]}</b>',76,bottom+49,W-150,11,color=INK if eco else white)
   para(c,'Digite este código na plataforma para revelar o desafio.',62,bottom+18,W-124,8)
  c.showPage()
 c.save();return path
cards();cards(True)
c=canvas.Canvas(str(OUT/'guia-do-responsavel.pdf'),pagesize=A4)
base(c,'Guia do responsável',1,'LEIA ANTES DE CHAMAR AS CRIANÇAS • CONTÉM SOLUÇÕES')
y=H-165
for title,text in [
 ('1. Prepare a equipe','Para 1 a 3 crianças de 5 a 9 anos, com acompanhamento de um adulto. Cadastre apelidos, escolha os avatares e selecione quem vai jogar. O progresso fica neste navegador; use o mesmo aparelho para retomar.'),
 ('2. Separe o necessário','Papel A4, lápis, um livro, uma almofada, uma mesa e uma caixa. Escolha um desenho, um bilhete ou uma surpresa que já tenha em casa para o tesouro. Não é necessário comprar um baú nem um cadeado.'),
 ('3. Imprima e organize','Imprima as 3 páginas de pistas e recorte os 6 cartões. Há uma versão econômica em preto e branco. Sem impressora, copie os textos, desenhos e códigos em seis papéis. A carta-convite é opcional: o cartão 1 já inicia o jogo.'),
 ('4. Faça uma conferência','Entregue o cartão 1 e esconda os demais na ordem da próxima página. Reserve cerca de 10 minutos como referência; a primeira preparação pode demorar mais. A duração de 25 a 40 minutos também varia por equipe.'),
 ('5. Acompanhe com segurança','Use locais baixos, secos e acessíveis. Não esconda em tomadas, eletrodomésticos, lugares altos ou perto de calor e objetos cortantes. Não mova móveis pesados. Leia os textos para quem precisar; os desafios são cooperativos.')]:
  y=para(c,title,48,y,W-96,14,font='Display')-9;y=para(c,text,48,y,W-96,10.5)-20
c.showPage();base(c,'Esconderijos e soluções',2,'SÓ PARA O RESPONSÁVEL • SIGA A ORDEM DOS CARTÕES')
y=H-163
for i,s in enumerate(steps):
 y=para(c,f'{i+1:02d}  {s["title"]}',48,y,W-96,13,font='Display')-5
 y=para(c,s['location'],48,y,W-96,10)-4
 y=para(c,f'Código: <b>{s["token"]}</b>  |  Resposta: <b>{s["answer"]}</b>',48,y,W-96,9)-15
para(c,'Adaptações: sem sofá, use uma cadeira e diga à equipe qual local substitui o sofá. Sem almofada, use uma toalha dobrada. Ao trocar um esconderijo, explique a substituição quando a plataforma citar o local original. O mapa é narrativo, não a planta da casa.',48,y,W-96,10)
c.showPage();base(c,'Durante a aventura',3,'ACOMPANHE, DÊ PISTAS E CELEBRE CADA DESCOBERTA')
y=H-163
for title,text in [
 ('Como jogar','Após encontrar cada cartão, digite a palavra em “Código do cartão”. Resolva o desafio na plataforma e toque em “Registrar descoberta e continuar”. O próximo esconderijo aparece na tela.'),
 ('Se a equipe travar','Peça para observar o cartão novamente. Depois ofereça a dica da plataforma. Leia em voz alta ou ajude a digitar quando necessário. Não há penalidade por pedir ajuda.'),
 ('Irmãos de idades diferentes','Alterne os papéis: uma criança procura, outra observa os símbolos e outra digita com sua ajuda. Evite corrida ou competição pelos cartões.'),
 ('O final e o tesouro','Os cartões 2, 3 e 4 revelam 4, 2 e 7. O código final é 427. Ele é digitado no aplicativo: a caixa física não precisa de fechadura. Abra a surpresa com a equipe e imprima o certificado personalizado ao concluir.'),
 ('Pausa e recomeço','Para continuar, volte ao mesmo navegador e à mesma equipe. Limpar dados do navegador pode apagar o progresso. Para repetir do início, use “Recomeçar com esta equipe” ao final; as pistas e respostas serão as mesmas.'),
 ('Antes de chamar os aventureiros','Confira: seis cartões prontos; esconderijos seguros; tesouro dentro da caixa; aparelho com a equipe selecionada; adulto disponível para acompanhar. Os enfeites do Kit de Imersão são opcionais e não substituem as pistas.')]:
 y=para(c,title,48,y,W-96,13,font='Display')-6;y=para(c,text,48,y,W-96,10.5)-18
c.save()
c=canvas.Canvas(str(OUT/'diario-do-explorador.pdf'),pagesize=A4)
for page in range(4):
 base(c,'Diário do explorador',page+1,'ESCREVA, DESENHE E GUARDE A HISTÓRIA DA SUA EQUIPE')
 if page==0:
  para(c,'Nossa equipe',48,H-175,W-96,22,font='Display')
  for k in range(3):
   y=H-235-k*70;para(c,f'Aventureiro {k+1}:',48,y,W-96,12);c.setStrokeColor(GOLD);c.line(48,y-35,W-48,y-35)
  para(c,'O que imaginamos encontrar?',48,H-490,W-96,16,font='Display');c.roundRect(48,105,W-96,205,8)
 else:
  for slot in range(2):
   idx=(page-1)*2+slot;y=H-170-slot*305
   para(c,f'{idx+1:02d}  {steps[idx]["title"]}',48,y,W-96,16,font='Display')
   para(c,'O que encontramos? O que descobrimos juntos?',48,y-32,W-96,10)
   c.setStrokeColor(GOLD);c.roundRect(48,y-260,W-96,200,8)
 c.showPage()
c.save()
# A carta visual original é um convite; os cartões contêm os códigos do jogo.
c=canvas.Canvas(str(OUT/'carta-convite.pdf'),pagesize=A4)
c.drawImage(str(ROOT/'public/materiais/carta-convite.jpg'),0,0,W,H,preserveAspectRatio=True,anchor='c',mask='auto');c.save()
