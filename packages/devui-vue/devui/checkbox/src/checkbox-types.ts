import { PropType, InjectionKey, Ref, ExtractPropTypes, ComputedRef } from 'vue';

type Direction = 'row' | 'column';
type Size = 'lg' | 'md' | 'sm' | 'xs';

const commonProps = {
  name: {
    type: String,
    default: undefined,
  },
  halfChecked: {
    type: Boolean,
    default: false,
  },
  isShowTitle: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
  },
  color: {
    type: String,
    default: undefined,
  },
  showAnimation: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  beforeChange: {
    type: Function as PropType<(isChecked: boolean, v: string) => boolean | Promise<boolean>>,
    default: undefined,
  },
  size: {
    type: String as PropType<Size>,
    default: 'md',
  },
} as const;

export const checkboxProps = {
  ...commonProps,
  checked: {
    type: Boolean,
    default: false,
  },
  value: {
    type: String,
  },
  label: {
    type: String,
    default: undefined,
  },
  'onUpdate:checked': {
    type: Function as PropType<(v: boolean) => void>,
    default: undefined,
  },
  onChange: {
    type: Function as PropType<(v: boolean) => void>,
    default: undefined,
  },
  modelValue: {
    type: Boolean,
  },
  'onUpdate:modelValue': {
    type: Function as PropType<(v: boolean) => void>,
  },
  border: {
    type: Boolean,
    default: false,
  },
} as const;

export type CheckboxProps = ExtractPropTypes<typeof checkboxProps>;

export const checkboxGroupProps = {
  ...commonProps,
  modelValue: {
    type: Array as PropType<string[]>,
    required: true,
  },
  direction: {
    type: String as PropType<Direction>,
    default: 'column',
  },
  itemWidth: {
    type: Number,
    default: undefined,
  },
  options: {
    type: Array as PropType<({ value: string } & Partial<CheckboxProps>)[]>,
    default: () => [],
  },
  onChange: {
    type: Function as PropType<(v: string[]) => void>,
    default: undefined,
  },
  'onUpdate:modelValue': {
    type: Function as PropType<(v: string[]) => void>,
    default: undefined,
  },
  border: {
    type: Boolean,
    default: false,
  },
  max: {
    type: Number,
    default: undefined,
  },
} as const;

export type CheckboxGroupProps = ExtractPropTypes<typeof checkboxGroupProps>;

interface checkboxGroupInjection {
  disabled: Ref<boolean>;
  isShowTitle: Ref<boolean>;
  color: Ref<string | undefined>;
  showAnimation: Ref<boolean>;
  beforeChange: undefined | ((isChecked: boolean, v: string) => boolean | Promise<boolean>);
  toggleGroupVal: (v: string | undefined) => void;
  isItemChecked: (v: string | undefined) => boolean;
  itemWidth: Ref<number | undefined>;
  direction: Ref<Direction>;
  size: Ref<string>;
  border: Ref<boolean>;
  max: Ref<number | undefined>;
  modelValue: Ref<string[]>;
}

export const checkboxGroupInjectionKey: InjectionKey<checkboxGroupInjection> = Symbol('d-checkbox-group');

export type UseCheckboxFn = {
  mergedChecked: ComputedRef<boolean | 0 | undefined>;
  mergedDisabled: ComputedRef<boolean | 0 | undefined>;
  mergedIsShowTitle: ComputedRef<boolean | undefined>;
  mergedShowAnimation: ComputedRef<boolean>;
  mergedColor: ComputedRef<string | undefined>;
  itemWidth: number | undefined;
  direction: string | undefined;
  size: ComputedRef<string>;
  border: ComputedRef<boolean>;
  handleClick: () => void;
};

export interface GroupDefaultOpt {
  checked: boolean;
  isShowTitle: boolean;
  halfChecked: boolean;
  showAnimation: boolean;
  disabled: boolean;
}
export type UseCheckboxGroupFn = {
  defaultOpt: GroupDefaultOpt;
};
