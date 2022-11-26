import api from './api'

export const getLevelList = (query)=>{
    return api.get("/categories", { params: query })
        
}
export const updateCateById = (id,cateName)=>{
    return api.put(`/categories/${id}`, {cat_name: cateName})
        
}
export const deleteCateById = (id)=>{
    return api.delete(`/categories/${id}`)
        
}
//attributes
export const getAttrList =(id, sel)=>{
    return api.get(`/categories/${id}/attributes`,{params:{sel}})
}
export const addAttr =(id, data)=>{
    return api.post(`/categories/${id}/attributes`, data)
}
export const editAttr = (attrId, id, data)=>{
    return api.put(`/categories/${id}/attributes/${attrId}`, data)
}
export const deleteAttr = (attrId, id)=>{
    return api.delete(`/categories/${attrId}/attributes/${id}`)
}
