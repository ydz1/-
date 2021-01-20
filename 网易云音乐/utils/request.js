import config from '../utils/config'
export default (url,data={},method='GET') => {
    let promise = new Promise((resolve, reject) => {
        wx.request({
            url: config.outhost + url,
            data,
            method,
            header:{
                'cookie':wx.getStorageSync('cookie') ? wx.getStorageSync('cookie').find(item => item.indexOf('MUSIC_U')!== -1) : ''
            },
            success:(res)=>{
                if(data.isLogin){//是登陆请求，将登录的cookies存到storage中
                    wx.setStorageSync('cookie', res.cookies);
                }
                resolve(res.data)
            },
            error:(err)=>{
                reject(err)
            }
        })
    })
    return promise
}