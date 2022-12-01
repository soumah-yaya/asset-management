import api from './api'
export function getGoodsList(query){
    return api.get('/goods', {params:query})
}
export function addGoods(data){
    return api.post('/goods', data)
}
export function deleteGoodsById(id){
    console.log(id)
    return api.delete(`/goods/${id}`)
}

export function getAttrList(){
    return api.get('/categories')
}

