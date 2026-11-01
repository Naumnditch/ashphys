import pypdfium2 as pdfium, glob, os
from PIL import Image
os.makedirs('preview', exist_ok=True)
for f in glob.glob('preview/*.png'): os.remove(f)
for f,tag in [('Grade11_AS_Physics_Exam.pdf','E'),('Grade11_AS_Physics_Mark_Scheme.pdf','M')]:
    d=pdfium.PdfDocument(f); print(f,len(d))
    ims=[d[i].render(scale=1.3).to_pil() for i in range(len(d))]
    for i,im in enumerate(ims): im.save(f'preview/{tag}{i+1:02d}.png')
    w,h=ims[0].size; s=0.4; cols=6; rows=(len(ims)+cols-1)//cols
    sh=Image.new('RGB',(int(w*s)*cols,int(h*s)*rows),'white')
    for i,im in enumerate(ims): sh.paste(im.resize((int(w*s),int(h*s))),((i%cols)*int(w*s),(i//cols)*int(h*s)))
    sh.save(f'preview/sheet_{tag}.png')
