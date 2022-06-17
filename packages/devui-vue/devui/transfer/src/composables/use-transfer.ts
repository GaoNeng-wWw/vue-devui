import { ref, computed, watch, onMounted } from 'vue';
import type { SetupContext } from 'vue';
import { TTransferProps, IItem, TKey, IDargItemAndDropItem } from '../transfer-types';

export const transferState = (props: TTransferProps, ctx: SetupContext) => {
  const sourceTitle = computed(() => props.titles[0]);
  const targetTitle = computed(() => props.titles[1]);
  const sourceChecked = ref<IItem[]>([]);
  const targetChecked = ref<IItem[]>([]);
  const sourceData = ref<IItem[]>([]);
  const targetData = ref<IItem[]>([]);
  const sourceDirection = ref('source');
  const targetDirection = ref('target');
  const sourceDisabled = computed(() => {
    return targetChecked.value.length === 0;
  });
  const targetDisabled = computed(() => {
    return sourceChecked.value.length === 0;
  });

  /**
   * getTransferData: 处理穿梭框数据
   */
  const getTransferData = () => {
    return {
      data: (() => {
        if (props.data && typeof props.sourceSortMethods === 'function') {
          return props.sourceSortMethods(props.data) ?? [];
        }
        return props.data;
      })(),
    };
  };
  /**
   * updateSourceAllCheckedHandle: 更新源穿梭框全选
   * @param value 是否全选
   */
  const updateSourceAllCheckedHandle = (value: IItem[]) => {
    sourceChecked.value = value;
  };
  /**
   * updateTargetAllCheckedHandle: 更新目标穿梭框全选
   * @param value 是否全选
   */
  const updateTargetAllCheckedHandle = (value: IItem[]) => {
    targetChecked.value = value;
  };
  /**
   * updateSourceCheckedHandle: 更新源选中值
   * @param value 是否可用
   */
  const updateSourceCheckedHandle = (value: IItem[]) => {
    sourceChecked.value = value;
  };
  /**
   * updateTargetCheckedHandle: 更新目标选中值
   * @param value 是否可用
   */
  const updateTargetCheckedHandle = (value: IItem[]) => {
    targetChecked.value = value;
  };
  const updateModelValue = () => {
    const targetValues = targetData.value.map((item) => {
      return item.value;
    });
    ctx.emit('update:modelValue', targetValues);
  };
  /**
   * toMoveTargetHandle: 源选中穿梭到目标
   */
  const toMoveTargetHandle = () => {
    const notIncluded: IItem[] = [];
    const checkedValues: TKey[] = [];
    sourceChecked.value.forEach((item) => {
      checkedValues.push(item.value);
    });
    sourceData.value = sourceData.value.filter((item) => {
      if (!checkedValues.includes(item.value)) {
        return true;
      }
      notIncluded.push(item);
      return false;
    });
    sourceChecked.value = [];
    targetData.value = targetData.value.concat(notIncluded);
  };
  /**
   * toMoveSourceHandle: 目标选中穿梭到源
   */
  const toMoveSourceHandle = () => {
    const notIncluded: IItem[] = [];
    const checkedValues: TKey[] = [];
    targetChecked.value.forEach((item) => {
      checkedValues.push(item.value);
    });
    targetData.value = targetData.value.filter((item) => {
      if (!checkedValues.includes(item.value)) {
        return true;
      }
      notIncluded.push(item);
      return false;
    });
    targetChecked.value = [];
    sourceData.value = sourceData.value.concat(notIncluded);
  };

  watch(targetData, () => {
    updateModelValue();
  });

  /**
   * getDargItemAndDropItem: 获取拖拽的item及放开的item
   * @param startValue 当前拖拽item的值
   * @param endValue 放开item的值
   * @param direction 穿梭框拖拽方向
   */
  const getDargItemAndDropItem = (startValue: TKey, endValue: TKey, direction: TKey): IDargItemAndDropItem => {
    const dataList: Array<IItem> = direction === 'source' ? sourceData.value : targetData.value;
    let startIndex = -1,
      endIndex = -1;
    let dragItem = null,
      dropItem = null;
    for (let i = 0; i < dataList.length; i++) {
      if (dataList[i].value === startValue) {
        startIndex = i;
        dragItem = dataList[i];
      }
      if (dataList[i].value === endValue) {
        endIndex = i;
        dropItem = dataList[i];
      }
    }
    return {
      startIndex,
      endIndex,
      dragItem: dragItem as IItem,
      dropItem: dropItem as IItem,
    };
  };
  /**
   * updateSourceDataHandle: 更新source数据
   * @param startValue 当前拖拽item的值
   * @param endValue 放开item的值
   */
  const updateSourceDataHandle = (startValue: TKey, endValue: TKey) => {
    const { startIndex, endIndex, dragItem, dropItem } = getDargItemAndDropItem(startValue, endValue, 'source');
    sourceData.value.splice(endIndex, 1, dragItem);
    sourceData.value.splice(startIndex, 1, dropItem);
  };
  /**
   * updateTargetDataHandle: 更新target数据
   * @param startValue 当前拖拽item的值
   * @param endValue 放开item的值
   */
  const updateTargetDataHandle = (startValue: TKey, endValue: TKey) => {
    const { startIndex, endIndex, dragItem, dropItem } = getDargItemAndDropItem(startValue, endValue, 'target');
    targetData.value.splice(endIndex, 1, dragItem);
    targetData.value.splice(startIndex, 1, dropItem);
  };

  onMounted(() => {
    const { data } = getTransferData();
    const sourceValues: IItem[] = [];
    const targetValues: IItem[] = [];
    data.forEach((item) => {
      if (props.sourceDefaultChecked.includes(item.value) && item.disabled === false) {
        sourceValues.push(item);
      }
      if (props.targetDefaultChecked.includes(item.value) && item.disabled === false) {
        targetValues.push(item);
      }
    });
    const sourceOption: IItem[] = [];
    const targetOption: IItem[] = [];
    data.forEach((item: IItem) => {
      if (props.modelValue.includes(item.value)) {
        targetOption.push(item);
      } else {
        sourceOption.push(item);
      }
    });
    sourceData.value = sourceOption;
    targetData.value = targetOption;
    sourceChecked.value = sourceValues;
    targetChecked.value = targetValues;
  });

  return {
    sourceTitle,
    targetTitle,
    sourceData,
    targetData,
    sourceDisabled,
    targetDisabled,
    sourceChecked,
    targetChecked,
    sourceDirection,
    targetDirection,
    updateSourceAllCheckedHandle,
    updateTargetAllCheckedHandle,
    updateSourceCheckedHandle,
    updateTargetCheckedHandle,
    toMoveTargetHandle,
    toMoveSourceHandle,
    updateSourceDataHandle,
    updateTargetDataHandle,
  };
};
