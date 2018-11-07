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
var key = "AIzaSyCweXwBZ82TU1ZdOCFoDFYhx9l75vh6E50";


var port = process.env.PORT || 5000;
AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.Credentials("AKIAJD57FJUNJYXIZDOQ", "qqL9+JZA7HEwjrrP7cQ3nunMo/kAshd7scBuBjnk");

app.get("/", function(req, res) {
    res.status(200).send("Welcome to SHADE's RESTFUL Server");
});

app.get("/analysis", (req, res) => {
    res.render('login');
});




app.get("/youtube/:search", function(req, ress) {

    var q = req.params.search;
    var result = "";

    function second() {
        ress.status(200).send(JSON.parse(result));
    }

    function first(callback) {
        request("https://www.googleapis.com/youtube/v3/search?key="+key+"&q=" + q + "&part=snippet,id&order=date&maxResults=20", function(error, res, body) {

            if (!error && res.statusCode == 200) {
                //  console.log("-->"+body);
                var response = JSON.parse(body);
                result = "{ \"videos\":[";
                for (var i = 0; i < response.items.length; i++) {
                    var link = "www.youtube.com/watch?v=" + response.items[i].id.videoId;
                    var title = response.items[i].snippet.title;
                    var description = response.items[i].snippet.description;
                    var preview = "";
                    if (response.items[i].snippet.thumbnails == null || response.items[i].snippet.thumbnails == undefined)
                        continue;


                    preview = response.items[i].snippet.thumbnails.default.url;
                    result = result.concat("{");
                    result = result.concat("\"preview\":\"").concat(preview).concat("\",");
                    result = result.concat("\"link\":\"").concat(link).concat("\",");
                    result = result.concat("\"title\":\"").concat(title.replace(/"/g, "").replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t")).concat("\",");
                    result = result.concat("\"description\":\"").concat(description.replace(/"/g, "").replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t")).concat("\"");
                    result = result.concat("}");

                    if (i <= response.items.length - 2)
                        result = result.concat(",");

                }
                result = result.concat("]}");
                console.log(result);
                callback(second);

            } else
                console.log(error);
        });
    }
    first(second);


});

app.get('/n/food/:lati/:longi', function(req, res) {
    var type = "food";
    //var location = req.params.location;
    //var key=req.params.key;
    var result = "";
    var lati = req.params.lati;
    var longi = req.params.longi;
    console.log("food");
    function second() {
        //return res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+result+'\"}}');
        return res.status(200).send(result);
    }

    function first(callback) {
        //request('https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + location + '+city+food&language=en&key=' + key, function(error, response, body) {
        request('https://maps.googleapis.com/maps/api/place/textsearch/json?query=food&location='+ lati +','+ longi + '+&radius=10000&key=' + key, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var o = JSON.parse(body);
                //console.log(body);
                //result="The spots are as follows:  ";
                result = "{ \"Hotels\":[";
                if (o.results.length == 0) {
                    result = "No data available for this location. Please try some other name";
                    callback(second);
                } else {
                    //console.log("Body:"+o);
                    for (var i = 0; i < o.results.length; i++) {
                        /*info=o.results[i].name.concat(',');
                        result=result.concat(info);*/
                        var addr = o.results[i].formatted_address;
                        var n = o.results[i].name;
                        result = result.concat("{");
                        result = result.concat("\"formatted_address\":\"").concat(addr).concat("\",");
                        result = result.concat("\"name\":\"").concat(n).concat("\"");

                        result = result.concat("}");
                        if (i <= o.results.length - 2)
                            result = result.concat(",");
                    }
                    result = result.concat("]}");
                }

                //console.log("response="+result);
                callback(second);
            } else {
                console.log("error..");
                return error;
            }
        });
    }
    first(second);


});


//nearby-nature-------------------------------------------------------------------------------------------
app.get('/n/natural/feature/:lati/:longi', function(req, res) {
    var type = "natural+feature";
    //var location = req.params.location;
    //var key=req.params.key;
    var lati = req.params.lati;
    var longi = req.params.longi;
    var result = "";

    function second() {
        //return res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+result+'\"}}');
        return res.status(200).send(result);
    }

    function first(callback) {
        //request('https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + location + '+city+natural+feature&language=en&key=' + key, function(error, response, body) {
        request('https://maps.googleapis.com/maps/api/place/textsearch/json?query=natural places&location='+ lati +','+ longi + '+&radius=10000&key=' + key, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var o = JSON.parse(body);
                //console.log(body);
                //result="The spots are as follows:  ";
                result = "{ \"Natural_Places\":[";
                if (o.results.length == 0) {
                    result = "No data available for this location. Please try some other name";
                    callback(second);
                } else {
                    for (var i = 0; i < o.results.length; i++) {
                        /*info=o.results[i].name.concat(',');
                        result=result.concat(info);*/
                        var addr = o.results[i].formatted_address;
                        var n = o.results[i].name;
                        result = result.concat("{");
                        result = result.concat("\"formatted_address\":\"").concat(addr).concat("\",");
                        result = result.concat("\"name\":\"").concat(n).concat("\"");

                        result = result.concat("}");
                        if (i <= o.results.length - 2)
                            result = result.concat(",");
                    }
                    result = result.concat("]}");
                }

                //console.log("response="+result);
                callback(second);
            } else {
                console.log("error..");
                return err;
            }
        });
    }
    first(second);
});


//nearby-worship--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/n/place/of/worship/:lati/:longi', function(req, res) {
    var type = "place+of+worship";
    //var location = req.params.location;
    //var key=req.params.key;
    var lati = req.params.lati;
    var longi = req.params.longi;
    var result = "";



    function second() {
        //return res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+result+'\"}}');
        return res.status(200).send(result);
    }

    function first(callback) {
        //request('https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + location + '+city+place+of+worship&language=en&key=' + key, function(error, response, body) {
        request('https://maps.googleapis.com/maps/api/place/textsearch/json?query=temples&location='+ lati +','+ longi + '+&radius=10000&key=' + key, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var o = JSON.parse(body);
                //console.log(body);
                //result="The spots are as follows:  ";
                result = "{ \"Temples\":[";
                if (o.results.length == 0) {
                    result = "No data available for this location. Please try some other name";
                    callback(second);
                } else {
                    for (var i = 0; i < o.results.length; i++) {
                        /*info=o.results[i].name.concat(',');
                        result=result.concat(info);*/
                        var addr = o.results[i].formatted_address;
                        var n = o.results[i].name;
                        result = result.concat("{");
                        result = result.concat("\"formatted_address\":\"").concat(addr).concat("\",");
                        result = result.concat("\"name\":\"").concat(n).concat("\"");

                        result = result.concat("}");
                        if (i <= o.results.length - 2)
                            result = result.concat(",");
                    }
                    result = result.concat("]}");
                }

                //console.log("response="+result);
                callback(second);
            } else {
                console.log("error..");
                return err;
            }
        });
    }
    first(second);
});

app.get("/date/", function(req, res){ 
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    console.log(formatted);
});

app.get("/s3/", function(req, res){ 

const s3 = new AWS.S3();

const fileName = 'speech.mp3';

const uploadFile = () => {
  fs.readFile(fileName, (err, data) => {
     if (err) throw err;
     const params = {
         Bucket: 'testags', // pass your bucket name
         Key: 'https://video.twimg.com/ext_tw_video/1057958538289369088/pu/vid/320x180/y84MxDs63mIWCNvJ.mp4', // file will be saved as testBucket/contacts.csv
         Body: JSON.stringify(data, null, 2)
     };
     s3.upload(params, function(s3Err, data) {
         if (s3Err) throw s3Err
         //console.log(data);
     });
  });
};

uploadFile();

});

app.get("/rekognition", function(req, res){
    var rekognition = new AWS.Rekognition();

   /* function base64_encode(file) {
        // read binary data
        var bitmap = fs.readFileSync(file);
        // convert binary data to base64 encoded string
        return new Buffer(bitmap).toString('base64');
    }
    //console.log(base64_encode('public/assets/images/test.jpg'));

    var params={
    "Image": {
        "Bytes": base64_encode('public/assets/images/test.jpg')
    },
    "MaxLabels": 10,
    "MinConfidence": 77
    }

    rekognition.detectLabels(params, function (err, data) {
      if (err) //console.log(err, err.stack); // an error occurred
      else {
            //console.log(data);
       }
    });*/
            fs.readFile('public/assets/images/test.png', 'base64', (err, data) => {

          // create a new base64 buffer out of the string passed to us by fs.readFile()
          const buffer = new Buffer(data, 'base64');

          // now that we have things in the right type, send it to rekognition
          rekognition.detectText({
              Image: {
                Bytes: buffer
              }
            }).promise()
            .then((res) => {

              // print out the labels that rekognition sent back
              //console.log(res);

            });
        });
});



app.get("/transcribe/:t", function(req, res){
    var t = req.params.t;
    var ep = new AWS.Endpoint('transcribe.us-east-1.amazonaws.com');
    var transcribeservice = new AWS.TranscribeService();

    if(t == '1')
    {
                    var params = {
                  LanguageCode:'en-US', /* required */
                  Media: { /* required */
                    MediaFileUri: "https://s3-us-east-1.amazonaws.com/testags/videoplayback.mp4"
                  },
                  MediaFormat: 'mp4', /* required */
                  TranscriptionJobName: 'Demo3', /* required */
                  //MediaSampleRateHertz: 32000,
                  OutputBucketName: 'testanalysis',
                  Settings: {
                    ChannelIdentification: true
                  }
                };
                transcribeservice.startTranscriptionJob(params, function(err, data) {
                  if (err) console.log(err, err.stack); // an error occurred
                  else     console.log(data);           // successful response
                });
    }
    else
    {
        var params = {
          TranscriptionJobName: 'Demo3'
        };
        transcribeservice.getTranscriptionJob(params, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else
          {     console.log(data);   
                var params = {
                  TranscriptionJobName: 'Demo3' /* required */
                };
                transcribeservice.deleteTranscriptionJob(params, function(err, data) {
                  if (err) console.log(err, err.stack); // an error occurred
                  else     console.log(data);           // successful response
                });
          }        // successful response
        });
    }
});

app.get("/translate/:text", function(req, res){
var ep = new AWS.Endpoint('https://Translate.us-east-1.amazonaws.com');
var translate = new AWS.Translate()
translate.endpoint = ep;
var params = {
  Text: req.params.text,
  SourceLanguageCode: 'auto',
  TargetLanguageCode: 'en'
};
translate.translateText(params, function (err, data) {
  //console.log(data.TranslatedText);
});
});

app.get("/comprehend/:text", function(req, res){
var ep = new AWS.Endpoint('transcribe.us-east-1.amazonaws.com');
var comprehend = new AWS.Comprehend();
var params = {
    LanguageCode: 'en',
    TextList: [req.params.text]
};

/*comprehend.batchDetectEntities(params, function(err, data){
if (err)
    //console.log(err, err.stack);
else
{
    //console.log(data['ResultList'][0]['Entities'].length);
    //console.log(data['ResultList'][0]['Entities']);
}
});*/

comprehend.batchDetectKeyPhrases(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else
  {
       //console.log(data['ResultList'][0]['KeyPhrases'].length);
       ////console.log(data['ResultList'][0]['KeyPhrases']);           // successful response
       var temp = data['ResultList'][0]['KeyPhrases'].length;
       for(var i=0;i<temp;i++)
        console.log(data['ResultList'][0]['KeyPhrases'][i].Text);
  }
});
});

app.get("/polly/:text/", function(req, res) {
            const Polly = new AWS.Polly({
            signatureVersion: 'v4',
            region: 'us-east-1'
        })

        let params = {
            'Text': req.params.text,
            'OutputFormat': 'mp3',
            'VoiceId': 'Kimberly'
        }

        Polly.synthesizeSpeech(params, (err, data) => {
            if (err) {
                //console.log(err.code)
            } else if (data) {
                if (data.AudioStream instanceof Buffer) {
                    fs.writeFile("public/assets/speech.mp3", data.AudioStream, function(err) {
                        if (err) {
                            console.log(err);
                        }
                        //console.log("The file was saved!");
                        res.status(200).send("done");
                    })
                    
                    }
            }
        }) 
});

app.get("/visualrecognition/", function(req, res) {

    var visualRecognition = new VisualRecognitionV3({
        version: '2018-03-19',
        "url": "https://gateway.watsonplatform.net/visual-recognition/api",
        iam_apikey: 'SUIEfbSq5apVu5HCOyzHWpwfYWTE4rO04-nnpjAswjmF'
    });

    var images_file = fs.createReadStream('public/assets/images/hello6.png');
    var classifier_ids = ["emotion_1004348802"];

    var params = {
      images_file: images_file,
      //url: 'https://scontent-bom1-1.cdninstagram.com/vp/53609e4f7b89627841d0941ad32ded29/5C2BB107/t51.2885-15/e35/38146144_1895271050766701_1294532726749134848_n.png',
      //url: urls[i],
      classifier_ids: classifier_ids
    };

    visualRecognition.classify(params, function(err, response) {
      if (err)
        console.log(err);
      else
        console.log(JSON.stringify(response, null, 2))
    });

    /*var params = {
        name: 'emotion',
        black_positive_examples: fs.createReadStream('./Black.zip'),
        color_positive_examples: fs.createReadStream('./Color.zip')
    };

    visualRecognition.createClassifier(params,
        function(err, response) {
            if (err)
                //console.log(err);
            else
                //console.log(JSON.stringify(response, null, 2))
        });*/
});

app.get("/personality-insights", function(req, res){
var personalityInsights = new PersonalityInsightsV3({
        'version_date': '2017-10-13',
        "url": "https://gateway.watsonplatform.net/personality-insights/api",
        "username": "8b302db5-6536-4ec8-bd54-7444ff456891",
        "password": "s5ArT7FJvhui"
    });

personalityInsights.profile({
        'text': 'I am very happy.'
    }, function(error, profile) {
        if (error) {
            //console.log(error);
        } else {
            //console.log(JSON.stringify(profile, null, 2));
        }
    });
});

app.get("/toneanalyzer", function(req, res) {
    var toneAnalyzer = new ToneAnalyzerV3({
        version_date: "2017-09-21",
        url: "https://gateway.watsonplatform.net/tone-analyzer/api",
        username: "6eb5faa5-f2e3-4eb2-b4c9-f78b9f1fab6e",
        password: "3MUVj1o8MQ61"
    });

    var text ="";

    var toneParams = {
        tone_input: {
            text: text
        },
        content_type: "application/json"
    };

    toneAnalyzer.tone(toneParams, function(error, toneAnalysis) {
        if (error) res.send(error);
        else res.send(JSON.stringify(toneAnalysis, null, 2));
    });
});

app.get("/readProfile/:tid/:mid/:iid", function(req, res) {

    var text = new Array();
    var lang = new Array();
    var time = new Array();
    var tweet_images = new Array();
    var blogs = new Array();
    var blogstime = new Array();
    var posts = new Array();
    var url = new Array();
    var modified_tweets = new Array();
    var dup = new Array();
    var names = new Array();
    var scores = new Array();
    var likes = new Array();
    var newtweets = new Array();
    var tone_size = new Array();
    var order = new Array();
    var text_entity = new Array();
    var scores_entity = new Array();
    var text_keyphrase = new Array();
    var scores_keyphrase = new Array();
    var type = new Array();
    var parentquality = new Array();
    var childrenquality = new Array();
    var sizequality = new Array();
    var mapquality = {};
    var parentpercentile = new Array();
    var childrenpercentile = new Array();
    var vr = new Array();
    var vrindex = 0;
    var z = 0;
    var qualitycount = 0;

    var map = {};
    var firstt = {};
    var nlumap = {};

    var ordercount = 0;
    var count = 0;
    var count1 = 0;
    var count2 = 0;
    var ts = 0;
    var id = "";
    var id1 = "";
    var id2 = "";
    var id3 = "";
    var id4 = "";
    var strtweet = "";
    var dd = "";

    var dict = {};
    var vrmap = {};
    var vrmap2 = {};
    

function personalityInsights()
{
    var str = "";
    var test = new Array();
    var result = "";

    for (var k = 0; k < newtweets.length; k++)
                str += newtweets[k] + " ";
    //console.log("Length: " + blogs.length + "\n");
    for (var k = 0; k < blogs.length; k++)
            str += blogs[k] + " ";
    //console.log("Length: " + posts.length + "\n");
    for (var k = 0; k < posts.length; k++)
            str += posts[k] + " ";
    test[0] = str;

    async.each(test, function(apiRequest, cb) {
        apicall(apiRequest, cb);
    }, function(err) {
        if (err)
            console.log("error...");
        else
            process_arrays();
        });

    function apicall(item, cb)
    {
        var personalityInsights = new PersonalityInsightsV3({
            'version_date': '2017-10-13',
            "url": "https://gateway.watsonplatform.net/personality-insights/api",
            "username": "8b302db5-6536-4ec8-bd54-7444ff456891",
            "password": "s5ArT7FJvhui"
        });

        personalityInsights.profile({
            'text': str
        }, function(error, profile) {
            if (error) {
                //console.log(error);
            } else {
                //console.log(JSON.stringify(profile, null, 2));
                var o = profile;
                    //console.log("personality length:" + o.personality.length + "\n");

                    for (var j = 0; j < o.personality.length; j++) {
                        parentquality[j] = o.personality[j].name;
                        sizequality[j] = o.personality[j].children.length;
                        parentpercentile[j] = o.personality[j].percentile;

                        for (var k = 0; k < o.personality[j].children.length; k++) {
                            childrenquality[qualitycount] = o.personality[j].children[k].name;
                            childrenpercentile[qualitycount++] = o.personality[j].children[k].percentile;
                        }
                    }
            }
            cb();
        });
    }

    function process_arrays()
    {
        result = result.concat("{");
        result = result.concat("\"twitterid\":\"").concat(req.params.tid).concat("\",");
        result = result.concat("\"mediumid\":\"").concat(req.params.mid).concat("\",");
        result = result.concat("\"instagramid\":\"").concat(req.params.iid).concat("\",");
        result = result.concat("\"personality_insights\":[");
        var ttt = 0;
        for (var j = 0; j < parentquality.length; j++) {
            result = result.concat("{");
            result = result.concat("\"quality\":\"").concat(parentquality[j]).concat("\",");
            result = result.concat("\"percentile\":\"").concat(parentpercentile[j]).concat("\",");

            result = result.concat("\"children\":[");
            for (var k = 0; k < sizequality[j]; k++) {
                result = result.concat("{");

                result = result.concat("\"quality\":\"").concat(childrenquality[ttt]).concat("\",");
                result = result.concat("\"percentile\":\"").concat(childrenpercentile[ttt++]).concat("\"");

                result = result.concat("}");

                if (k <= sizequality[j] - 2)
                    result = result.concat(",");
            }
            result = result.concat("]");
            result = result.concat("}");

            if (j <= parentquality.length - 2)
                result = result.concat(",");

        }        

        result = result.concat("]");
        result = result.concat("}");
            
                result = JSON.parse(result);
                request.post('https://api.mlab.com/api/1/databases/awsai/collections/personalityinsights?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK', {
                        json: result
                    },
                    function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log("----->" + body);
                        } else
                            console.log("-----XXXXX>" + error);
                    }
                );


                ////console.log(image_emotion);   
                ////console.log("URL Length:" + url.length);  

                //res.status(200).send(result);
           
    }
    
}

function detectEntities()
{
    var len = modified_tweets.length;
    var enlen = 0;
    var result = "";
    var localcount = 0;
    var test=new Array();
    //console.log("len="+len);
    //console.log("m_tweets="+modified_tweets);

    for (var x = 0; x < len/2; x++)
    {
        strtweet = strtweet + "  .  " +modified_tweets[x]; 
    }
    test[0]=strtweet;
    //console.log("****** All Tweets:"+test[0]);

    async.each(test, function(apiRequest, cb) {
        apicall(apiRequest, cb);
    }, function(err) {
        if (err)
            console.log("error...");
        else
            process_arrays();
        });

    function apicall(item, cb)
    {
        var ep = new AWS.Endpoint('transcribe.us-east-1.amazonaws.com');
        var comprehend = new AWS.Comprehend();
        var params = {
        LanguageCode: 'en',
        TextList: [item]
        };

        comprehend.batchDetectEntities(params, function(err, data){
        if (err)
            console.log(err, err.stack);
        else
        {
            enlen = data['ResultList'][0]['Entities'].length;
            //console.log("-----222>>>"+data['ResultList'][0]['Entities'].length);
            ////console.log(data['ResultList'][0]['Entities']);
            for(var i=0;i<enlen;i++)
            {
                if(data['ResultList'][0]['Entities'][i].Type != "OTHER")
                {
                    text_entity[localcount] = data['ResultList'][0]['Entities'][i].Text;
                    scores_entity[localcount] = data['ResultList'][0]['Entities'][i].Score;
                    type[localcount] = data['ResultList'][0]['Entities'][i].Type;
                    localcount++;
                }
            }
            //console.log("*****Text1" + text_entity);

        }

        cb();
        });
        
    }

    function process_arrays()
    {
        result = result.concat("{");
        result = result.concat("\"twitterid\":\"").concat(req.params.tid).concat("\",");
        result = result.concat("\"mediumid\":\"").concat(req.params.mid).concat("\",");
        result = result.concat("\"instagramid\":\"").concat(req.params.iid).concat("\",");
        result = result.concat("\"Entities\":[");

        for(var i=0;i < localcount;i++)
        {
            result = result.concat("{");
            result = result.concat("\"Text\":\"").concat(text_entity[i]).concat("\",");
            result = result.concat("\"Score\":\"").concat(scores_entity[i]).concat("\",");
            result = result.concat("\"Type\":\"").concat(type[i]).concat("\"");

             result = result.concat("}");
             if (i <= localcount - 2)
                    result = result.concat(",");
        }

        result = result.concat("]");
        result = result.concat("}");

        //console.log("*****Text2" + text_entity);
            
                result = JSON.parse(result);
                request.post('https://api.mlab.com/api/1/databases/awsai/collections/entities?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK', {
                        json: result
                    },
                    function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log("----->" + body);
                        } else
                            console.log("-----XXXXX>" + error);
                    }
                );


                ////console.log(image_emotion);   
                ////console.log("URL Length:" + url.length);  

                //res.status(200).send(result);
           
    }
}

function detectKeyPhrases()
{
    var len = modified_tweets.length;
    var enlen = 0;
    var result = "";
    var localcount = 0;
    var strtweet1 = "";
    var test=new Array();
    //console.log("len="+len);
    //console.log("m_tweets="+modified_tweets);

    for (var x = 0; x < len/2; x++)
    {
        strtweet1 = strtweet1 + "  .  " +modified_tweets[x]; 
    }
    test[0]=strtweet1;
    //console.log("****** All Tweets:"+test[0]);

    async.each(test, function(apiRequest, cb) {
        apicall(apiRequest, cb);
    }, function(err) {
        if (err)
            console.log("error...");
        else
            process_arrays();
        });

    function apicall(item, cb)
    {
        var ep = new AWS.Endpoint('transcribe.us-east-1.amazonaws.com');
        var comprehend = new AWS.Comprehend();
        var params = {
        LanguageCode: 'en',
        TextList: [item]
        };

        comprehend.batchDetectKeyPhrases(params, function(err, data){
        if (err)
            console.log(err, err.stack);
        else
        {
            enlen = data['ResultList'][0]['KeyPhrases'].length;
            //console.log("-----111>>>"+data['ResultList'][0]['KeyPhrases'].length);
            ////console.log(data['ResultList'][0]['Entities']);
            for(var i=0;i<enlen;i++)
            {
                    text_keyphrase[i] = data['ResultList'][0]['KeyPhrases'][i].Text;
                    scores_keyphrase[i] = data['ResultList'][0]['KeyPhrases'][i].Score;
                    
            }
            ////console.log("*****Text1" + text_entity);

        }
        cb();
        });        
    }

    function process_arrays()
    {
        result = result.concat("{");
        result = result.concat("\"twitterid\":\"").concat(req.params.tid).concat("\",");
        result = result.concat("\"mediumid\":\"").concat(req.params.mid).concat("\",");
        result = result.concat("\"instagramid\":\"").concat(req.params.iid).concat("\",");
        result = result.concat("\"KeyPhrases\":[");

        for(var i=0;i < enlen;i++)
        {
            result = result.concat("{");
            result = result.concat("\"Text\":\"").concat(text_keyphrase[i]).concat("\",");
            result = result.concat("\"Score\":\"").concat(scores_keyphrase[i]).concat("\"");

             result = result.concat("}");
             if (i <= enlen - 2)
                    result = result.concat(",");
        }

        result = result.concat("]");
        result = result.concat("}");

        ////console.log("*****Text2" + text_entity);
            
                result = JSON.parse(result);
                request.post('https://api.mlab.com/api/1/databases/awsai/collections/keyphrases?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK', {
                        json: result
                    },
                    function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log("----->" + body);
                        } else
                            console.log("-----XXXXX>" + error);
                    }
                );
    }
}

function toneAnalysis()
{
    var j = 0;
    var imagename = new Array();
    var text = new Array();
    var labels = new Array();
    var celebrity = "";

    function one(callback)
    {
        async.each(tweet_images, function(apiRequest, cb) {
            apicall(apiRequest, cb);

        }, function(err) {
            if (err)
                console.log("error...");
            else
                process_arrays();
        });

        function apicall(item, cb) {
        const options = {
                        url: item,
                        dest: 'public/assets/images/tweet' + j + '.jpg' // Save to /path/to/dest/image.png
                    }

            if(item != "No Image")
            {
                    //var filename = 'hello.png';
                    imagename[j] = "tweet" + j + ".jpg";
                    j++;
                    download.image(options)
                        .then(({
                            filename, image
                        }) => {
                            //console.log('File saved to', filename);
                            cb();
                        })
                        .catch((err) => {
                            console.error(err);
                            cb();
                        })
            }
            else
            {
                imagename[j] = "No Image-tweet"+j+".jpg";
                j++;
                cb();
            }
        }

        function process_arrays() {
            callback(two);
        }
    }

    function two(callback)
    {

        async.each(imagename, function(apiRequest, cb) {
            apicall(apiRequest, cb);

        }, function(err) {
            if (err)
                console.log("error...");
            else
                process_arrays();
        });

        function apicall(item,cb)
        {

            var sub = parseInt(item.substr(item.indexOf("tweet")+5,item.indexOf(".")));
            if(dict[sub] == 0)
            {
                dict[sub] = 1;
                    if(item.indexOf("No Image") == -1)
                    {
                        var rekognition = new AWS.Rekognition();

                        fs.readFile('public/assets/images/'+item, 'base64', (err, data) => {

                          // create a new base64 buffer out of the string passed to us by fs.readFile()
                        const buffer = new Buffer(data, 'base64');

                          // now that we have things in the right type, send it to rekognition
                        rekognition.detectText({
                              Image: {
                                Bytes: buffer
                              }
                            }).promise()
                            .then((res) => {

                                    // print out the labels that rekognition sent back
                                    rekognition.detectLabels({
                                      Image: {
                                        Bytes: buffer
                                      }
                                    }).promise()
                                    .then((res1) => {
                                            
                                                    rekognition.recognizeCelebrities({
                                              Image: {
                                                Bytes: buffer
                                              }
                                            }).promise()
                                            .then((res2) => {

                                                    //Detect Text Analysis 
                                                    console.log("Sub: " + sub);
                                                    /*nsole.log("res1:**** "+JSON.stringify(res));
                                                    console.log("res2:---- "+JSON.stringify(res1));
                                                    console.log("res3:^^^^ "+JSON.stringify(res2));*/


                                                    var r = JSON.parse(JSON.stringify(res));
                                                      var str = "";
                                                      if(r.TextDetections.length != 0)
                                                      {
                                                        for(var k=0;k<r.TextDetections.length;k++)
                                                            str = str.concat(r.TextDetections[k].DetectedText+" "); 
                                                        text[sub] = str;
                                                      }
                                                      else
                                                      {
                                                        text[sub] = "No Image";
                                                      }  

                                                      // Detect Label Analysis
                                                    var r1 = JSON.parse(JSON.stringify(res1));
                                                    var str1 = "";
                                                    if(r1.Labels.length != 0)
                                                    {
                                                        for(var k=0;k<r1.Labels.length;k++)
                                                            str1 = str1.concat(r1.Labels[k].Name+" "); 
                                                        labels[sub] = str1;
                                                    }
                                                    else
                                                        labels[sub] =  "No Image";   

                                                    //Detect Celebrity Faces
                                                    var r2 = JSON.parse(JSON.stringify(res2));
                                                    var str2 = "";
                                                    if(r2.CelebrityFaces.length != 0)
                                                    {
                                                        for(var k=0;k<r2.CelebrityFaces.length;k++)
                                                            str2 = str2.concat(r2.CelebrityFaces[k].Name+" "); 
                                                        celebrity = celebrity.concat(str2).concat(" ");
                                                    }
                                                    cb();  

                                                });
                                            });

                            });
                        });
                    }
                    else
                    {
                        text[sub] = "No Image";
                        labels[sub] = "No Image";
                        cb();
                    }
                }
                else
                    cb();
        }

        function process_arrays()
        {
            callback(three);
        }

    }

    function three()
    {
            console.log("Length: " + modified_tweets.length + "\n");

            for (var m = 0; m < modified_tweets.length/2; m++)
                    console.log(modified_tweets[m].replace(/"/g, "").replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t")+ "\n");
            //console.log("-----------------------------------------" + "\n");

            var len = modified_tweets.length;
            for (var x = 0; x < len/2; x++)
            {
                newtweets[x] = modified_tweets[x].replace(/"/g, "").replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
                if(text[x] != "No Image")
                    newtweets[x] = newtweets[x]+" "+text[x];
                if(labels[x] != "No Image")
                    newtweets[x] = newtweets[x]+" "+labels[x];
                map[newtweets[x]] = x;
            }

            //console.log("New Length: " + newtweets.length + "\n");
            async.each(newtweets, function(apiRequest, cb) {
                apicall(apiRequest, cb);
            }, function(err) {
                if (err)
                    console.log("error...");
                else
                    process_arrays();
                });

            function apicall(item, cb) {
                if (firstt[item] == 0)
                {
                    firstt[item] = 1;

                    var toneAnalyzer = new ToneAnalyzerV3({
                        version_date: "2017-09-21",
                        url: "https://gateway.watsonplatform.net/tone-analyzer/api",
                        username: "6eb5faa5-f2e3-4eb2-b4c9-f78b9f1fab6e",
                        password: "3MUVj1o8MQ61"
                        });

                    var toneParams = {
                        tone_input: {
                            text: item
                        },
                        content_type: "application/json"
                    };

                    toneAnalyzer.tone(toneParams, function(error, toneAnalysis) {
                        order[ordercount++] = map[item];
                        tone_size[ts++] = toneAnalysis.document_tone.tones.length;

                        //console.log("*****************************************" + "\n");
                        //console.log(item + "\n");
                        for (var k = 0; k < tone_size[ts - 1]; k++)
                        {
                            names[count1++] = toneAnalysis.document_tone.tones[k].tone_name;
                            scores[count2++] = toneAnalysis.document_tone.tones[k].score;
                            //console.log(toneAnalysis.document_tone.tones[k].tone_name + "\n" + toneAnalysis.document_tone.tones[k].score + "\n");
                        }

                        if (toneAnalysis.document_tone.tones.length == 0)
                        {
                            tone_size[ts - 1] = 1;
                            names[count1++] = "Neutral";
                            scores[count2++] = "0.1";
                        }

                        //console.log("*****************************************" + "\n");
                            cb();
                        });
                    } else
                        cb();
                }

                function process_arrays()
                {
                    console.log("Post:");
                    var result = "";
                    result = result.concat("{");
                    result = result.concat("\"twitterid\":\"").concat(req.params.tid).concat("\",");
                    result = result.concat("\"mediumid\":\"").concat(req.params.mid).concat("\",");
                    result = result.concat("\"instagramid\":\"").concat(req.params.iid).concat("\",");
                    result = result.concat("\"celebrity\":\"").concat(celebrity).concat("\",");
                    result = result.concat("\"date\":\"").concat(dd).concat("\",");

                    var temp_tt = "";
                    for (var i = 0; i < (newtweets.length - 1); i++)
                    {
                        for (var j = 0; j < (newtweets.length - i - 1); j++)
                        {
                            if (order[j] > order[j + 1])
                            {
                                temp_tt = order[j];
                                order[j] = order[j + 1];
                                order[j + 1] = temp_tt;
                                temp_tt = names[j];
                                names[j] = names[j + 1];
                                names[j + 1] = temp_tt;
                                temp_tt = scores[j];
                                scores[j] = scores[j + 1];
                                scores[j + 1] = temp_tt;
                                temp_tt = tone_size[j];
                                tone_size[j] = tone_size[j + 1];
                                tone_size[j + 1] = temp_tt;
                            }
                        }

                    }

                    var tttt = 0;
                    result = result.concat("\"tweets\":[");
                    for (var j = 0; j < newtweets.length; j++)
                    {
                        result = result.concat("{");
                        //result = result.concat("\"text\":\"").concat(newtweets[j].replace(/"/g, "").replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t")).concat("\",")
                        result = result.concat("\"text\":\"").concat(newtweets[j]).concat("\",");
                        result = result.concat("\"lang\":\"").concat(lang[j]).concat("\",");
                        result = result.concat("\"time\":\"").concat(time[j]).concat("\",");

                        //insert tone analyser details for each tweet here
                        result = result.concat("\"tone_analyser\":[");

                        for (var k = 0; k < tone_size[j]; k++)
                        {
                            result = result.concat("{");

                            result = result.concat("\"name\":\"").concat(names[tttt]).concat("\",");
                            result = result.concat("\"score\":\"").concat(scores[tttt++]).concat("\"");

                            result = result.concat("}");

                            if (k <= tone_size[j] - 2)
                                result = result.concat(",");
                        }
                        result = result.concat("]");
                        result = result.concat("}");

                        if (j <= newtweets.length - 2)
                            result = result.concat(",");
                    }

                    result = result.concat("]}");
                    //console.log(result);
                    //console.log("***** id : " + id);

                        console.log("*********************************************"+result);
                        //result = result.replace(/"/g, "").replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
                        //if(result.indexOf("alexa") != -1)
                        //    console.log(result.substr(result.indexOf("alexa"),result.indexOf("alexa")+20));
                        console.log("********** Error Indentify *****"+"\n");
                        console.log(result.substr(0,10));
                        result = JSON.parse(result);

                        request.post('https://api.mlab.com/api/1/databases/awsai/collections/tweets?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK', {
                                json: result
                            },
                            function(error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    console.log("----->" + "Success");
                                } 
                                else{
                                    console.log("-----XXXXX>" + error+"\n");
                                    console.log("statusCode: "+response.statusCode)
                            }
                        });


                        ////console.log(image_emotion);   
                        ////console.log("URL Length:" + url.length);  

                        //res.status(200).send(result);
                    
                
            }
        }
        one(two);
}

function instagramAnalysis()
{
        function first(callback)
        {
            var temp = new Array();

            for (var i = 0; i < url.length; i++)
                temp[i] = url[i].concat("99999").concat(i + 1);

            async.each(temp, function(apiRequest, cb) {
                    apicall(apiRequest, cb);

                }, function(err) {
                    if (err)
                        console.log("error...");
                    else
                        process_arrays();

            });

            function apicall(item, cb) {
                    var u = item.substr(0, item.indexOf("99999"));
                    var j = item.substr(item.indexOf("99999") + 5);

                    const options = {
                        url: u,
                        dest: 'public/assets/images/hello' + j + '.png' // Save to /path/to/dest/image.png
                    }

                    //var filename = 'hello.png';
                    download.image(options)
                        .then(({
                            filename, image
                        }) => {
                            //console.log('File saved to', filename);
                            cb();
                        })
                        .catch((err) => {
                            console.error(err);
                            cb();
                        })
                }

                function process_arrays() {
                    callback(sixth);
                }
        }

        function sixth(callback)
        {
            var temp = new Array();

            for (var i = 0; i < url.length; i++)
                temp[i] = url[i].concat("99999").concat(i + 1);

            async.each(temp, function(apiRequest, cb) {
                apicall(apiRequest, cb);

            }, function(err) {
            if (err)
                console.log("error...");
            else
                process_arrays();

            });

            function apicall(item, cb) {

                if (z < temp.length) {
                    var u = item.substr(0, item.indexOf("99999"));
                    var j = item.substr(item.indexOf("99999") + 5);
                    if(vrmap[j] == 0)
                    {
                            vrmap[j] = 1;
                            z++;

                            var input = {
                                "image": u,
                                "numResults": 7
                            };

                            Algorithmia.client("simkzwbWTiRHuQD4thgiDpX5hZ01")
                                .algo("deeplearning/EmotionRecognitionCNNMBP/1.0.1")
                                .pipe(input)
                                .then(function(response) {
                                    //console.log("Algorithmia: ***************>" + JSON.stringify(response.result));
                                    //console.log("\n" + j + "\n");

                                    if (response.result.results.length == 0)
                                        t = "Watson";
                                    else {
                                        t = response.result.results[0].emotions[0].label;
                                        if (t == "Happy")
                                            t = "joy";
                                        if (t == "Sad")
                                            t = "sad";
                                        t = t.toLowerCase();
                                        //console.log("********* " + t + "\n\n");
                                    }
                                    vr[j - 1] = t;
                                    cb();
                                });
                        }
                        else
                            cb();
                } else
                    cb();
            }

            function process_arrays() {
                //console.log("=====================>" + vr + "\n\n");
                callback(seventh);
            }
    }

    function seventh()
    {
        var local = new Array();
        for (var i = 0; i < url.length; i++)
            local[i] = url[i].concat("99999").concat(vr[i]).concat("999999").concat(i + 1);

        async.each(local, function(apiRequest, cb) {
            apicall(apiRequest, cb);

        }, function(err) {
            if (err)
                console.log("error...");
            else
                process_arrays();

        });

        function apicall(item, cb) {


                var u = item.substr(0, item.indexOf("99999"));
                var h = item.substr(item.indexOf("99999") + 5, item.indexOf("999999"));
                var j = item.substr(item.indexOf("999999") + 6);

                if(vrmap2[j] == 0)
                {
                    vrmap2[j] = 1;
                        var visualRecognition = new VisualRecognitionV3({
                            version: '2018-03-19',
                            "url": "https://gateway.watsonplatform.net/visual-recognition/api",
                            iam_apikey: 'SUIEfbSq5apVu5HCOyzHWpwfYWTE4rO04-nnpjAswjmF'
                        });


                        h = h.substr(0, 6);
                        //console.log("########### To call Watson ? :" + h + "\n");
                        var classifier_ids = new Array();
                        if (h == "Watson") {

                            //console.log("************* Calling Watson API " + j + "\n\n");
                            classifier_ids = ["emotion_1004348802"];
                            var images_file = fs.createReadStream("public/assets/images/hello" + j + ".png");

                            var params = {
                                images_file: images_file,
                                //url: item,
                                classifier_ids: classifier_ids
                            };

                            visualRecognition.classify(params, function(err, response) {
                                if (err)
                                    console.log(err);
                                else {
                                    //console.log("Watson : ----------->" + JSON.stringify(response) + "");
                                    //console.log("\n" + j + "\n");
                                    var t = "";
                                    var s = 0;

                                    //console.log("----------->" + JSON.stringify(response.images[0]) + "\n\n");
                                    t = response.images[0].classifiers[0].classes[0].class;
                                    s = response.images[0].classifiers[0].classes[0].score;

                                    for (var i = 0; i < response.images[0].classifiers[0].classes.length; i++) {
                                        if (s < response.images[0].classifiers[0].classes[i].score) {
                                            s = response.images[0].classifiers[0].classes[i].score;
                                            t = response.images[0].classifiers[0].classes[i].class;
                                        }
                                    }

                                    if (t == "black")
                                        t = "sad";
                                    if (t == "color")
                                        t = "joy";
                                    //console.log("********* " + t + "\n\n");
                                    vr[j - 1] = t;
                                    cb();
                                }
                            });
                        }
                        else
                            cb();
                } else {
                    cb();
                }
            } // closing apicall
        function process_arrays()
        {
            var result = "{";
            result = result.concat("\"twitterid\":\"").concat(req.params.tid).concat("\",");
            result = result.concat("\"mediumid\":\"").concat(req.params.mid).concat("\",");
            result = result.concat("\"instagramid\":\"").concat(req.params.iid).concat("\",");
            result = result.concat("\"posts\":[");

            for (var j = 0; j < posts.length; j++) {
            result = result.concat("{");
            result = result.concat("\"text\":\"").concat(posts[j].replace(/"/g, "").replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t")).concat("\",");
            result = result.concat("\"url\":\"").concat(url[j]).concat("\",");
            result = result.concat("\"likes\":").concat(likes[j]).concat(",");
            result = result.concat("\"emotion\":\"").concat(vr[j]).concat("\"");

            result = result.concat("}");

            if (j <= posts.length - 2)
                result = result.concat(",");
        }
            result = result.concat("]}");
            result = JSON.parse(result);
                request.post('https://api.mlab.com/api/1/databases/awsai/collections/instagram_images?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK', {
                        json: result
                    },
                    function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log("----->" + body);
                            res.status(200).send("[\"analyser successful\"]");
                        } else
                            console.log("-----XXXXX>" + error);
                    }
                );



        }
    }
    first(sixth);
}

function fourth()
{
    //await Promise.all([toneAnalysis(), detectEntities(),detectKeyPhrases(),personalityInsights(),instagramAnalysis()]);
    instagramAnalysis();
    toneAnalysis();
    detectEntities();
    detectKeyPhrases();
    personalityInsights();
}

function third()
{
    

    fourth();
}

function second(callback)
{
    //console.log("!!!!!!!!! I am in second !!!!!!!!!!!   " + dup + "\n\n\n");

        async.each(dup, function(apiRequest, cb) {
            apicall(apiRequest, cb);

        }, function(err) {
            if (err)
                console.log("error...");
            else
                process_arrays();

        });

        function apicall(item, cb) {
            var t = item.substr(0, item.indexOf("99999"));
            var lang = item.substr(item.indexOf("99999") + 5);
            lang = lang.replace(/[0-9]/g, '');
            ////console.log("async second api"+"\n");
            //console.log(t + " : " + lang + "\n");


            if (lang != "English" && lang != "Undetermined")
            {
                //console.log("Executing IF "+"\n");
                var ep = new AWS.Endpoint('https://Translate.us-east-1.amazonaws.com');
                var translate = new AWS.Translate()
                translate.endpoint = ep;

                var params = {
                    Text: t,
                    SourceLanguageCode: 'auto',
                    TargetLanguageCode: 'en'
                };

                translate.translateText(params, function (err, data) {
                ////console.log(data);
                modified_tweets[count++] = data.TranslatedText;
                cb();
                });
            } 
            else
            {
                //console.log("Executing ELSE "+"\n");
                modified_tweets[count++] = t;
                cb();
            }
        }

        function process_arrays() {
            for (var x = 0; x < modified_tweets.length/2; x++) {
                firstt[modified_tweets[x]] = 0;
                ////console.log(modified_tweets[x]);
            }
            callback(third);
        }
}

function first(callback)
{
    //console.log("********* Calling First ************");
    nlumap["executed"] = 0;
    var name = new Array();
    var size = new Array();
    name[0] = "Jan";name[1] = "Feb";name[2] = "Mar";name[3] = "Apr";name[4] = "May";name[5] = "Jun";name[6] = "Jul";name[7] = "Aug";
    name[8] = "Sep";name[9] = "Oct";name[10] = "Nov";name[11] = "Dec";
    size[0] = 31;size[1] = 28;size[2] = 31;size[3] = 30;size[4] = 31;size[5] = 30;size[6] = 31;size[7] = 31;size[8] = 30;size[9] = 31;
    size[10] = 30;size[11] = 31;
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    formatted = formatted.substr(0,formatted.indexOf(" "));
    dd = formatted;
    formatted = formatted.split("-");
    var month = name[formatted[1]-1];
    var day = formatted[2];
    var curmonth="";var targetmonth="";

    if(day.charAt(0) == '0')
            day = day.substr(1,2);

    var tillday = day - 7;
        

        if(tillday <= 0)
        {
            if(tillday < 0)
                for(var j=0;j<12;j++)
                {
                    if(name[j] == month)
                    {
                        targetmonth = j;
                        curmonth = j+1;
                        tillday = tillday + size[j-1] + 1;
                        break;
                    }
                }
            else
                for(var j=0;j<12;j++)
                {
                    if(name[j] == month)
                    {
                        targetmonth = j+1;
                        curmonth = j+1;
                        tillday = tillday + 1;
                        break;
                    }
                } 
        }
        else
        {
            for(var j=0;j<12;j++)
            {
                if(name[j] == month)
                {
                    targetmonth = j+1;
                    curmonth = j+1;
                    tillday = tillday + 1;
                    break;
                }
            }   
        }


    console.log(formatted);

    request("https://api.mlab.com/api/1/databases/awsai/collections/aggregate?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK", function(error, response, body) {

        if (!error && response.statusCode == 200)
        {
            var o = JSON.parse(body);
                for (var i = 0; i < o.length; i++)
                {
                    var temp = o[i];

                    if (temp.twitterid == req.params.tid && temp.mediumid == req.params.mid && temp.instagramid == req.params.iid)
                    {
                        var tt = 0;
                        for (var j = 0; j < temp.tweets.length; j++)
                        {
                            dict[j] = 0;
                            var td = temp.tweets[j].time;
                            var tdm = td.split("-")[1];
                            var tdd = td.split("-")[2];

                            if(tdm.charAt(0) == '0')
                                tdm = tdm.substr(1,2);
                            if(tdd.charAt(0) == '0')
                                tdd = tdd.substr(1,2);

                            console.log("tdd = " + tdd+" tillday"+tillday+" day:"+day+"\n");
                            console.log("Cur Month = " + curmonth+" targetmonth "+targetmonth +" tdm"+tdm+"\n");
                            if((tdd >= tillday && targetmonth == curmonth) || ((targetmonth == curmonth - 1) && (tdd >= tillday || (tdd.length == 1 && tdm == curmonth ))))
                            {
                                    console.log("tdd >= tillday && targetmonth == curmonth :" + (tdd >= tillday && targetmonth == curmonth));
                                    console.log("tdd >= tillday : " + (tdd >= tillday));
                                    console.log("tdd.length == 1 : " + (tdd.length == 1));
                                    console.log("Entered *****"+temp.tweets[j].time);
                

                                    //if(curmonth == targetmonth && tdm != curmonth)
                                     //   continue;

                                    if(!(temp.tweets[tt].text in unique_tweets))
                                    {
                                    unique_tweets[temp.tweets[tt].text]=1;
                                    text[tt] = temp.tweets[tt].text;
                                    lang[tt] = temp.tweets[tt].lang;
                                    time[tt] = temp.tweets[tt].time;
                                    tweet_images[tt] = temp.tweets[tt].image;
                                    dup[tt] = temp.tweets[tt].text + "99999" + temp.tweets[tt].lang;
                                    tt++;
                                    }
                            }
                        }
                        console.log(time+"*******"+text);

                        for (var j = 0; j < temp.blogs.length; j++)
                        {
                            blogs[j] = temp.blogs[j].text;
                            blogstime[j] = temp.blogs[j].time;
                        }

                        for (var j = 0; j < temp.posts.length; j++)
                        {
                            posts[j] = temp.posts[j].text;
                            url[j] = temp.posts[j].url;
                            likes[j] = temp.posts[j].likes;
                            vrmap[j] = 0;
                            vrmap2[j] = 0;
                        }
                        vrmap[j] = 0;
                        vrmap2[j] = 0;
                        ////console.log(temp);
                        //id = temp._id.$oid;
                        break;

                    }
                }
           
				request("https://api.mlab.com/api/1/databases/awsai/collections/tweets?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK", function(error, response, body) {
				if (!error && response.statusCode == 200)
				{
					var o = JSON.parse(body);
						for (var i = 0; i < o.length; i++)
						{
							var temp = o[i];

							if (temp.twitterid == req.params.tid && temp.mediumid == req.params.mid && temp.instagramid == req.params.iid)
							{
								id = temp._id.$oid;
								request.delete('https://api.mlab.com/api/1/databases/awsai/collections/tweets/' + id + '?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK', function(error, response, body) {
								if (!error && response.statusCode == 200) {

								console.log("deleted...");
								   
								}
								});
								break;
							}
						}
				}

				});

				request("https://api.mlab.com/api/1/databases/awsai/collections/entities?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK", function(error, response, body) {

				if (!error && response.statusCode == 200)
				{
					var o = JSON.parse(body);
						for (var i = 0; i < o.length; i++)
						{
							var temp = o[i];

							if (temp.twitterid == req.params.tid && temp.mediumid == req.params.mid && temp.instagramid == req.params.iid)
							{
								id1 = temp._id.$oid;
								
									request.delete('https://api.mlab.com/api/1/databases/awsai/collections/entities/' + id1 + '?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK', function(error, response, body) {
									if (!error && response.statusCode == 200) {

										console.log("deleted...");
										
									}
									});
								
								
								break;
							}
						}
				}
				else
					console.log(error);
			});      

			request("https://api.mlab.com/api/1/databases/awsai/collections/personalityinsights?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK", function(error, response, body) {

				if (!error && response.statusCode == 200)
				{
					var o = JSON.parse(body);
						for (var i = 0; i < o.length; i++)
						{
							var temp = o[i];

							if (temp.twitterid == req.params.tid && temp.mediumid == req.params.mid && temp.instagramid == req.params.iid)
							{
								id2 = temp._id.$oid;
								
								request.delete('https://api.mlab.com/api/1/databases/awsai/collections/personalityinsights/' + id2 + '?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK', function(error, response, body) {
									if (!error && response.statusCode == 200) {

										console.log("deleted...");
										
									}
								});
								
								break;
							}
						}
				}
				else
					console.log(error);
			});      

			request("https://api.mlab.com/api/1/databases/awsai/collections/keyphrases?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK", function(error, response, body) {

				if (!error && response.statusCode == 200)
				{
					var o = JSON.parse(body);
						for (var i = 0; i < o.length; i++)
						{
							var temp = o[i];

							if (temp.twitterid == req.params.tid && temp.mediumid == req.params.mid && temp.instagramid == req.params.iid)
							{
								id3 = temp._id.$oid;
								
								 request.delete('https://api.mlab.com/api/1/databases/awsai/collections/keyphrases/' + id3 + '?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK', function(error, response, body) {
									if (!error && response.statusCode == 200) {

										console.log("deleted...");
										
									}
								});
								break;
							}
						}
				}
				else
					console.log(error);
			});      

			request("https://api.mlab.com/api/1/databases/awsai/collections/instagram_images?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK", function(error, response, body) {

				if (!error && response.statusCode == 200)
				{
					var o = JSON.parse(body);
						for (var i = 0; i < o.length; i++)
						{
							var temp = o[i];

							if (temp.twitterid == req.params.tid && temp.mediumid == req.params.mid && temp.instagramid == req.params.iid)
							{
								id4 = temp._id.$oid;
								
								request.delete('https://api.mlab.com/api/1/databases/awsai/collections/instagram_images/' + id4 + '?apiKey=mAVS03itlTctm2m3MlM1hKfxSd16lsFK', function(error, response, body) {
								if (!error && response.statusCode == 200) {

										console.log("deleted...");
										
									}
								});
								break;
							}
						}
				}
				else
					console.log(error);
			}); 
                
			//all delete ids collected.	
			callback(second);

			
        }
          
    });

         
}
first(second);
});

module.exports = app;
