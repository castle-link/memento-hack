import { ArgTypes } from '@storybook/api';
import { StackeeProps } from './stackee.proptypes';

const table = {
  category: 'Stackee',
};

export const StackeeArgTypes: Record<keyof StackeeProps, ArgTypes> = {
  grow: { table },
  shrink: { table },
  basis: { table },
};
