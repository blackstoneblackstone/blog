import os
import oss2
import re
from configparser import ConfigParser

__cfg = ConfigParser()
__cfg.read('./config.ini')
__cfg.sections()
__appKey = __cfg.get('ossConf', 'appKey')
__appSec = __cfg.get('ossConf', 'appSec')
__auth = oss2.Auth(__appKey, __appSec)
__bucket = oss2.Bucket(__auth, 'http://oss-cn-beijing.aliyuncs.com', 'yondu-blog')


class PlayMusic:
    title = ''
    author = ''
    url = ''
    pic = ''

    def __init__(self, title, author, url, pic):
        self.title = title
        self.author = author
        self.url = url
        self.pic = pic

    def prf(self):
        return '{"title":"' + self.title + '","author":"' + self.author + '","url":"' + self.url + '","pic":"' + self.pic + '"}'


__s = []


def listFile(filePath):
    files = os.listdir(filePath)
    for fileName in files:
        if os.path.isdir(filePath + "/" + fileName):
            listFile(filePath + "/" + fileName)
        else:
            os.rename(filePath + "/" + fileName, filePath + "/" + fileName.replace(' ', ''))
            if re.match(r'lr[0-9]+\.mp3', fileName):
                upFile(filePath + "/" + fileName, fileName)
            __s.append(fileName)
    return __s


def upFile(localFile, onlineFile):
    with open(localFile, 'rb') as fileobj:
        fileobj.seek(0, os.SEEK_SET)
        __bucket.put_object('lr/2016/' + onlineFile, fileobj)
