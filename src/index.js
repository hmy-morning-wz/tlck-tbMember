import React from 'zebra-isv-base/libs/preact'
import { mtop,navigation,crossImage,auth ,simpleDraw,shop,goldlog } from 'zebra-isv-base'
import './index.less'
console.log(__version__)
goldlog.record('load', 'EXP', `version=${__version__}`)

const {activity} = data.config
function Toast (props){
  return (<div class={props.content?"am-toast text":"hide"}>
  <div class="am-toast-text">
  {props.content}
  </div>
</div>)
}

function Loading (props){
  return (<div class={props.content?"am-toast":"hide"} >
  <div class="am-toast-text">
    <div class="am-loading-indicator white">
      <div class="am-loading-item"></div>
      <div class="am-loading-item"></div>
      <div class="am-loading-item"></div>
    </div>
    {props.content}
  </div>
</div>)
}
function coventArrary(a){
  if(typeof a ==='string'){
    return a.split(',')
  } else if(typeof a ==='object'){
    let b= []
  for(let i=0;i<a.length;i++){
     b.push(a[i])
  }
  return b
}else return []
}

function Rule(props) {
  let {ruleList,attentionList} = props
  ruleList = coventArrary(ruleList)
  attentionList = coventArrary(attentionList)
  return (<div class={props.ruleShow?'main':'hide'}  >      
  <div class='container'>
    <div class="rules">
      <div class="tit">活动时间</div>
      <div class="each_rule">{props.time}</div>
      <div style="height:16px;"></div>
      <div class="tit">参与条件</div>
      <div class="each_rule">{props.condition }</div>
      <div style="height:16px;"></div>
      <div class="tit">活动规则</div>        
      <div class="each_rule" id="activity_rule" >
       {  
          ruleList && ruleList.map((t)=>
          (<div class="activity_rule">{t}</div>) )                 
       }
      </div>
      <div style="height:16px;"></div>
      <div class="tit">注意事项</div>
      <div class="each_rule">
      {  
      attentionList && attentionList.map((t)=>{return <span>{t}<br/></span>})                    
       }     
      </div>
    </div>
  </div>
</div>)
}
/*
simpleDraw.updateLotteryCount({actId: '23455'}).then((res)=>{
  console.log('updateLotteryCount', res)  
},(err)=>{
  console.log('updateLotteryCount', err)  
})
*/
const assets = __isProduction__ ? `//g.alicdn.com/code/isv/custom-brandstreet/${__projectName__}/${__version__}/assets/` : './assets/'
const box = document.getElementById('box')
//const sellerId='1603022933'//'735011836'//'1603022933'
class App extends React.Component {
  constructor (...args) {
    super(args)
    this.state = {
      sellerId:null,
      datetime: null,
      joinDisplay:false,
      textMessage:null,
      mobile:'',
      ready:false,
      inputEnable:false,
      ruleShow:false,
      toast:null,
      //?activityId=111&bizScenario=111&userId=111
      activityId:'',
      bizScenario:'',
      //?code=ERROR&actId=1234
      resultUrl:'',
      callbackUrl:'',
      time:"",
      condition:"",
      ruleList: [
 ],
      attentionList:[
   ]
    }
  }

  showToast(msg,duration,type){
    console.log('toast',msg)
    this.setState({toast:msg})
    setTimeout(()=>{
      this.setState({toast:null})
     }, duration ||2000)
      
  }
  
  showLoading= (msg) => {
    console.log("showLoading",msg)
    this.setState({loading:msg})
	}
	hideLoading= () => {
    console.log("hideLoading")
    this.setState({loading:null})
	}
 
  onRulePressed(e){
    e.preventDefault()
    this.setState({
      ruleShow: !this.state.ruleShow,
    })
    /*
    let {callbackUrl,activityId,bizScenario,userId} = this.state
    let navigationUrl = `${callbackUrl}?bizScenario=${bizScenario}&activityId=${activityId}&userId=${userId}`
    navigation.pushWindow(navigationUrl)
    */
  }
  checkUserStatus(callback,error){
    //
    let _self = this;
    let {sellerId} = this.state
    mtop( 'mtop.tmall.seiya.tmax.cem.getMemberCenterUrl',{ 
        brandSellerId: sellerId,
        callbackUrl: location.href
      },{needSignIn: true}
    ).then(function(res) {
        callback(res);
    }, function(err) {
        console.log('sync inventory error', err)    
    });
  }
  simpleDraw(simpleDrawId){
    goldlog.record('simpleDraw', 'CLK', `simpleDrawId=${simpleDrawId}&age=18`)

    let {debug} = this.state
    simpleDraw.fetchLotteryCount({
      // 测试活动，正式活动id请咨询对口运营同学
      actId: simpleDrawId,
    }).then(lotteryCount => {
      console.log('simpleDraw.fetchLotteryCount', lotteryCount,debug)
      /*
      addcount: "0"
count: "3"
leftCount: "0"
maxAddCount: "2"
maxCount: "3"
      */
      this.setState({
        isLotteryCountFetched: true,
        lotteryCount,
      })
    })
/*
    simpleDraw.updateLotteryCount({actId: 23455}).then((res)=>{
      console.log('updateLotteryCount', res)  
    },(err)=>{
      console.log('updateLotteryCount', err)  
    })
  */  
   
    simpleDraw.draw({actId: simpleDrawId}).then((res)=>{
      console.log('simpleDraw.draw', res,debug)  
      debug && this.showToast("抽奖成功"+ ((JSON.stringify(res))),60000 ) 
     
    },(err)=>{
      console.log('sync inventory error', err,debug)   
      //{"code":"OUT_OF_MAX_COUNT","message":"次数达到上限…_OF_MAX_COUNT::次数达到上限！"],"v":"1.0","retType":-1}}
      this.showToast(err.message || "系统开小差了"+ ((debug&&JSON.stringify(err))||'') ,30000)  
      
    })
    
  }
  
  shopFollow(sellerId){
    shop.hasFollowed(sellerId).then((isFollowed) => {
      console.log('hasFollowed '+isFollowed)  
    },(err)=>{
      console.log('sync inventory error', err)   
      this.showToast("系统开小差了"+ ((debug&&JSON.stringify(err))||'') )  
    })
  }


  checkUser(cb) {
    auth.isLogin().then(user => {

      if (user) {
        console.log('L19 login')
        this.setState({
          user,
        })    
        cb && cb()
        console.log('L19 login end')
        
      }else {
        console.log('checkUser not login' )
        auth.login().then(({ errorCode, errorMessage }) => {
          console.log('auth.login',errorCode,errorMessage)
          //this.checkUser()
        })
      }
    },(err)=>{
      console.log('checkUser err',err)
      setTimeout(()=>{
        auth.login().then(({ errorCode, errorMessage }) => {
          console.log('auth.login',errorCode,errorMessage)
          //this.checkUser()
        })
      },1000)
      
    })
  }

  componentDidMount () {   
    console.log('componentDidMount', navigation.getUrlParams(),data)
    this.input.oncomputed = (input) => {
      this.realInput = input
    }
    this.codeInput.oncomputed = (input) => {
      this.realCodeInput = input
    }
     //activityId,bizScenario
     let {activityId,actId,bizScenario,userId,simpleDrawId,simpleDrawAdd,sharer,inviterId,debug} = navigation.getUrlParams() || {}
     activityId = activityId || actId
     sharer = sharer || inviterId
     this.setState({activityId,bizScenario,userId,sharer})
     let act =null
     if(activityId){
      //console.log(JSON.stringify(activity))
      for(let i=0;i<activity.length;i++){
        if(activity[i].activityId===activityId){
         act = activity[i]
        }
      }
      //let act =  activity.filter((t)=>(t.activityId===activityId))
     
     }
     console.log('act',act)
     //this.shopFollow('1917047079')
     let {sellerId,ruleList,attentionList,time,condition,resultUrl,callbackUrl,bgImage} = act || {}
     if(resultUrl && resultUrl.indexOf("https://")==-1){
       resultUrl = 'https://'+'money.allcitygo.com'+resultUrl
     }
     if(callbackUrl && callbackUrl.indexOf("https://")==-1){
       callbackUrl = 'https://'+'operation.allcitygo.com'+callbackUrl
     }
    // sellerId = '92686194'
     this.setState({sellerId,ruleList,attentionList,time,condition,resultUrl,callbackUrl,bgImage,debug},()=>{
      
     })
    this.showLoading("加载中")
      
      this.checkUser(()=>{
         //////////////////      
   
    if(!sellerId && !simpleDrawId){
      this.showToast("没有这个活动")
    }
  
    if(false){
      this.checkUserStatus((res)=>{
        console.log(res)  
        let callbackurl = res.data.value.memberCenterUrl; 
        navigation.pushWindow(callbackurl);
      })
    }

  
   if(sellerId) {
      //let {sellerId} = this.state
      mtop('mtop.taobao.seattle.memberinfo.get', {sellerId}, { needSignIn: true }).then((result) => {
        console.log(result)  
          this.hideLoading()
        let data = result && result.data && result.data.result &&  result.data.result
        if(data){
        let isMember =data.isMember=='true'
        let buyerNick =data.buyerNick
        let cardCover =data.cardCover
        let mobile =data.mobile
        //buyerNick: "louis林新华"
        //cardCover: "//img.alicdn.com/imgextra/i2/0/TB25DpSor5YBuNjSspoXXbeNFXa_!!0-crm.jpg"
         if(isMember){
          this.setState({
            ready:true,
            joinDisplay: !isMember,
            buyerNick:buyerNick,
            cardCover:cardCover,
            mobile:mobile,
            textMessage:"已经是会员了"
          });
          this.showToast("已经是会员了") 
             //?code=ERROR&actId=1234         
          let {resultUrl,activityId} = this.state
          let navigationUrl = `${resultUrl}?code=FAIL&actId=${activityId}&message=已经是会员了`
          navigation.pushWindow(navigationUrl)//'https://money.allcitygo.com/cookerKing/index.html#/?bizScenario=xxxx')//http://sit-operation.allcitygo.com/tmall/index.html')
          //window.location.href='https://money.allcitygo.com/cookerKing/index.html#/?bizScenario=xxxx'
        }else {
          this.realInput.value = mobile
        this.setState({
          ready:true,
          textMessage:"加入会员有礼",
          buyerNick:buyerNick,
          cardCover:cardCover,
          mobile:mobile,
          joinDisplay: !isMember
        });        
      }}else {
        this.showToast("系统开小差了，请稍候重试") 
      }
      
      }, (err)=> {
        console.log('sync inventory error', err)  
        let {res,message} = err || {}
        let msg = (res.data && res.data.errorMsg) ||message ||"系统开小差了，请稍候重试"
        this.showToast(msg)
          this.hideLoading()
    })
  }else {
    if(simpleDrawId){
      if(simpleDrawAdd==1) {
        simpleDraw.updateLotteryCount({actId: simpleDrawId}).then((res)=>{
          console.log('updateLotteryCount', res)  
          this.showToast('增加奖励次数成功')
          this.simpleDraw(simpleDrawId)
        },(err)=>{
          this.showToast('增加奖励次数失败')
          console.log('updateLotteryCount', err)  
        })      
      }else {
      this.simpleDraw(simpleDrawId)
      }
    }
    
      this.hideLoading()
      /* this.setState({
      ready:true,
      mobile:1111,
      textMessage:"加入会员有礼",    
      joinDisplay: true
    });      */  
  }
  //////////////////
   })
  }

 

  render () {
    return (
      <div class ="content">     
        
        <div class="bt-rule"   style={{display: this.state.ready? 'flex': 'none'}} onClick={this.onRulePressed.bind(this)} ><div class="text">{this.state.ruleShow?'返回':'规则'}</div></div>
        <div class="act-bg">
        <img  src={this.state.bgImage} />       
        </div>
        <div class="act-box"   style={{display: this.state.ready ? '': 'none'}}>
          <div class="msg">你同意将以下个人信息授权给商家使用，并接受专属客服发送的信息 </div>
        <div class="mobile-box"  style={{display: this.state.joinDisplay? '': 'none'}}>
          <div class="title-text">手机</div>
          <div class="title-text2" style={{display: this.state.inputEnable? 'none': ''}}>{this.state.mobile}</div>
          <input   style={{display: this.state.inputEnable? '': 'none'}}
          ref={input => {this.input = input}} 
          placeholder="请输入手机号" type='text'  
          class="input" 
          value={this.state.mobile} 
          onChange={this.onChange.bind(this)} />          
          <div class="right"  style={{display: this.state.inputEnable? 'none': ''}} onClick={this.onMobileEditPressed.bind(this)}>
            <img  src="//gw.alicdn.com/tfs/TB17koUcgoQMeJjy1XaXXcSsFXa-32-34.png_110x10000.jpg" style="display: flex; width: 17.4507px; height: 17.4507px;"/>
          </div> 
          <div class="right2" style={{display: this.state.inputEnable? '': 'none'}} onClick={this.onSendSmsPressed.bind(this)}>
          <span  class="getcode"  >发送验证码</span>
          </div>
        </div>
        <div>  
        </div>

        <div class="mobile-smscode-box"
         style={{display: this.state.inputEnable && this.state.joinDisplay? '': 'none'}}>
          <div class="title-text" >验证码</div>
          <input  ref={input => {this.codeInput = input}}  placeholder="请输入验证码" maxlength="6"  class="input"/>
        </div>

        <div  class="join-button"  style={{display: this.state.joinDisplay? '': 'none'}}>
          <div class="text" onClick={this.onJoinPressed.bind(this)}>一键入会领红包</div>
        </div>
      </div>

      <Rule 
        ruleShow={this.state.ruleShow}
        ruleList = {this.state.ruleList} 
        attentionList= {this.state.attentionList}
        time = {this.state.time}
        condition = {this.state.condition}
        />  
        <Toast content={this.state.toast}/>
        <Loading content={this.state.loading}/>
      </div>
        
    )
  }
  onMobileEditPressed(e){
    e.preventDefault()
    this.setState({
      inputEnable: !this.state.inputEnable,
    })
  }
  onChange(e){
    console.log('L36',this.realInput.value)
    this.setState({
      imputMobile: this.realInput.value,
    })
  }
/*   onCodeJoinPressed (e) {
    e.preventDefault()
    mtop('mtop.taobao.seattle.member.bind', {
      sellerId,mobile: this.realInput.value,code: this.realCodeInput.value,
    //  pageExtraInfo:"{}",
    //  extraInfo:"{\"source\":\"FromTmax\"}"
    }, { needSignIn: true , v: '2.0',}).then((result) => {
      console.log(result)  
      this.showToast("入会成功")
    }, (err)=> {
      console.log('sync inventory error', err)    
      this.showToast("系统开小差了，请稍候重试")
  })
  }
 */

  onSendSmsPressed (e) {
    e.preventDefault()
    console.log("onSendSmsPressed",this.realInput.value) 
    let {sellerId} = this.state
    mtop('mtop.taobao.seattle.member.smscode.get', {sellerId,mobile: this.realInput.value}, { needSignIn: true }).then((result) => {
      console.log(result) 
      this.showToast("短信获取成功")
    }, (err)=> {
      console.log('sync inventory error', err)  
      let {res,message} = err || {}
      let msg = (res.data && res.data.errorMsg) ||message ||"系统开小差了，请稍候重试"
      this.showToast(msg)

      //this.showToast("系统开小差了，请稍候重试")  
  })
  }

  onJoinPressed (e) {
    e.preventDefault()
    //navigation.pushWindow('http://sit-operation.allcitygo.com/oper-act-tmall/tmallActivity/sendTmallVoucher?activityId=111&bizScenario=111&userId=111')
    //return
    let mobile = this.realInput.value || null
    let code = this.realCodeInput.value || null
    if( this.state.inputEnable){
      if(mobile==null|| mobile==='' || code==null || code==='')
     { console.log("onJoinPressed null") 
     this.showToast("请输入手机号") 
      return
    }
    }else {
      mobile = null
      code = null
    }
    console.log("onJoinPressed",mobile,code) 
     this.showLoading("请稍等")
    let {sellerId} = this.state    
    mtop('mtop.taobao.seattle.member.bind', {
      sellerId,mobile:mobile,code:code,
    //  pageExtraInfo:"{}",
    //  extraInfo:"{\"source\":\"FromTmax\"}"
    }, { needSignIn: true , v: '2.0',}).then((result) => {
      console.log(result)  
        this.hideLoading()
      if(result.data.errorCode==='0'){
        this.setState({
          textMessage:"入会成功",        
          joinDisplay:false
        });
        this.showToast("入会成功")
        goldlog.record('member.bind', 'CLK', `sellerId=${sellerId}`)   
        let {callbackUrl,activityId,bizScenario,userId,sharer} = this.state
        let navigationUrl = `${callbackUrl}?bizScenario=${bizScenario}&activityId=${activityId}&userId=${userId}`
        sharer && (navigationUrl= navigationUrl+"&sharer="+sharer)
        console.log("入会成功 pushWindow",navigationUrl)
        navigation.pushWindow(navigationUrl)
      }else {
        this.showToast("入会失败") 
      }
    }, (err)=> {
        this.hideLoading()
      let {res,message} = err || {}
      let msg = (res.data && res.data.errorMsg) ||message ||"系统开小差了，请稍候重试"
      this.showToast(msg)

      /**
       * :
code: "UNKNOWN_FAIL_CODE"
message: "系统开小差了，请稍候重试"
res:
api: "mtop.taobao.seattle.member.bind"
data: {errorCode: "502", errorMsg: "无法获取手机号码", total: "0"}
ret: {0: "UNKNOWN_FAIL_CODE::系统开小差了，请稍候重试", length: 1}
retType: -1
v: "2.0"

       */
      console.log('member.bind error', err)    
  })

  }

}

React.render(<App />, box)