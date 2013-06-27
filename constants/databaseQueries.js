var preferences = require('../preferences');

exports.queries = {
    
     databaseUrl : preferences.databaseUrl,
    
     paginationSize : preferences.paginationSize,
     searchSize : preferences.searchSize,
    
     blogIndex : function(){
         
         return this.databaseUrl+'blog/';
     },
    
    postType : function(){
        
        return this.blogIndex()+'post/';
    },
    
    search : function(){
    
    return this.postType()+'_search';
    
    }
};