var constants = require('../constants');
var request = require('request');
var helpers = require('../helpers');
var preferences = require('../preferences').preferences;


exports.getRecentPosts = function(req,res){
    
    var url = constants.queries.search();
	var pageNo = parseInt(req.params.page);
    var headers = helpers.setHeaders(url,getRecentPostsQueryData(pageNo,preferences.index.paginationSize));
    
    request(headers,function(error,response,body){

		var hasPosts = error|| !body || body.error || body.hits.hits.length===0?false:true;
		if(!hasPosts){return res.redirect('/create');}
        var resultCount = preferences.index.paginationSize - 1;
        var results = body.hits;
        var dataToRender = buildResponse(results.hits.slice(0,resultCount),pageNo,body.hits.hits.length);
		return res.render(constants.views.home,dataToRender);
    });
    
    
};

function getRecentPostsQueryData(pageNo,paginationSize){    
	
    var queryData = {
      "sort" :{ "postedOn" : {"order" : "desc"}},
	   "fields" : preferences.index.pageFields	
    };
	
    return helpers.pagination.buildPaginationQuery(pageNo,paginationSize,queryData);
}

function buildResponse(data,pageNo,total){
       var items = {};
    
    items.hits = helpers.prepareResponse(data,preferences.index); 
    items.hasPrevious = helpers.pagination.hasPrevButton(pageNo);
    items.hasNext = helpers.pagination.hasNextButton(pageNo,total,preferences.index.paginationSize);
	items.isFirstPage = helpers.pagination.isFirstPage(items.hasPrevious);
    return items;
}


