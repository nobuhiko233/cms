import Axios from "@/utils/Axios";

const ArticleAPI = {
  // 获取单条记录
  getById(id) {
    return Axios.get(`/api/article/getById?id=${id}`);
  },

  // 获取分页列表
  pageList(page, pageSize) {
    return Axios.get(`/api/article/pageList?page=${page}&pageSize=${pageSize}`);
  },

  // 添加
  add(data) {
    return Axios.post("/api/article/add", data);
  },

  // 编辑
  edit(data) {
    return Axios.post("/api/article/edit", data);
  },

  // 删除
  del(id) {
    return Axios.post("/api/article/del", { id: id });
  },

  // 上传图片
  uploadImg(data) {
    return Axios.postFile("/api/article/uploadImg", data);
  },

  // wangEditor - 上传图片
  editorUploadImg(data) {
    return Axios.postFile("/api/article/wangEditor/uploadImg", data);
  },
};

export default ArticleAPI;
