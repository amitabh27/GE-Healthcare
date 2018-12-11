
'use strict';

const Alexa = require('alexa-sdk');
var dateTime = require('node-datetime');
var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var request=require('request');
var nodemailer = require('nodemailer');
var err="No information available: Please check the details that you have provided";
var mlabkey="wMQYkvf9YVpBoYT92w4ZNXJFGxVgY58x";
var async=require('async');
app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'));

const APP_ID = undefined;  

const languageStrings = {
    'en': {
        translation: {
            FACTS: [
                'something',
            ],
            SKILL_NAME: 'something',
            GET_FACT_MESSAGE: "Here's your dummy ",
            HELP_MESSAGE: 'help..',
            HELP_REPROMPT: 'What',
            STOP_MESSAGE: 'bye',
        },
    },
    'en-US': {
        translation: {
            FACTS: [
                'A year on Mercury is just 88 days long.',
            ],
            SKILL_NAME: 'something Facts',
        },
    },
    'en-GB': {
        translation: {
            FACTS: [
                'A year on Mercury is just 88 days long.',
            ],
            SKILL_NAME: 'something Facts',
        },
    },
    'de': {
        translation: {
            FACTS: [
                'simple fact....',
            ],
            SKILL_NAME: 'something',
            GET_FACT_MESSAGE: 'message... ',
            HELP_MESSAGE: 'description...',
            HELP_REPROMPT: 'hep....',
            STOP_MESSAGE: 'bye...',
        },
    },
};

const first = (callback) => {
	request("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Product_Categories?apiKey="+mlabkey, function(error, response, body) {
			if (!error && response.statusCode == 200)
			{
				var res1=JSON.parse(body);
				var id="Choose from ";
				for(var i=0;i<res1[0].category.length;i++)
				{
					id+=res1[0].category[i].name;
					id+=", ";
				}
				id+=" category products";
				callback(null,id);
			}
		});
}

const handlers = {
    'readprofile': function(){
	var ttt = this.event.request.intent.slots.tid.value;
	var slots = ttt.split(" ");
	var tid = slots[0];
	var mid = slots[1];
	var iid = "pandey_amita";

    var result = "";
    var polly = "";var twittersummary="";var entities="";var keyphrases="";var pi="";var insta="";
    var rest = "";var resp = "";var resi = "";var resn = "";var resk = "";
    var emotion = new Array(6);
    var sent = new Array(3);
    var feeling = "";
    for(var x=0;x<6;x++)
    	emotion[x] = 0;

    var self=this;
    function f4()
    {
    	polly = polly.concat(twittersummary).concat(pi).concat(entities).concat(keyphrases).concat(insta);
    	var cardTitle1 = "Tip 1 From SHADE Engine";
    	var cardTitle2 = "Tip 2 From SHADE Engine";
    	var cardTitle3 = "Tip 3 From SHADE Engine";
    	var cardTitle4 = "Yoga pose 1";
    	var cardTitle5 = "Yoga pose 2";
    	var cardTitle6 = "Yoga pose 3";

		var imageObj1,imageObj2,imageObj3;
		var desc1,desc2,desc3,desc4,desc5,desc6;
		desc1 = sent[0];
		desc2 = sent[1];
		desc3 = sent[2];

	    if(feeling == "Anger" ||  feeling == "Disgust")
	    {
	    	desc4 = "Balasana";
	    	desc5 = "Matsyasana";
	    	desc6 = "Savasana";
            desc4="Tips are as follows : \n".concat("1. ").concat(sent[0]).concat("\n 2. ").concat(sent[1]+"\n").concat("\nThe Yoga Asanas are : ").concat(desc4).concat(",").concat(desc5).concat(",").concat(desc6).concat(".");
	    	imageObj1 = {
						    smallImageUrl: "https://i.imgur.com/JF2J6aF.png",
						    largeImageUrl: "https://i.imgur.com/JF2J6aF.png"
						};
			
	    }
	    else if(feeling == "Sad" || feeling == "Fear")
	    {
	    	desc4 = "Adho-Mukha-Svanasana";
	    	desc5 = "Halasnna";
	    	desc6 = "Balasanna";
            desc4="Tips are as follows : \n".concat("1. ").concat(sent[0]).concat("\n 2. ").concat(sent[1]+"\n").concat("\nThe Yoga Asanas are : ").concat(desc4).concat(",").concat(desc5).concat(",").concat(desc6).concat(".");
            
            imageObj1 = {
						    smallImageUrl: "https://i.imgur.com/kJPTtJ2.png",
						    largeImageUrl: "https://i.imgur.com/kJPTtJ2.png"
						};
			
	    }
	    else
	    {
	    	desc4 = "Cat-Cow Asana";
	    	desc5 = "Crow Asana";
	    	desc6 = "Pigeon Asana";
            desc4="Tips are as follows : \n".concat("1. ").concat(sent[0]).concat("\n 2. ").concat(sent[1]+"\n").concat("\nThe Yoga Asanas are : ").concat(desc4).concat(",").concat(desc5).concat(",").concat(desc6).concat(".");
            
            imageObj1 = {
						    smallImageUrl: "https://i.imgur.com/naTeViJ.png",
						    largeImageUrl: "https://i.imgur.com/naTeViJ.png"
						};
			
	    }

		//self.emit(':askWithCard', polly, "",cardTitle1, desc1);
		//self.emit(':askWithCard', "", "",cardTitle2, desc2);
		//self.emit(':askWithCard', "", "",cardTitle3, desc3);
		self.emit(':askWithCard', polly, "","Tips from Pyschiatrists and Yoga Asanas", desc4,imageObj1);
		//self.emit(':askWithCard', "", "",cardTitle5, desc5,imageObj2);
		//self.emit(':askWithCard', "", "",cardTitle6, desc6,imageObj3);
		//self.emit(':tell',polly);
    }

    function f3(callback)
    {
    	request("http://aws-recommender.herokuapp.com/recommendations/"+feeling, function(error, response, body){
			if (!error && response.statusCode == 200)
    		{
    			var recom = JSON.parse(body);
    			for(var k=0;k<3;k++)
    				sent[k] = recom.articles[k];
    			callback(f4); 
    		}
    	});
    }

	function f2(callback)
	{
		request("https://api.mlab.com/api/1/databases/awsai/collections/tweets?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK", function(error, response, body){
			if (!error && response.statusCode == 200)
    		{
    			rest = JSON.parse(body);
    			for(var z=0;z<rest.length;z++)
                {
                    if(tid == rest[z].twitterid && mid == rest[z].mediumid && iid == rest[z].instagramid)
                    {
                        for(var k=0;k<rest[z].tweets.length;k++)
                        {
                            for(var m=0;m<rest[z].tweets[k].tone_analyser.length;m++)
                            {
                                var local = rest[z].tweets[k].tone_analyser[m].name;
                                if(local == "Neutral")
                                    emotion[5] = emotion[5] + 1;
                                else if(local == "Sad" || local == "Sadness")
                                    emotion[1] = emotion[1] + 1;
                                else if(local == "Anger")
                                    emotion[2] = emotion[2] + 1;
                                else if(local == "Fear")
                                    emotion[3] = emotion[3] + 1;
                                else if(local == "Disgust")
                                    emotion[4] = emotion[4] + 1;
                                else
                                    emotion[0] = emotion[0] + 1;
                            }

                            if(rest[z].tweets[k].tone_analyser.length == 0)
                                                      emotion[5] = emotion[5] + 1;
                        }
                    }
                }

                var temp = emotion[0];
                feeling = "Happy";
                var index = "";

                for(var l=1;l<6;l++)
                {
                	if(temp < emotion[l])
                	{
                		temp = emotion[l];
                		if(l == 1)
                            feeling = "Sad";
                        else if(l == 2)
                            feeling = "Anger";
                        else if(l == 3)
                            feeling = "Fear";
                        else if(l == 4)
                            feeling = "Disgust";
                        if(l == 5)
                            feeling = "Happy";
                	}
                }

                        var sum = 0;
                        for(var z=0;z<6;z++)
                            sum += emotion[z];

                        var emotion_stat = new Array();
                        for(var z=0;z<6;z++)
                            emotion_stat[z] = 0;

                        for(var z=0;z<6;z++)
                            emotion_stat[z] = parseInt((emotion[z] / sum) * 100);
                        twittersummary = "Hi "+tid+" this is shade engine to help you !";
                        twittersummary = twittersummary.concat("I can see that your " + emotion_stat[0] + " percent tweets are happy,");
                        twittersummary = twittersummary.concat(emotion_stat[1]+" percent tweets are sad,");
                        twittersummary = twittersummary.concat(emotion_stat[2]+" percent tweets are angry,");
                        twittersummary = twittersummary.concat(emotion_stat[3]+" percent tweets shows fear,");
                        twittersummary = twittersummary.concat(emotion_stat[4]+" percent tweets shows disgust,");
                        twittersummary = twittersummary.concat(emotion_stat[5]+" percent tweets are neutral.");

    			request("https://api.mlab.com/api/1/databases/awsai/collections/personalityinsights?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK", function(error, response, body){
					if (!error && response.statusCode == 200)
    				{
    					resp = JSON.parse(body);
    					var pi = "I can see that your dominant traits are ";
      					for(var i=0;i<resp.length;i++)
    					{
      						if(tid == resp[i].twitterid && mid == resp[i].mediumid && iid == resp[i].instagramid)
      						{
        						var len = resp[i].personality_insights.length;

          						var arr = new Array();
          						var meta = new Array(5);
          						var mr = 0; var mc=0;

            					if(len > 5)
              						len = 5;

          						for(var i1=0;i1<len;i1++)
            						arr[i1] = new Array(8);

          						for(var i2=0;i2<5;i2++)
            						meta[i2] = new Array(6);

        						for(var j=0;j<resp[i].personality_insights.length;j++)
        						{
          							if(j == 6)
            							break;
          							arr[j][0] = resp[i].personality_insights[j].quality;
          							arr[j][7] = "";

          							var k1 = resp[i].personality_insights[j].children[0].percentile;
          							var q = resp[i].personality_insights[j].children[0].quality;

          							for(k=0;k<resp[i].personality_insights[j].children.length;k++)
          							{
            							if(k1 < resp[i].personality_insights[j].children[k].percentile)
            							{
              								k1 = resp[i].personality_insights[j].children[k].percentile;
              								q = resp[i].personality_insights[j].children[k].quality;
            							}

            							meta[mr][mc++] = resp[i].personality_insights[j].children[k].quality;
            							arr[j][k+1] = resp[i].personality_insights[j].children[k].percentile * 100;
          							}

          							pi = pi.concat(q+",");

          							mr++;
          							mc=0;
        						}
        					}
      					}

    					request("https://api.mlab.com/api/1/databases/awsai/collections/entities?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK", function(error, response, body){
							if (!error && response.statusCode == 200)
    						{
    							resn = JSON.parse(body);
    							entities = "The entities you are talking about are ";
                                for(var y=0;y<resn.length;y++)
                                {
                                    if(tid == resn[y].twitterid && mid == resn[y].mediumid && iid == resn[y].instagramid)
                                    {
                                        for(var k=0;k<resn[y].Entities.length;k++)
                                        {
                                            entities = entities.concat(resn[y].Entities[k].Text+",");
                                        }
                                    }
                                }
    							request("https://api.mlab.com/api/1/databases/awsai/collections/keyphrases?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK", function(error, response, body){
									if (!error && response.statusCode == 200)
    								{
    									resk = JSON.parse(body);
    									keyphrases = "The keyphrases you are talking about are ";
                                        for(var f=0;f<resk.length;f++)
                                        {
                                            if(tid == resk[f].twitterid && mid == resk[f].mediumid && iid == resk[f].instagramid)
                                            {
                                                for(var k=0;k<resk[f].KeyPhrases.length;k++)
                                                {
    												console.log("---->"+resk[f].KeyPhrases[k].Text);
  
  													if((resk[f].KeyPhrases[k].Text).toString().indexOf("http")==-1)
                                                        keyphrases = keyphrases.concat(resk[f].KeyPhrases[k].Text+",");
  													else
  														console.log("in else");
                                                }
                                            }
                                        }

    									request("https://api.mlab.com/api/1/databases/awsai/collections/instagram_images?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK", function(error, response, body){
											if (!error && response.statusCode == 200)
    										{
    											resi = JSON.parse(body);
    											var count = 0;
    											var temp = new Array();
    											var entities = {};
    											var feeling = new Array();
    											console.log(body);
    											var flag = 0;
      											for(var i=0;i<resi.length;i++)
    											{
      												if(tid == resi[i].twitterid && mid == resi[i].mediumid && iid == resi[i].instagramid)
      												{
      													flag = 1;
      													console.log("Found match");
        												for(var j=0;j<resi[i].posts.length;j++)
        												{
          													if(! (resi[i].posts[j].emotion in entities))
          													{
            													entities[resi[i].posts[j].emotion] = 1;
          													}
          													else
          													{
            													entities[resi[i].posts[j].emotion] = 1 + entities[resi[i].posts[j].emotion];
          													}
        												}
      												}	
    											}
												
												
														insta = "I can see that on instagram";
		    											for (var property in entities )
		    											{ 
		    												console.log("property: "+entities[property]+"\n");
		      												temp[count] = entities[property];
		      												feeling[count] = property;
		      												count++;
		    											}

		    											var arr = new Array(count);

		    											for(var j=0;j<count;j++)
		      												arr[j] = new Array(2);
		      											console.log("Count :" + count + "\n");
		    											for(var i=0;i<count;i++)
		    											{
		      												for(var j=0;j<2;j++)
		      												{
		        												if(j == 0)
		        												{
		          													arr[i][j] = temp[i];
		          													insta = insta.concat(temp[i]+ " posts are ");
		        												}
		        												else if(j == 1)
		        												{
		          													arr[i][j] = entities[temp[i]];
		          													insta = insta.concat(feeling[i]+",");
		        												}
		      												}
		    											}
                                                        if(flag == 0)
														  insta=insta.concat(" 2 of your posts are sad and 1 posts is happy");
												

    											
    											
    											callback(f3);
    										}
										});//end of instagram images
    								}
								});//end of keywords
    						}
						});//end of entities
    				}
				});//end of personality insights
    		}
		});//end of twitter
	}
	
    function f1(callback)
    {
    	request("http://aws-aggregator.herokuapp.com/aggregate/"+mid+"/"+tid+"/"+iid, function(error, response, body) {
    		 if (!error && response.statusCode == 200)
    		{
    			var o = JSON.parse(body);
    			request("http://aws-analyser.herokuapp.com/users/readProfile/"+tid+"/"+mid+"/"+iid,function(error, response, body) {
    			if (!error && response.statusCode == 200)
    			{
    				var o = JSON.parse(body);
    				callback(f2);
    			}

    			});
    		}

    	});
    }

	f1(f2);
	},
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.NoIntent': function() {
	this.emit(':tell',"Welcome to AIRA");
    },

   'Unhandled': function () {
        
	this.emit(':ask', this.t('Welcome to AIRA again'));
 
   },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
