/**
 * Created by linGo on 2018/3/12.
 */

function getNewId(article){
  return new Promise( (resolve, reject) => {
    if(article === 2){
      resolve(123)
    }else{
      reject(111)
    }
  })
}

function getArray(articles) {
  return Promise.all( articles.map ((article)=>{
    return getNewId(article).then(newId=>newId, ()=>{console.log(11)})
  }))
}
getArray([1,2,3]).then( array => {
 array = array.filter( (gg) =>  typeof(gg)!='undefined')
  console.log(array)
})