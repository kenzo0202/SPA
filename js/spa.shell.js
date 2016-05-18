//        jslint設定
/*        jslint browser :true, continue :true,
            devel: true,indent: 2,maxerr :50,
            newcap: true, nomen: true, plusplus: true,
            regexp: true, sluppy: true, vars: true,
            white: true
*/
//        global $, spa:true

spa.shell = (function(){
    //モジュールスコープ変数開始
    var 
    configMap = {
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
        + '<div class="spa-shell-modal"></div>'
    },
        stateMap = {$container: null},
        jQueryMap = {},
        setJqueryMap,initModule;
    //モジュールスコープ変数終了
    //ユーティリティーメソッド開始（ページとやりとりをしないメソッド）
    //ユーティリティーメソッド終了
    //DOMメソッド開始
    //DOMメソッドsetJqueryMap開始
    setJqueryMap = function(){
        var $container = stateMap.$container;
        jQueryMap = {$container:$container};
    };
    
    //DOMメソッドsetJqueryMap終了
    
    //イベントハンドラ開始
    //イベントハンドラ終了
    //パブリックメソッド開始
    initModule = function($container){
        stateMap.$container = $container;
        $container.html(configMap.main_html);
        setJqueryMap();
    }
    
    //パブリックメソッド終了
    return {initModule: initModule};
}());