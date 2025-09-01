"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, Home, BarChart3, Settings, Info, LogIn, UserPlus, Sun, Moon, Monitor } from "lucide-react"

export default function GlobalMenu() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const menuItems = [
    { href: "/", label: "学习首页", icon: Home, shortcut: "Ctrl+H" },
    { href: "/stats", label: "学习统计", icon: BarChart3, shortcut: "Ctrl+S" },
    { href: "/settings", label: "设置", icon: Settings, shortcut: "Ctrl+," },
    { href: "/about", label: "关于", icon: Info, shortcut: "Ctrl+I" },
  ]

  const accountItems = [
    { href: "/login", label: "登录", icon: LogIn },
    { href: "/register", label: "注册", icon: UserPlus },
  ]

  return (
    <div className="fixed top-6 left-6 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-md flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all duration-200 shadow-sm"
            aria-label="菜单"
          >
            <Menu className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50 rounded-lg shadow-xl"
          align="start"
          sideOffset={8}
        >
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <DropdownMenuItem key={item.href} asChild>
                <Link
                  href={item.href}
                  className="flex items-center justify-between px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-700/70 rounded-md transition-all duration-150 group cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.shortcut}
                  </span>
                </Link>
              </DropdownMenuItem>
            )
          })}

          <DropdownMenuSeparator className="border-gray-200/60 dark:border-gray-700/60 my-3" />

          <DropdownMenuLabel className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">
            账户管理
          </DropdownMenuLabel>

          {accountItems.map((item) => {
            const IconComponent = item.icon
            return (
              <DropdownMenuItem key={item.href} asChild>
                <Link
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-gray-700/70 rounded-md transition-all duration-150 ml-1 cursor-pointer"
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              </DropdownMenuItem>
            )
          })}

          <DropdownMenuSeparator className="border-gray-200/60 dark:border-gray-700/60 mt-3" />

          <DropdownMenuLabel className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">
            主题
          </DropdownMenuLabel>

          {mounted && (
            <div className="flex items-center justify-center space-x-1 px-3 py-2">
              <button
                onClick={() => setTheme("light")}
                className={`w-8 h-8 border rounded flex items-center justify-center transition-colors ${
                  theme === "light"
                    ? "bg-blue-500 border-blue-600 text-white"
                    : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                }`}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`w-8 h-8 border rounded flex items-center justify-center transition-colors ${
                  theme === "dark"
                    ? "bg-blue-500 border-blue-600 text-white"
                    : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                }`}
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`w-8 h-8 border rounded flex items-center justify-center transition-colors ${
                  theme === "system"
                    ? "bg-blue-500 border-blue-600 text-white"
                    : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
