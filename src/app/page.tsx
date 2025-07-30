export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            生日礼物送什么？ 🎁
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            通过AI智能分析，为你推荐最贴心的生日礼物
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-center space-x-8 mb-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🎂</div>
              <p className="text-sm text-gray-600">智能问卷</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🤖</div>
              <p className="text-sm text-gray-600">AI分析</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎉</div>
              <p className="text-sm text-gray-600">精准推荐</p>
            </div>
          </div>

          <p className="text-gray-700 mb-6">
            只需几分钟，告诉我们收礼人的基本信息和兴趣爱好，
            我们的AI助手就能为你推荐3个贴心的礼物选择，
            还会生成专属的生日祝福语！
          </p>

          <a
            href="/questionnaire"
            className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105"
          >
            开始选择礼物 ✨
          </a>
        </div>

        <p className="text-gray-500 text-sm">
          解决你的&ldquo;送礼焦虑&rdquo;，让每一份礼物都充满心意
        </p>
      </div>
    </div>
  );
}