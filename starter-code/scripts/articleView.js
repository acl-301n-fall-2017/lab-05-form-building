'use strict';

var articleView = {};

articleView.populateFilters = function() {
  $('article').each(function() {
    if (!$(this).hasClass('template')) {
      var val = $(this).find('address a').text();
      var optionTag = `<option value="${val}">${val}</option>`;

      if ($(`#author-filter option[value="${val}"]`).length === 0) {
        $('#author-filter').append(optionTag);
      }

      val = $(this).attr('data-category');
      optionTag = `<option value="${val}">${val}</option>`;
      if ($(`#category-filter option[value="${val}"]`).length === 0) {
        $('#category-filter').append(optionTag);
      }
    }
  });
};

articleView.handleAuthorFilter = function() {
  $('#author-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-author="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#category-filter').val('');
  });
};

articleView.handleCategoryFilter = function() {
  $('#category-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-category="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#author-filter').val('');
  });
};

articleView.handleMainNav = function() {
  $('.main-nav').on('click', '.tab', function() {
    $('.tab-content').hide();
    $('#' + $(this).data('content')).fadeIn();
  });

  $('.main-nav .tab:first').click();
};

articleView.setTeasers = function() {
  $('.article-body *:nth-of-type(n+2)').hide();
  $('article').on('click', 'a.read-on', function(e) {
    e.preventDefault();
    if ($(this).text() === 'Read on →') {
      $(this).parent().find('*').fadeIn();
      $(this).html('Show Less &larr;');
    } else {
      $('body').animate({
        scrollTop: ($(this).parent().offset().top)
      },200);
      $(this).html('Read on &rarr;');
      $(this).parent().find('.article-body *:nth-of-type(n+2)').hide();
    }
  });
};

articleView.initNewArticlePage = function() {
  // TODOdone??: Ensure the main .tab-content area is revealed. We might add more tabs later or otherwise edit the tab navigation.
  $('.tab-content').show();

  // TODO: The new articles we create will be copy/pasted into our source data file.
  // Set up this "export" functionality. We can hide it for now, and show it once we have data to export.
  //I don't understand this one - tried googling different ways but nothing has come up that made sense to put here.

  $('#article-json').on('focus', function(){
    this.select();
  });
  
  // TODO: Add an event handler to update the preview and the export field if any inputs change.
  //**I don't know what function to call on this event because my inital idea is to call the articleView.create but I can't call it before it's been defined ¯\_(ツ)_/¯ */
  // $('#articles').on('change', whichFunction??);
};

articleView.create = function() {
  // TODOdone: Set up a var to hold the new article we are creating.
  var $article = $('#articles');
  // Clear out the #articles element, so we can put in the updated preview
  $article.empty();
  // TODO: Instantiate an article based on what's in the form fields:
  //**line 114 is making an object and supposed to be stringifying that into a json object - isn't this the same as making and instance of the form field values? I'm unsure about the different between these two */


  // TODO-done??: Use our interface to the Handblebars template to put this new article into the DOM:
  var template = Handlebars.compile($('#new-article-template').text());
  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';

  // TODO-done?? (stretch goal): Pass the article body into the marked.js library to format our Markdown input!
  var markedContent = marked($('#article-body').val());
  $('#articles').html(markedContent);

  // TODO-done??: Activate the highlighting of any code blocks; look at the documentation for hljs to see how to do this by placing a callback function in the .each():
  $('#articles pre code').each(function(i, block){
    ljs.highlightBlock(block);
  });
  
  // TODOhalfdone??: Show our export field, and export the new article as JSON, so it's ready to copy/paste into blogArticles.js:
  $('form').submit(function(event){
    event.preventDefault();
    console.log($(this).serializeArray());
    var jsonObj = JSON.stringify($newArticleData);
    console.log(jsonObj);
  })
};

$('#previewButton').on('click', articleView.create);

articleView.initIndexPage = function() {
  articleView.populateFilters();
  articleView.handleCategoryFilter();
  articleView.handleAuthorFilter();
  articleView.handleMainNav();
  articleView.setTeasers();
};

articleView.initNewArticlePage = function() {
  articleView.initNewArticlePage();
  articleView.create();
  hljs.initHighlightingOnLoad();
}


