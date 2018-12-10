# GE Healthcare Challenge
SHADE Engine to detect the emotions of a person based on his/her social media activity and recommend measures to improve upon the same.

# Problem Statement

Help me with my Mood with Social-media Health Analysis and Display Engine (SHADE) is a software solution which tries to analyse your current emotions based on the content that you share on different social media websites. With advances in technology, it has now become easy to detect the emotions user is going though by using NLP on the text shared which when combined with visual recognition on the images gives a concrete solution to take calm down measures before hand he/she chooses any drastic actions.


# Key Value Proposition 
<ul>
<li>Data is fetched not only from Twitter but also from Medium.com and Instagram.
<li>Emotion detection is applied on photos shared on Instagram and twitter apart from text.
<li>Derive personality insights apart from blogs written on medium website.
<li>Graphical representation of data using Google Charts (Bar Graph, Donut Pie-chart, 3D chart etc)
<li>Recommendation engine for providing tips from doctors and psychiatrist based upon emotion detected.
<li>Use of AWS-Translate module to translate all tweets to English so that other AWS services can use it effectively.
<li>Based on emotion detected, various yoga positions have been displayed.
<li>If user is sad or feeling disgusted, it is very dangerous to leave him alone. So we have shown nearby worship places, restaurants and natural places using Google Nearby APIs so that he will come out of room and explore places and will not be alone in public places.
<li>To show the nearby places, application uses the current location of the user.
<li><b>SMS Service</b> : If Sadness in aggregated crosses 60% then SMS is sent to user's emergency number.
<li><b>Medicine Aggregator</b> : Given a medicine name, links of different e-commerce websites where the product is available for sale.<br>
<li><b>Nearby Psychiatrists</b> : Using Location service from Browser, getting nearby psychiatrist clinics
<li><b>Alexa Skill </b>: Apart from web app, we have an Alexa Skill with same functionality which gives voice response as well as recommendations on alea app.
<li><b>Chatbot for CBT(Cognitive Behavioral Test)</b> : Chatbot powered by AI Services that improves over time as the patient interacts with it. It performs the role of expert in CBT Tests thus implanting positive thoughts in patient's mind.
</ul>
<br>


<h2>Proposed Solution</h2>

<ul>
  <li>The social media websites that we are targeting to understand user's current emotions are :</li>
  <ul>
    <li><b>Twitter</b> : We see twitter as a place where people express their instant emotions about Named Entities(Name,place,Product,Organisation etc).</li>
    <li><b>Instagram </b>: We see instagram as a rich source of data because of the #Tags usage and images a user shares which points to his current mental well being</li>
    <li><b>Medium </b>: The earlier two websites are used by people to express their momentary emotions where as when it comes to the most popular blog website like medium, analysing user's blogs gives you deep insights about his interests,personality and his state of mind.</li>
  </ul>
  
<li>
  The software solution has the following components :
  <ul>
    <li><b>Data Aggregator </b>: It is a REST Server to aggregate data from different social media websites and put it in a NoSQL DB</li>
    <li><b>Data Analyser </b>: It uses the data aagregated previously and use AWS-AI Services like Translate,Comprehend,Rekognition services like detectText,detectLabel,recogniseCelebrities and Watson components like Tone Analyser and Personality Insights; Custom Models to understand user's state of mind.</li>
    <li><b>Suggested Measures </b>: Once the user's state of mind has been understood. We shall give him data visualizations to help him understand himself better and songs,videos,articles,yoga asanas and nearby places to eat,worship or of natural beauty depending the most prominent emotion detected.</li>
   </ul>
</li>  
  
</ul>

# Architectures and Flow Diagram

![aws-rec-DB5](https://github.com/amitabh27/GE-Healthcare/blob/master/gitRepoMetadata/aws-archi3.png)<br><br><hr>
![aws-rec-DB3](https://github.com/amitabh27/AI-AWS-CHALLENGE/blob/master/gitRepoMetadata/aws-archi1.png)<br><br><hr>
![aws-rec-DB4](https://github.com/amitabh27/AI-AWS-CHALLENGE/blob/master/gitRepoMetadata/aws-archi2.png)<br>


# Technology Stack used 

<ul>
  <li><b> aws-aggregator : </b></li>
  <ul>
     <li>Server-Type : REST</li>
     <li>Programming Language : Python</li>
     <li>App : Flask App</li>
     <li>Hosted : heroku </li>
     <li>Major API Endpoint : http://aws-aggregator.herokuapp.com/aggregate/valid_mediumID/valid_twitterID/valid_instagramID</li>
    <li> 3rd Party APIs used : Twitter REST API,Medium RSS Feed, Instagram APIs. </li>
  </ul>
  <li><b> aws-analyser : </b></li>
  <ul>
     <li>Server-Type : NodeJS Project (Web-APP + REST Server)</li>
     <li>Programming Language : NodeJS with Express Framework</li>
     <li>App : NodeJS App</li>
     <li>Hosted : AWS Lambda </li>
     <li>Database : MongoDB hosted on MLAB </li>
     <li>Major API Endpoint : https://aws-analyser.amazonapp.com/readProfile/valid_twitterID/valid_mediumID/valid_instagramID</li>
    <li> 3rd Party APIs used : AWS APIs like Translate,Comprehend,Rekognition and Polly,Youtube APIs, Nearby Places APIs,Google Chart APIs,Algorithmia Models,Custom Model APIs,ibm-tone analyser APIs,ibm - personality insights APIs</li>
  </ul> 
  <li><b> aws-recommender : </b></li>
  <ul>
     <li>Server-Type : REST</li>
     <li>Programming Language : Python</li>
     <li>App : Flask App</li>
     <li>Hosted : heroku </li>
     <li>Major API Endpoint : http://aws-recommender.herokuapp.com/recommendations/emotion_detected</li>
    <li> Machine Learning Models Used : LDA and Tf-IDF</li>
    <li>Data for ML Models : CSVs with tips from doctors and psychologists to fight different emotions.</li>
  </ul>
  <li>For instagram, business accounts were having a 15days approval period to get access to APIs but since we dint have that much of time, we used a hack wherein the instagram data of any user can be obtained from this URL : https://www.instagram.com/iam_niks026/?__a=1
   where iam_niks026 is the "Instagram Handle".So currently we have used that as the JSON Response and kept it on server and built a JSON parser on top of it. When the solution goes live the FILE Reading will be replaced by the API calling.</li>
</ul>



# Implementation Details 

<h3> Module 1 : aws-aggregator </h3>
<ul>
  <li> Python Libraries Used : Flask,tweepy,json,csv,requests,xml.etree.ElementTree</li>
  <li> For each user we have a single document in the collection "aggregate" of DB "awsai" in MongoDB. When the user first enters the system, aws-aggregator checks the DB if these set of social-media IDs exist in DB. If not implies he has come to the web app for the first time and a new document is created for him.If not then the previous document is deleted and a new one is created for him.</li>
  <li><h6> Twitter Sub-Module : </h6></li>
  <ul>
    <li> Motivation : To get user's tweets of past 7 days to undertsand what were the instantaneoud emotions he went though.</li>
    <li> Data collected : For each tweet, we collect tweet text,time and language of tweet. Also we collect the image if any associated with the tweet.</li>
  </ul>
  <li><h6> Instagram Sub-Module : </h6></li>
  <ul>
    <li> Motivation : To get hash tags of each post which convey user's current state of mind and perform visual recognition on images.</li>
    <li> Data collected : For each post, we collect post's hashtages and post's image URL and number of likes and store it in DB</li>
  </ul>
  <li><h6> Medium Sub-Module : </h6></li>
  <ul>
    <li> Motivation : To get insights into user's perosnality and interests.</li>
    <li>Data Collected : For each blog, the blog content and date of publish.</li>
  </ul>
  
  <li><h6> Process Flow : </h6></li>
  <ul>
  <li>When user provides the social media handles the User Interface first calls the aws-aggregator module to fetch the data into DB which would be then analysed.</li>
  <li>Typical API Call looks like : http://aws-aggregator.herokuapp.com/aggregate/oldirony/amitabhtiwari3/amita_pandey</li>
  <li>Now the DB Document created for this user looks like:</li>
  </ul>
</ul>


 ![aws-agg-DB1](https://github.com/amitabh27/AI-AWS-CHALLENGE/blob/master/gitRepoMetadata/aws-agg1.png)<br>
    ![aws-agg-DB2](https://github.com/amitabh27/AI-AWS-CHALLENGE/blob/master/gitRepoMetadata/aws-agg2.png)<br>
    ![aws-agg-DB3](https://github.com/amitabh27/AI-AWS-CHALLENGE/blob/master/gitRepoMetadata/aws-agg3.png)<br>
    
    
<br><br>


<h3> Module 2 : aws-analyser </h3>
<ul>
  <li> NodeJS Modules Used : aws-sdk,watson-developer-cloud,image-downloader,request,async,body-parser,request,fs,algorithmia etc</li>
  <li> When aws-aggregator has successfully agregated the data, the UI calls aws-analyser to enrich the data with emotion intelligence.</li>
  <li><h6> AWS Translate Sub-Module : </h6></li>
  <ul>
    <li> Motivation : Using the tweet language field , convert tweets in other language to english.</li>
    <li> Outcome : Now all the tweets have been converted to english.</li>
  </ul>
  <li><h6> AWS Rekognition Sub-Module : </h6></li>
  <ul>
    <li> Motivation : If the user has tweeted an image in the tweet then,</li>
      <ul>
        <li> We use detectText() to extract the text in the image in the form of slogans,messages or memes.</li>
        <li>We use detectLabels() to identify the objects in an image or activities going on in an image</li>
        <li>We use recogniseCelebrities to find if any celebrities in the image (indicative of a fan/follower)</li>
      </ul>
    <li> Outcome : Enriching the textual tweet content and then later these insights are used for personalised recommendations.</li>
  </ul>
  <li><h6> Watson - Tone Analyser Sub-Module : </h6></li>
  <ul>
    <li> Motivation : To analyse the tone behind the set of words tweeted by the user.</li>
    <li>Outcome : To get scores of different emotions like sad,happy etc and add them to each tweet object and the one with highest score is chosen as the prominent emotion .</li>
     </ul>
  
  <li><h6> AWS Comprehend for getting Named Entities and Keyphrases : </h6></li>
  <ul>
    <li> Motivation : It is applied to Tweets to get keywords and Entities the user is influenced by.</li>
    <li>Outcome : Keywords array and Entities array added to user's document.</li>
  </ul>
  <li><h6> AWS Polly acting as a peronalised bot</h6></li>
  <ul>
    <li> Motivation : To narrate the user about what are the findings from his social media activity.</li>
    <li>Outcome : A human voice that calms down the user and explains him the entire SHADE engine's dashboard</li>
  </ul>
  
  <li><h6> Watson - Personality insights Sub-Module : </h6></li>
  <ul>
    <li> Motivation : It is applied to Blogs and Instagram Hashtags to know the personality attributes of user.</li>
    <li>Outcome :Personality insights array added to user's document with different parent quality and corresponding children quality.</li>
  </ul>
  
  <li><h6> Custom ML Model and Algorithmia Model Sub-Module : </h6></li>
  <ul>
    <li> Motivation : to create a customised 2-layer Network of Models to understand the emotions involved in an instagram image for each instagram post.</li>
          <li> <b>First Layer Model : Algorithmia model </b>- To find if the image has any human faces involved in it. If YES then the face emotions are extracted out to be associated with image.</li>
          <li> <b>Second Layer Model</b>- when first layer model confirms that there is no human being in the image then we make use of aesthetics of the image to determine emotion with a model trained with two sets of images like ones that are charcaterized by colors like black,grey,dark shades of blue and the other with much more vibrant colors. The first signifies that the user is feeling low while the second is an indicator of joy.</li>
          
        
  <li> Outcome : Each instagram post object is updated with the associated emotion.</li>
  </ul>
  
  <li><h6> Process Flow : </h6></li>
  <ul>
  <li>When aws-aggregator confirms that the data has been aggregated in DB, aws-analyser comes into action and does perform all the analysis and updates the user document with enriched analytical results.</li>
  <li>Typical API Call looks like : aws-analyser.herokuapp.com/users/readProfile/amitabhtiwari3/oldirony/pandey_amita</li>
  <li>Now the DB Document created for this user looks like:</li>
  </ul>
</ul>


 ![aws-ana-DB1](https://github.com/amitabh27/AI-AWS-CHALLENGE/blob/master/gitRepoMetadata/aws-ana1.png)<br>
    ![aws-ana-DB2](https://github.com/amitabh27/AI-AWS-CHALLENGE/blob/master/gitRepoMetadata/aws-ana2.png)<br>
    ![aws-ana-DB3](https://github.com/amitabh27/AI-AWS-CHALLENGE/blob/master/gitRepoMetadata/aws-ana3.png)<br>
    ![aws-ana-DB4](https://github.com/amitabh27/AI-AWS-CHALLENGE/blob/master/gitRepoMetadata/aws-ana4.png)<br>
    ![aws-ana-DB5](https://github.com/amitabh27/AI-AWS-CHALLENGE/blob/master/gitRepoMetadata/aws-ana5.png)<br>
    
  <br><br>
<h3> Module 3 : aws-recommender </h3>
<ul>
  <li> Python packages Used : numpy,pandas,gensim,nltksklearn,pyLDAvis,datetime,kmodes,pickle etc</li>
  <li> After aws-analyser has updated the user document,based on emotion the UI calls the recommender for pro-tips from doctors and psychologists to fight the adverse effects of emotions. This REST Server acting as recommendation engine then returns a set of 5 articles obtained from LDA and TF-IDF Model.</li>
  <li><h6>LDA - Latent Dirichlet Allocation Model : </h6></li>
  <ul>
    <li> Motivation : Using API input, where the emotion param is a piece of text describing the user's state, the LDA Model using topic modelling on the corpus of articles it has, tries to find related articles.</li>
    <li> Outcome : 2 Articles from LDA are concatenated to JSON Response.</li>
  </ul>
  <li><h6>TF-IDF - TermFrequency - InverseDocumentFrequency Model : </h6></li>
  <ul>
    <li> Motivation : It tries to cluster articles based on term weights and uses cosine similarity between the input param and each vector representation of article from corpus and returns top 3 srticles with maximum matching scores.</li>
    <li>Outcome : 3 Articles from LDA are concatenated to JSON Response.</li>
     </ul>
 
  
  <li><h6> Process Flow : </h6></li>
  <ul>
  <li>Both Models have been pickled and at run time the pickled representation of them are used to come up with a set of 5 articles from the corpus that are most similar to the input param text received at th ePAI endpoint.</li>
  <li>Typical API Call looks like : http://aws-recommender.herokuapp.com/recommendations/fear</li>
  <li>Snapshots : Recommendation Engine and REST-Response</li>
  </ul>
</ul>


![aws-rec-DB1](https://github.com/amitabh27/AI-AWS-CHALLENGE/blob/master/gitRepoMetadata/aws-rec1.png)<br>
![aws-rec-DB2](https://github.com/amitabh27/AI-AWS-CHALLENGE/blob/master/gitRepoMetadata/aws-rec2.png)<br>

<h6>Block Diagram of LDA Model</h6>

![aws-rec-DB3](https://github.com/amitabh27/AI-AWS-CHALLENGE/blob/master/gitRepoMetadata/aws-rec3.png)<br>

<h6>Block Diagram of TF-IDF Model</h6>

![aws-rec-DB4](https://github.com/amitabh27/AI-AWS-CHALLENGE/blob/master/gitRepoMetadata/aws-rec4.png)<br>

    
  <br><br>
<h3> Module 4 : Web APP : User Interface </h3>
<ul>
  <li> Motivation : To come up with a dashboard with data visualisations to help user understand himself and the real-word entities that are influencing his state of mind. Also to come up with video,songs and articles recommendations based on his prominent emotion. Plus to come up with Nearby places to explore and Yoga Asanas to practice to overcome the diffcult times.</li>
  <li> After aws-analyser has updated the user document, the UI calls the Recommender for articles,Youtube APIs for songs and videos based on his current emotion. Google charts APIs are called for data visulaisations and Nearby APIs for places to eat,worship or explore natural beauty. Yoga Asanas Carousels are created at run time depending on his state of mind. </li>
  <li><h6>Youtube APIs for videos and songs: </h6></li>
  <ul>
    <li> Motivation : To get funny content and relaxing music.</li>
    <li> Outcome : 3 responses for videos and songs. User can click on it and he will be redirected to youtube site to play the same.</li>
  </ul>
  
   <li><h6>aws-recommender APIs for articles: </h6></li>
  <ul>
    <li> Motivation : To get professional tips on how to deal with certain kind of emotions.</li>
    <li> Outcome : 5 tips are presented on the dashboard.</li>
  </ul>
  
  <li><h6>Google Nearby APIs for Nearby places to eat,worship or of natural beauty: </h6></li>
  <ul>
    <li> Motivation : To cheer up people with depressions, psychologists says it's important to get out of your home, visit places that have good vibes to calm down your mind. The app asks the permission to know the current location of the user. Then the Nearby APIs are called to get list of restaurants,holy places and natural beauties around that location. </li>
    <li> Outcome : Lists of places, clicking on any list item, redirects to google maps with the the source as your current location and destination as the Latitude,Longitude of list item you clicked on giving you a glimpse of how to reach the destination./li>
  </ul>
  
  <li><h6>Carousels of images showing Yoga Asanas : </h6></li>
  <ul>
    <li> Motivation : There are different Yoga positions to practice depending on the emotion you are feeling.</li>
    <li> Outcome : Same is presented to user depending on whether he is feeling happy,sad or disgusting.</li>
  </ul>
  
  <li><h6>Data Visualisations using Google Chart APIs</h6></li>
  <ul>
    <li> Motivation : To come up with a dashboard to help user undertand himself better.</li>
    <li> Outcome : Different kinds of graphs and pie-charts depicted below.</li>
  </ul>

 
  <li><h6> Process Flow : </h6></li>
  <ul>
  <li>UI does API calls and gets the dashboard populated with data from DB and external 3rd party APIs.</li>
  <li>Few Snapshots : UI elements are as follows.</li>
  </ul>
</ul>

<h6>SHADE Dashboard</h6><br>

![aws-rec-DB1](https://github.com/amitabh27/AI-AWS-CHALLENGE/blob/master/gitRepoMetadata/ui1.png)<br>
![aws-rec-DB1](https://github.com/amitabh27/AI-AWS-CHALLENGE/blob/master/gitRepoMetadata/ui2.png)<br>
![aws-rec-DB1](https://github.com/amitabh27/AI-AWS-CHALLENGE/blob/master/gitRepoMetadata/ui3.png)<br>
![aws-rec-DB1](https://github.com/amitabh27/AI-AWS-CHALLENGE/blob/master/gitRepoMetadata/ui4.png)<br>

<h6>SMS Service</h6><br>

![aws-rec-DB1](https://github.com/amitabh27/GE-Healthcare/blob/master/gitRepoMetadata/sms.png)<br>

<h6>Product Aggregator Service</h6><br>

![aws-rec-DB1](https://github.com/amitabh27/GE-Healthcare/blob/master/gitRepoMetadata/product.png)<br>

<h6>Nearby Psychiatrist</h6><br>

![aws-rec-DB1](https://github.com/amitabh27/GE-Healthcare/blob/master/gitRepoMetadata/psychiatrist.png)<br>

<h6>Alexa Service</h6><br>

![aws-rec-DB1](https://github.com/amitabh27/GE-Healthcare/blob/master/gitRepoMetadata/alexa.png)<br>


<h6>Chatbot Service</h6><br>

![aws-rec-DB1](https://github.com/amitabh27/GE-Healthcare/blob/master/gitRepoMetadata/chatbot.gif)<br>

