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
