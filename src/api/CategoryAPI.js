import Axios from "@/utils/Axios";

const CategoryAPI = {
  // 获取单条记录
  getById(id) {
    return Axios.get(`/api/category/getById?id=${id}`);
  },

  // 获取列表
  getListByParentId(parent_id) {
    return Axios.get(`/api/category/getListByParentId?parent_id=${parent_id}`);
  },

  // 获取全部列表
  getAllById(id) {
    return Axios.get(`/api/category/list?id=${id}`);
  },

  // 添加
  add(data) {
    return Axios.post("/api/category/add", data);
  },

  // 编辑
  edit(data) {
    return Axios.post("/api/category/edit", data);
  },

  // 删除
  del(id) {
    return Axios.post("/api/category/del", { id: id });
  },
};

export default CategoryAPI;
