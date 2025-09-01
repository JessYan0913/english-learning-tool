export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-light text-gray-900 mb-6">关于</h1>
          <p className="text-xl text-gray-400">了解我们的英语学习工具</p>
        </div>

        <div className="space-y-16">
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-light text-gray-900">应用介绍</h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              这是一个专为中文用户设计的英语学习工具，采用渐进式学习方法，帮助用户从基础词组开始，
              逐步构建完整的英语句子。通过实时反馈和颜色提示，让学习过程更加直观有效。
            </p>
          </div>

          <div className="text-center space-y-8">
            <h2 className="text-3xl font-light text-gray-900">主要特性</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-xl text-gray-600">渐进式学习</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-xl text-gray-600">实时反馈</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-xl text-gray-600">键盘快捷键</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-xl text-gray-600">学习统计</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-xl text-gray-600">简洁设计</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-xl text-gray-600">专注学习</span>
              </div>
            </div>
          </div>

          <div className="text-center space-y-8">
            <h2 className="text-3xl font-light text-gray-900">快捷键说明</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="space-y-3">
                <div className="text-2xl font-mono text-gray-700">← →</div>
                <div className="text-lg text-gray-500">切换词组</div>
              </div>
              <div className="space-y-3">
                <div className="text-2xl font-mono text-gray-700">Enter</div>
                <div className="text-lg text-gray-500">开始练习/提交</div>
              </div>
              <div className="space-y-3">
                <div className="text-2xl font-mono text-gray-700">Esc</div>
                <div className="text-lg text-gray-500">返回学习</div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-8">
            <h2 className="text-3xl font-light text-gray-900">颜色提示</h2>
            <div className="flex justify-center space-x-12">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                <span className="text-xl text-gray-600">正确</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                <span className="text-xl text-gray-600">部分正确</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                <span className="text-xl text-gray-600">错误</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
