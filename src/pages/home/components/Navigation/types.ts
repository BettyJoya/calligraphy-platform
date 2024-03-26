import { IconType } from 'react-icons';
import { FaMap, FaFeatherAlt, FaFortAwesome, FaGhost } from 'react-icons/fa';

type navKey = 'copyBook' | 'writing' | 'community' | 'personal';

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
