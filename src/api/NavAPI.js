import Axios from "@/utils/Axios";

const NavAPI = {
  // 获取单条记录
  getById(id) {
    return Axios.get(`/api/nav/getById?id=${id}`);
  },

  // 获取列表
  getListByParentId(parent_id) {
    return Axios.get(`/api/nav/getListByParentId?parent_id=${parent_id}`);
  },

  // 获取全部列表
  getAllById(id) {
    return Axios.get(`/api/nav/list?id=${id}`);
  },

  // 获取导航树
  getAll() {
    return Axios.get(`/api/nav/tree`);
  },

  // 添加
  add(data) {
    return Axios.post("/api/nav/add", data);
  },

  // 编辑
  edit(data) {
    return Axios.post("/api/nav/edit", data);
  },

  // 删除
  del(id) {
    return Axios.post("/api/nav/del", { id: id });
  },
};

export default NavAPI;
