//        jslint設定
/*        jslint browser :true, continue :true,
            devel: true,indent: 2,maxerr :50,
            newcap: true, nomen: true, plusplus: true,
            regexp: true, sluppy: true, vars: true,
            white: true
*/
//        global $, spa:true

spa.shell = (function () {
    //モジュールスコープ変数開始
    var 
    configMap = {
        anchor_schema_map : {
            chat:{opened : true,closed : true}
        },
        main_html : String()
        + '<div class="spa-shell-head">'
          + '<div class="spa-shell-head-logo"></div>'
          + '<div class="spa-shell-head-acct"></div>'
          + '<div class="spa-shell-head-search"></div>'
        + '</div>'
        + '<div class="spa-shell-main">'
          + '<div class="spa-shell-main-nav"></div>'
          + '<div class="spa-shell-main-content"></div>'
        + '</div>'
        + '<div class="spa-shell-foot"></div>'
        + '<div class="spa-shell-modal"></div>'
    },
        stateMap = {
            anchor_map : {},
        },
        jQueryMap = {},
        copyAnchorMap,setJqueryMap,changeAnchorPart,onHashchange,initModule,setChatAnchor;
    //モジュールスコープ変数終了
    //ユーティリティーメソッド開始（ページとやりとりをしないメソッド）
    //下の階層の値も再帰的にマージ（ディープコピー）してほしい場合は、extend() の第1引数に true を指定します。
    copyAnchorMap = function(){
        return $.extend(true,{},stateMap.anchor_map)
    }
    //ユーティリティーメソッド終了
    //DOMメソッド開始
    //DOMメソッドsetJqueryMap開始
    setJqueryMap = function(){
        var $container = stateMap.$container;
        jQueryMap = {
            $container:$container
        };
    };
    
    
    //DOMメソッドsetJqueryMap終了
    
    
    //DOMメソッドchangeAnchorPart開始
    //目的：URIアンカー要素部分を変更する
    //引数：変更したいURIアンカー部分を表すマップ
    changeAnchorPart =function(arg_map){
        var
        anchor_map_revise = copyAnchorMap(),
        bool_return = true,
        key_name,key_name_dep;
        
        KEYVAL:
        for(key_name in arg_map){
            if(arg_map.hasOwnProperty(key_name)){
                if(key_name.indexOf('_') === 0){continue KEYVAL;}
                
                //独立キーを更新する
                anchor_map_revise[key_name]=arg_map[key_name];
                
                //合致する独立キーを更新する
                key_name_dep = '_' +key_name;
                if(arg_map[key_name_dep]){
                    anchor_map_revise[key_name_dep]=arg_map[key_name_dep];
                }else{
                    delete anchor_map_revise[key_name_dep];
                    delete anchor_map_revise['_s'+key_name_dep];
                }
            }
        }
        //アンカーマップへ変更を統合終了
        //URIの変更開始。成功しなければ元に戻す。
        try{
            $.uriAnchor.setAnchor(anchor_map_revise);
        }catch(error){
            $.uriAnchor.setAnchor(stateMap.anchor_map,null,true);
            bool_return = false;
            };
        //URIの変更終了
        
        return bool_return;
    };
    
    //イベントハンドラ開始
        onHashchange = function(event){
        var 
        is_ok = true,
        anchor_map_previous = copyAnchorMap(),
        anchor_map_proposed,_s_chat_previous,
        _s_chat_proposed,s_chat_proposed;
        
        
        try{anchor_map_proposed = $.uriAnchor.makeAnchorMap();}
        catch(error){
            $.uriAnchor.setAnchor(anchor_map_previous,null,true);
            return false;
        }
        
        stateMap.anchor_map = anchor_map_proposed;
        _s_chat_previous =anchor_map_previous._s_chat;
        _s_chat_proposed =anchor_map_proposed._s_chat;
        
        //変更されている場合のチャットコンポーネントの調整開始
        if(! anchor_map_previous
          || _s_chat_previous !== _s_chat_proposed){
            s_chat_proposed = anchor_map_proposed.chat;
            switch(s_chat_proposed){
                case 'open':
                    is_ok = spa.chat.setSliderPosition('opened');
                break;
                case 'closed':
                    is_ok = spa.chat.setSliderPosition('closed')
                break;
                default:
                    spa.chat.setSliderPosition('closed')
                    delete anchor_map_proposed.chat;
                    $.uriAnchor.setAnchor(anchor_map_proposed,null,true);
            }
        }
        //スライダーの変更が拒否された場合にアンカーをもとに戻す処理を開始
        if(is_ok){
            if(anchor_map_previous){
                $.uriAnchor.setAnchor(anchor_map_previous,null,true);
                stateMap.anchor_map = anchor_map_previous;
            }else{
                delete anchor_map_proposed.chat;
                $.uriAnchor.setAnchor(anchor_map_proposed,null,true);
            }
        }
        return false
    };
        
    //コールバックメソッド/setChatAnchor/開始
    //用例：setChatAnchor('closed')
    //目的:アンカーのチャットコンポーネントを変更する
    //引数: position_type -[closed]または[opened]
    
    setChatAnchor = function(position_type){
        return changeAnchorPart({chat: position_type});
    }
    
    //コールバックメソッド/setChatAnchor/終了
    
    //イベントハンドラ終了
    //パブリックメソッド開始
    initModule = function($container){
        stateMap.$container = $container;
        $container.html(configMap.main_html);
        setJqueryMap();
        
        $.uriAnchor.configModule({
            schema_map: configMap.anchor_schema_map
        });
        
        //機能モジュールを設定して初期化する
        spa.chat.configModule({
            set_chat_anchor : setChatAnchor,
            chat_model: spa.model.chat,
            people_model: spa.model.people
        });
        spa.chat.initModule(jQueryMap.$container);
        
        
        $(window).bind("hashchange",onHashchange)
        .trigger("hashchange");
    };
    //パブリックメソッド終了
    return {initModule: initModule};
}());