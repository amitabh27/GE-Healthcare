var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var request = require("request");
var async = require('async');
var fs = require('fs');
const download = require('image-downloader');
var Algorithmia = require("algorithmia");
var AWS = require('aws-sdk');
var ToneAnalyzerV3 = require("watson-developer-cloud/tone-analyzer/v3");
var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
const stream = require('stream');
var player = require('play-sound')({player: "./vlc.exe"});
var base64 = require('file-base64');
var dateTime = require('node-datetime');
const Nexmo = require('nexmo');
var key = "AIzaSyCweXwBZ82TU1ZdOCFoDFYhx9l75vh6E50";


var port = process.env.PORT || 5000;
AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.Credentials("", "");

// Set Port
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});

app.get("/", function(req, res) {
    res.status(200).send("Welcome to SHADE's Chatbot Server");
});

app.get("/chatbot/:username/:info", function(req, res) {
    var info = req.params.info;
    var username = req.params.username;
    var result = "";
    var result1 = "";
    var result2 = "";
    var date = dateTime.create();
    var formatted = date.format('Y-m-d H:M:S');
    formatted = formatted.substr(0,formatted.indexOf(" "));
    var id = "";
    var enlen = "";
    var enlen1 = "";
    var enlen2 = "";
    var feeling = "";
    var entities = "";
    var keyphrases = "";
    var engati = "";
    var entitiesmap = {};
    var keymap = {};
    var finance_loss = new Array();
    var drugs = new Array();
    var grief = new Array();
    var abuse = new Array();
    var illness = new Array();
    var category = "";
    finance_loss[0]="money";finance_loss[1]="debt";finance_loss[2]="share market";finance_loss[3]="loan";finance_loss[4]="finance";finance_loss[5]="theft";
    finance_loss[6]="black money";finance_loss[7]="monetary";finance_loss[8]="buisness";
    drugs[0]="addict";drugs[1]="narcotics";drugs[2]="overdose";drugs[3]="alcohol";drugs[4]="cigarette";drugs[5]="weed";drugs[6]="drug";drugs[7]="pills";drugs[0]="smuggle";
    grief[0]="die";grief[1]="death";grief[2]="demise";grief[3]="breakup";grief[4]="regret";grief[5]="dioverce";grief[6]="sorrow";grief[7]="marriage";grief[8]="old age";
    abuse[0]="abuse";abuse[1]="assault";abuse[2]="insult";abuse[3]="harass";abuse[4]="discrimination";abuse[5]="partiality";abuse[6]="exploit";abuse[7]="prosti";
    illness[0]="sick";illness[1]="fever";illness[2]="syndrome";illness[3]="ill";illness[4]="disorder";illness[5]="disease";illness[6]="health";

    function f5()
    {
    	if(enlen2 != 0)
        {
        	engati = engati.concat("I can see that you are feeling "+feeling+".");
        }
        if(enlen != 0)
        {
        	engati = engati.concat("The entities you are talking about are:"+entities+".");
        }
        if(enlen1 != 0)
        {
        	engati = engati.concat("The keyphrases you are talking about are:"+keyphrases+".");
        }

        for(var i=0;i<finance_loss.length;i++)
        {
        	if(info.indexOf(finance_loss[i]) != -1)
        		category = "Financial loss";
        }

        for(var i=0;i<grief.length;i++)
        {
        	if(info.indexOf(grief[i]) != -1)
        		category = "Grief and Loss";
        }

        for(var i=0;i<drugs.length;i++)
        {
        	if(info.indexOf(drugs[i]) != -1)
        		category = "Drugs";
        }

        for(var i=0;i<illness.length;i++)
        {
        	if(info.indexOf(illness[i]) != -1)
        		category = "Illness";
        }

        for(var i=0;i<abuse.length;i++)
        {
        	if(info.indexOf(abuse[i]) != -1)
        		category = "Abuse";
        }

        if(category == "")
        	category = "Grief and Loss";

        engati = engati.concat("I can see that your problem belongs to category "+category+".");
        console.log("Engati: "+engati+"\n");

        var result3 = "";
        result3 = result3.concat("\"category\":\"").concat(category);
        result3 = result3.concat("\"}");
        result = result.concat(result1).concat(result2).concat(result3);

    	request.post('https://api.mlab.com/api/1/databases/awsai/collections/chatbot?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK', {
                                json: JSON.parse(result)
                            },
        function(error, response, body) {
            if (!error && response.statusCode == 200)
            {
             	//res.status(200).send("[\"post successful\"]");
             	res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+engati+'\"}}');
            } 
            else
            {
                console.log("-----XXXXX>" + error+"\n");
                console.log("statusCode: "+response.statusCode);
            }
        });
        
        //res.status(200).send(result.concat(result1).concat(result2));
    }

    function f4(callback)
    {
    	result2 = "";
    	var ep = new AWS.Endpoint('transcribe.us-east-1.amazonaws.com');
        var comprehend = new AWS.Comprehend();
        var params = {
        LanguageCode: 'en',
        TextList: [info]
        };

        comprehend.batchDetectKeyPhrases(params, function(err, data){
        if (err)
            console.log(err, err.stack);
        else
        {
            enlen1 = data['ResultList'][0]['KeyPhrases'].length;
            console.log("enlen1: "+enlen1+"\n");
            result2 = result2.concat("\"KeyPhrases\":[");
            //console.log("-----111>>>"+data['ResultList'][0]['KeyPhrases'].length);
            ////console.log(data['ResultList'][0]['Entities']);
            for(var i=0;i<enlen1;i++)
            {
            		if(!(data['ResultList'][0]['KeyPhrases'][i].Text in keymap))
                    {
                    	keyphrases = keyphrases.concat(data['ResultList'][0]['KeyPhrases'][i].Text);
                    	keymap[data['ResultList'][0]['KeyPhrases'][i].Text] = 1;
                    }
            		//keyphrases = keyphrases.concat(data['ResultList'][0]['KeyPhrases'][i].Text);
            		result2 = result2.concat("{");	
                    result2 = result2.concat("\"Text\":\"").concat(data['ResultList'][0]['KeyPhrases'][i].Text).concat("\",");
        			result2 = result2.concat("\"Score\":\"").concat(data['ResultList'][0]['KeyPhrases'][i].Score).concat("\"");
        			if(i<enlen-1)
        				result2 = result2.concat("},");
        			else
        				result2 = result2.concat("}");
                    
            }
            result2 = result2.concat("],");
            ////console.log("*****Text1" + text_entity);
            callback(f5);
        }
    	});

    }

    function f3(callback)
    {
    	result1 = "";
        var ep = new AWS.Endpoint('transcribe.us-east-1.amazonaws.com');
        var comprehend = new AWS.Comprehend();
        var params = {
        LanguageCode: 'en',
        TextList: [info]
        };

        comprehend.batchDetectEntities(params, function(err, data){
        if (err)
            console.log(err, err.stack);
        else
        {
            enlen = data['ResultList'][0]['Entities'].length;
            console.log("enlen: "+enlen+"\n");
            //console.log("-----222>>>"+data['ResultList'][0]['Entities'].length);
            ////console.log(data['ResultList'][0]['Entities']);
            result1 = result1.concat("\"Entities\":[");
            for(var i=0;i<enlen;i++)
            {
            	console.log("i:"+i+"\n");
                if(data['ResultList'][0]['Entities'][i].Type != "OTHER" )
                {
                	result1 = result1.concat("{");
                    /*text_entity[localcount] = data['ResultList'][0]['Entities'][i].Text;
                    scores_entity[localcount] = data['ResultList'][0]['Entities'][i].Score;
                    type[localcount] = data['ResultList'][0]['Entities'][i].Type;
                    localcount++;*/
                    if(!(data['ResultList'][0]['Entities'][i].Text in entitiesmap))
                    {
                    	entities = entities.concat(data['ResultList'][0]['Entities'][i].Text+" ");
                    	entitiesmap[data['ResultList'][0]['Entities'][i].Text] = 1;
                    }
                    result1 = result1.concat("\"Text\":\"").concat(data['ResultList'][0]['Entities'][i].Text).concat("\",");
        			result1 = result1.concat("\"Score\":\"").concat(data['ResultList'][0]['Entities'][i].Score).concat("\",");
        			result1 = result1.concat("\"Type\":\"").concat(data['ResultList'][0]['Entities'][i].Type).concat("\"");
        			if(i < enlen - 1)
                	result1 = result1.concat("},");
                	else
                	result1 = result1.concat("}");
                }
                
            }
            result1 = result1.concat("],");
            //console.log("*****Text1" + text_entity);
            callback(f4);
        }
        });
        

    }

    function f2(callback)
    {
    	var toneAnalyzer = new ToneAnalyzerV3({
                        version_date: "2017-09-21",
                        url: "https://gateway.watsonplatform.net/tone-analyzer/api",
                        username: "6eb5faa5-f2e3-4eb2-b4c9-f78b9f1fab6e",
                        password: "3MUVj1o8MQ61"
                        });

    				var toneParams = {
        				tone_input: {
            			text: info
        				},
        				content_type: "application/json"
    				};

    		toneAnalyzer.tone(toneParams, function(error, toneAnalysis) {
        			if (error) res.send(error);
        			else
        			{
        				//res.send(JSON.stringify(toneAnalysis, null, 2));
        				//var res = JSON.parse(toneAnalysis);
        				console.log("Response :"+JSON.stringify(toneAnalysis)+"\n");

        				result = "{";
        				result = result.concat("\"username\":\"").concat(username).concat("\",");
        				result = result.concat("\"date\":\"").concat(formatted).concat("\",");
        				result = result.concat("\"text\":\"").concat(info).concat("\",");
        				result = result.concat("\"analysis\":[");
        				var tweetscore = 0; 
        				enlen2 = toneAnalysis.document_tone.tones.length;
        				console.log("enlen2: "+enlen2+"\n");
        				for(var k=0;k<toneAnalysis.document_tone.tones.length;k++)
        				{
        					if(tweetscore < toneAnalysis.document_tone.tones[k].score)
        					{
        						tweetscore = toneAnalysis.document_tone.tones[k].score;
        						feeling = toneAnalysis.document_tone.tones[k].tone_name;
        					}
        					
        					if(k < toneAnalysis.document_tone.tones.length - 1)
        					{
        						result = result.concat("{");
        						result = result.concat("\"name\":\"").concat(toneAnalysis.document_tone.tones[k].tone_name).concat("\",");
        						result = result.concat("\"score\":\"").concat(toneAnalysis.document_tone.tones[k].score).concat("\"");
        						result = result.concat("},");

        					}
        					else
        					{
        						result = result.concat("{");
        						result = result.concat("\"name\":\"").concat(toneAnalysis.document_tone.tones[k].tone_name).concat("\",");
        						result = result.concat("\"score\":\"").concat(toneAnalysis.document_tone.tones[k].score).concat("\"");
        						result = result.concat("}");	
        					}
        				}
        				result = result.concat("],");
        				
        				//console.log("Result :"+result+"\n");
        				//res.status(200).send(result);

        				callback(f3);
        			} 
    				});
    }

    function f1(callback)
    {
    	request("https://api.mlab.com/api/1/databases/awsai/collections/chatbot?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK", function(error, response, body) {
    	if (!error && response.statusCode == 200)
    	{
    		var o = JSON.parse(body);
    		for(var i=0;i<o.length;i++)
    		{
    			var temp = o[i];
    			if(temp.username == username)
    			{
    				id = temp._id.$oid;
    				request.delete('https://api.mlab.com/api/1/databases/awsai/collections/chatbot/' + id + '?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK', function(error, response, body) {
    					if (!error && response.statusCode == 200)
    					{
    						console.log("deleted...");
    						//break;
    					}
    				});
    			}		
    		}
    		callback(f2);
    	}
		});
    }

    f1(f2);
});
module.exports = app;
