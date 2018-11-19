# -*- coding: utf-8 -*-
import re
import player

path = "/Users/lihongbin/Desktop/2016年"
# path = "/Users/lihongbin/Downloads/xun"
files = player.listFile(path)

mp3 = []
jpg = []
pdf = []
pds = []
playString = ''

for s in files:
    if re.match(r'lr[0-9]+\.mp3', s):
        s = s.replace('lr', '')
        s = s.replace('.mp3', '')
        mp3.append(s)
    elif re.match(r'\S+\.jpg', s):
        jpg.append(s)
    elif re.match(r'\S+\.pdf', s):
        pdf.append(s)


for mp in mp3:
    for pd in jpg:
        if pd.find(mp) != -1 and pd.find('｜') != -1:
            pd = pd.split('.')[0].split('｜')[1]
            pm = player.PlayMusic(pd, "刘润", 'http://static.gm-fitness.com/lr/2016/lr' + mp + '.mp3',
                                  "/images/9d25606f77315916afa1e399b3b05499.png")
            pds.append(pm)
            playString = playString + pm.prf() + ','
            break


playerList = '''{% aplayerlist %}
{ "narrow": false, "autoplay": true,
"mode": "order",
"showlrc": 0,
"mutex": true,
"theme": "#e6d0b2",
"preload": "auto",
"listmaxheight": "100%",
"music": [ ''' + playString[:-1] + '''
 ] }
{% endaplayerlist %}
'''

xzf = open('/Users/lihongbin/Desktop/life/blog/src/source/_data/lr.json', 'w')
xzf.write(playerList)
xzf.close()

print playerList
