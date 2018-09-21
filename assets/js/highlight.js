hljs.initHighlightingOnLoad();
  InstantClick.on('change', function() {
    var blocks = document.querySelectorAll('pre code');
    for (var i = 0; i < blocks.length; i++) {
      hljs.highlightBlock(blocks[i]);
    }
  });