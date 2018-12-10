

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
const second = (category,callback) => {
	request("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Product_Categories?apiKey="+mlabkey, function(error, response, body) {
			if (!error && response.statusCode == 200)
			{
				var res1=JSON.parse(body);
				var id="Choose from ";
				for(var i=0;i<res1[0].category.length;i++)
				{
					if(res1[0].category[i].name==category)
					{
						for(var j=0;j<res1[0].category[i].subcat.length;j++)
						{
							id+=res1[0].category[i].subcat[j].name;
							id+=", ";
						}
					}
				}
				id+=" subcategory products";
				callback(null,id);
			}
		});

}
const third = (category,sub_category,callback) => {
	request("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Product_Categories?apiKey="+mlabkey, function(error, response, body) {
			if (!error && response.statusCode == 200)
			{
				var res1=JSON.parse(body);
				var id="Choose from ";
				for(var i=0;i<res1[0].category.length;i++)
				{
					if(res1[0].category[i].name==category)
					{
						for(var j=0;j<res1[0].category[i].subcat.length;j++)
						{
							if(res1[0].category[i].subcat[j].name==sub_category)
							{
								for(var k=0;k<res1[0].category[i].subcat[j].brands.length;k++)
								{
									id+=res1[0].category[i].subcat[j].brands[k].name;
									id+=", ";
								}
							}
						}
					}
				}
				id+=" brands";
				callback(null,id);
			}
		});
}
const fourth = (category,sub_category,brand_name,callback) => {
console.log(category+" " +sub_category+brand_name);
request("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Product_Categories?apiKey="+mlabkey, function(error, response, body) {
			if (!error && response.statusCode == 200)
			{
				var res1=JSON.parse(body);
				var id="Choose from ";
				for(var i=0;i<res1[0].category.length;i++)
				{
					if(res1[0].category[i].name==category)
					{
						for(var j=0;j<res1[0].category[i].subcat.length;j++)
						{
							if(res1[0].category[i].subcat[j].name==sub_category)
							{
								for(var k=0;k<res1[0].category[i].subcat[j].brands.length;k++)
								{
									if(res1[0].category[i].subcat[j].brands[k].name==brand_name)
									{
										for(var l=0;l<res1[0].category[i].subcat[j].brands[k].products.length;l++)
										{
											id+=res1[0].category[i].subcat[j].brands[k].products[l].name;
											id+=", ";
										}
									}
								}
							}
						}
					}
				}
				id+=" products of "+brand_name+ " brand";
				callback(null,id);
			}
		});
}
const fifth = (category,sub_category,brand_name,product_name,callback) => {
request("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Product_Categories?apiKey="+mlabkey, function(error, response, body) {
			if (!error && response.statusCode == 200)
			{
				var res1=JSON.parse(body);
				var id="Choose from ";
				for(var i=0;i<res1[0].category.length;i++)
				{
					if(res1[0].category[i].name==category)
					{
						for(var j=0;j<res1[0].category[i].subcat.length;j++)
						{
							if(res1[0].category[i].subcat[j].name==sub_category)
							{
								for(var k=0;k<res1[0].category[i].subcat[j].brands.length;k++)
								{
									if(res1[0].category[i].subcat[j].brands[k].name==brand_name)
									{
										for(var l=0;l<res1[0].category[i].subcat[j].brands[k].products.length;l++)
										{
											if(res1[0].category[i].subcat[j].brands[k].products[l].name==product_name)
											{
												//id+=res1[0].category[i].subcat[j].brands[k].products[l].name;
												//id="Price is ";
												id=res1[0].category[i].subcat[j].brands[k].products[l].price;
												id+="***"+res1[0].category[i].subcat[j].brands[k].products[l].desc+"***"+res1[0].category[i].subcat[j].brands[k].products[l].url;
												//id+=" Available quantity is ";
												//id+=res1[0].category[i].subcat[j].brands[k].products[l].quantity;
											}
										}
									}
								}
							}
						}
					}
				}
				//id+=" Do you want to buy this product";
				callback(null,id);
			}
		});
}
const sixth = (callback) => {
request("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/User_Profiles?apiKey="+mlabkey, function(error, response, body) {
			if (!error && response.statusCode == 200)
			{
				var res1=JSON.parse(body);
				var id="Item in your cart are ";
				for(var i=0;i<res1[0].users.length && res1[0].users[i].name=="tarun";i++)
				{
					for(var j=0;j<res1[0].users[i].option[1].length;j++)
					{
						id+=res1[0].users[i].option[1][j].name;
						id+=", ";
					}
				}
				callback(null,id);
			}
		});

}
const seventh = (status_value,order_number,callback) => {
var id="";
var id_to_be_deleted="";
request("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/User_Profiles?apiKey="+mlabkey, function(error, response, body) {
			if (!error && response.statusCode == 200)
			{
				var res1=JSON.parse(body);
				console.log(id_to_be_deleted);
				id_to_be_deleted=res1[0]._id.$oid;
				console.log(id_to_be_deleted);
				var details=new Array();
				var option1_number=new Array();
				var option1_name=new Array();
				var option1_date=new Array();
				var option1_bill=new Array();
				var option1_quantity=new Array();
				var option1_status=new Array();
				var option2_name=new Array();
				var option2_price=new Array();
				var option2_quantity=new Array();
				details[0]=res1[0].users[0].name;
				details[1]=res1[0].users[0].emailid;
				details[2]=res1[0].users[0].mobileno;
				details[3]=res1[0].users[0].address;
				var status_value="cancelled";
				var order_number="123";
				for(var i=0;i<res1[0].users.length && res1[0].users[0].name=="tarun";i++)
				{
					for(var j=0;j<res1[0].users[i].option[0].length;j++)
					{
						if(res1[0].users[i].option[0][j].number==order_number)
						{
							option1_number[j]=res1[0].users[i].option[0][j].number;
							option1_name[j]=res1[0].users[i].option[0][j].name;
							option1_date[j]=res1[0].users[i].option[0][j].date;
							option1_bill[j]=res1[0].users[i].option[0][j].bill;
							option1_quantity[j]=res1[0].users[i].option[0][j].quantity;
							option1_status[j]=status_value;
						}
						else
						{
							option1_number[j]=res1[0].users[i].option[0][j].number;
							option1_name[j]=res1[0].users[i].option[0][j].name;
							option1_date[j]=res1[0].users[i].option[0][j].date;
							option1_bill[j]=res1[0].users[i].option[0][j].bill;
							option1_quantity[j]=res1[0].users[i].option[0][j].quantity;
							option1_status[j]=res1[0].users[i].option[0][j].status;
						}
					}
					for(var j=0;j<res1[0].users[i].option[1].length;j++)
					{
						option2_name[j]=res1[0].users[i].option[1][j].name;
						option2_price[j]=res1[0].users[i].option[1][j].price;
						option2_quantity[j]=res1[0].users[i].option[1][j].quantity;
					}
				}
				id="{\"users\" :[ { \"name\":\""+details[0]+"\", \"emailid\":\""+details[1]+"\", \"mobileno\" : \""+details[2]+"\", \"address\" : \""+details[3]+"\",";
				id+="\"option\":[ [ ";
				for(var i=0;i<option1_number.length;i++)
				{	
					id+="{ \"number\": \""+option1_number[i]+"\",";
					id+="\"name\": \""+option1_name[i]+"\",";
					id+="\"date\": \""+option1_date[i]+"\",";
					id+="\"bill\": \""+option1_bill[i]+"\",";
					id+="\"quantity\": \""+option1_quantity[i]+"\",";
					id+="\"status\": \""+option1_status[i]+"\"";
					id+="}";
					if(i+1<option1_number.length)
						id+=",";	
				}
				id+="],[";
				for(var i=0;i<option2_name.length;i++)
				{
					id+="{ \"name\": \""+option2_name[i]+"\",";
					id+="\"price\": \""+option2_price[i]+"\",";
					id+="\"quantity\": \""+option2_quantity[i]+"\"";
					id+="}";
					if(i+1<option2_name.length)
						id+=",";
				}
				id+="] ] }";
				//CODE_UPDATED
				var user2=JSON.stringify(res1[0].users[1]);
				var user3=JSON.stringify(res1[0].users[2]);
				
				id=id+","+user2;
				id=id+","+user3;
				
				id=id+ "] }";
				console.log(id);
			}
				
				console.log(id_to_be_deleted);
				request.delete('https://api.mlab.com/api/1/databases/alexa_rakuten/collections/User_Profiles/'+id_to_be_deleted+'?apiKey='+mlabkey,function (error, response, body) {
				if (!error && response.statusCode == 200)
				{
					console.log("deleted...");
					id=JSON.parse(id);	
					request.post('https://api.mlab.com/api/1/databases/alexa_rakuten/collections/User_Profiles?apiKey='+mlabkey,{ json: id },
					function (error, response, body) {
						if(!error && response.statusCode == 200) {
							console.log("----->"+body);
						}
						else
							console.log("-----XXXXX>"+error);
					}
					);
					
				
				}
				else
				console.log(response.statusCode);
				});
				var res="Status of the order has been changed";
				callback(null,res);
});
}
const eighth= (order_number,callback) => {
request("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/User_Profiles?apiKey="+mlabkey, function(error, response, body) {
			if (!error && response.statusCode == 200)
			{
				var res1=JSON.parse(body);
				var id="Order status is ";
				for(var i=0;i<res1[0].users.length && res1[0].users[i].name=="tarun";i++)
				{
					for(var j=0;j<res1[0].users[i].option[0].length;j++)
					{
						if(res1[0].users[i].option[0][j].number==order_number)
						{
							id+=res1[0].users[i].option[0][j].status;
							break;
						}
					}
				}
				callback(null,id);
			}
		});
}


const ninth=(callback) => {
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: '756375fa',
  apiSecret: 'sBJF41nAZp6lICan'
});
var val = Math.floor(1000 + Math.random() * 9000);
const from = 'AIRA'
const to = '917011120227'
const text = "Your OTP for order confirmation is "+val+". Happy Shopping!";

nexmo.message.sendSms(from, to, text);
var res=val;
callback(null,res);
}

const eleventh=(id_to_be_deleted,id) => {
console.log("sjvcs"+id_to_be_deleted);
console.log("user id"+id);
request.delete('https://api.mlab.com/api/1/databases/alexa_rakuten/collections/User_Profiles/'+id_to_be_deleted+'?apiKey='+mlabkey,function (error, response, body) {
				if (!error && response.statusCode == 200)
				{
					console.log("deleted user profile");
					id=JSON.parse(id);	
					request.post('https://api.mlab.com/api/1/databases/alexa_rakuten/collections/User_Profiles?apiKey='+mlabkey,{ json: id },
					function (error, response, body) {
						if(!error && response.statusCode == 200) {
							console.log("-----> posted user profile   "+body);
						}
						else
							console.log("-----XXXXX> user profile post errror"+error);
					}
					
					);
					
				//callback(null,"everything was fine");
				}
				
				else
				console.log("user profile delete error");
				});
}
const tenth=(product_name,product_price,otp,callback) => {
	var res="";
	var order_number=Math.floor(1000 + Math.random() * 9000);
	var product_quantity=1;
	
	var dt = dateTime.create();
    
	var formatted = dt.format('Y-m-d H:M:S');
    
	formatted = formatted.substr(0,formatted.indexOf(" "));
    
	formatted = formatted.split("-");
    
	var month=formatted[1];
	var day=formatted[2];
	var year=formatted[0];
	var date=day+'-'+month+'-'+year;
	var status="shipped";
	res=order_number+"***"+date;
	request("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Seller_Profiles?apiKey="+mlabkey, function(error, response, body) {
			if (!error && response.statusCode == 200)
			{
				var res1=JSON.parse(body);
				console.log("seller profile  "+res1);
				var flag=0;
				for(var i=0;i<res1.length && flag==0;i++)
				{
					var details=new Array();
					var products_name=new Array();
					var product_quantity=new Array();
					
					//CODE_UPDATED
					var date=new Array();
					var last_updated=new Array();
					var original_quantity=new Array();
					
					var id_to_be_deleted=res1[i]._id.$oid;
					details[0]=res1[i].sellerID;
					details[1]=res1[i].sellerName;
					details[2]=res1[i].sellerAddress;
					for(var j=0;j<res1[i].products.length;j++)
					{
						products_name[j]=res1[i].products[j].name;
						product_quantity[j]=res1[i].products[j].quantity;
						date[j]=res1[i].products[j].date;
						last_updated[j]=res1[i].products[j].last_updated;
						original_quantity[j]=res1[i].products[j].original_quantity;
						
						
						if(flag==0 && products_name[j]==product_name)
						{
							product_quantity[j]-=1;
							flag=1;
						}
					}
					var id="{\"sellerID\": \""+details[0]+"\",\"sellerName\": \" "+details[1]+"\",\"sellerAddress\": \" "+details[2]+"\", \"products\": [ ";
					
					var dtt = dateTime.create();var formattedt = dtt.format('Y-m-d H:M:S');
					formattedt = formattedt.substr(0,formattedt.indexOf(" "));formattedt = formattedt.split("-");

					var datet=formattedt[2]+'-'+formattedt[1]+'-'+formattedt[0];
					
					for(var j=0;j<products_name.length;j++)
					{
						if(products_name[j]==product_name)
						id+="{ \"name\": \""+products_name[j]+"\", \"quantity\": \""+product_quantity[j]+"\",\"date\":\""+date[j]+"\",\"last_updated\":\""+datet+"\",\"original_quantity\":\""+original_quantity[j]+"\"}";
						
						else
						id+="{ \"name\": \""+products_name[j]+"\", \"quantity\": \""+product_quantity[j]+"\",\"date\":\""+date[j]+"\",\"last_updated\":\""+last_updated[j]+"\",\"original_quantity\":\""+original_quantity[j]+"\"}";
						
						
						if(j+1<products_name.length)
							id+=",";	
					}
					id+="]}";
					console.log("after seller profile  "+id);
					console.log(id_to_be_deleted);
					request.delete('https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Seller_Profiles/'+id_to_be_deleted+'?apiKey='+mlabkey,function (error, response, body) {
					if (!error && response.statusCode == 200)
					{
						console.log("deleted seller profile");
						id=JSON.parse(id);	
						request.post('https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Seller_Profiles?apiKey='+mlabkey,{ json: id },
						function (error, response, body) {
						if(!error && response.statusCode == 200) {
							console.log("----->  posted successfully   "+body);
						}
						else
							console.log("-----XXXXX> seller profile post error  "+error);
					});
					}
					else
						console.log("seller profile delete error");
					});
				}
				
			}
			else
					console.log("error in seller profiles");
var user_id="";
var user_id_to_be_deleted="";
request("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/User_Profiles?apiKey="+mlabkey, function(error, response, body) {
			if (!error && response.statusCode == 200)
			{
				var res1=JSON.parse(body);
				console.log(res1);
				console.log(user_id_to_be_deleted);
				var id_to_be_deleted=res1[0]._id.$oid;
				console.log(user_id_to_be_deleted);
				var details=new Array();
				var option1_number=new Array();
				var option1_name=new Array();
				var option1_date=new Array();
				var option1_bill=new Array();
				var option1_quantity=new Array();
				var option1_status=new Array();
				var option2_name=new Array();
				var option2_price=new Array();
				var option2_quantity=new Array();
				details[0]=res1[0].users[0].name;
				details[1]=res1[0].users[0].emailid;
				res+="***"+res1[0].users[0].emailid;
				var email_id=res1[0].users[0].emailid;
				details[2]=res1[0].users[0].mobileno;
				details[3]=res1[0].users[0].address;
				console.log(details[0]+details[1]+details[2]+details[3]);
				for(var i=0;i<res1[0].users.length && res1[0].users[0].name=="tarun";i++)
				{
					for(var j=0;j<res1[0].users[i].option[0].length;j++)
					{
						option1_number[j]=res1[0].users[i].option[0][j].number;
						option1_name[j]=res1[0].users[i].option[0][j].name;
						option1_date[j]=res1[0].users[i].option[0][j].date;
						option1_bill[j]=res1[0].users[i].option[0][j].bill;
						option1_quantity[j]=res1[0].users[i].option[0][j].quantity;
						option1_status[j]=res1[0].users[i].option[0][j].status;
					}
					for(var j=0;j<res1[0].users[i].option[1].length;j++)
					{
						option2_name[j]=res1[0].users[i].option[1][j].name;
						option2_price[j]=res1[0].users[i].option[1][j].price;
						option2_quantity[j]=res1[0].users[i].option[1][j].quantity;
					}
				}
				user_id="{\"users\" :[ { \"name\":\""+details[0]+"\", \"emailid\":\""+details[1]+"\", \"mobileno\" : \""+details[2]+"\", \"address\" : \""+details[3]+"\",";
				user_id+="\"option\":[ [ ";
				for(var i=0;i<option1_number.length;i++)
				{	
					user_id+="{ \"number\": \""+option1_number[i]+"\",";
					user_id+="\"name\": \""+option1_name[i]+"\",";
					user_id+="\"date\": \""+option1_date[i]+"\",";
					user_id+="\"bill\": \""+option1_bill[i]+"\",";
					user_id+="\"quantity\": \""+option1_quantity[i]+"\",";
					user_id+="\"status\": \""+option1_status[i]+"\"";
					user_id+="}";
					user_id+=",";	
				}
				user_id+="{ \"number\": \""+order_number+"\",";
				user_id+="\"name\": \""+product_name+"\",";
				user_id+="\"date\": \""+date+"\",";
				user_id+="\"bill\": \""+product_price+"\",";
				user_id+="\"quantity\": \""+product_quantity+"\",";
				user_id+="\"status\": \""+status+"\"";
				user_id+="}";
				user_id+="],[";
				for(var i=0;i<option2_name.length;i++)
				{
					user_id+="{ \"name\": \""+option2_name[i]+"\",";
					user_id+="\"price\": \""+option2_price[i]+"\",";
					user_id+="\"quantity\": \""+option2_quantity[i]+"\"";
					user_id+="}";
					if(i+1<option2_name.length)
						user_id+=",";
				}
				user_id+="] ] }";
				//CODE_UPDATED
				var user2=JSON.stringify(res1[0].users[1]);
				var user3=JSON.stringify(res1[0].users[2]);
				
				user_id=user_id+","+user2;
				user_id=user_id+","+user3;
				
				user_id=user_id+ "] }";
				console.log(user_id);
				eleventh(user_id_to_be_deleted,user_id);
				var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
			user: 'airarakuten@gmail.com',
			pass: 'rakuten123#'
			}
			});

			var mailOptions = {
			from: 'airarakuten@gmail.com',
			to: email_id,
			subject: 'Order Placed',
			html:'<html><head><style>table {    font-family: arial, sans-serif;border-collapse: collapse;width: 80%}td, th { border: 2px solid #dddddd; text-align: left; padding: 10px;}tr:nth-child(even) {background-color: #dddddd;}</style></head><body>Hi "+details[0]+",<br> Thank you for shopping with us.Please find your order details below:<table><tr><th>Order Details</th></tr><tr><td>Product Name</td><td>'+product_name+'</td></tr><tr><td>Product price</td><td>'+product_price+'</td></tr><tr><td>Order Number</td><td>'+order_number+'</td></tr><tr><td>Order Date</td><td>'+date+'</td></tr></table><br><br> *This is a auto-generated mail. Please do not reply to this.</body></html>'
			
			};

			transporter.sendMail(mailOptions, function(error, info){
			if (error) {
			console.log(error);
			} else {
			console.log('Email sent: ' + info.response);
			}
			});
				callback(null,res);
			}
			else
				console.log("error user profiles");
				
				console.log(id_to_be_deleted);
});

});
}

const twelth=(product_name,product_price,order_number,product_quantity,date,status,id,id_to_be_deleted) => {
	request.delete('https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Seller_Profiles/'+id_to_be_deleted+'?apiKey='+mlabkey,function (error, response, body) {
					if (!error && response.statusCode == 200)
					{
						console.log("deleted seller profile");
						id=JSON.parse(id);	
						request.post('https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Seller_Profiles?apiKey='+mlabkey,{ json: id },
						function (error, response, body) {
						if(!error && response.statusCode == 200) {
							console.log("----->  posted successfully   "+body);
							fourteen(product_name,product_price,order_number,product_quantity,date,status,id,id_to_be_deleted);
						}
						else
							console.log("-----XXXXX> seller profile post error  "+error);
					});
					}
					else
						console.log("seller profile delete error");
					});
}
const thirteen=(product_name,product_price) => {
	var order_number=Math.floor(1000 + Math.random() * 9000);
	var product_quantity=1;
	
	var dt = dateTime.create();
    
	var formatted = dt.format('Y-m-d H:M:S');
    
	formatted = formatted.substr(0,formatted.indexOf(" "));
    
	formatted = formatted.split("-");
    
	var month=formatted[1];
	var day=formatted[2];
	var year=formatted[0];
	var date=day+'-'+month+'-'+year;
	var status="shipped";
	request("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Seller_Profiles?apiKey="+mlabkey, function(error, response, body) {
			if (!error && response.statusCode == 200)
			{
				var res1=JSON.parse(body);
				console.log("seller profile  "+res1);
				var flag=0;
				for(var i=0;i<res1.length && flag==0;i++)
				{
					var details=new Array();
					var products_name=new Array();
					var product_quantity=new Array();
					//CODE_UPDATED
					var date=new Array();
					var last_updated=new Array();
					var original_quantity=new Array();
					
					var id_to_be_deleted=res1[i]._id.$oid;
					details[0]=res1[i].sellerID;
					details[1]=res1[i].sellerName;
					details[2]=res1[i].sellerAddress;
					for(var j=0;j<res1[i].products.length;j++)
					{
						products_name[j]=res1[i].products[j].name;
						product_quantity[j]=res1[i].products[j].quantity;
						date[j]=res1[i].products[j].date;
						last_updated[j]=res1[i].products[j].last_updated;
						original_quantity[j]=res1[i].products[j].original_quantity;
						if(flag==0 && products_name[j]==product_name)
						{
							product_quantity[j]-=1;
							flag=1;
						}
					}
					var id="{\"sellerID\": \""+details[0]+"\",\"sellerName\": \" "+details[1]+"\",\"sellerAddress\": \" "+details[2]+"\", \"products\": [ ";
					
					var dtt = dateTime.create();var formattedt = dtt.format('Y-m-d H:M:S');
					formattedt = formattedt.substr(0,formattedt.indexOf(" "));formattedt = formattedt.split("-");

					var datet=formattedt[2]+'-'+formattedt[1]+'-'+formattedt[0];
					
					for(var j=0;j<products_name.length;j++)
					{
						if(products_name[j]==product_name)
						id+="{ \"name\": \""+products_name[j]+"\", \"quantity\": \""+product_quantity[j]+"\",\"date\":\""+date[j]+"\",\"last_updated\":\""+datet+"\",\"original_quantity\":\""+original_quantity[j]+"\"}";
							
						else
						id+="{ \"name\": \""+products_name[j]+"\", \"quantity\": \""+product_quantity[j]+"\",\"date\":\""+date[j]+"\",\"last_updated\":\""+last_updated[j]+"\",\"original_quantity\":\""+original_quantity[j]+"\"}";
						
						
						if(j+1<products_name.length)
							id+=",";	
					}
					id+="]}";
					twelth(product_name,product_price,order_number,product_quantity,date,status,id,id_to_be_deleted);
					var res="everything was fine";
					console.log("after seller profile  "+id);
					console.log(id_to_be_deleted);
				}	
			}
			else
					console.log("error in seller profiles");
});
}

const fourteen=(product_name,product_price,order_number,product_quantity,date,status) => {
var user_id="";
var user_id_to_be_deleted="";
request("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/User_Profiles?apiKey="+mlabkey, function(error, response, body) {
			if (!error && response.statusCode == 200)
			{
				var res1=JSON.parse(body);
				console.log(res1);
				user_id_to_be_deleted=res1[0]._id.$oid;
				console.log(user_id_to_be_deleted);
				var details=new Array();
				var details=new Array();
				var option1_number=new Array();
				var option1_name=new Array();
				var option1_date=new Array();
				var option1_bill=new Array();
				var option1_quantity=new Array();
				var option1_status=new Array();
				var option2_name=new Array();
				var option2_price=new Array();
				var option2_quantity=new Array();
				details[0]=res1[0].users[0].name;
				details[1]=res1[0].users[0].emailid;
				var email_id=res1[0].users[0].emailid;
				details[2]=res1[0].users[0].mobileno;
				details[3]=res1[0].users[0].address;
				console.log(details[0]+details[1]+details[2]+details[3]);
				for(var i=0;i<res1[0].users.length && res1[0].users[0].name=="tarun";i++)
				{
					for(var j=0;j<res1[0].users[i].option[0].length;j++)
					{
						option1_number[j]=res1[0].users[i].option[0][j].number;
						option1_name[j]=res1[0].users[i].option[0][j].name;
						option1_date[j]=res1[0].users[i].option[0][j].date;
						option1_bill[j]=res1[0].users[i].option[0][j].bill;
						option1_quantity[j]=res1[0].users[i].option[0][j].quantity;
						option1_status[j]=res1[0].users[i].option[0][j].status;
					}
					for(var j=0;j<res1[0].users[i].option[1].length;j++)
					{
						option2_name[j]=res1[0].users[i].option[1][j].name;
						option2_price[j]=res1[0].users[i].option[1][j].price;
						option2_quantity[j]=res1[0].users[i].option[1][j].quantity;
					}
				}
				user_id="{\"users\" :[ { \"name\":\""+details[0]+"\", \"emailid\":\""+details[1]+"\", \"mobileno\" : \""+details[2]+"\", \"address\" : \""+details[3]+"\",";
				user_id+="\"option\":[ [ ";
				for(var i=0;i<option1_number.length;i++)
				{	
					user_id+="{ \"number\": \""+option1_number[i]+"\",";
					user_id+="\"name\": \""+option1_name[i]+"\",";
					user_id+="\"date\": \""+option1_date[i]+"\",";
					user_id+="\"bill\": \""+option1_bill[i]+"\",";
					user_id+="\"quantity\": \""+option1_quantity[i]+"\",";
					user_id+="\"status\": \""+option1_status[i]+"\"";
					user_id+="}";
					user_id+=",";	
				}
				user_id+="{ \"number\": \""+order_number+"\",";
				user_id+="\"name\": \""+product_name+"\",";
				user_id+="\"date\": \""+date+"\",";
				user_id+="\"bill\": \""+product_price+"\",";
				user_id+="\"quantity\": \""+product_quantity+"\",";
				user_id+="\"status\": \""+status+"\"";
				user_id+="}";
				user_id+="],[";
				for(var i=0;i<option2_name.length;i++)
				{
					user_id+="{ \"name\": \""+option2_name[i]+"\",";
					user_id+="\"price\": \""+option2_price[i]+"\",";
					user_id+="\"quantity\": \""+option2_quantity[i]+"\"";
					user_id+="}";
					if(i+1<option2_name.length)
						user_id+=",";
				}
				
				user_id+="] ] }";
				//CODE_UPDATED
				var user2=JSON.stringify(res1[0].users[1]);
				var user3=JSON.stringify(res1[0].users[2]);
				
				user_id=user_id+","+user2;
				user_id=user_id+","+user3;
				
				user_id=user_id+ "] }";
				
				
				console.log(user_id);
				eleventh(user_id_to_be_deleted,user_id);
				var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
			user: 'airarakuten@gmail.com',
			pass: 'rakuten123#'
			}
			});

			var mailOptions = {
			from: 'airarakuten@gmail.com',
			to: email_id,
			subject: 'Order Placed',
			html:'<html><head><style>table {    font-family: arial, sans-serif;border-collapse: collapse;width: 80%}td, th { border: 2px solid #dddddd; text-align: left; padding: 10px;}tr:nth-child(even) {background-color: #dddddd;}</style></head><body>Hi "+details[0]+",<br> Thank you for shopping with us.Please find your order details below:<table><tr><th>Order Details</th></tr><tr><td>Product Name</td><td>'+product_name+'</td></tr><tr><td>Product price</td><td>'+product_price+'</td></tr><tr><td>Order Number</td><td>'+order_number+'</td></tr><tr><td>Order Date</td><td>'+date+'</td></tr></table><br><br> *This is a auto-generated mail. Please do not reply to this.</body></html>'
			
			
			
			};

			transporter.sendMail(mailOptions, function(error, info){
			if (error) {
			console.log(error);
			} else {
			console.log('Email sent: ' + info.response);
			}
			});
			
			}
			
			else
				console.log("error user profiles");
				
				console.log(user_id_to_be_deleted);
});

}
const handlers = {
    'price_of_product': function(){
	this.attributes['type_of_intent']='price_of_product';
	first((err, res) => {
			this.emit(':ask', res);
		});
	},
    'category_name':function(){
	this.attributes['category']=this.event.request.intent.slots.category.value;
	second(this.attributes['category'],(err,res) => {
			this.emit(':ask',res);
		});
	},
    'sub_category_name':function(){
	this.attributes['sub_category']=this.event.request.intent.slots.category.value;
	third(this.attributes['category'],this.attributes['sub_category'],(err,res) => {
			this.emit(':ask',res);
		});
	},
    'brand_name':function(){
	this.attributes['brand_name']=this.event.request.intent.slots.company_name.value.toLowerCase();
	fourth(this.attributes['category'],this.attributes['sub_category'],this.attributes['brand_name'],(err,res) => {
			this.emit(':ask',res);
		});
	},
    'productname':function(){
	this.attributes['product_name']=this.event.request.intent.slots.product_name.value;
		if(this.attributes['type_of_intent']=='price_of_product')
		{
			fifth(this.attributes['category'],this.attributes['sub_category'],this.attributes['brand_name'],this.attributes['product_name'],(err,res) => {
						this.attributes['product_price']=res.substr(0,res.indexOf("***"));
						this.attributes['product_desc']=res.substr(res.indexOf("***")+3,res.lastIndexOf("***"));
						this.attributes['product_image']=res.substr(res.lastIndexOf("***")+3);
						var speechOutput =" We have sent a product preview to your alexa app. Do you want to buy this product? "
						var cardTitle = this.attributes['product_name'];
						var tt=this.attributes['product_desc'].substr(0,this.attributes['product_desc'].indexOf("***"));
						var cardContent =tt+".  Price is "+this.attributes['product_price'];
						var imageObj = {
						    smallImageUrl: this.attributes['product_image'],
						    largeImageUrl: this.attributes['product_image']
						};
						this.emit(':askWithCard', speechOutput, "",cardTitle, cardContent, imageObj);
				});
		}
	},
    'cart_products':function(){
	this.attributes['type_of_intent']='cart_details';
	sixth((err, res) => {
			this.emit(':tell', res);
		});
	},
    'change_order_status':function(){
	this.attributes['type_of_intent']='change_order_status';
	this.emit(':ask',"you want to cancel or return your order");
	},
    'orderstatus':function(){
	this.attributes['status_value']=this.event.request.intent.slots.order_status.value;
	this.emit(':ask',"Please enter the order number");
	},
    'ordernumber':function(){
	this.attributes['order_number']=this.event.request.intent.slots.order_number.value;
	if(this.attributes['type_of_intent']=='change_order_status')
	{
		/*seventh(this.attributes['status_value'],this.attributes['order_number'],(err,res) => {
				this.emit(':tell',res);
			});*/
		console.log(":ffwiuebfbf");
		var self=this;
		var dict={};
		var id="";
		var id_to_be_deleted="";
		var status_value=this.attributes['status_value'];
		var order_number=this.attributes['order_number'];
		function f3(){
			self.emit(':tell',"Your order status has been changed");
		}
		function f2(callback){
			if(dict["key"]=="0")
			{
				dict["key"]="1";
				request.delete('https://api.mlab.com/api/1/databases/alexa_rakuten/collections/User_Profiles/'+id_to_be_deleted+'?apiKey='+mlabkey,function (error, response, body) {
				if (!error && response.statusCode == 200)
				{
					console.log("deleted...");
					id=JSON.parse(id);	
					request.post('https://api.mlab.com/api/1/databases/alexa_rakuten/collections/User_Profiles?apiKey='+mlabkey,{ json: id },
					function (error, response, body) {
						if(!error && response.statusCode == 200) {
							console.log("----->"+body);
							callback(f3);
						}
						else
							console.log("-----XXXXX>"+error);
					}
					);
					
				}
				else
				console.log(response.statusCode);
				});
			}
			else
			{
				callback(f3);
			}
		}
		function f1(callback){
		dict["key"]="1";
		request("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/User_Profiles?apiKey="+mlabkey, function(error, response, body) {
			if (!error && response.statusCode == 200)
			{
				var res1=JSON.parse(body);
				id_to_be_deleted=res1[0]._id.$oid;
				console.log("76e2"+id_to_be_deleted);
				var details=new Array();
				var option1_number=new Array();
				var option1_name=new Array();
				var option1_date=new Array();
				var option1_bill=new Array();
				var option1_quantity=new Array();
				var option1_status=new Array();
				var option2_name=new Array();
				var option2_price=new Array();
				var option2_quantity=new Array();
				details[0]=res1[0].users[0].name;
				details[1]=res1[0].users[0].emailid;
				details[2]=res1[0].users[0].mobileno;
				details[3]=res1[0].users[0].address;
				for(var i=0;i<res1[0].users.length && res1[0].users[0].name=="tarun";i++)
				{
					for(var j=0;j<res1[0].users[i].option[0].length;j++)
					{
						if(res1[0].users[i].option[0][j].number==order_number)
						{
							option1_number[j]=res1[0].users[i].option[0][j].number;
							option1_name[j]=res1[0].users[i].option[0][j].name;
							option1_date[j]=res1[0].users[i].option[0][j].date;
							option1_bill[j]=res1[0].users[i].option[0][j].bill;
							option1_quantity[j]=res1[0].users[i].option[0][j].quantity;
							option1_status[j]=status_value;
						}
						else
						{
							option1_number[j]=res1[0].users[i].option[0][j].number;
							option1_name[j]=res1[0].users[i].option[0][j].name;
							option1_date[j]=res1[0].users[i].option[0][j].date;
							option1_bill[j]=res1[0].users[i].option[0][j].bill;
							option1_quantity[j]=res1[0].users[i].option[0][j].quantity;
							option1_status[j]=res1[0].users[i].option[0][j].status;
						}
					}
					for(var j=0;j<res1[0].users[i].option[1].length;j++)
					{
						option2_name[j]=res1[0].users[i].option[1][j].name;
						option2_price[j]=res1[0].users[i].option[1][j].price;
						option2_quantity[j]=res1[0].users[i].option[1][j].quantity;
					}
				}
				id="{\"users\" :[ { \"name\":\""+details[0]+"\", \"emailid\":\""+details[1]+"\", \"mobileno\" : \""+details[2]+"\", \"address\" : \""+details[3]+"\",";
				id+="\"option\":[ [ ";
				for(var i=0;i<option1_number.length;i++)
				{	
					id+="{ \"number\": \""+option1_number[i]+"\",";
					id+="\"name\": \""+option1_name[i]+"\",";
					id+="\"date\": \""+option1_date[i]+"\",";
					id+="\"bill\": \""+option1_bill[i]+"\",";
					id+="\"quantity\": \""+option1_quantity[i]+"\",";
					id+="\"status\": \""+option1_status[i]+"\"";
					id+="}";
					if(i+1<option1_number.length)
						id+=",";	
				}
				id+="],[";
				for(var i=0;i<option2_name.length;i++)
				{
					id+="{ \"name\": \""+option2_name[i]+"\",";
					id+="\"price\": \""+option2_price[i]+"\",";
					id+="\"quantity\": \""+option2_quantity[i]+"\"";
					id+="}";
					if(i+1<option2_name.length)
						id+=",";
				}
				id+="] ] }";
				//CODE_UPDATED
				var user2=JSON.stringify(res1[0].users[1]);
				var user3=JSON.stringify(res1[0].users[2]);
				
				id=id+","+user2;
				id=id+","+user3;
				
				id=id+ "] }";
				console.log(id);
				dict["key"]="0";
				callback(f2);
			}
			else
			{
				console.log("sarvrv");
			}
		});
	}
		f1(f2);
	}
	else if(this.attributes['type_of_intent']=='check_order_status')
	{
		eighth(this.attributes['order_number'],(err,res) => {
				this.emit(':tell',res);
			});	
	}
	},
     'check_order_status':function(){
	this.attributes['type_of_intent']='check_order_status';
	this.emit(':ask',"Please enter the order number");
	},
    'buying_goods':function(){
	this.attributes['type_of_intent']='buying_goods';
	ninth((err,res) => {
			this.attributes['otp_sent']=res;
			this.emit(':ask',"Please enter the OTP Received on your phone");
		});
	},
    'otp_send':function(){
	this.attributes['otp']=this.event.request.intent.slots.otp.value;
		if(this.attributes['otp_sent']==this.attributes['otp'])
		{
			//tenth(this.attributes['product_name'],this.attributes['product_price'],this.attributes['otp'],(err,res) => {
			var id_to_be_deleted="";
			var user_id_to_be_deleted="";
			var id="";
			var product_quantity="1";
			var order_number="";
			var date="";
			var status="";
			var user_id="";
			var product_name=this.attributes['product_name'];
			var product_price=this.attributes['product_price'];
			var dict={};
			var self=this;
			function f5(){
				self.emit(':tell',"Order has been Placed. Please check your registered email id for more details");
				/*if(dict["key3"]=="0")
				{
					emit(':tell',"Order has been Placed. Please check your registered email id for more details");
					dict["key3"]="1";
				}*/
			}
			function f4(callback){
			if(dict["key2"]=="0")
			{
				dict["key3"]="0";
				dict["key2"]="1";
				console.log("sjvcs"+user_id_to_be_deleted);
				console.log("user id"+user_id);
				request.delete('https://api.mlab.com/api/1/databases/alexa_rakuten/collections/User_Profiles/'+user_id_to_be_deleted+'?apiKey='+mlabkey,function (error, response, body) {
				if (!error && response.statusCode == 200)
				{
					console.log("deleted user profile");
					user_id=JSON.parse(user_id);	
					request.post('https://api.mlab.com/api/1/databases/alexa_rakuten/collections/User_Profiles?apiKey='+mlabkey,{ json: user_id },
					function (error, response, body) {
						if(!error && response.statusCode == 200) {
							console.log("-----> posted user profile   "+body);
							callback(f5);
						}
						else
							console.log("-----XXXXX> user profile post errror"+error);
					}
					
					);
				//callback(null,"everything was fine");
				}
				
				else
				console.log("user profile delete error");
				});
			}
			else
			{
				callback(f5);
			}
			}
			function f3(callback){
			if(dict["key1"]=="0")
			{
				dict["key2"]="0";
				dict["key1"]="1";
			user_id="";
				user_id_to_be_deleted="";
request("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/User_Profiles?apiKey="+mlabkey, function(error, response, body) {
			if (!error && response.statusCode == 200)
			{
				var res1=JSON.parse(body);
				console.log(res1);
				user_id_to_be_deleted=res1[0]._id.$oid;
				console.log(user_id_to_be_deleted);
				var details=new Array();
				var details=new Array();
				var option1_number=new Array();
				var option1_name=new Array();
				var option1_date=new Array();
				var option1_bill=new Array();
				var option1_quantity=new Array();
				var option1_status=new Array();
				var option2_name=new Array();
				var option2_price=new Array();
				var option2_quantity=new Array();
				details[0]=res1[0].users[0].name;
				details[1]=res1[0].users[0].emailid;
				var email_id=res1[0].users[0].emailid;
				details[2]=res1[0].users[0].mobileno;
				details[3]=res1[0].users[0].address;
				console.log(details[0]+details[1]+details[2]+details[3]);
				for(var i=0;i<res1[0].users.length && res1[0].users[0].name=="tarun" && res1[0].users[0].name=="tarun";i++)
				{
					for(var j=0;j<res1[0].users[i].option[0].length;j++)
					{
						option1_number[j]=res1[0].users[i].option[0][j].number;
						option1_name[j]=res1[0].users[i].option[0][j].name;
						option1_date[j]=res1[0].users[i].option[0][j].date;
						option1_bill[j]=res1[0].users[i].option[0][j].bill;
						option1_quantity[j]=res1[0].users[i].option[0][j].quantity;
						option1_status[j]=res1[0].users[i].option[0][j].status;
					}
					for(var j=0;j<res1[0].users[i].option[1].length;j++)
					{
						option2_name[j]=res1[0].users[i].option[1][j].name;
						option2_price[j]=res1[0].users[i].option[1][j].price;
						option2_quantity[j]=res1[0].users[i].option[1][j].quantity;
					}
				}
				user_id="{\"users\" :[ { \"name\":\""+details[0]+"\", \"emailid\":\""+details[1]+"\", \"mobileno\" : \""+details[2]+"\", \"address\" : \""+details[3]+"\",";
				user_id+="\"option\":[ [ ";
				for(var i=0;i<option1_number.length;i++)
				{	
					user_id+="{ \"number\": \""+option1_number[i]+"\",";
					user_id+="\"name\": \""+option1_name[i]+"\",";
					user_id+="\"date\": \""+option1_date[i]+"\",";
					user_id+="\"bill\": \""+option1_bill[i]+"\",";
					user_id+="\"quantity\": \""+option1_quantity[i]+"\",";
					user_id+="\"status\": \""+option1_status[i]+"\"";
					user_id+="}";
					user_id+=",";	
				}
				user_id+="{ \"number\": \""+order_number+"\",";
				user_id+="\"name\": \""+product_name+"\",";
				user_id+="\"date\": \""+date+"\",";
				user_id+="\"bill\": \""+product_price+"\",";
				user_id+="\"quantity\": \""+product_quantity+"\",";
				user_id+="\"status\": \""+status+"\"";
				user_id+="}";
				user_id+="],[";
				for(var i=0;i<option2_name.length;i++)
				{
					user_id+="{ \"name\": \""+option2_name[i]+"\",";
					user_id+="\"price\": \""+option2_price[i]+"\",";
					user_id+="\"quantity\": \""+option2_quantity[i]+"\"";
					user_id+="}";
					if(i+1<option2_name.length)
						user_id+=",";
				}
				user_id+="] ] }";
				//CODE_UPDATED
				var user2=JSON.stringify(res1[0].users[1]);
				var user3=JSON.stringify(res1[0].users[2]);
				
				user_id=user_id+","+user2;
				user_id=user_id+","+user3;
				
				user_id=user_id+ "] }";
				console.log(user_id);
				//eleventh(user_id_to_be_deleted,user_id);
				var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
			user: 'airarakuten@gmail.com',
			pass: 'rakuten123#'
			}
			});

			var mailOptions = {
			from: 'airarakuten@gmail.com',
			to: email_id,
			subject: 'Order Placed',
			html:'<html><head><style>table {    font-family: arial, sans-serif;border-collapse: collapse;width: 80%}td, th { border: 2px solid #dddddd; text-align: left; padding: 10px;}tr:nth-child(even) {background-color: #dddddd;}</style></head><body>Hi '+details[0]+',<br> Thank you for shopping with us.Please find your order details below:<br><table><tr><th>Order Details</th></tr><tr><td>Product Name</td><td>'+product_name+'</td></tr><tr><td>Product price</td><td>'+product_price+'</td></tr><tr><td>Order Number</td><td>'+order_number+'</td></tr><tr><td>Order Date</td><td>'+date+'</td></tr></table><br><br> *This is a auto-generated mail. Please do not reply to this.</body></html>'
			
			};

			transporter.sendMail(mailOptions, function(error, info){
			if (error) {
			console.log(error);
			} else {
			console.log('Email sent: ' + info.response);
			callback(f4);
			}
			});
			}
			
			else
				console.log("error user profiles");
				
				console.log(user_id_to_be_deleted);
});
			}
			else
			{
				callback(f4);
			}
			}
			function f2(callback){
			if(dict["key"]=="0")
			{
			dict["key1"]="0";
			console.log("wefsf"+id_to_be_deleted);
			console.log("sefs"+id);
			request.delete('https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Seller_Profiles/'+id_to_be_deleted+'?apiKey='+mlabkey,function (error, response, body) {
					if (!error && response.statusCode == 200)
					{
						console.log("deleted seller profile");
						id=JSON.parse(id);	
						request.post('https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Seller_Profiles?apiKey='+mlabkey,{ json: id },
						function (error, response, body) {
						if(!error && response.statusCode == 200) {
							console.log("----->  posted successfully   "+body);
							dict["key"]="1";
							callback(f3);
						}
						else
							console.log("-----XXXXX> seller profile post error  "+error);
					});
					
					}
					
					else
						console.log("seller profile delete error");
					});
			}
			else{
				callback(f3);
			}
			}
			function f1(callback){
				dict["key"]=0;
				order_number=Math.floor(1000 + Math.random() * 9000);
				product_quantity=1;
				var dt = dateTime.create();
    
	var formatted = dt.format('Y-m-d H:M:S');
    
	formatted = formatted.substr(0,formatted.indexOf(" "));
    
	formatted = formatted.split("-");
    
	var month=formatted[1];
	var day=formatted[2];
	var year=formatted[0];
	date=day+'-'+month+'-'+year;
	status="shipped";
	request("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Seller_Profiles?apiKey="+mlabkey, function(error, response, body) {
			if (!error && response.statusCode == 200)
			{
				var res1=JSON.parse(body);
				console.log("seller profile  "+res1);
				var flag=0;
				for(var i=0;i<res1.length && flag==0;i++)
				{
					var details=new Array();
					var products_name=new Array();
					var product_quantity=new Array();
					
					//CODE_UPDATED
					var date=new Array();
					var last_updated=new Array();
					var original_quantity=new Array();
					id_to_be_deleted=res1[i]._id.$oid;
					details[0]=res1[i].sellerID;
					details[1]=res1[i].sellerName;
					details[2]=res1[i].sellerAddress;
					for(var j=0;j<res1[i].products.length;j++)
					{
						products_name[j]=res1[i].products[j].name;
						product_quantity[j]=res1[i].products[j].quantity;
						date[j]=res1[i].products[j].date;
						last_updated[j]=res1[i].products[j].last_updated;
						original_quantity[j]=res1[i].products[j].original_quantity;
						if(flag==0 && products_name[j]==product_name)
						{
							product_quantity[j]-=1;
							flag=1;
						}
					}
					id="{\"sellerID\": \""+details[0]+"\",\"sellerName\": \" "+details[1]+"\",\"sellerAddress\": \" "+details[2]+"\", \"products\": [ ";
					
					
					var dtt = dateTime.create();var formattedt = dtt.format('Y-m-d H:M:S');
					formattedt = formattedt.substr(0,formattedt.indexOf(" "));formattedt = formattedt.split("-");

					var datet=formattedt[2]+'-'+formattedt[1]+'-'+formattedt[0];
					
					
					for(var j=0;j<products_name.length;j++)
					{
						if(products_name[j]==product_name)
						id+="{ \"name\": \""+products_name[j]+"\", \"quantity\": \""+product_quantity[j]+"\",\"date\":\""+date[j]+"\",\"last_updated\":\""+datet+"\",\"original_quantity\":\""+original_quantity[j]+"\"}";
						else
						id+="{ \"name\": \""+products_name[j]+"\", \"quantity\": \""+product_quantity[j]+"\",\"date\":\""+date[j]+"\",\"last_updated\":\""+last_updated[j]+"\",\"original_quantity\":\""+original_quantity[j]+"\"}";
						
						
						if(j+1<products_name.length)
							id+=",";	
					}
					id+="]}";
				}	
				callback(f2);
			}
			else
					console.log("error in seller profiles");
});
			}
			f1(f2);





//			this.emit(':tell',"Order has been Placed. Please check your registered email id for more details");
		}
		else
		{
			this.emit(':ask',"Please enter the correct OTP");
		}
	},
    'bargain_begin':function(){
	this.attributes['type_of_intent']='bargain_begin';
	var exec={};
	var discount_per=0;
	var product_name=this.attributes['product_name'];
	var product_price=this.attributes['product_price'];
	var address_of_users=new Array;
	var address_of_current_user="";
	var distances=new Array;
	var dd=0;
	var self=this;
	var flag_month=false;
	
	function f4()
	{
	self.attributes['product_price']=parseInt(parseInt(product_price)-((parseInt(product_price)*discount_per)/100)).toString();
	self.emit(':ask',"Although we are earning just a small fragment of the "+product_price +" rupees, we are ready to give up our share and sell you "+product_name+" for only "+parseInt(parseInt(product_price)-((parseInt(product_price)*discount_per)/100)).toString() +" INR. What do you say?");
	}
	
	function f3(callback)
	{
		
		if(exec["f3"]=="1")
		{
			
			request("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Seller_Profiles?apiKey="+mlabkey, function(error, response, body) {
				if (!error && response.statusCode == 200)
				{
					var res1=JSON.parse(body);
					for(var i=0;i<res1.length;i++)
					{
					
						for(var j=0;j<res1[i].products.length;j++)
						{
							
							var upload_day=parseInt(res1[i].products[j].date.substr(0,res1[i].products[j].date.indexOf("-")));
							var upload_month=parseInt(res1[i].products[j].date.substr(res1[i].products[j].date.indexOf("-")+1,res1[i].products[j].date.lastIndexOf("-")));
							
							var last_updated_day=parseInt(res1[i].products[j].last_updated.substr(0,res1[i].products[j].last_updated.indexOf("-")));
							var last_updated_month=parseInt(res1[i].products[j].last_updated.substr(res1[i].products[j].last_updated.indexOf("-")+1,res1[i].products[j].last_updated.lastIndexOf("-")));
							
							
							
							if(last_updated_month!=upload_month && upload_month== (last_updated_month-1))
							{
								var gap=dict[upload_month-1]-upload_day;
								gap+=last_updated_day;
								if(gap>=30)
								{
									flag_month=true;
								}
							}
							else if((last_updated_month-upload_month)>=2)
							{
								flag_month=true;
							}
							
							
							
							if(res1[i].products[j].name==product_name && ((res1[i].products[j].original_quantity == res1[i].products[j].quantity)||(flag_month))   )
							{
							discount_per=10;
							break;
							}
							
						}
					
					}
					
				callback(f4);
				}
				else
				{
					console.log("error in request block of seller for bargain");
				}
			});
			
		}
		else
		{
		callback(f4);	
		}
		
	}
	function f2(callback){
		if(exec["f2"]=="1")
		{
			exec["f2"]="0";
			exec["f3"]="1";
			async.each(address_of_users, function(apiRequest, cb) {
            apicall(apiRequest, cb);

			}, 
			function(err) {
				if (err)
					console.log("error...");
				else
					process_arrays();

			});
			function apicall(item, cb) {
				request('https://maps.googleapis.com/maps/api/directions/json?origin='+address_of_current_user+'&destination='+item+'&mode=driving&key=AIzaSyCweXwBZ82TU1ZdOCFoDFYhx9l75vh6E50', function (error, response, body) {
						if (!error && response.statusCode == 200) 
						{
						
							body = body.replace('\u003c/b','');	
							body = body.replace('\u003e/','');
							body = body.replace('\u003cb','');
							body = body.replace('\u003e','');body = body.replace('<b>','');body = body.replace('</b>','');
							body = body.replace('<div>','');
							body = body.replace('</div>','');
							var o=JSON.parse(body);
							
							distances[dd]=parseInt(o.routes[0].legs[0].distance.text);
							dd++;
							console.log("dist "+dd+ "sfsr "+distances[dd-1]);
							cb();
						}
					});
            }
			function process_arrays() {
				var no_of_order_in_proximity=0;
				for(var i=0;i<distances.length;i++)
				{
					if(distances[i]<=25)
					{
						no_of_order_in_proximity++;
					}
				}
				console.log("ordersss "+no_of_order_in_proximity);
				if(no_of_order_in_proximity<1)
				{
					exec["f3"]="0";
					discount_per=10;
				}
					callback(f3);
			}
		}
		else
		{
			console.log("f2 execute nhi hua");
			callback(f3);
		}
	}
	function f1(callback){
		request("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/User_Profiles?apiKey="+mlabkey, function(error, response, body) {
			if (!error && response.statusCode == 200)
			{
				var res1=JSON.parse(body);
				console.log("hula re"+res1);
				var dt = dateTime.create();
    			var formatted = dt.format('Y-m-d H:M:S');
    			formatted = formatted.substr(0,formatted.indexOf(" "));
    			formatted = formatted.split("-");
    			var month=parseInt(formatted[1]);
				var day=parseInt(formatted[2]);
				var year=formatted[0];
				var dict=new Array;
				dict[0]=31;
				dict[1]=28;
				dict[2]=31;
				dict[3]=30;
				dict[4]=31;
				dict[5]=30;
				dict[6]=31;
				dict[7]=31;
				dict[8]=30;
				dict[9]=31;
				dict[10]=30;
				dict[11]=31;
				//var date=day+'-'+month+'-'+year;
				var i=0;
					var count_of_delivered=0;
					var new_user=res1[0].users[i].option[0].length;
					for(var j=0;j<res1[0].users[i].option[0].length;j++)
					{
						var pd_day=parseInt(res1[0].users[i].option[0][j].date.substr(0,res1[0].users[i].option[0][j].date.indexOf('-')));
						var pd_month=parseInt(res1[0].users[i].option[0][j].date.substr(res1[0].users[i].option[0][j].date.indexOf('-')+1,res1[0].users[i].option[0][j].date.lastIndexOf('-')));
						address_of_current_user=res1[0].users[i].address;
						if(month!=pd_month && pd_month==month-1)
						{
							var gap=dict[pd_month-1]-pd_day;
							gap+=day;
							if(gap<=30)
							{
								count_of_delivered+=1;
							}
						}
						else if(month==pd_month)
						{
							count_of_delivered+=1;
						}
						
					}
					if((count_of_delivered==0 && res1[0].users[i].option[0].length>=2)|| new_user==0)
					{
						discount_per=10;
						exec["f2"]="0";
					}
					else if(count_of_delivered>=2)
					{
						discount_per=5;
						exec["f2"]="0";
					}
					else
						exec["f2"]="1";
					// now check for last 30 days order of users in proximity
					var no_orders=0;
					var l=0;
					for(var i=0;i<res1[0].users.length;i++)
					{
						if(res1[0].users[i].name!="tarun")
						{
						console.log("username"+res1[0].users[0].name);
						for(var j=0;j<res1[0].users[i].option[0].length;j++)
						{
							if(res1[0].users[i].option[0][j].status=="delivered" || res1[0].users[i].option[0][j].status=="shipped")
							{
								if(res1[0].users[i].option[0][j].name==product_name)
								{
									var order_day=parseInt(res1[0].users[i].option[0][j].date.substr(0,res1[0].users[i].option[0][j].date.indexOf('-')));
									var order_month=parseInt(res1[0].users[i].option[0][j].date.substr(res1[0].users[i].option[0][j].date.indexOf('-')+1,res1[0].users[i].option[0][j].date.lastIndexOf('-')));
									if(month!=order_month && order_month==month-1)
									{
										var gap=dict[order_month-1]-order_day;
										gap+=day;
										if(gap<=30)
										{
											no_orders+=1;
											address_of_users[l]=res1[0].users[i].address;
											l++;
										}
									}
									else if(month==pd_month)
									{
										no_orders+=1;
										address_of_users[l]=res1[0].users[i].address;
										l++;
									}
									else
									{
										console.log("not in proximity "+res1[0].users[i].name);
									}
								}
								console.log("array of addre "+address_of_users);
							}
							else
							{
								console.log("orrder status hi mathc nhi hua"+res1[0].users[i].name);
							}
						}
					}
				}
				callback(f2);
			}
			else
			{
				console.log("user file opening error");
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