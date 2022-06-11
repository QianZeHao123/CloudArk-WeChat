// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database().collection('user')


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return await db
  .where(
       {
        openid : event.openid,
      }
  )
  .update({
    data:{
     userphoto:event.photo
 
    }
  })
}