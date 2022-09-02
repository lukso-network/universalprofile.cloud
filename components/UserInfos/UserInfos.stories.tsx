import { Meta, ComponentStory } from '@storybook/react';

import { LSP3Profile } from '../../interfaces/lsps';
import UserInfos from './UserInfos';

const lsp3Json: LSP3Profile = {
  LSP3Profile: {
    name: 'Alice',
    description: 'Hello this is my description',
    links: [{ title: 'LUKSO', url: 'https://lukso.network/' }],
    tags: ['foot', 'bayern'],
    profileImage: [],
    backgroundImage: [],
  },
};

export default {
  title: 'Input/UserInfos',
  component: UserInfos,
  argTypes: {
    address: {
      defaultValue: '0xA8285FE8877F25dD0A9c8a7f03c0cbA5C88dF57A',
      control: { type: 'text' },
    },
    lsp3JSON: {
      defaultValue: lsp3Json,
      control: {
        type: 'object',
      },
    },
  },
} as Meta;

const Template: ComponentStory<typeof UserInfos> = (args) => (
  <UserInfos {...args} />
);

export const UserInfosStory = Template.bind({});
