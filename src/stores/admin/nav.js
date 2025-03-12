import { reactive } from "vue";
import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import NavAPI from "@/api/NavAPI";

const useNavStore = defineStore("nav", () => {
  const data = reactive({
    id: 0,
    level: 1,
    parentId: 0,
    pageAdd: false,
    pageEdit: false,
  });

  const listData = reactive({
    path: [],
    list: [],
  });

  // 获取列表
  const getList = (parentId) => {
    NavAPI.getListByParentId(parentId)
      .then((result) => {
        if (!result.status) {
          ElMessage.error(result.msg);
          return;
        }

        listData.path = result.data.path;
        listData.list = result.data.list;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // 更新 level 与 parentId
  const update = (path, parentId) => {
    if (path == null) {
      data.level + 1;
    } else {
      data.level = path.length + 1;
    }
    data.parentId = parentId;
  };

  return {
    data,
    listData,
    getList,
    update,
  };
});

export { useNavStore };
