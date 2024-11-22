// ----- pinia ----------
import { defineStore, createPinia, setActivePinia } from "pinia"
const pinia = createPinia()
setActivePinia(pinia)
export const useCommon = defineStore({
// id は必須+唯一です、管理しやすいためです
  id: 'common',

  state: () => ({


    videoPass    : null,  // 動画再生エリアの動画パス
    filePass     : null,  // ファイルのパス
    nowVideoDate : null,  // 動画再生エリアの動画送信日時情報
    nowKouteiInfo: null,  // 動画再生エリアの工程名情報
    nowFuncInfo  : null,  // 動画再生エリアの動画機能情報
    btnString    : null,  // 動画送信ボタンエリア文言
    drawer       : true,  // drawerの制御上納
    btnflag      : false, // ボタン制御

    // API
    apigeturl_init         : "https://0c2tjjhknd-vpce-0189780872fc2b3e9.execute-api.ap-northeast-1.amazonaws.com/production/case",
    s3_uploadurl           : "https://bucket.vpce-0693d7f817a5c0981-x2u6t3kv.s3.ap-northeast-1.vpce.amazonaws.com/sibw-video-management/upload/",
    apiposturl             : "https://0c2tjjhknd-vpce-0189780872fc2b3e9.execute-api.ap-northeast-1.amazonaws.com/production/case",
    s3_inferencevideo_url  : "https://bucket.vpce-0693d7f817a5c0981-x2u6t3kv.s3.ap-northeast-1.vpce.amazonaws.com/",
    endpointurl            : "https://0c2tjjhknd-vpce-0189780872fc2b3e9.execute-api.ap-northeast-1.amazonaws.com/production/step_function",
    stateMachineArn        : "arn:aws:states:ap-northeast-1:510517927469:stateMachine:MainProcessing",
    stateMachineArn_ver2   : "arn:aws:states:ap-northeast-1:510517927469:stateMachine:MainProcessing_ver_2",
    stateMachineArn_ver3   : "arn:aws:states:ap-northeast-1:510517927469:stateMachine:MainProcessing_ver_3",
    // stateMachineArn_ver4_1   : "arn:aws:states:ap-northeast-1:510517927469:stateMachine:MainProcessing_ver_4",
    stateMachineArn_ver4_1 : "arn:aws:states:ap-northeast-1:510517927469:stateMachine:MainProcessing_ver_4.1",
    // ファイル送信API
    dynamo_file_getdurl  : "https://0c2tjjhknd-vpce-0189780872fc2b3e9.execute-api.ap-northeast-1.amazonaws.com/production/asset_management",
    // dynamo_file_getdurl  : "aaabbbxxx",
    s3_file_uploadurl    : "https://bucket.vpce-0693d7f817a5c0981-x2u6t3kv.s3.ap-northeast-1.vpce.amazonaws.com/sibw-video-management",
    api_file_posturl     : "https://0c2tjjhknd-vpce-0189780872fc2b3e9.execute-api.ap-northeast-1.amazonaws.com/production/asset_management",
    inference_endpointurl: "arn:aws:states:ap-northeast-1:510517927469:stateMachine:TeacherPoseEstimationProcessing",
    file_displayname     : "https://0c2tjjhknd-vpce-0189780872fc2b3e9.execute-api.ap-northeast-1.amazonaws.com/production/asset_management",
    file_s3bucket_url    : "https://bucket.vpce-0693d7f817a5c0981-x2u6t3kv.s3.ap-northeast-1.vpce.amazonaws.com/sibw-video-management/pdf/",
    // 動画フォーマッタ
    s3_file_formaturl    : "https://bucket.vpce-0693d7f817a5c0981-x2u6t3kv.s3.ap-northeast-1.vpce.amazonaws.com/sibw-video-management/upload/",
    // FPS変換
    convert_fps          : "https://0c2tjjhknd-vpce-0189780872fc2b3e9.execute-api.ap-northeast-1.amazonaws.com/production/movie_format",
    //教師データ検索チェック
    inference_file_check : "https://0c2tjjhknd-vpce-0189780872fc2b3e9.execute-api.ap-northeast-1.amazonaws.com/production/veteran",
    //過去教師データ削除
    archive_teacher_data : "https://0c2tjjhknd-vpce-0189780872fc2b3e9.execute-api.ap-northeast-1.amazonaws.com/production/veteran",
    //ステップファンクションベテラン推論
    // veteran_inference    : "arn:aws:states:ap-northeast-1:510517927469:stateMachine:TeacherPoseEstimationProcessing",
    //ステップファンクションベテラン推論ver2
    veteran_inference    : "arn:aws:states:ap-northeast-1:510517927469:stateMachine:TeacherPoseEstimationProcessing_ver_2",
    //教師データ登録
    put_teacher_data     : "https://bucket.vpce-0693d7f817a5c0981-x2u6t3kv.s3.ap-northeast-1.vpce.amazonaws.com/sibw-video-management/teaching/",
    //動画フォーマッタ―
    mov_formatter        : "https://0c2tjjhknd-vpce-0189780872fc2b3e9.execute-api.ap-northeast-1.amazonaws.com/production/movie_format",
    //動画フォーマッタ―S3パス
    mov_frmt_s3_path     : "s3://sibw-video-management/upload/",


    // スクリーンへの表示情報
    screen_message:{
        Demo_type  : '新人教育補助システム',
        Prot_type  : '【プロト版】新人教育補助システム',
        User_type  : '【本番仕様】新人教育補助システム',
        koutei_text: '工程名',
        upload_text: 'アップロード日',
        select_text: '解析する動画を選択して下さい',
        select_file: '解析するファイルを選択してください',
        speed_info : '現在の再生速度',
        func_info  : '追加機能名',
        log_out    : 'ログアウト'
    },

    // 一覧のヘッダー情報
    headers: [
      { text: "解析進捗",       align: "center", value: "status" },
      { text: "アップロード日",  align: "center", value: "upload_date" },
      { text: "ファイル名",     align: "center", value: "movie_info.org_file_name" },
    ],

    // TODO：リファクタリング
    koutei_name:{
      OP410: 'OP410',
      OP610: 'OP610',
    },

    mov_speed:{
      slow_2 : "0.1",
      slow_1 : "0.25",
      normal : '0.5',
      fast_1 : "0.75",
      fast_2 : "1.0",
    },

    // upload
    uploadfile:{
      OP410 : null,
      OP610 : null,
    },

    // upload
    uploadteacher:{
      OP410 : null,
      OP610 : null,
    },

    fileinfo: {
      OP410 : null,
      OP610 : null,
    },



    saveToLocalStorage(key, data) {
      localStorage.setItem(key, JSON.stringify(data));
    },

getFromLocalStorage(key) {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    },

  }),



  getters: {
    //filter
  },

  actions: {

    addProcess(newProcess) {
      if (newProcess) {
        // 新しい工程名をkoutei_nameに追加する（オブジェクトのプロパティとして追加）
        this.koutei_name[newProcess] = newProcess;
        // 入力フォームをクリアする
        this.newProcess = '';
      }
    },
    //値をset
  },

})