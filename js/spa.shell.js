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
            chat:{open : true,closed : true}
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
        + '<div class="spa-shell-chat"></div>'
        + '<div class="spa-shell-modal"></div>',
        chat_extend_time: 1000,
        chat_retract_time: 300,
        chat_extend_height: 450,
        chat_retract_height:15,
        chat_extend_title: "Click to retract",
        chat_retract_title: "Click to extend"
    },
        stateMap = {
            $container: null,
            anchor_map : {},
            is_chat_retracted: true
        },
        jQueryMap = {},
        copyAnchorMap,setJqueryMap,toggleChat,changeAnchorPart,onHashchange,initModule,onClickChat;
    //モジュールスコープ変数終了
    //ユーティリティーメソッド開始（ページとやりとりをしないメソッド）
    copyAnchorMap = function(){
        return $.extend(true,{},stateMap.anchor_map)
    }
    //ユーティリティーメソッド終了
    //DOMメソッド開始
    //DOMメソッドsetJqueryMap開始
    setJqueryMap = function(){
        var $container = stateMap.$container;
        jQueryMap = {
            $container:$container,
            $chat: $container.find('.spa-shell-chat')
        };
    };
    
    
    //DOMメソッドsetJqueryMap終了
    //DOMメソッドtoggleChat開始
    //状態:is_chat_retractedを設定する
    // true:スライダーは格納されている
    // false:スライダーは拡大されている
    toggleChat = function(do_extend,callback){
        var 
            px_chat_ht = jQueryMap.$chat.height(),
            is_open = px_chat_ht === configMap.chat_extend_height,
            is_closed = px_chat_ht === configMap.chat_retract_height,
            is_sliding = !is_open &&  !is_closed;
        
        if(is_sliding){return false;}
        
        //チャットスライダーの拡大開始
        if(do_extend){
            jQueryMap.$chat.animate(
                {height: configMap.chat_extend_height},
                configMap.chat_extend_time,
                function(){
                    jQueryMap.$chat.attr('title',configMap.chat_extend_title);
                    stateMap.is_chat_retracted = false;
                    if(callback){callback(jQueryMap.$chat);}
                }
            );
            return true;
        }
        
        //チャットスライダーの拡大終了
        //チャットスライダーの格納開始
        jQueryMap.$chat.animate(
            {height:configMap.chat_retract_height},
            configMap.chat_retract_time,
            function(){
                jQueryMap.$chat.attr('title',configMap.chat_retract_title);
                stateMap.is_chat_retracted = true;
                if(callback){callback(jQueryMap.$chat);}
            }
        );
        return true;
    };
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
                    toggleChat(true);
                break;
                case 'closed':
                    toggleChat(false);
                break;
                default:
                    toggleChat(false);
                    delete anchor_map_proposed.chat;
                    $.uriAnchor.setAnchor(anchor_map_proposed,null,true);
            }
        }
        return false
    };
        
    
    onClickChat = function(event){
        changeAnchorPart({
            chat:(stateMap.is_chat_retracted ? 'open':'closed')
        });
        return false;
    }
    //イベントハンドラ終了
    //パブリックメソッド開始
    initModule = function($container){
        $.uriAnchor.configModule({
            schema_map: configMap.anchor_schema_map
        });
        stateMap.$container = $container;
        $container.html(configMap.main_html);
        setJqueryMap();
        
        //チャットスライダーを初期化し、クリックイベントにバインドする
        stateMap.is_chat_retracted = true;
        jQueryMap.$chat.attr('title',configMap.chat_retract_title).click(onClickChat);
        
//        setTimeout(function(){toggleChat(true)},3000);
//        setTimeout(function(){toggleChat(false)},8000);
        
        $(window).bind("hashchange",onHashchange)
        .trigger("hashchange");
    };
    
    //パブリックメソッド終了
    return {initModule: initModule};
}());