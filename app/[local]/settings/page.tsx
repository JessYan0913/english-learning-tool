'use client';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'zh-CN',
    autoPlay: true,
    showHints: true,
    difficulty: 'beginner',
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light mb-4">设置</h1>
          <p className="text-xl text-muted-foreground">个性化你的学习体验</p>
        </div>

        <div className="space-y-8">
          <Card className="bg-transparent">
            <CardHeader>
              <CardTitle className="text-2xl">外观</CardTitle>
              <CardDescription>自定义应用的外观和感觉</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme" className="text-base">
                  主题
                </Label>
                <Select value={settings.theme} onValueChange={(value) => handleSettingChange('theme', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="选择主题" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">浅色</SelectItem>
                    <SelectItem value="dark">深色</SelectItem>
                    <SelectItem value="auto">跟随系统</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language" className="text-base">
                  语言
                </Label>
                <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="选择语言" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zh-CN">简体中文</SelectItem>
                    <SelectItem value="en-US">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-transparent">
            <CardHeader>
              <CardTitle className="text-2xl">学习</CardTitle>
              <CardDescription>调整学习相关的设置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="difficulty" className="text-base">
                  难度级别
                </Label>
                <Select value={settings.difficulty} onValueChange={(value) => handleSettingChange('difficulty', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="选择难度" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">初级</SelectItem>
                    <SelectItem value="intermediate">中级</SelectItem>
                    <SelectItem value="advanced">高级</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="autoPlay" className="text-base">
                  自动播放发音
                </Label>
                <Switch
                  id="autoPlay"
                  checked={settings.autoPlay}
                  onCheckedChange={(checked) => handleSettingChange('autoPlay', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showHints" className="text-base">
                  显示快捷键提示
                </Label>
                <Switch
                  id="showHints"
                  checked={settings.showHints}
                  onCheckedChange={(checked) => handleSettingChange('showHints', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-transparent">
            <CardHeader>
              <CardTitle className="text-2xl">数据</CardTitle>
              <CardDescription>管理你的学习数据</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 bg-transparent">
                  导出数据
                </Button>
                <Button variant="destructive" className="flex-1">
                  清除数据
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
