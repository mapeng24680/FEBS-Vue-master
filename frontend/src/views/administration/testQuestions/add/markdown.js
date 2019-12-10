// Released under MIT license
// Copyright (c) 2009-2010 Dominic Baggott
// Copyright (c) 2009-2010 Ash Berlin
// Copyright (c) 2011 Christoph Dorn <christoph@christophdorn.com> (http://www.christophdorn.com)

/*jshint browser:true, devel:true */
import $ from 'jquery';
var qt_type = "",typeName = ['单选题','多选题','判断题','填空题','问答题']

export  function  Markdown(dialect) {
  switch (typeof dialect) {
    case "undefined":
      this.dialect = Markdown.dialects.Gruber;
      break;
    case "object":
      this.dialect = dialect;
      break;
    default:
      if ( dialect in Markdown.dialects ) {
        this.dialect = Markdown.dialects[dialect];
      }
      else {
        throw new Error("Unknown Markdown dialect '" + String(dialect) + "'");
      }
      break;
  }
  this.em_state = [];
  this.strong_state = [];
  this.debug_indent = "";
}

  /**
   *  parse( markdown, [dialect] ) -> JsonML
   *  - markdown (String): markdown string to parse
   *  - dialect (String | Dialect): the dialect to use, defaults to gruber
   *
   *  Parse `markdown` and return a markdown document as a Markdown.JsonML tree.
   **/
  Markdown.parse = function( source, dialect ) {
    // dialect will default if undefined
    var md = new Markdown( dialect );
    return md.toTree( source );
  };

  /**
   *  toHTML( markdown, [dialect]  ) -> String
   *  toHTML( md_tree ) -> String
   *  - markdown (String): markdown string to parse
   *  - md_tree (Markdown.JsonML): parsed markdown tree
   *
   *  Take markdown (either as a string or as a JsonML tree) and run it through
   *  [[toHTMLTree]] then turn it into a well-formated HTML fragment.
   **/
  Markdown.toHTML = function toHTML( source , dialect , options ,type) {
    qt_type=type
    var input = Markdown.toHTMLTree( source , dialect , options );
    return Markdown.renderJsonML( input );
  };

  /**
   *  toHTMLTree( markdown, [dialect] ) -> JsonML
   *  toHTMLTree( md_tree ) -> JsonML
   *  - markdown (String): markdown string to parse
   *  - dialect (String | Dialect): the dialect to use, defaults to gruber
   *  - md_tree (Markdown.JsonML): parsed markdown tree
   *
   *  Turn markdown into HTML, represented as a JsonML tree. If a string is given
   *  to this function, it is first parsed into a markdown tree by calling
   *  [[parse]].
   **/

  Markdown.toHTMLTree = function toHTMLTree( input, dialect , options ) {

    // convert string input to an MD tree
    if ( typeof input ==="string" ) input = this.parse( input, dialect );

    // Now convert the MD tree to an HTML tree

    // remove references from the tree
    var attrs = extract_attr( input ),
      refs = {};

    if ( attrs && attrs.references ) {
      refs = attrs.references;
    }

    var html = convert_tree_to_html( input, refs , options );
    merge_text_nodes( html );
    return html;
  };


  var mk_block = Markdown.mk_block = function(block, trail, line) {
    // Be helpful for default case in tests.
    if ( arguments.length == 1 ) trail = "\n\n";
    //去掉粘贴到的首尾空格
    block = block.replace(/(^(&nbsp;\s*)*)|((&nbsp;\s*)*$)/g, "");
    var s = new String(block);
    s.trailing = trail;
    // To make it clear its not just a string
    // s.inspect = mk_block_inspect;
    // s.toSource = mk_block_toSource;

    if ( line != undefined ){s.lineNumber = line;}
    // 这里是将每个块域的首字母大写
    s=s.substr(0,1).toUpperCase()+s.substr(1,s.length-1);
    // 这里将中文的顿号自动替换为英文状态下的点

    return s.replace(/^([A-H]|\d+)[、|．]/,"$1.");

  };

  function count_lines( str,blocks ) {
    var n = 0, i = -1;
    while ( ( i = str.indexOf("\n", i + 1) ) !== -1 ) n++;
    //连续两次或以上换行，视为两道题的分割线
    // if (n>1) blocks.push("-------分割线-------");
    return n;
  }


// 这里是将输入内容分割成块
// Internal - split source into rough blocks
  Markdown.prototype.split_blocks = function splitBlocks( input, startLine ) {
    input = input.replace(/(\r\n|\n|\r)/g, "\n");
    // 这里是判断若选项位于同一行，则自动转行，判断依据是选项前有空格且选项后有点或顿号
    // 否则视为同一选项中的内容
    var n;
    // var res=/(\s)+([a-h])([、，,．]|\.|\s)/gi;
    var res=/(\s)+([a-h])([、，,．]|\.)/gi;

    input=input.replace(res,"\n$2$3");
    // [\s\S] matches _anything_ (newline or space)
    // [^] is equivalent but doesn't work in IEs.
    // 这是原先用的正则，一句话结束换行一次不会分割成块
    // var re = /([\s\S]+?)($|\n#|\n(?:\s*\n|$)+)/g,
    // 两行中间没有空格也会显示成<p></p><p></p>
    var re = /([\s\S]+?)($|\n#|\n(?:\s*\n|$)*)/g,
      blocks = [],
      m;

    var line_no = 1;

    if ( ( m = /^(\s*\n)/.exec(input) ) != null ) {
      // skip (but count) leading blank lines
      line_no += count_lines( m[0],blocks );
      re.lastIndex = m[0].length;
    }


    while ( ( m = re.exec(input) ) !== null ) {
      if (m[2] == "\n#") {
        m[2] = "\n";
        re.lastIndex--;
      }
      blocks.push( mk_block( m[1], m[2], line_no ) );
      line_no += count_lines( m[0],blocks );
    }
    return  blocks ;

  };
  /**
   *  Markdown#processBlock( block, next ) -> undefined | [ JsonML, ... ]
   *  - block (String): the block to process
   *  - next (Array): the following blocks
   *
   * Process `block` and return an array of JsonML nodes representing `block`.
   *
   * It does this by asking each block level function in the dialect to process
   * the block until one can. Succesful handling is indicated by returning an
   * array (with zero or more JsonML nodes), failure by a false value.
   *
   * Blocks handlers are responsible for calling [[Markdown#processInline]]
   * themselves as appropriate.
   *
   * If the blocks were split incorrectly or adjacent blocks need collapsing you
   * can adjust `next` in place using shift/splice etc.
   *
   * If any of this default behaviour is not right for the dialect, you can
   * define a `__call__` method on the dialect that will get invoked to handle
   * the block processing.
   */
  Markdown.prototype.processBlock = function processBlock( block, next ) {
    var cbs = this.dialect.block,
      ord = cbs.__order__;

    if ( "__call__" in cbs ) {
      return cbs.__call__.call(this, block, next);
    }

    for ( var i = 0; i < ord.length; i++ ) {
      //D:this.debug( "Testing", ord[i] );
      var res = cbs[ ord[i] ].call( this, block, next );
      if ( res ) {
        //D:this.debug("  matched");
        if ( !isArray(res) || ( res.length > 0 && !( isArray(res[0]) ) ) )
          this.debug(ord[i], "didn't return a proper array");
        //D:this.debug( "" );
        return res;
      }
    }

    // Uhoh! no match! Should we throw an error?
    return [];
  };

  Markdown.prototype.processInline = function processInline( block ) {
    return this.dialect.inline.__call__.call( this, String( block ) );
  };

  /**
   *  Markdown#toTree( source ) -> JsonML
   *  - source (String): markdown source to parse
   *
   *  Parse `source` into a JsonML tree representing the markdown document.
   **/
// custom_tree means set this.tree to `custom_tree` and restore old value on return
  Markdown.prototype.toTree = function toTree( source, custom_root ) {

    var _this = this;
    // var blocks;
    // _this.split_blocks( source ).map(function (value) {
    //      // k = value.name
    //     blocks = source instanceof Array ? source :  value.name;
    //     qt_type = value.type
    // });
    var blocks = source instanceof Array ? source :  _this.split_blocks( source );

    // Make tree a member variable so its easier to mess with in extensions
    var old_tree = _this.tree;
    try {
      _this.tree = custom_root || _this.tree || ["markdown"];

      blocks:
        while (blocks.length) {

          var b = _this.processBlock(blocks.shift(), blocks);
          // Reference blocks and the like won't return any content
          if (!b.length) continue blocks;
          _this.tree.push.apply(_this.tree, b);
        }
      return _this.tree;
    }

    finally {
      if (custom_root) {
        _this.tree = old_tree;
      }
    }
  };


  /**
   * Markdown.dialects
   *
   * Namespace of built-in dialects.
   **/
  Markdown.dialects = {};

  /**
   * Markdown.dialects.Gruber
   *
   * The default dialect that follows the rules set out by John Gruber's
   * markdown.pl as closely as possible. Well actually we follow the behaviour of
   * that script which in some places is not exactly what the syntax web page
   * says.
   **/

  Markdown.dialects.Gruber = {

    block: {
      //自定义每题的题干、选项、答案和解析
      // 这是题干部分
      qtTitle: function qtTitle( block,next) {
        var m = block.match( /^\s*(([0-9]+\.)|(((\()|（)[0-9]+((\))|）)))\s*(.*?)\s*(?:\n|$)/ );
        if ( !m ) return undefined;

        var title = [ "title" ];
        Array.prototype.push.apply(title, this.processInline(m[ 0 ]));

        if ( m[0].length < block.length )
          next.unshift( mk_block( block.substr( m[0].length ), block.trailing, block.lineNumber + 2 ) );
        return [title];
      },
      //这是选项部分
      qtKey: function qtKey( block, next ) {
        var m = block.match( /^\s*([A-H])(\.)\s*(.*?)\s*(?:\n|$)/ );
        if ( !m ) return undefined;
        if(qt_type=="1"||qt_type=="2"){
          var n=m[0].match(/^[A-H]/);
          var type="";
          switch (n[0]) {
            case "A": type="A"; break;
            case "B": type="B"; break;
            case "C": type="C"; break;
            case "D": type="D"; break;
            case "E": type="E"; break;
            case "F": type="F"; break;
            case "G": type="G"; break;
            case "H": type="H"; break;
            default: type="Error";
          }
          var key = [ "key"+type ];
          Array.prototype.push.apply(key, this.processInline(m[ 0 ]));

          if ( m[0].length < block.length )
            next.unshift( mk_block( block.substr( m[0].length ), block.trailing, block.lineNumber + 2 ) );

          return [key];
        }else {
          var error = [ "error" ];
          Array.prototype.push.apply(error, this.processInline(m[ 0 ]));

          if ( m[0].length < block.length )
            next.unshift( mk_block( block.substr( m[0].length ), block.trailing, block.lineNumber + 2 ) );
          return [error];
        }
      },
      //普通关键词部分
      qtCommon:function qtCore(block,next){

        block = block.replace(/^\s*【\s*普通关键词\s*】\s*/,'普通关键词:');
        var m = block.match(/^\s*(\s*普通关键词[:：]\s*)\s*(.*?)\s*(?:\n|$)/);
        if ( !m ) return undefined;

        var comKeyWord = [ "comKeyWord" ];
        Array.prototype.push.apply(comKeyWord, this.processInline(m[ 0 ]));

        if ( m[0].length < block.length )
          next.unshift( mk_block( block.substr( m[0].length ), block.trailing, block.lineNumber + 2 ) );

        return [comKeyWord];

      },
      //核心关键词部分
      qtCore:function qtCore(block,next){

        block = block.replace(/^\s*【\s*核心关键词\s*】\s*/,'核心关键词:');
        var m = block.match(/^\s*(\s*核心关键词[:：]\s*)\s*(.*?)\s*(?:\n|$)/);
        if ( !m ) return undefined;

        var coreKeyWord = [ "coreKeyWord" ];
        Array.prototype.push.apply(coreKeyWord, this.processInline(m[ 0 ]));
        if ( m[0].length < block.length )
          next.unshift( mk_block( block.substr( m[0].length ), block.trailing, block.lineNumber + 2 ) );

        return [coreKeyWord];

      },
      // 这是答案部分
      qtAnswer: function qtAnswer( block, next ) {

        block=  block.replace(/^\s*【\s*答案\s*】\s*/,' 答案：');

        var m = block.match( /^\s*(答案[:：])\s*(.*?)\s*(?:\n|$)/);
        if ( !m ) return undefined;
        var answer = [ "answer" ];
        var n;
        if(qt_type=="1"){
          n=m[2].match(/^\s*[a-h]\s*(?:\n|$)/i);
          if(n==null){
            var error = [ "ans_error" ];
            Array.prototype.push.apply(error, this.processInline(m[0]));

            if ( m[0].length < block.length )
              next.unshift( mk_block( block.substr( m[0].length ), block.trailing, block.lineNumber + 2 ) );
            return [error];
          }
        }else if(qt_type=="2") {
         var ms = m[2].replace(/[,|，]/g,'');//匹配标点分隔符
          n=ms.match(/^\s*[a-h]{1,8}\s*(?:\n|$)/i);
          if(n==null){
            var error = [ "ans_error" ];
            Array.prototype.push.apply(error, this.processInline(m[0]));

            if ( m[0].length < block.length )
              next.unshift( mk_block( block.substr( m[0].length ), block.trailing, block.lineNumber + 2 ) );
            return [error];
          }
        }else if (qt_type=="3") {
          var ms = m[2] || m[1];
          n=ms.match(/^\s*(正确|错误|对|错)\s*(?:\n|$)/i);
          if(n==null){
            var error = [ "ans_error" ];
            Array.prototype.push.apply(error, this.processInline(m[ 0 ]));

            if ( m[0].length < block.length )
              next.unshift( mk_block( block.substr( m[0].length ), block.trailing, block.lineNumber + 2 ) );
            return [error];
          }
        }
        Array.prototype.push.apply(answer, this.processInline(m[ 0 ]));

        if ( m[0].length < block.length )
          next.unshift( mk_block( block.substr( m[0].length ), block.trailing, block.lineNumber + 2 ) );

        return [answer];
      },
      // 这是解析部分
      qtAnalysis: function qtAnalysis( block, next ) {
        block = block.replace(/^\s*【\s*解析\s*】\s*/,'解析：');
        var m = block.match( /^\s*(解析[:：])\s*(.*?)\s*(?:\n|$)/ );
        if ( !m ) return undefined;
        var analysis = [ "analysis" ];
        Array.prototype.push.apply(analysis, this.processInline(m[ 0 ]));

        if ( m[0].length < block.length )
          next.unshift( mk_block( block.substr( m[0].length ), block.trailing, block.lineNumber + 2 ) );

        return [analysis];
      },
      // 这是难度部分
      qtDifficult: function qtDifficult( block, next ) {
        block = block.replace(/^\s*【\s*难度\s*】\s*/,'难度：');
        var m = block.match( /^\s*(难度[:：])\s*(.*?)\s*(?:\n|$)/ );
        if ( !m ) return undefined;
        var difficult = [ "difficult" ];
        Array.prototype.push.apply(difficult, this.processInline(m[ 0 ]));

        if ( m[0].length < block.length )
          next.unshift( mk_block( block.substr( m[0].length ), block.trailing, block.lineNumber + 2 ) );

        return [difficult];
      },
      // 这是标签部分
      qtLabel: function qtLabel( block, next ) {
        block = block.replace(/^\s*【\s*试题标签\s*】\s*/,'试题标签：');
        var m = block.match( /^\s*(试题标签[:：])\s*(.*?)\s*(?:\n|$)/ );
        if ( !m ) return undefined;
        var label = [ "label" ];
        Array.prototype.push.apply(label, this.processInline(m[ 0 ]));

        if ( m[0].length < block.length )
          next.unshift( mk_block( block.substr( m[0].length ), block.trailing, block.lineNumber + 2 ) );

        return [label];
      },

      para: function para( block, next ) {
        // everything's a para!
        return [ ["para"].concat( this.processInline( block ) ) ];
      }
    }
  };

  Markdown.dialects.Gruber.inline = {

    __oneElement__: function oneElement( text, patterns_or_re, previous_nodes ) {
      var m,
        res,
        lastIndex = 0;
      patterns_or_re = patterns_or_re || this.dialect.inline.__patterns__;
      var re = new RegExp( "([\\s\\S]*?)(" + (patterns_or_re.source || patterns_or_re) + ")" );

      m = re.exec( text );
      if (!m) {
        // Just boring text
        return [ text.length, text ];
      }
      else if ( m[1] ) {
        // Some un-interesting text matched. Return that first
        return [ m[1].length, m[1] ];
      }
      var res;
      if ( m[2] in this.dialect.inline ) {
        res = this.dialect.inline[ m[2] ].call(
          this,
          text.substr( m.index ), m, previous_nodes || [] );
      }
      // Default for now to make dev easier. just slurp special and output it.
      res = res || [ m[1].length, m[2] ];
      return res;
    },

    __call__: function inline( text, patterns ) {
      var out = [],
        res;

      function add(x) {
        //D:self.debug("  adding output", uneval(x));
        if ( typeof x == "string" && typeof out[out.length-1] == "string" )
          out[ out.length-1 ] += x;
        else
          out.push(x);
      }

      while ( text.length > 0 ) {
        res = this.dialect.inline.__oneElement__.call(this, text, patterns, out );
        text = text.substr( res.shift() );
        forEach(res, add )
      }
      return out;
    },

    "  \n": function lineBreak( text ) {
      return [ 3, [ "linebreak" ] ];
    }

  };



// Build default order from insertion order.
  Markdown.buildBlockOrder = function(d) {
    var ord = [];
    for ( var i in d ) {
      if ( i == "__order__" || i == "__call__" ) continue;
      ord.push( i );
    }
    d.__order__ = ord;
  };

// Build patterns for inline matcher
  Markdown.buildInlinePatterns = function(d) {
    var patterns = [];

    for ( var i in d ) {
      // __foo__ is reserved and not a pattern
      if ( i.match( /^__.*__$/) ) continue;
      var l = i.replace( /([\\.*+?|()\[\]{}])/g, "\\$1" )
        .replace( /\n/, "\\n" );

      patterns.push( i.length == 1 ? l : "(?:" + l + ")" );
    }

    patterns = patterns.join("|");
    d.__patterns__ = patterns;
    //print("patterns:", uneval( patterns ) );

    var fn = d.__call__;
    d.__call__ = function(text, pattern) {
      if ( pattern != undefined ) {
        return fn.call(this, text, pattern);
      }
      else
      {
        return fn.call(this, text, patterns);
      }
    };
  };

  Markdown.DialectHelpers = {};
  Markdown.DialectHelpers.inline_until_char = function( text, want ) {
    var consumed = 0,
      nodes = [];

    while ( true ) {
      if ( text.charAt( consumed ) == want ) {
        // Found the character we were looking for
        consumed++;
        return [ consumed, nodes ];
      }

      if ( consumed >= text.length ) {
        // No closing char found. Abort.
        return null;
      }

      var res = this.dialect.inline.__oneElement__.call(this, text.substr( consumed ) );
      consumed += res[ 0 ];
      // Add any returned nodes.
      nodes.push.apply( nodes, res.slice( 1 ) );
    }
  }

// Helper function to make sub-classing a dialect easier
  Markdown.subclassDialect = function( d ) {
    function Block() {}
    Block.prototype = d.block;
    function Inline() {}
    Inline.prototype = d.inline;

    return { block: new Block(), inline: new Inline() };
  };
  Markdown.buildBlockOrder ( Markdown.dialects.Gruber.block );

  Markdown.buildInlinePatterns( Markdown.dialects.Gruber.inline );

  Markdown.dialects.Maruku = Markdown.subclassDialect( Markdown.dialects.Gruber );

  Markdown.buildBlockOrder ( Markdown.dialects.Maruku.block );
  Markdown.buildInlinePatterns( Markdown.dialects.Maruku.inline );

  var isArray = Array.isArray || function(obj) {
    return Object.prototype.toString.call(obj) == "[object Array]";
  };

  var forEach;
// Don't mess with Array.prototype. Its not friendly
  if ( Array.prototype.forEach ) {
    forEach = function( arr, cb, thisp ) {
      return arr.forEach( cb, thisp );
    };
  }
  else {
    forEach = function(arr, cb, thisp) {
      for (var i = 0; i < arr.length; i++) {
        cb.call(thisp || arr, arr[i], i, arr);
      }
    }
  }

  var isEmpty = function( obj ) {
    for ( var key in obj ) {
      if ( hasOwnProperty.call( obj, key ) ) {
        return false;
      }
    }

    return true;
  }

  function extract_attr( jsonml ) {
    return isArray(jsonml)
    && jsonml.length > 1
    && typeof jsonml[ 1 ] === "object"
    && !( isArray(jsonml[ 1 ]) )
      ? jsonml[ 1 ]
      : undefined;
  }



  /**
   *  renderJsonML( jsonml[, options] ) -> String
   *  - jsonml (Array): JsonML array to render to XML
   *  - options (Object): options
   *
   *  Converts the given JsonML into well-formed XML.
   *
   *  The options currently understood are:
   *
   *  - root (Boolean): wether or not the root node should be included in the
   *    output, or just its children. The default `false` is to not include the
   *    root itself.
   */
  Markdown.renderJsonML = function( jsonml, options ) {
    options = options || {};
    // include the root element in the rendered output?
    options.root = options.root || false;

    var content = [];

    if ( options.root ) {
      content.push( render_tree( jsonml ) );
    }
    else {
      jsonml.shift(); // get rid of the tag
      if ( jsonml.length && typeof jsonml[ 0 ] === "object" && !( jsonml[ 0 ] instanceof Array ) ) {
        jsonml.shift(); // get rid of the attributes
      }

      while ( jsonml.length ) {
        content.push( render_tree( jsonml.shift() ) );
      }
    }

    // 根据两道题之间的水平分割线来将题分割成整块
    var html = "";
    var html_temp = "";
    var loop_status = 0;//记录循环次数
    // 各种计数
    var params ={
      count : 0,//题目计数
      key_count : 0//单选多选选项计数
    };

    // 各组成部分状态——检查区
    var status = {
      "qt_title": false,
      "qt_key": false,
      "qt_comKeyWord":false,
      "qt_coreKeyWord":false,
      "qt_answer": false,
      "qt_analysis": false,
      "qt_difficult": false,
      "qt_label": false,
      "qt_error": false
    };

    // 各组成部分需插入代码
    var insert ={
      "left": "<div class='question' ref='question' data-type='"+qt_type+"'>",
      "title": "<p class='qt_error'>题目（至少两个字）</p>",
      //key只存在于单选和多选
      "key": (qt_type=="1"||qt_type=="2") ? "<p class='qt_error'>选项（至少两项）</p>" : "",
      "comKeyWord":"",
      "coreKeyWord":"",
      "answer": "<p class='qt_error'>答案</p>",
      "analysis": "",
      "difficult": "",
      "label": "",
      "error": "",
      "right": "</div>",
    };


    //检测字符串是题目中哪一部分，记录一整道题中各组成部分状态,存储各部分内容
    function regStr(string) {
      var qt_title = new RegExp("qt_title");
      var qt_key = new RegExp("key_");
      var qt_comKeyWord = new RegExp("qt_comKeyWord");
      var qt_coreKeyWord = new RegExp("qt_coreKeyWord");
      var qt_answer = new RegExp("qt_answer");
      var qt_analysis = new RegExp("qt_analysis");
      var qt_difficult = new RegExp("qt_difficult");
      var qt_label = new RegExp("qt_label");
      var qt_error = new RegExp("qt_error");
      //存储各部分内容
      insert.title =  qt_title.test(string) ? string : insert.title;
      if(params.key_count>1){
        insert.key = insert.key.replace("<p class='qt_error'>选项（至少两项）</p>","");
      }
      insert.key = qt_key.test(string) ? (insert.key+string) : insert.key;
      insert.answer = qt_answer.test(string) ? string : insert.answer;
      insert.analysis = qt_analysis.test(string) ? string : insert.analysis;
      insert.difficult = qt_difficult.test(string) ? string : insert.difficult;
      insert.label = qt_label.test(string) ? string : insert.label;
      insert.comKeyWord = qt_comKeyWord.test(string) ? string : insert.comKeyWord;
      insert.coreKeyWord = qt_coreKeyWord.test(string) ? string : insert.coreKeyWord;
      insert.error = qt_error.test(string) ? string : insert.error;
      //记录一整道题中各组成部分状态
      status.qt_title = qt_title.test(string) ? true : status.qt_title;
      status.qt_key = qt_key.test(string) ? true : status.qt_key;
      status.qt_answer = qt_answer.test(string) ? true : status.qt_answer;
      status.qt_analysis = qt_analysis.test(string) ? true : status.qt_analysis;
      status.qt_difficult = qt_difficult.test(string) ? true : status.qt_difficult;
      status.qt_label = qt_label.test(string) ? true : status.qt_label;
      status.qt_comKeyWord = qt_comKeyWord.test(string) ? true : status.qt_comKeyWord;
      status.qt_coreKeyWord = qt_coreKeyWord.test(string) ? true : status.qt_coreKeyWord;

      status.qt_error = qt_error.test(string) ? true : status.qt_error;
    }

    for (var i = 0; i < content.length; i++) {
      var title_reg = new RegExp("qt_title");
      var key_reg = new RegExp("key_");
      var error_reg = new RegExp("class='error'");
      // 根据loop_status判断是否跳过，凡跳一次，计数减一
      if(loop_status>0) {
        loop_status--;
        continue;
      }
      //这是无法识别出来的内容，统一视为上一项中的内容
      for (var j = i; j < content.length-1; j++) {//都是检测下一项，所以不用再去对最后一行做判断
        if ( error_reg.test(content[j+1])) {//检测当前项的下一项，若为error则与当前项拼接
          //当下一项中有图片（fr-dib是froala编辑器中图片的class）；并且当前项为答案时
          if(content[j+1].match('class="fr-dib"') && content[j].match('qt_answer')){
            //判断题、填空题答案不能有图片
            if((qt_type=="3"||qt_type=="4")){
              content[j] = content[j].replace(/qt_answer/,'qt_answer qt_error');
            }
            //问答题的答案中不能只放图片(问答题；字符串长度小于4；答案；下一项是图片)
            else if(qt_type=="5"){
              var answerLength = $(content[j]).text().replace(/\s*/g,"").length;//答案长度
              if(answerLength<4){
                content[j] = content[j].replace(/qt_answer/,'qt_answer qt_error');
              }
            }
          }
          content[j+1] = (content[j]+content[j+1]).replace(/<\/p><p class='error'>/,"<br class='markdown_return'>");
          loop_status++;//记录需跳过的行数
        }else {
          break;//如遇到非error项则跳出循环
        }
      }
      // 根据loop_status判断是否跳过，凡跳一次，计数减一
      if(loop_status>0) {
        loop_status--;
        continue;
      }

      // 选项计数
      if(key_reg.test(content[i])){
        params.key_count++;
      }
      // 题目计数
      if(title_reg.test(content[i])){
        params.count++;
      }
      //检测字符串是题目中哪一部分，记录一整道题中各组成部分状态,存储各部分内容
      regStr(content[i]);

      if(params.count>1){
        //出现下一个title意味着上一题结束，重新初始化
        status = {
          "qt_title": false,
          "qt_key": false,
          "qt_comKeyWord":false,
          "qt_coreKeyWord":false,
          "qt_answer": false,
          "qt_analysis": false,
          "qt_difficult": false,
          "qt_label": false,
          "qt_error": false,
        };
        insert = {
          "left": "<div class='question' data-type='"+qt_type+"'>",
          "title": "<p class='qt_error'>题目（至少两个字）</p>",
          //key只存在于单选和多选
          "key": (qt_type=="1"||qt_type=="2") ? "<p class='qt_error'>选项（至少两项）</p>" : "",
          "comKeyWord":"",
          "coreKeyWord":"",
          "answer": "<p class='qt_error'>答案</p>",
          "analysis": "",
          "difficult": "",
          "label": "",
          "error": "",
          "right": "</div>",
        };
        //   手动添加title状态
        status.qt_title = true;
        params.count = 1;
        params.key_count = 0;
        insert.title = content[i];
        if(qt_type == '5'){
          html += insert.left + insert.title + insert.key +insert.comKeyWord+insert.coreKeyWord+ insert.answer + insert.analysis + insert.difficult + insert.label + insert.error + insert.right;
        }else{
          html += insert.left + insert.title + insert.key+ insert.answer + insert.analysis + insert.difficult + insert.label + insert.error + insert.right;
        }
      }else {
        encodeHtml(insert.difficult);
        // !insert.difficult.match(/\s*(简单|普通|困难)\s*/i)
        if ($(insert.difficult).text().slice(3) != '简单' && $(insert.difficult).text().slice(3) != '普通' && $(insert.difficult).text().slice(3) != '困难'){
          var diffDivTxt = $('.simulationSelect.difficult .title-font').text();
          if (diffDivTxt != '') {
            insert.difficult = '<p class="qt_difficult qt_error_diff"><span class="title">难度：</span>'+diffDivTxt+'</p>';
            insert.left = "<div class='question check_error_diff' data-type='"+qt_type+"'>"
          }
        }
        //如果单选题、多选题的答案中有图片
        if(insert.answer.match('class="fr-dib"') && (qt_type=="1"||qt_type=="2")){
          insert.error = "<p class='qt_error'>请勿在答案中写入图片</p>";
        }
        // 拼接所有部分，对整块question进行更新
        if(qt_type == '5'){
          var characterCheck = /[`~!@#$%^&*()_\-+=<>?:"{},.\/;'\\[\]·~！@#￥%……&*（）——\-+={}《》？：“”【】；‘’，。]/im;//解决特殊字符判分不准的问题
          var _comKeyWord = $(insert.comKeyWord).text().substring(6,$(insert.comKeyWord).text().length);
          var _coreKeyWord = $(insert.coreKeyWord).text().substring(6,$(insert.coreKeyWord).text().length);
          if(characterCheck.test(_comKeyWord) || characterCheck.test(_coreKeyWord)){
            insert.error = "<p class='qt_error'>关键词不允许使用特殊字符</p>";
          }
          html_temp = insert.left + insert.title + insert.key +insert.comKeyWord+insert.coreKeyWord+insert.answer + insert.analysis + insert.difficult + insert.label + insert.error + insert.right;
        }else{
          html_temp = insert.left + insert.title + insert.key +insert.answer + insert.analysis + insert.difficult + insert.label + insert.error + insert.right;
        }
        //如果answer和error内容相同，就只显示answer
        if(insert.answer == insert.error){
          if(qt_type == '5'){
            html_temp = insert.left + insert.title + insert.key +insert.comKeyWord+insert.coreKeyWord+insert.answer + insert.analysis + insert.difficult + insert.label + insert.right;
          }else{
            html_temp = insert.left + insert.title + insert.key+insert.answer + insert.analysis + insert.difficult + insert.label + insert.right;
          }
        }
        var _index = html.lastIndexOf("<div class='question'>");
        html = html.substring(0, _index) + html_temp;
      }
    }
    content = html;
    return content;
  };
  function encodeHtml(str){
    var encodedStr = "" ;
    if (str=="") return encodedStr ;
    else {
      for (var i = 0 ; i < str.length ; i ++){
        encodedStr += "&#" + str.substring(i, i + 1).charCodeAt().toString(10) + ";" ;
      }
    }
    return encodedStr ;
  }
  function escapeHTML( text ) {
    // return text.replace( /&/g, "&amp;" )
    //            .replace( /</g, "&lt;" )
    //            .replace( />/g, "&gt;" )
    //            .replace( /"/g, "&quot;" )
    //            .replace( /'/g, "&#39;" )
    //            .replace( / /g, "&nbsp;")
    return text;
  }

  function render_tree( jsonml ) {

    var errorChidren = $('#preview').find('.qt_difficult');
    if ($(errorChidren)){
      $(".simulationSelect.difficult .title-font").text('简单');
    }

    // basic case
    if ( typeof jsonml === "string" ) {
      return escapeHTML( jsonml );
    }
    var tag = jsonml.shift(),
      attributes = {},
      content = [],
      checkOrRadio = '';
    while ( jsonml.length ) {
      content.push( render_tree( jsonml.shift() ) );
    }

    if(qt_type=="1"){
    var  span = "<span class='change-type'><input class='checkOrRadio' type='checkbox' /><span>录入为多选题</span></span>";
      checkOrRadio = "<input class='checkOrRadio' type='radio' />";
    }else if(qt_type=="2") {
      checkOrRadio = "<input class='checkOrRadio' type='checkbox' />";
    }
    if(qt_type != '1'){
      var span = "";
    }

    // be careful about adding whitespace here for inline elements
    //给试题各个部分添加相应的class
    switch (tag) {
      case "title":
        // if(content.join( "" ).length<=3){
        //     tag_attrs=" class='qt_error'";
        // }else {
        //     tag_attrs=" class='qt_title'";
        // }
        var tag_attrs=" class='qt_title'";
        return "<p" + tag_attrs + " ref='qt_title'>" + content.join( "" ).replace(/^\s*([0-9]+\.)|(((\()|（)[0-9]+((\))|）))/,"<span class='type-box'><span ref='typeBox' class='title type-name-"+qt_type+"'>$1$2</span><span class='type-name type-name-"+qt_type+"'>"+typeName[Number(qt_type)-1]+"</span>"+span+"</span>") + "</p>";
        break;
      case "keyA":
        var tag_attrs=" class='key key_A'";
        return "<p" + tag_attrs + ">" + checkOrRadio + content.join( "" ).replace("A.", "<span class='title'>A.</span>") + "</p>";
        break;
      case "keyB":
        var tag_attrs=" class='key key_B'";
        return "<p" + tag_attrs + ">" + checkOrRadio + content.join( "" ).replace("B.", "<span class='title'>B.</span>") + "</p>";
        break;
      case "keyC":
        var tag_attrs=" class='key key_C'";
        return "<p" + tag_attrs + ">" + checkOrRadio + content.join( "" ).replace("C.", "<span class='title'>C.</span>") + "</p>";
        break;
      case "keyD":
        var tag_attrs=" class='key key_D'";
        return "<p" + tag_attrs + ">" + checkOrRadio + content.join( "" ).replace("D.", "<span class='title'>D.</span>") + "</p>";
        break;
      case "keyE":
        var tag_attrs=" class='key key_E'";
        return "<p" + tag_attrs + ">" + checkOrRadio + content.join( "" ).replace("E.", "<span class='title'>E.</span>") + "</p>";
        break;
      case "keyF":
        var tag_attrs=" class='key key_F'";
        return "<p" + tag_attrs + ">" + checkOrRadio + content.join( "" ).replace("F.", "<span class='title'>F.</span>") + "</p>";
        break;
      case "keyG":
        var tag_attrs=" class='key key_G'";
        return "<p" + tag_attrs + ">" + checkOrRadio + content.join( "" ).replace("G.", "<span class='title'>G.</span>") + "</p>";
        break;
      case "keyH":
        var tag_attrs=" class='key key_H'";
        return "<p" + tag_attrs + ">" + checkOrRadio + content.join( "" ).replace("H.", "<span class='title'>H.</span>") + "</p>";
        break;
      case "answer":
        var tag_attrs=" class='qt_answer'";
        var tag_hidden = " class=qt_answer hidden";

        if(qt_type == '1' ||qt_type == '2'){
          return "<p" + tag_hidden + ">" + content.join( "" ).replace(/(&nbsp;)*\s*答案[:：]/,"<span class='title'>答案：</span>") + "</p>";
        }else{
          return "<p" + tag_attrs + " ref='qt_answer'>" + content.join( "" ).replace(/(&nbsp;)*\s*答案[:：]/,"<span class='title'>答案：</span>") + "</p>";
        }
        break;
      case 'comKeyWord':
        var tag_attrs=" class='qt_comKeyWord'";

        return "<p" + tag_attrs + ">" + content.join( "" ).replace(/(&nbsp;)*普通关键词[:：]/,"<span class='title'>普通关键词：</span>") + "</p>";

        break;
      case 'coreKeyWord':
        var tag_attrs=" class='qt_coreKeyWord'";

        return "<p" + tag_attrs + ">" + content.join( "" ).replace(/(&nbsp;)*核心关键词[:：]/,"<span class='title'>核心关键词：</span>") + "</p>";
        break;
      case "ans_error":
        var tag_attrs=" class='qt_error qt_answer'";
        return "<p" + tag_attrs + ">" + content.join( "" ).replace(/(&nbsp;)*答案[:：]/,"<span class='title'>答案：</span>") + "</p>";
        break;
      case "analysis":
        var tag_attrs=" class='qt_analysis'";
        return "<p" + tag_attrs + ">" + content.join( "" ).replace(/(&nbsp;)*解析[:：]/,"<span class='title'>解析：</span>") + "</p>";
        break;
      case "difficult":
        var tag_attrs=" class='qt_difficult'";
        return "<p" + tag_attrs + ">" + content.join( "" ).replace(/(&nbsp;)*难度[:：]/,"<span class='title'>难度：</span>") + "</p>";
        break;
      case "label":
        var tag_attrs=" class='qt_label'";
        return "<p" + tag_attrs + ">" + content.join( "" ).replace(/(&nbsp;)*试题标签[:：]/,"<span class='title'>试题标签：</span>") + "</p>";
        break;
      case "key_error":
        var tag_attrs=" class='qt_error qt_key'";
        return "<p"+ tag_attrs + ">" + content.join( "" ) + "</p>";
        break;
      default:
        var tag_attrs=" class='error'";
        return "<"+ tag + tag_attrs + ">" + content.join( "" ) + "</" + tag + ">";
    }
  }
  function convert_tree_to_html( tree, references, options) {
    var i;
    options = options || {};

    // shallow clone
    var jsonml = tree.slice( 0 );

    if ( typeof options.preprocessTreeNode === "function" ) {
      jsonml = options.preprocessTreeNode(jsonml, references);
    }

    // Clone attributes if they exist
    var attrs = extract_attr( jsonml );
    if ( attrs ) {
      jsonml[ 1 ] = {};
      for ( i in attrs ) {
        jsonml[ 1 ][ i ] = attrs[ i ];
      }
      attrs = jsonml[ 1 ];
    }

    // 这是需要的部分，最基础的
    // basic case
    if ( typeof jsonml === "string" ) {
      return jsonml;
    }

    // convert this node
    // 给试题添加相应标签
    switch ( jsonml[ 0 ] ) {
      case "title":
        jsonml[ 0 ] = "title";
        break;
      case "keyA":
        jsonml[ 0 ] = "keyA";
        break;
      case "keyB":
        jsonml[ 0 ] = "keyB";
        break;
      case "keyC":
        jsonml[ 0 ] = "keyC";
        break;
      case "keyD":
        jsonml[ 0 ] = "keyD";
        break;
      case "keyE":
        jsonml[ 0 ] = "keyE";
        break;
      case "keyF":
        jsonml[ 0 ] = "keyF";
        break;
      case "keyG":
        jsonml[ 0 ] = "keyG";
        break;
      case "keyH":
        jsonml[ 0 ] = "keyH";
        break;
      case "ans_error":
        jsonml[ 0 ] = "ans_error";
        break;
      case "key_error":
        jsonml[ 0 ] = "key_error";
        break;
      case "answer":
        jsonml[ 0 ] = "answer";
        break;
      case "analysis":
        jsonml[ 0 ] = "analysis";
        break;
      case "difficult":
        jsonml[ 0 ] = "difficult";
        break;
      case "label":
        jsonml[ 0 ] = "label";
        break;
      case "para":
        jsonml[ 0 ] = "p";
        break;
    }

    // convert all the children
    i = 1;

    // deal with the attribute node, if it exists
    if ( attrs ) {
      // if there are keys, skip over it
      for ( var key in jsonml[ 1 ] ) {
        i = 2;
        break;
      }
      // if there aren't, remove it
      if ( i === 1 ) {
        jsonml.splice( i, 1 );
      }
    }

    for ( ; i < jsonml.length; ++i ) {
      jsonml[ i ] = convert_tree_to_html( jsonml[ i ], references, options );
    }

    return jsonml;
  }
// merges adjacent text nodes into a single node
  function merge_text_nodes( jsonml ) {
    // skip the tag name and attribute hash
    var i = extract_attr( jsonml ) ? 2 : 1;

    while ( i < jsonml.length ) {
      // if it's a string check the next item too
      if ( typeof jsonml[ i ] === "string" ) {
        //如果是img
        if(jsonml[i].indexOf("<img")>-1){
          var img = $("<div/>").html(jsonml[i]);
          // jsonml[i] = img;
        }
        if ( i + 1 < jsonml.length && typeof jsonml[ i + 1 ] === "string" ) {
          // merge the second string into the first and remove it
          jsonml[ i ] += jsonml.splice( i + 1, 1 )[ 0 ];
        }
        else {
          ++i;
        }
      }
      // if it's not a string recurse
      else {
        merge_text_nodes( jsonml[ i ] );
        ++i;
      }
    }
  }



