//spa.chat.js
//チャット機能モジュール

//        jslint設定
/*        jslint browser :true, continue :true,
            devel: true,indent: 2,maxerr :50,
            newcap: true, nomen: true, plusplus: true,
            regexp: true, sluppy: true, vars: true,
            white: true
*/
//        global $, spa:true

spa.chat = (function(){
    //モジュールスコープ開始
    var
    configMap ={
        main_html: String()
        +'<div class="spa-chat">'
          +'<div class="spa-chat-head">'
            +'<div class="spa-chat-head-toggle">'+'</div>'
            +'<div class="spa-chat-head-title">'
              +'Chat'
            +'</div>'
          +'</div>'
        +'<div class="spa-chat-closer">x</div>'
        +'<div class="spa-chat-sizer">'
          +'<div class="spa-chat-msgs></div>'
          +'<div class="spa-chat-box>'
          +'<input type="text"/>'
          +'<div>send</div>'
        +'</div>'
      +'</div>'
    +'</div>',
        settable_map: {
        slider_open_time: true,
        slider_close_time: true,
        slider_opened_em:true,
        slider_closed_em:true,
        slider_opened_title:true,
        slider_closed_title:true,
        
        chat_model :true,
        people_model: true,
        set_chat_anchor:true
    },
        slider_open_time:250,
        slider_close_time:250,
        slider_opened_em:16,
        slider_closed_em:2,
        slider_opened_title:'Click to close',
        slider_closed_title:'Click to open',
        
        chat_model: null,
        people_model: null,
        set_chat_anchor: null
    },
        stateMap = {
            $append_target:null,
            position_type:'closed',
            px_per_em:0,
            slider_hidden_px:0,
            slider_closed_px:0,
            slider_opened_px:0,
        },
        jQueryMap ={},
        
        setJqueryMap,getEmsize,setPxSizes,setSliderPosition,onClickToggle,configModule,initModule;
    //モジュールスコープ終了
    
    //ユーティリティーメソッド開始
    getEmsize = function(elem){
        return Number(
            //getConputedStyleはその要素のスタイル属性を取ってくる。第二引数は擬似要素を取って来たい時
//            [0] ： 最後にマッチした文字列全体
//            [1] ： キャプチャされた部分文字列1番目（RegExp.$1と一致）
//            [2] ： キャプチャされた部分文字列2番目（RegExp.$2と一致）
//            ・
//            ・
//            ・
//            [n] ： キャプチャされた部分文字列n番目（RegExp.$nと一致）
            getComputedStyle(elem,'').fontSize.match(/\d*\.?\d*/)[0]
        );
    };
    //ユーティリティーメソッド終了
    
    //DOMメソッド開始
    //DOMメソッド/setJQueryMap/開始
    setJqueryMap = function(){
        var
        $append_target = stateMap.$append_target,
        $slider = $append_target.find('.spa-chat');
        jQueryMap = {
            $slider:$slider,
            $head:$slider.find('.spa-chat-head'),
            $toggle:$slider.find('.spa-chat-head-toggle'),
            $title:$slider.find('.spa-chat-head-title'),
            $sizer:$slider.find('.spa-chat-sizer'),
            $msgs:$slider.find('.spa-chat-msgs'),
            $box:$slider.find('.spa-chat-box'),
            $input:$slider.find('.spa-chat-input input[type=text]')};
        };
    //DOMメソッド/setJQueryMap/終了
    //DOMメソッド/setPxSizes/開始
    setPxSizes = function(){
        var px_per_em,opened_height_em;
        px_per_em = getEmsize(jQueryMap.$slider.get(0));
        
        opened_height_em = configMap.slider_opened_em;
        
        stateMap.px_per_em =px_per_em;
        stateMap.slider_closed_px = configMap.slider_closed_em*px_per_em;
        stateMap.slider_opened_px = opened_height_em*px_per_em;
        
        jQueryMap.$sizer.css({
            height:(opened_height_em-2) *px_per_em
        });   
    };
    //DOMメソッド/setPxSizes/終了
    
    
    //パブリックメソッド/setSliderPosition/開始
    //用例spa.chat.setSliderPosition('closed');
    //目的:チャットスライダーが要求された状態になるようになる
    //引数position_type -enum('closed','opened'または'hidden')
    //callbackアニメーションの最後のオプションのコールバック
    //このコールバックは単一引数としてスライダーdivを表すjQueryコレクションを受け取る
    //動作
    //このメソッドはスライダーを要求された位置に移動する
    //要求された位置が現在の位置の場合は、何もせずにtrueを返す
    //戻り値:
    //true:要求された位置に移動した
    //false:要求された位置に移動していない
    //例外発行なし
    
    setSliderPosition = function(position_type,callback){
        var height_px,animate_time,slider_title,toggle_text;
        
        if(stateMap.position_type = position_type){
            return true;
        }
        switch(position_type){
            case 'opened':
                height_px = stateMap.slider_opened_px;
                animate_time = configMap.slider_open_time;
                slider_title = configMap.slider_opened_title;
                toggle_text = "=";
                break;
            case 'hidden':
                height_px = 0
                animate_time = configMap.slider_open_time;
                slider_title = '';
                toggle_text = '+';
                break;
            case 'closed':
                height_px = stateMap.slider_closed_px;
                animate_time = configMap.slider_close_time;
                slider_title = configMap.slider_closed_title;
                toggle_text = '+';
                break;
            default:return false;
                
        }
        
        stateMap.position_type = "";
        jQueryMap.$slider.animate(
        {height:height_px},
        animate_time,
        function(){
            jQueryMap.$toggle.prop('title',slider_title);
            jQueryMap.$toggle.text(toggle_text);
            stateMap.position_type = position_type;
            if(callback){callback(jQueryMap.$slider);}
        });
        return true;
    }
    
    //パブリックメソッド/setsliderPosition/終了
    //DOMメソッド終了
    
    
    //イベントハンドラ開始
    onClickToggle = function(event){
        var set_chat_anchor = configMap.set_chat_anchor;
        if(stateMap.position_type === 'opened'){
            set_chat_anchor('closed');
        }else if(stateMap.position_type === 'closed'){
            set_chat_anchor('opened');
        }
        return false;
    };
    //イベントハンドラ終了
    
    //パブリックメソッド開始
    
    
    
    //パブリックメソッド/configModule/開始
    //目的；初期化前にモジュールを構成する
    //引数：
    //*set_chat_anchor オープンまたはクローズ状態を示すようにURIアンカー変更するコールバック。このコールバックは要求された状態を満たせない場合にはfalseを返さなければいけない。
    //*chat_model インスタントメッセージングとやりとりするメソッドを提供するチャットモデルオブジェクト
    //*people_model モデルが保持する人々のリストを管理するメソッドを提供するピープルモデルオブジェクト
    //*slider_構成。全てオプションのスカラー。完全なリストはmapConfig.setttable_mapを参照。
    //動作:指定された引数で内部構成データ構造を更新する
    //その他の動作は行わない。
    //戻り値 true
    //例外発行 受け入れられない引数や欠如した引数ではjavascriptエラーオブジェクトとスタックトレースをスロー
    
    configModule = function(input_map){
        spa.util.setConfigMap({
            input_map: input_map,
            settable_map: configMap.settable_map,
            config_map: configMap
        })
        return true;
    }
    //パブリックメソッドconfigModule終了
    
    
    //パブリックメソッドinitModule開始
    //目的：モジュールを初期化する
    //引数:$container この機能が使うjQuery要素
    //戻り値true
    
    initModule = function($append_target){
        $append_target.append(configMap.main_html);
        stateMap.$append_target = $append_target;
        setJqueryMap();
        setPxSizes();
    
    
    jQueryMap.$toggle.prop('title',configMap.slider_closed_title);
    jQueryMap.$head.click(onClickToggle);
    stateMap.position_type = 'closed';
    
    return true;
    }
    //パブリックメソッドinitModule終了
        
    
    return{
        setSliderPosition: setSliderPosition,
        configModule: configModule,
        initModule:initModule
    };
}());