function prepareInitialWorkSpace() {

        var editArea = $("#editArea");
        editArea.autosize();
        titleContainer.focus();
        return editArea;

    }

    function hideThis(elements) {

        $(elements.join(',')).hide();
    }

    function showThis(elements) {
        
       $(elements.join(',')).show();
    }

    function getMarkdownText() {
        return editArea.val();
    }

    function getWordCount(text) {

        return text.split(/\s+\b/).length;
    }

    function setHtmlinPreviewPane(markdownText) {
        wordCountLabel.text('words: ' + getWordCount(markdownText));
        var previewHtml = markdown.toHTML(markdownText);
        previewPaneView.html(replaceAllImagesWithFigure(previewHtml));
    }

    function setRawHtml() {

        previewPaneView.text(previewPaneView.html());
    }

    function setPlain() {
        previewPaneView.html(previewPaneView.text());
    }


    function getWordCountFromLabel(text) {

        return text.match(/\d+/)[0];
    }


    function validateInputOnFousOut() {

        var isTitleEmpty = titleContainer.val().trim() === '';
        var isDraftEmpty = editAreaView.val() === '';
        var hasTitileAndDraft = !isTitleEmpty && !isDraftEmpty;
        return hasTitileAndDraft;

    }


function replaceAllImagesWithFigure(html){
    
    var parsedHtml = $(html);    
    
    $('img',parsedHtml).replaceWith(function(){
        var alt = $(this).attr('alt');
       return '<figure><img src="'+$(this).attr('src')+'" alt="'+alt+'"><figcaption>'+alt+'</figcaption></figure>';
        
    });
    
  return parsedHtml;   
}

function getItemsToPost(){
    
    var html = previewPaneView.html();
    var item = {
        
        postHtml: html,
        wordCount :getWordCountFromLabel(wordCountLabel.text()),
        title : titleContainer.val(),
        secret :secret.val()
        
    };    
       
    return item;
}

function publishArticle(){
    
    $.post('/addpost',getItemsToPost(),function(data){
        removeDraft(titleContainer.val());
         window.location.href = "/"+data.id;
    }).fail(function(data){
		
			if(data.status === 403)alert('un-authorized');
           if(data.status===500) alert('internal server error');
	});
}

function updatePost(){
    
    var items = getItemsToPost();
    items.postedBy = update.data().postedby;
    items.id = update.data().id;
    items.postedOn = update.data().postedon;
    $.post('/updatePost',items,function(data){
        removeDraft(items.title);
        window.location.href = "/"+data.id;
    }).fail(function(data){
		
			if(data.status === 403)alert('un-authorized');
           if(data.status===500) alert('internal server error');
	});
}


var editArea = prepareInitialWorkSpace();

    