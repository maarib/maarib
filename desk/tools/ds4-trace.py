# Trace a DualShock 4 silhouette from a top-down photo into a lettered pixel grid, then paint its parts.
# Run: python3 tools/ds4-trace.py <photo> [out.json]   (needs Pillow; writes data/ds4.json by default)
# The coordinates below (the crop box and every part's position) are in the pixels of the photo it was
# made from: a 1500x1500 top-down shot of a black DS4 on white. A different photo needs them re-measured.
import json, sys, math, os
from PIL import Image
SRC=sys.argv[1]
OUT=sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(__file__), '..', 'data', 'ds4.json')
im=Image.open(SRC).convert('L')
X0,Y0,X1,Y1=36,296,1461,1204
N=64; s=(X1-X0)/N; H=round((Y1-Y0)/s)
crop=im.crop((X0,Y0,X1,Y1)).point(lambda v:255 if v<200 else 0).resize((N,H),Image.BOX)
M=[[crop.getpixel((x,y))>110 for x in range(N)] for y in range(H)]
# Fill holes (the white logo, the touchpad's light dots): anything the outside can't reach is controller
out=set(); st=[(x,y) for x in range(N) for y in (0,H-1)]+[(x,y) for y in range(H) for x in (0,N-1)]
while st:
  x,y=st.pop()
  if not(0<=x<N and 0<=y<H) or (x,y) in out or M[y][x]: continue
  out.add((x,y)); st+=[(x+1,y),(x-1,y),(x,y+1),(x,y-1)]
M=[[(x,y) not in out for x in range(N)] for y in range(H)]
g=[['.']*N for _ in range(H)]
inside=lambda x,y:0<=x<N and 0<=y<H and M[y][x]
for y in range(H):
  for x in range(N):
    if not M[y][x]: continue
    edge=any(not inside(x+dx,y+dy) for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)))
    g[y][x]='o' if edge else 'b'
# Body shading: a light rim along the top and left, a dark one along the bottom and right
for y in range(H):
  for x in range(N):
    if g[y][x]!='b': continue
    if not inside(x,y-2) or not inside(x-2,y): g[y][x]='h'
    elif not inside(x,y+2) or not inside(x+2,y): g[y][x]='d'
P=lambda px,py:((px-X0)/s,(py-Y0)/s)
def disc(px,py,pr,c,only=None):
  cx,cy=P(px,py); r=pr/s
  for y in range(H):
    for x in range(N):
      if (x+.5-cx)**2+(y+.5-cy)**2<=r*r and g[y][x]!='.' and (only is None or g[y][x] in only): g[y][x]=c
def rect(px0,py0,px1,py1,c):
  a,b=P(px0,py0); e,f=P(px1,py1)
  for y in range(round(b),round(f)):
    for x in range(round(a),round(e)):
      if 0<=x<N and 0<=y<H and g[y][x]!='.': g[y][x]=c
def put(cx,cy,pat,cols):
  for j,row in enumerate(pat):
    for i,ch in enumerate(row):
      if ch!='.': g[cy+j][cx+i]=cols.get(ch,ch)
# Grip ends: the lighter rubber, with a dithered band where it meets the body
for y in range(H):
  py=Y0+(y+.5)*s
  for x in range(N):
    if g[y][x] in 'bhd' and py>1075: g[y][x]='g' if py>1105 or (x+y)%2 else g[y][x]
# Touchpad with its dot texture, the light bar above it, Share and Options
rect(520,350,995,628,'p')
for y in range(H):
  for x in range(N):
    if g[y][x]=='p' and (x+y)%3==0: g[y][x]='q'
tx0,_=P(520,0); tx1,_=P(995,0)
for x in range(round(tx0),round(tx1)):
  for y in range(H):
    if g[y][x]!='.': g[y][x]='L'; g[y+1][x]='L' if g[y+1][x]=='o' else g[y+1][x]; break
disc(462,420,28,'k'); disc(1046,420,28,'k')
# The D-pad and shape-button dips
disc(312,555,168,'r',only='bhd'); disc(1205,555,168,'r',only='bhd')
cx,cy=P(312,555); cx,cy=round(cx-.5),round(cy-.5)
arrow={'k':'k','K':'K'}
for dx,dy,pat in ((0,-5,['.K.','KkK','kkk','kkk']),(0,3,['kkk','kkk','kkk','.k.']),(-5,0,['.Kkk','Kkkk','.kkk']),(3,0,['kkk.','kkkk','kkk.'])):
  put(cx-1+dx,cy-1+dy,pat,arrow)
for (bx,by,pat,c) in ((1205,462,['.G.','GGG'],'G'),(1302,555,['.R.','R.R','.R.'],'R'),(1205,665,['B.B','.B.','B.B'],'B'),(1098,555,['MMM','M.M','MMM'],'M')):
  disc(bx,by,58,'k')
  x,y=P(bx,by); w=len(pat[0]); h=len(pat)
  put(round(x-w/2),round(y-h/2),pat,{})
# Sticks: a dark collar, the cap, and a highlight on the cap's top-left
for sx in (530,1000):
  disc(sx,792,148,'s'); disc(sx,792,112,'t'); disc(sx-25,768,55,'T',only='t')
# Speaker grille and the PS button
for i,(px,py) in enumerate([(720,650),(755,650),(790,650),(737,676),(772,676)]):
  x,y=P(px,py); g[round(y)][round(x)]='n'
x,y=P(755,792); g[round(y-.5)][round(x-.5)]='w'; g[round(y-.5)][round(x-.5)+1]='w'; g[round(y-.5)+1][round(x-.5)]='w'
json.dump([''.join(r) for r in g],open(OUT,'w'))
print(N,H); print('\n'.join(''.join(r) for r in g))
