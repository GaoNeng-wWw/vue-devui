import { defineComponent } from 'vue';
import { Icon } from '../../../icon';
import { Tag } from '../../../tag';
import { Popover } from '../../../popover';
import { useNamespace } from '../../../shared/hooks/use-namespace';
import useSelectContent from '../composables/use-select-content';
import { selectContentProps, SelectContentProps, OptionObjectItem } from '../select-types';
export default defineComponent({
  name: 'SelectContent',
  props: selectContentProps,
  setup(props: SelectContentProps) {
    const ns = useNamespace('select');
    const clearCls = ns.e('clear');
    const arrowCls = ns.e('arrow');
    const multipleCls = ns.e('multiple');
    const multipleInputCls = ns.em('multiple', 'input');
    const {
      searchQuery,
      selectedData,
      isSelectDisable,
      isSupportCollapseTags,
      isSupportTagsTooltip,
      isDisabledTooltip,
      selectionCls,
      inputCls,
      placeholder,
      isMultiple,
      handleClear,
      tagDelete
    } = useSelectContent(props);

    return () => {
      return (
        <div class={selectionCls.value}>
          {isMultiple.value ? <div class={multipleCls}>
            {
              !isSupportCollapseTags.value &&
              selectedData.value.length >= 1 &&
              selectedData.value.map((item: OptionObjectItem) =>
                <Tag deletable onTagDelete={(e: MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  tagDelete(item);
                }} key={item.value}>
                  {item.name}
                </Tag>
              )
            }
            {
              isSupportCollapseTags.value &&
              selectedData.value.length >= 1 &&
              (<Tag deletable onTagDelete={(e: MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                tagDelete(selectedData.value[0]);
              }}>
                {selectedData.value[0].name}
              </Tag>)
            }
            {
              isSupportCollapseTags.value &&
              !isSupportTagsTooltip.value &&
              selectedData.value.length > 1 &&
              <Tag>{`+${selectedData.value.length -1}`}</Tag>
            }
            {
              isSupportCollapseTags.value &&
              isSupportTagsTooltip.value &&
              selectedData.value.length > 1 &&
              (<Popover trigger="hover" v-slots={{
                default: () => <Tag>{`+${selectedData.value.length -1}`}</Tag>,
                content: () => <div>
                  {
                    selectedData.value.map((item: OptionObjectItem) =>
                      <Tag deletable onTagDelete={(e: MouseEvent) => {
                        e.preventDefault();
                        e.stopPropagation();
                        tagDelete(item);
                      }} key={item.value}>
                        {item.name}
                      </Tag>
                    )
                  }
                </div>
              }}>
              </Popover>)
            }
            <div class={multipleInputCls}>
              <input
                value={searchQuery.value}
                type="text"
                class={inputCls.value}
                placeholder={placeholder.value}
                readonly
                disabled={isSelectDisable.value}
              />
            </div>
          </div> :
            <input
              value={props.value}
              type="text"
              class={inputCls.value}
              placeholder={placeholder.value}
              readonly
              disabled={isSelectDisable.value}
            />}
          <span onClick={handleClear} class={clearCls}>
            <Icon name="close" />
          </span>
          <span class={arrowCls}>
            <Icon name="select-arrow" />
          </span>
        </div>
      );
    };
  },
});
