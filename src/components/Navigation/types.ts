import { FaHome, FaTh, FaGhost, FaBars } from 'react-icons/fa';
import type { IconType } from 'react-icons';

export type NavListKeys = 'home' | 'searchChar' | 'personal' | 'more';

interface NavItem {
  title: string;
  icon: IconType;
  key: NavListKeys;
}

export const NavList: NavItem[] = [
  {
    title: '首页',
    icon: FaHome,
    key: 'home'
  },
  {
    title: '集字',
    icon: FaTh,
    key: 'searchChar'
  },
  {
    title: '我的',
    icon: FaGhost,
    key: 'personal'
  },
  {
    title: '更多',
    icon: FaBars,
    key: 'more'
  }
];
