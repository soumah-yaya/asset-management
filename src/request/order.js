import api from '../request/api'

export const getOrderList = (data) =>{
    return api.get('/orders', {params:data})
}
export const getProgress = (id) =>{
    console.log(id)
    return api.get(`/kuaidi/${id}`)
}