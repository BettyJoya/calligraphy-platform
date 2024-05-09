import { IconType } from 'react-icons';
import { FaMap, FaFeatherAlt, FaFortAwesome, FaGhost, FaGripHorizontal } from 'react-icons/fa';

type navKey = 'copyBook' | 'writing' | 'collecting' | 'community' | 'personal';

interface navItem {
  key: navKey;
  title: string;
  icon: IconType;
}

export const navList: navItem[] = [
  {
    key: 'copyBook',
    title: '字帖',
    icon: FaMap
  },
  {
    key: 'writing',
    title: '临摹',
    icon: FaFeatherAlt
  },
  {
    key: 'collecting',
    title: '集字',
    icon: FaGripHorizontal
  },
  {
    key: 'community',
    title: '社区',
    icon: FaFortAwesome
  },
  {
    key: 'personal',
    title: '我的',
    icon: FaGhost
  }
];
