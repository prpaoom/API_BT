module.exports = new function(){

    var mongoose = require('mongoose');
    mongoose.Promise = global.Promise;

    //var url = 'mongodb://Devorite:Pbird7979!$@27.254.81.130:23166/commons';
    var url = 'mongodb://root:root@128.199.162.53:27017/p_commons';
    var Schema = mongoose.Schema;
    cm = mongoose.createConnection(url);
    
    var user = Schema({
        username : String,
        password : String,
        permission : Number,
        email : String,
        phone : String,
        shop_id : { type: Schema.Types.ObjectId, ref: 'shop' },
        date : Number,
    },{collection:'Cm_user'});
    cm.model('user', user);
    
    var token_blacklist = Schema({
      token:String
    },{collection:'Cm_token_blacklist'});
    cm.model('token_blacklist',token_blacklist);
    
    var about = Schema({
        about_title : String,
        about_title_custom : String,
        about_detail : String,
        about_detail_custom : String,
        about_concept : String,
        about_content: String,
        about_img : {},
        about_hashtag : String,
        about_hashtag_concept : String 
    },{collection:'Cm_about'});
    cm.model('about', about);
    
    var defaultx = Schema({
        cm_contact : String,
        cm_seo : String,
        cm_location : String,
        cm_img : { path:String, width:String, height:String },
    },{collection:'Cm_default'});
    cm.model('default', defaultx);
    
    var event = Schema({
        shop_id : { type: Schema.Types.ObjectId, ref: 'shop' }, 
        event_time : { time_start:String, time_end:String },
        event_title : { title_en:String, title_th:String },
        event_content : { content_en:String, content_th:String },
        event_slug : String,
        event_img : { path:String, width:String, height:String },
        event_cover : { path:String, width:String, height:String },
        event_color : Number,
        event_expire : Number,
        event_status : Number,
        date: Number,
        
    },{collection:'Cm_event'});
    cm.model('event', event);

    var photo_event = Schema({
        event_id : { type: Schema.Types.ObjectId }, 
        img : String, 
        width:String, 
        height:String,
        date: Number,
        
    },{collection:'Cm_photo_event'});
    cm.model('photo_event', photo_event);

    var photo_shop = Schema({
        shop_id : { type: Schema.Types.ObjectId }, 
        img : String, 
        width:String, 
        height:String,
        date: Number,
        
    },{collection:'Cm_photo_shop'});
    cm.model('photo_shop', photo_shop);

    var get = Schema({ 
        name : String,
        slug : String,
        status : Number, 
        shop_id : { type: Schema.Types.ObjectId, ref: 'shop' }, 
        index: Number,
        
    },{collection:'Cm_get'});
    cm.model('get', get);

    var activity = Schema({
        shop_id : mongoose.Schema.Types.ObjectId,
        activity_img : String,
        width:String,
        height:String,
        caption_en:String,
        caption_th:String,
        index:Number,
        event_id: { type: Schema.Types.ObjectId, ref: 'event' },
        date: Number,
    },{collection:'Cm_activity'});
    cm.model('activity', activity);

    var slide = Schema({
        shop_id : mongoose.Schema.Types.ObjectId,
        img : String,
        width:String,
        height:String,
    },{collection:'Cm_slide'});
    cm.model('slide', slide);

    var slide_about = Schema({
        type : String,
        img : String,
        width:String,
        height:String,
        caption: { caption_en:String, caption_th:String},
        date: Number,
    },{collection:'Cm_slide_about'});
    cm.model('slide_about', slide_about);

    var log = Schema({
        shop_id : mongoose.Schema.Types.ObjectId,
        ip : String,
        platform:String,
        browser:String,
        //useragent : {}, 
        referrer : String,
        page:String, 
        date : Number
    },{collection:'Cm_log'});
    cm.model('log', log);
    
    var shop = Schema({
        short_name: String,
        shop_name: String,
        shop_slug: String,
        shop_logo: String, 
        shop_logo_landscape: String,
        shop_cover: String,
        shop_avatar: String,
        shop_open: String,
        shop_content: String,
        status_get: Number, 
        status_content: Number,
        status_slide: Number,
        status_open: Number,
        add_follow: Number,
        status_content_follow: Number,
        follow_content : { content_en:String, content_th:String },
        shop_content_custom : { content_en:String, content_th:String },
        shop_title: String,
        shop_layout_img: String,
        shop_seo: String,
        shop_contact: String,
        shop_bio: String,
        shop_detail: { detail_en:String, detail_th:String },
        start_time: String,
        end_time: String,
        shop_header : { header_en:String, header_th:String },
        img_default: { path:String, width:String, height:String },
        img_side: { path:String, width:String, height:String },

    },{collection:'Cm_shop'});
    cm.model('shop', shop);
}