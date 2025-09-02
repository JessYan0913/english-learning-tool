'use client';
import { useEffect, useState } from 'react';

import { BarChart3, Home, Info, LogIn, Menu, Monitor, Moon, Settings, Sun, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function GlobalMenu() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    { href: '/', label: '学习首页', icon: Home, shortcut: 'Ctrl+H' },
    { href: '/stats', label: '学习统计', icon: BarChart3, shortcut: 'Ctrl+S' },
    { href: '/settings', label: '设置', icon: Settings, shortcut: 'Ctrl+,' },
    { href: '/about', label: '关于', icon: Info, shortcut: 'Ctrl+I' },
  ];

  const accountItems = [
    { href: '/login', label: '登录', icon: LogIn },
    { href: '/register', label: '注册', icon: UserPlus },
  ];

  // 主菜单项渲染
  const renderMenuItems = () => (
    <>
      {menuItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <DropdownMenuItem key={item.href} asChild>
            <Link
              href={item.href}
              className="flex items-center justify-between px-3 py-2.5 text-foreground hover:bg-accent/70 rounded-md transition-all duration-150 group cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                {item.shortcut}
              </span>
            </Link>
          </DropdownMenuItem>
        );
      })}
    </>
  );

  // 账户菜单项渲染
  const renderAccountItems = () => (
    <>
      {accountItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <DropdownMenuItem key={item.href} asChild>
            <Link
              href={item.href}
              className="flex items-center justify-between px-3 py-2.5 text-foreground hover:bg-accent/70 rounded-md transition-all duration-150 group cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            </Link>
          </DropdownMenuItem>
        );
      })}
    </>
  );

  // 主题切换渲染
  const renderThemeToggle = () => (
    <div className="flex items-center justify-center space-x-1 px-3 py-2">
      <button
        onClick={() => setTheme('light')}
        className={`w-8 h-8 border rounded flex items-center justify-center transition-colors ${
          theme === 'light'
            ? 'bg-primary border-primary text-primary-foreground'
            : 'bg-background border-input hover:bg-accent'
        }`}
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`w-8 h-8 border rounded flex items-center justify-center transition-colors ${
          theme === 'dark'
            ? 'bg-primary border-primary text-primary-foreground'
            : 'bg-background border-input hover:bg-accent'
        }`}
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`w-8 h-8 border rounded flex items-center justify-center transition-colors ${
          theme === 'system'
            ? 'bg-primary border-primary text-primary-foreground'
            : 'bg-background border-input hover:bg-accent'
        }`}
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="fixed top-6 left-6 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="w-10 h-10 bg-background/90 backdrop-blur-md border border-border rounded-md flex items-center justify-center hover:bg-background hover:shadow-md transition-all duration-200 shadow-sm"
            aria-label="菜单"
          >
            <Menu className="w-4 h-4 text-foreground" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-64 bg-background/95 backdrop-blur-md border-border rounded-lg shadow-xl"
          align="start"
          sideOffset={8}
        >
          {renderMenuItems()}
          <DropdownMenuSeparator className="border-gray-200/60 dark:border-gray-700/60 my-3" />
          {renderAccountItems()}
          <DropdownMenuSeparator className="border-gray-200/60 dark:border-gray-700/60 mt-3" />
          {mounted && renderThemeToggle()}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
