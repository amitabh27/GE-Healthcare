from flask import Flask
import warnings
import random
warnings.filterwarnings('ignore')
import numpy as np
import pandas as pd
import re, nltk, gensim,random
from sklearn.decomposition import LatentDirichletAllocation, TruncatedSVD
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.model_selection import GridSearchCV
from pprint import pprint
import pyLDAvis
import pyLDAvis.sklearn
from nltk.stem.porter import PorterStemmer
from stop_words import get_stop_words
from nltk import ne_chunk, pos_tag, word_tokenize
from nltk.tree import Tree
from sklearn.cluster import SpectralClustering
from nltk.probability  import FreqDist
import datetime
import sklearn
from kmodes.kprototypes import KPrototypes
import pickle


def lda(text):
    
    #word_tokenizing
    global sent_to_words

    def sent_to_words(sentences):
        for sentence in sentences:
            yield(gensim.utils.simple_preprocess(str(sentence), deacc=True))
        
    data_words = list(sent_to_words(data))


    p_stemmer = PorterStemmer()
    en_stop = get_stop_words('en')

    data_lemmatized = []

    for i in data_words:
        tokens = i
        stopped_tokens = [i for i in tokens if not i in en_stop]
        stemmed_tokens = [p_stemmer.stem(i) for i in stopped_tokens]
    
        data_lemmatized.append(' '.join(stemmed_tokens))
    
    global vectorizer,data_vectorized,lda_model,lda_output,best_lda_model
    
    if training == 1:
        vectorizer = CountVectorizer(analyzer='word',       
                                 #min_df=10,                        # minimum reqd occurences of a word 
                                 stop_words='english',             # remove stop words
                                 lowercase=True,                   # convert all words to lowercase
                                 token_pattern='[a-zA-Z0-9]{3,}',  # num chars > 3
                                 # max_features=30000,             # max number of uniq words
                                )

        data_vectorized = vectorizer.fit_transform(data_lemmatized)

        #Building LDA model
        lda_model = LatentDirichletAllocation(n_components=8,               # Number of topics
                                          max_iter=20,               # Max learning iterations
                                          learning_method='online',   
                                          random_state=100,          # Random state
                                          batch_size=2,            # n docs in each learning iter
                                          evaluate_every = -1,       # compute perplexity every n iters, default: Don't
                                          n_jobs = -1,               # Use all available CPUs
                                         )
        lda_output = lda_model.fit_transform(data_vectorized)


        search_params = {'n_components': [3,5,7,9], 'learning_decay': [.5, .7, .9]}

        # Init the Model
        lda = LatentDirichletAllocation()

        # Init Grid Search Class
        model = GridSearchCV(lda, param_grid=search_params)

        # Do the Grid Search
        model.fit(data_vectorized)

        # Printing params for best model among all the generated ones
        # Best Model
        best_lda_model = model.best_estimator_
        
        outfile = open('vectorizer.pickled','wb')
        pickle.dump(vectorizer,outfile)
        outfile.close()
        outfile = open('data_vectorized.pickled','wb')
        pickle.dump(data_vectorized,outfile)
        outfile.close()
        outfile = open('lda_output.pickled','wb')
        pickle.dump(lda_output,outfile)
        outfile.close()
        outfile = open('lda_model.pickled','wb')
        pickle.dump(lda_model,outfile)
        outfile.close()
        outfile = open('best_lda_model.pickled','wb')
        pickle.dump(best_lda_model,outfile)
        outfile.close()
        
    else :
        
        infile = open('vectorizer.pickled','rb')
        vectorizer = pickle.load(infile)
        infile.close()
        infile = open('data_vectorized.pickled','rb')
        data_vectorized = pickle.load(infile)
        infile.close()
        infile = open('lda_output.pickled','rb')
        lda_output = pickle.load(infile)
        infile.close()
        infile = open('lda_model.pickled','rb')
        lda_model = pickle.load(infile)
        infile.close()
        infile = open('best_lda_model.pickled','rb')
        best_lda_model = pickle.load(infile)
        infile.close()


    #dominant topic in each doc

    # Create Document - Topic Matrix
    lda_output = best_lda_model.transform(data_vectorized)

    # column names
    topicnames = ["Topic" + str(i) for i in range(best_lda_model.n_components)]

    # index names
    docnames = ["Doc" + str(i) for i in range(len(data))]

    # Make the pandas dataframe
    df_document_topic = pd.DataFrame(np.round(lda_output, 2), columns=topicnames, index=docnames)

    # Get dominant topic for each document
    dominant_topic = np.argmax(df_document_topic.values, axis=1)
    df_document_topic['dominant_topic'] = dominant_topic

    df_topic_distribution = df_document_topic['dominant_topic'].value_counts().reset_index(name="Num Documents")

    # defining topic keywords 
    # Topic-Keyword Matrix
    df_topic_keywords = pd.DataFrame(best_lda_model.components_)

    # Assign Column and Index
    df_topic_keywords.columns = vectorizer.get_feature_names()
    df_topic_keywords.index = topicnames

    # View
    df_topic_keywords.head()

    #get top 15 keywords for each doc


    # Show top n keywords for each topic
    def show_topics(vectorizer=vectorizer, lda_model=lda_model, n_words=20):
        keywords = np.array(vectorizer.get_feature_names())
        topic_keywords = []
        for topic_weights in lda_model.components_:
            top_keyword_locs = (-topic_weights).argsort()[:n_words]
            topic_keywords.append(keywords.take(top_keyword_locs))
        return topic_keywords

    topic_keywords = show_topics(vectorizer=vectorizer, lda_model=best_lda_model, n_words=15)  

    #Given a piece of text, predicting the topic in document

    def predict_topic(text):
        global sent_to_words

        mytext_2 = list(sent_to_words(text))
        #print(mytext_2)

        mytext_3 =[]

        for i in mytext_2 :

            tokens=i
            stopped_tokens = [i for i in tokens if not i in en_stop]
            #print(stopped_tokens)
            stemmed_tokens = [p_stemmer.stem(i) for i in stopped_tokens]
            #print(stemmed_tokens)
            mytext_3.append(' '.join(stemmed_tokens))
            #print(mytext_3)

            mytext_4 = vectorizer.transform(mytext_3)

        topic_probability_scores = best_lda_model.transform(mytext_4)
        topic = df_topic_keywords.iloc[np.argmax(topic_probability_scores), :].values.tolist()
        return topic, topic_probability_scores



    #Given a piece of Text, predicting the documents that are related to it most closely

    from sklearn.metrics.pairwise import euclidean_distances

    def similar_documents(text, doc_topic_probs, documents = data, top_n=2, verbose=False):
        topic, x  = predict_topic(text)
        dists = euclidean_distances(x.reshape(1, -1), doc_topic_probs)[0]
        doc_ids = np.argsort(dists)[:top_n]
        return doc_ids, np.take(documents, doc_ids)

    arr=[]
    arr.append(text)
    doc_ids, docs = similar_documents(text=arr, doc_topic_probs=lda_output, documents = data, top_n=2, verbose=True)
    result_api.append(docs[0])
    #print(result_api)


def tfidf(text):
    stopwords_en = get_stop_words('en')
    #stop words of english are removed by the below function
    def preprocessing(raw):
        wordlist=nltk.word_tokenize(raw)
        text=[w.lower() for w in wordlist if w not in stopwords_en]
        return text


    similarity_scores = []
    doc_number = []

    #We need to find documents that are similar to sample_doc from the corpus built above - data .

    sample_doc = text
    word_set= {'ibm'}

    for doc in data:
        word_set=word_set.union(set(preprocessing(doc)))
    word_set=word_set.union(set(preprocessing(sample_doc)))


    i=0
    for doc in data:
        text1=preprocessing(doc)
        text2=preprocessing(sample_doc)

        #TF Calculations

        freqd_text1=FreqDist(text1)
        text1_length=len(text1)

        text1_tf_dict = dict.fromkeys(word_set,0)
        for word in text1:
            text1_tf_dict[word] = freqd_text1[word]/text1_length


        freqd_text2=FreqDist(text2)
        text2_length=len(text2)

        text2_tf_dict = dict.fromkeys(word_set,0)
        for word in text2:
            text2_tf_dict[word] = freqd_text2[word]/text2_length


        #IDF Calculations

        text12_idf_dict=dict.fromkeys(word_set,0)
        text12_length = len(data)
        for word in text12_idf_dict.keys():
            if word in text1:
                text12_idf_dict[word]+=1
            if word in text2:
                text12_idf_dict[word]+=1

        import math
        for word,val  in text12_idf_dict.items():
            if val == 0 :
                val=0.01
                text12_idf_dict[word]=1+math.log(text12_length/(float(val)))


        #TF-IDF Calculations

        text1_tfidf_dict=dict.fromkeys(word_set,0)
        for word in text1:
            text1_tfidf_dict[word] = (text1_tf_dict[word])*(text12_idf_dict[word])

        text2_tfidf_dict=dict.fromkeys(word_set,0)
        for word in text2:
            text2_tfidf_dict[word] = (text2_tf_dict[word])*(text12_idf_dict[word])


        #Finding cosine distance which ranges between 0 and 1. 1 implies documents are similar since cos-inverse(0)=1 that is 
        #vectors are collinear.cos-inverse(90)=1 that is vectors are othogonal to each other implying compltely dissimilar.

        v1=list(text1_tfidf_dict.values())
        v2=list(text2_tfidf_dict.values())

        similarity= 1- nltk.cluster.cosine_distance(v1,v2)
        doc_number.append(int(i))
        similarity_scores.append(float(format(similarity*100,'4.2f')))
        i=i+1

        #print("Similarity Index = {:4.2f} % ".format(similarity*100))

    #print('Document IDs : ' + ', '.join(str(e) for e in doc_number))    
    #print('Similarity % : ' + ', '.join(str(e) for e in similarity_scores))
	
    
    #Based on similarity scores computed previously sort the document indices in ascending leading to most similar document indices
    #present at the end of array
    sorted_doc_list = [doc_number for _,doc_number in sorted(zip(similarity_scores,doc_number))]


    #printing top 3 documents which are most similar to sample_doc
    j = 0
    n=4
    for doc in reversed(sorted_doc_list):
        #print('\n\n',data[doc][:40])
        result_api.append(data[doc][0:])
        j=j+1
        if j==n :
            break
            
    #print(result_api)



		 
app = Flask(__name__)

@app.route("/recommendations/<text>",methods=['GET'])
def hello(text):
    
	global df,result_api,training,data,ids
	
	
	df=pd.read_excel("articles.xlsx")
	data=[]
	ids=[]
	for v in df['content']:
		data.append(v)

	#Getting user statistics
	text=text
	training=0


	#result_api will contain article ids of articles that are to be recommended
	result_api=[]
	tfidf(text)
	lda(text)
	#temp(text)
	#result_api=ids

	


	#print("Articles Recommended: {}".format(result_api))
	
	response="{\"articles\":["
	j=0
	for i in result_api:
		response=response+"\""+i+"\""

		if j<= (len(result_api)-2):
			response=response+","
		j=j+1
	response=response+"]}"
	

	
	
	
	
	return response


if __name__ == '__main__':
    app.run(debug=True)