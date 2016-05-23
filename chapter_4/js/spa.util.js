//spa.util.jsonp
//汎用Javascriptユーティリティー

//        jslint設定
/*        jslint browser :true, continue :true,
            devel: true,indent: 2,maxerr :50,
            newcap: true, nomen: true, plusplus: true,
            regexp: true, sluppy: true, vars: true,
            white: true
*/
//        global $, spa:true


spa.util = (function(){
    var MakeError,setConfigMap;
    
    //パブリックコンストラクタmakeError
    //目的:エラーオブジェクトを作成するマッパー
    //引数:name_text-エラー名 msg_text-長いエラーメッセージ名 data-エラーオブジェクトに付加するオプションのデータ
    
    MakeError = function(name_text,msg_text,data){
        var error = new Error();
        error.name = name_text;
        error.text = msg_text;
        
        if(data){error.data = data};
        
        return error;
    }
    
    //パブリックコンストラクタsetConfigMap
    //目的：機能モジュールで構成を行うための共通コード
    //引数input_map- 構成するキーバリューマップ　settable_map -構成できるキーのマップ　config_map - 構成を適用するマップ
    
    setConfigMap = function(arg_map){
        var input_map = arg_map.input_map,
            settable_map = arg_map.settable_map,
            config_map = arg_map.config_map,
            key_name,error;
        
        for(key_name in input_map){
            if(input_map.hasOwnProperty(key_name)){
                if(settable_map.hasOwnProperty(key_name)){
                    config_map[key_name] = input_map[key_name];
                }else{
                    error = MakeError('Bad Input','Setting config key |' + key_name + '|is not supported')
                    throw error;
            }
        }
    }
    }
    
    return {
        MakeError:MakeError,
        setConfigMap:setConfigMap
    }
}());
