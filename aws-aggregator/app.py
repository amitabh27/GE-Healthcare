from flask import Flask       
import tweepy 
import json
import csv 
import requests 
import xml.etree.ElementTree as ET
import re

TAG_RE = re.compile(r'<[^>]+>')
consumer_key = "" 
consumer_secret = ""
access_key = ""
access_secret = ""

medium_text=[]
medium_time=[]
tweets_text=[]
tweets_time=[]
tweets_language=[]
tweets_image=[]
tweets_video=[]
instagram_text=[]
instagram_displayurl=[]
instagram_likes=[]

def get_tweets(username): 
          
        
        langs = {'ar': 'Arabic', 'bg': 'Bulgarian', 'ca': 'Catalan', 'cs': 'Czech', 'da': 'Danish', 'de': 'German', 'el': 'Greek', 'en': 'English', 'es': 'Spanish', 'et': 'Estonian',
         'fa': 'Persian', 'fi': 'Finnish', 'fr': 'French', 'hi': 'Hindi', 'hr': 'Croatian', 'hu': 'Hungarian', 'id': 'Indonesian', 'is': 'Icelandic', 'it': 'Italian', 'iw': 'Hebrew',
         'ja': 'Japanese', 'ko': 'Korean', 'lt': 'Lithuanian', 'lv': 'Latvian', 'ms': 'Malay', 'nl': 'Dutch', 'no': 'Norwegian', 'pl': 'Polish', 'pt': 'Portuguese', 'ro': 'Romanian',
         'ru': 'Russian', 'sk': 'Slovak', 'sl': 'Slovenian', 'sr': 'Serbian', 'sv': 'Swedish', 'th': 'Thai', 'tl': 'Filipino', 'tr': 'Turkish', 'uk': 'Ukrainian', 'ur': 'Urdu',
         'vi': 'Vietnamese', 'zh_CN': 'Chinese (simplified)', 'zh_TW': 'Chinese (traditional)','und':'Undetermined'}

        auth = tweepy.OAuthHandler(consumer_key, consumer_secret) 
        auth.set_access_token(access_key, access_secret) 
        # Calling api 
        api = tweepy.API(auth) 
  
        tweets = api.user_timeline(screen_name=username) 
    
    
        i=0
        for i in range(0,len(tweets)):
            
            status = tweets[i]
            json_str = json.dumps(status._json)
            
            if 'extended_entities' in json_str and 'video_info' in json_str:
                #print(tweets[i].extended_entities['media'][0]['video_info']['variants'][1]['url'])
                tweets_video.append(tweets[i].extended_entities['media'][0]['video_info']['variants'][1]['url'])
            else:
                tweets_video.append("No Video")
            i=i+1
        
    
        for tweet in tweets:
            #print(tweet)
            tweets_text.append(tweet.text)
            tweets_time.append(str(tweet.created_at).split()[0])
                
            media = tweet.entities.get('media', [])
            
            if(len(media) > 0):
                tweets_image.append(media[0]['media_url'])
            else:
                tweets_image.append("No Image")
            
            pre_lang = str(tweet.lang)
            if pre_lang == "et":
                pre_lang="en"
            tweets_language.append(langs[pre_lang])
        
        #print(tweets_text)
        #print(tweets_time)
        print(tweets_image)
        print(tweets_video)


def remove_tags(text):
	return TAG_RE.sub('', text)

def get_blogs(username): 
	r = requests.get('https://medium.com/feed/@'+username)
	
	with open('blogs.xml', 'wb') as f: 
		f.write(r.content)
		
	tree = ET.parse('blogs.xml') 
	root = tree.getroot() 

	for item in root.findall('./channel/item'): 
		news = {} 
		for child in item: 
			if child.tag=='{http://purl.org/rss/1.0/modules/content/}encoded':
				medium_text.append(remove_tags(str(child.text)))
			if child.tag=='pubDate':
				date=str(child.text).split()
				names=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
				numbers=['01','02','03','04','05','06','07','08','09','10','11','12']
				mn=0
				
				for i in range(0,12):
					if date[2] == names[i]:
						mn=numbers[i]
				medium_time.append(date[3]+'-'+mn+'-'+date[1])
				
	#print(medium_text)
	#print(medium_time)
	#print("medium executed successfully")

	
def get_posts(username): 
	
	json_data=open("instagram.json").read()
	data = json.loads(json_data)
	#print("entering in instagram")
	#print(len(data["graphql"]["user"]["edge_owner_to_timeline_media"]["edges"]))
	#print(len(data["graphql"]["user"]["edge_owner_to_timeline_media"]["edges"][0]["node"]["edge_media_to_caption"]["edges"]))
	#print(data["graphql"]["user"]["edge_owner_to_timeline_media"]["edges"][2]["node"]["edge_media_to_caption"]["edges"][0]["node"]["text"])
	#print(data["graphql"]["user"]["edge_owner_to_timeline_media"]["edges"][2]["node"]["display_url"])
	#print(data["graphql"]["user"]["edge_owner_to_timeline_media"]["edges"][2]["node"]["edge_liked_by"]["count"])
	for i in range(0,len(data["graphql"]["user"]["edge_owner_to_timeline_media"]["edges"])):
		z = len(data["graphql"]["user"]["edge_owner_to_timeline_media"]["edges"][i]["node"]["edge_media_to_caption"]["edges"])
		if(i >= 5):
			break
		if(z == 0):
			instagram_text.append("Blank Text")
		else:
			instagram_text.append(data["graphql"]["user"]["edge_owner_to_timeline_media"]["edges"][i]["node"]["edge_media_to_caption"]["edges"][0]["node"]["text"])
		instagram_displayurl.append(data["graphql"]["user"]["edge_owner_to_timeline_media"]["edges"][i]["node"]["display_url"])
		instagram_likes.append(data["graphql"]["user"]["edge_owner_to_timeline_media"]["edges"][i]["node"]["edge_liked_by"]["count"])
		#print(i)
	
	#print("insta executed")    
	#print(instagram_text)
	#print(instagram_displayurl)
	#print(instagram_likes)
	
	
	



	
	
	 
app = Flask(__name__)

@app.route("/aggregate/<m>/<t>/<insta>",methods=['GET'])
def hello(m,t,insta):
	
	#oldirony,amitabhtiwari3,iam_niks026
	#print("Aggregate Hit")
	mediumid=m
	get_blogs(mediumid)
	twitterid=t
	get_tweets(twitterid)
	instagramid=insta
	get_posts(instagramid)
	
	
	result={}
	result['twitterid']=twitterid
	result['mediumid']=mediumid
	result['instagramid']=instagramid

	t_arr=[]      
	for i in range(0,len(tweets_text)):
		res={}
		res['text']=tweets_text[i]
		res['lang']=tweets_language[i]
		res['time']=tweets_time[i]
		res['image']=tweets_image[i]
		res['video']=tweets_video[i]
		t_arr.append(res)

	result['tweets']=t_arr

	m_arr=[]
	for i in range(0,len(medium_text)):
		res={}
		res['text']=medium_text[i]
		res['time']=medium_time[i]
		m_arr.append(res)
	result['blogs']=m_arr

	i_arr=[]
	j=0
	for i in range(0,len(instagram_text)):
		res={}
		res['text']=instagram_text[i]
		res['url']=instagram_displayurl[i]
		res['likes']=instagram_likes[i]
		i_arr.append(res)
		j=j+1
		if j == 5:
			break
	result['posts']=i_arr

	#print(result)    


	e=requests.get('https://api.mlab.com/api/1/databases/awsai/collections/aggregate?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK')
	id=''
	for user in json.loads(e.text) :
		if user["twitterid"] == twitterid and user["mediumid"] == mediumid and user["instagramid"] == instagramid:
			id=user["_id"]["$oid"]
			requests.delete('https://api.mlab.com/api/1/databases/awsai/collections/aggregate/'+id+'?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK')
			break


	r = requests.post('https://api.mlab.com/api/1/databases/awsai/collections/aggregate?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK', json = result)

		
	
	temp="Data has been Aggregated in MongoDB"
	return json.dumps(result)


if __name__ == '__main__':
	app.run(debug=True)
