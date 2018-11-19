# -*- coding: utf-8 -*-
import re
import player

path = "/Users/lihongbin/Desktop/2017年"
# path = "/Users/lihongbin/Downloads/xun"
files = player.listFile(path)

mp3 = []
jpg = []
pdf = []
pds = []
playString = ''

for s in files:
    if re.match(r'xzf[0-9]+\.mp3', s):
        s = s.replace('xzf', '')
        s = s.replace('.mp3', '')
        mp3.append(s)
    elif re.match(r'\S+\.jpg', s):
        jpg.append(s)
    elif re.match(r'\S+\.png', s):
        jpg.append(s)
    elif re.match(r'\S+\.pdf', s):
        pdf.append(s)
print jpg

for mp in mp3:
    flag = 0
    for pd in jpg:
        if pd.find(mp) != -1:
            pd = pd.split('.')[0]
            if pd.find('丨') != -1:
                pd = pd.split('丨')[1]
            elif pd.find('|') != -1:
                pd = pd.split('|')[1]

            pm = player.PlayMusic(pd, "薛兆丰", 'http://static.gm-fitness.com/xzf/2017/xzf' + mp + '.mp3',
                                  "/images/9d25606f77315916afa1e399b3b05499.png")
            pds.append(pm)
            playString = playString + pm.prf() + ','
            flag = 1
            break
    if flag == 0:
        print mp

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

xzf = open('/Users/lihongbin/Desktop/life/blog/src/source/_data/xzf-3.json', 'w')
xzf.write(playerList)
xzf.close()

print playerList
