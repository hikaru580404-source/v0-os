"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

// 質問データ
const QUESTIONS = [
  {"id":1,"phase":"フェーズ1：対人関係とエラー処理","text":"家に帰ると、親が明らかにイライラして不機嫌な空気を漂わせています。あなたのOSはどう作動しますか？","options":[{"key":"A","text":"機嫌を取るため、先回りして手伝いなどを探す"},{"key":"B","text":"自室にこもり、イヤホンをして関わりを完全に絶つ"},{"key":"C","text":"「何か怒ってる？」とストレートに理由を尋ねる"},{"key":"D","text":"とくに気にせず、普段通り自分のペースで過ごす"}]},
  {"id":2,"phase":"フェーズ1：対人関係とエラー処理","text":"仲の良いグループ全員が「このルールおかしいよね」と盛り上がっていますが、自分はそうは思いません。どうしますか？","options":[{"key":"A","text":"場の空気を壊さないよう、周囲に強く同意する"},{"key":"B","text":"黙ってやり過ごし、心の中では違うと思い続ける"},{"key":"C","text":"「自分はこう思うけどね」とストレートに言う"},{"key":"D","text":"別の話題にすり替えるか、その場からそっと離れる"}]},
  {"id":3,"phase":"フェーズ1：対人関係とエラー処理","text":"担任の先生と部活の顧問で、言っている指導方針が真逆で板挟みになりました。どう対応しますか？","options":[{"key":"A","text":"その場にいる大人に合わせて、態度や返事を変える"},{"key":"B","text":"面倒になり、両方の言うことを聞き流すようになる"},{"key":"C","text":"直接「先生によって言っていることが違う」と指摘する"},{"key":"D","text":"どちらかに従うのではなく、自分が正しいと思う方だけをやる"}]},
  {"id":4,"phase":"フェーズ1：対人関係とエラー処理","text":"教室で、自分が直接関係ないクラスメイトが激しく怒られています。あなたはどう感じますか？","options":[{"key":"A","text":"自分が怒られているように感じて、ひどく疲弊する"},{"key":"B","text":"「面倒な空間だ」と感じ、意識を別の世界に飛ばす"},{"key":"C","text":"「なぜ怒られているのか」理由や論理を客観的に分析する"},{"key":"D","text":"全く気にならず、自分の作業や思考に集中し続ける"}]},
  {"id":5,"phase":"フェーズ1：対人関係とエラー処理","text":"LINEなどのグループトークで、急に誰かが不機嫌になり空気が悪くなった時、どう行動しますか？","options":[{"key":"A","text":"すぐにフォローのスタンプを入れたり、話題を変えようと努力する"},{"key":"B","text":"通知を切り、しばらくそのグループを見ないようにする"},{"key":"C","text":"「どうしたの？」とその場で原因をはっきりさせようとする"},{"key":"D","text":"そのやり取りには参加せず、別の友達と個別のトークをする"}]},
  {"id":6,"phase":"フェーズ1：対人関係とエラー処理","text":"仲の良いグループの中で、自分以外の2人が激しいケンカを始めました。あなたのOSはどう作動しますか？","options":[{"key":"A","text":"すぐに間に入って、両方の機嫌を取りながらその場を収めようとする"},{"key":"B","text":"「自分には関係ない」と物理的にその場から離れる"},{"key":"C","text":"「何が原因でケンカになったの？」と冷静に事実確認をする"},{"key":"D","text":"ケンカが終わるまで、黙って自分のスマホなどをいじって待つ"}]},
  {"id":7,"phase":"フェーズ1：対人関係とエラー処理","text":"家族の予定が急に変更されて、自分のやりたかったことができなくなった時、最初のリアクションは？","options":[{"key":"A","text":"家族の雰囲気を悪くしないよう、笑顔で我慢する"},{"key":"B","text":"部屋に引きこもって、ふて寝する"},{"key":"C","text":"「なぜ変更になったのか」納得のいく理由を問いただす"},{"key":"D","text":"家族とは別行動をとり、一人で好きなことをする"}]},
  {"id":8,"phase":"フェーズ1：対人関係とエラー処理","text":"クラスで「特定の人をいじる」ような暗黙のルールができつつある時、どう振る舞いますか？","options":[{"key":"A","text":"自分がターゲットにならないよう、周りに合わせて笑う"},{"key":"B","text":"関わらないように気配を消して、目立たないように過ごす"},{"key":"C","text":"「それは良くないと思う」と直接言葉にする"},{"key":"D","text":"クラスの空気は無視して、自分が話したい人とだけ話す"}]},
  {"id":9,"phase":"フェーズ1：対人関係とエラー処理","text":"自分の失敗ではないのに、連帯責任でグループ全体が怒られた時、どう対処しますか？","options":[{"key":"A","text":"真っ先に謝り、少しでも早く場を収めようとする"},{"key":"B","text":"表面上は反省したふりをして、心の中で理不尽さを呪う"},{"key":"C","text":"「自分は関係ない」と論理的に説明し、反論する"},{"key":"D","text":"怒られている状況を、どこか他人事のように眺めている"}]},
  {"id":10,"phase":"フェーズ1：対人関係とエラー処理","text":"親戚から、あまり触れられたくない進路や成績の話を聞かれた時、どうやって切り抜けますか？","options":[{"key":"A","text":"相手が喜びそうな「ウソ（建前）」を言ってやり過ごす"},{"key":"B","text":"トイレに行くなど理由をつけて、物理的にその場から逃げる"},{"key":"C","text":"「その話はしたくない」とはっきり伝える"},{"key":"D","text":"適当に相槌を打ちながら、頭の中では全く別のことを考えている"}]},
  {"id":11,"phase":"フェーズ2：情報のインストールと保存","text":"友達と初めてプレイする複雑なボードゲーム。一番最初にルールをどうやってインストールしますか？","options":[{"key":"A","text":"ルールブックの図解やイラストをじっくり見る"},{"key":"B","text":"ルールを知っている友達の口頭説明を聞く"},{"key":"C","text":"とりあえず一度実際にカードやコマを動かしてプレイしてみる"},{"key":"D","text":"ルールブックの文章の隅々まで論理的に読み込む"}]},
  {"id":12,"phase":"フェーズ2：情報のインストールと保存","text":"テスト前日、歴史の年号や出来事の流れを暗記する時、一番頭に残りやすい方法はどれですか？","options":[{"key":"A","text":"教科書やノートの「ページ全体の映像」として頭に思い浮かべる"},{"key":"B","text":"語呂合わせの音や、ブツブツと声に出して耳から覚える"},{"key":"C","text":"部屋を歩き回ったり、何度も紙に書きなぐったりして覚える"},{"key":"D","text":"出来事の因果関係やストーリーを論理的にまとめる"}]},
  {"id":13,"phase":"フェーズ2：情報のインストールと保存","text":"友達と初めて行く場所で、スマホの地図を見ながら待ち合わせ場所に向かいます。どうやって進みますか？","options":[{"key":"A","text":"地図のルートと、実際の景色や建物を視覚的に照らし合わせる"},{"key":"B","text":"人に道を聞いたり、踏切などの周囲の音を頼りにする"},{"key":"C","text":"一度行った人の後ろをただついていくか、自分の方向感覚だけで行く"},{"key":"D","text":"「次の角を右に曲がる」と頭の中で言葉にして確認する"}]},
  {"id":14,"phase":"フェーズ2：情報のインストールと保存","text":"複雑な家具やプラモデルを組み立てる時、どのように進めるのが得意ですか？","options":[{"key":"A","text":"完成図や設計図の全体像（イラスト）を常に手元に置いて確認する"},{"key":"B","text":"誰かに手順を口に出して読み上げてもらいながら作業する"},{"key":"C","text":"説明書は読まず、とりあえずパーツを触って感覚で組み立てる"},{"key":"D","text":"手順「1」「2」などのテキストでの指示を一つずつ順番にこなす"}]},
  {"id":15,"phase":"フェーズ2：情報のインストールと保存","text":"好きな曲を覚える時、どの部分が一番最初にインプットされますか？","options":[{"key":"A","text":"ミュージックビデオの映像や、アーティストの衣装・表情"},{"key":"B","text":"メロディラインや、楽器のリズム・音程"},{"key":"C","text":"ライブで自分が盛り上がっている感覚や、ダンスの動き"},{"key":"D","text":"歌詞の意味や、そこに含まれるメッセージ性"}]},
  {"id":16,"phase":"フェーズ2：情報のインストールと保存","text":"自分が感動した映画やアニメの面白さを友達に伝える時、どうやって伝えますか？","options":[{"key":"A","text":"「あのシーンの映像がとにかく綺麗だった！」と情景を語る"},{"key":"B","text":"主題歌やBGMの良さ、声優の演技のすばらしさを中心に語る"},{"key":"C","text":"身振り手振りを大きく交えて、キャラクターの動きを再現する"},{"key":"D","text":"ストーリーの伏線や、セリフの深い意味を論理的に解説する"}]},
  {"id":17,"phase":"フェーズ2：情報のインストールと保存","text":"授業のノートをとる時、あなたのノートはどんな風になりやすいですか？","options":[{"key":"A","text":"色ペンをたくさん使い、図やイラストが多い"},{"key":"B","text":"先生の雑談や「ここ重要」という声のトーンをメモしている"},{"key":"C","text":"ノートをとるより、実際に問題を解きながら手で覚える"},{"key":"D","text":"矢印や箇条書きを使って、論理的な���成でまとまっている"}]},
  {"id":18,"phase":"フェーズ2：情報のインストールと保存","text":"人の顔と名前を覚える時、何を手がかりにすることが多いですか？","options":[{"key":"A","text":"その人の顔のパーツや、着ていた服の映像"},{"key":"B","text":"その人の声のトーンや、名前の響き"},{"key":"C","text":"その人と一緒に何をしたか、どう動いたかのエピソード"},{"key":"D","text":"その人の名刺の文字や、プロフィール情報"}]},
  {"id":19,"phase":"フェーズ2：情報のインストールと保存","text":"夏休みの自由研究や工作で、一番ワクワクする瞬間は？","options":[{"key":"A","text":"完成図や綺麗なレイアウトを頭の中でイメージしている時"},{"key":"B","text":"友達や家族と「どうする？」とアイデアを話し合っている時"},{"key":"C","text":"実際に手を動かして、材料を切ったり貼ったりしている時"},{"key":"D","text":"テーマの理由や、結果の考察を文章でまとめる時"}]},
  {"id":20,"phase":"フェーズ2：情報のインストールと保存","text":"本や漫画を読むとき、頭の中はどうなっていますか？","options":[{"key":"A","text":"シーンがフルカラーの映像として再生されている"},{"key":"B","text":"キャラクターのセリフが「声」として脳内で聞こえる"},{"key":"C","text":"キャラクターの感情や痛みが、自分の体にも移るように感じる"},{"key":"D","text":"作者の意図や伏線の構造を考えながら活字を追っている"}]},
  {"id":21,"phase":"フェーズ3：バッテリーの消費と警告","text":"委員会やグループワークで、自分がチーム全体に迷惑をかける大きなミスをした時、どう動きますか？","options":[{"key":"A","text":"「責められる」と恐れ、自分でこっそり隠蔽・解決しようとする"},{"key":"B","text":"状況を順序立てて説明するのが面倒で、誰かが気づくまで放置する"},{"key":"C","text":"怒られる覚悟で、すぐにリーダーや先生に事実だけを報告する"},{"key":"D","text":"仲の良い友達一人にだけ打ち明けて、どうするか相談する"}]},
  {"id":22,"phase":"フェーズ3：バッテリーの消費と警告","text":"授業や宿題で、どうしても分からない難しい問題に出くわした時、どうしますか？","options":[{"key":"A","text":"「こんなことも分からないのか」と思われるのが嫌で質問できない"},{"key":"B","text":"どこが分からないのかを言葉で説明する手間が面倒で質問しない"},{"key":"C","text":"気にせず、すぐに先生や頭の良い友達に質問しに行く"},{"key":"D","text":"ネットで検索するか、解答を丸写しして自分一人で終わらせる"}]},
  {"id":23,"phase":"フェーズ3：バッテリーの消費と警告","text":"進路や人間関係で深く悩んでいて、精神的なバッテリーが枯渇している時、どうなりやすいですか？","options":[{"key":"A","text":"「重いヤツ」と思われて空気を壊すのが怖くて誰にも言えない"},{"key":"B","text":"自分の気持ちを言葉にする気力すら湧かず、一人で抱え込む"},{"key":"C","text":"問題の根本的な原因を冷静に分析し、解決策を一つずつ探す"},{"key":"D","text":"信頼できる親友一人にだけ、すべてを泣きながら話す"}]},
  {"id":24,"phase":"フェーズ3：バッテリーの消費と警告","text":"誰かに手伝ってほしいのに、みんなが忙しそうにしている時、あなたはどうしますか？","options":[{"key":"A","text":"相手の負担になることを過剰に恐れ、絶対に頼めない"},{"key":"B","text":"自分の状況をわかってもらうための説明を考えるのが面倒で諦める"},{"key":"C","text":"相手が忙しそうでも「ここだけ手伝って」と具体的に交渉する"},{"key":"D","text":"その場にいる人ではなく、全く関係のない外部の人（親など）に頼る"}]},
  {"id":25,"phase":"フェーズ3：バッテリーの消費と警告","text":"自分の得意な作業に取り組んでいる時、最もバッテリー（やる気）を消耗するのはどんな状況ですか？","options":[{"key":"A","text":"自分の成果が誰からも認められず、感謝されない時"},{"key":"B","text":"作業の意味や目的が不明確なまま、ただやらされている時"},{"key":"C","text":"周囲にやる気のない人がいて、チーム全体の士気が低い時"},{"key":"D","text":"やり方やルールを他人に細かく指定され、自由がない時"}]},
  {"id":26,"phase":"フェーズ3：バッテリーの消費と警告","text":"明日提出の重要な課題を完全に忘れていたことに、前日の夜になって気づきました。最初のリアクションは？","options":[{"key":"A","text":"先生に怒られる恐怖や、評価が下がる不安でパニックになる"},{"key":"B","text":"「もう無理だ」と考えるのを放棄して、寝てしまうか別のことをする"},{"key":"C","text":"「今からどうすれば最小限の被害で済むか」の手順を論理的に考える"},{"key":"D","text":"すぐに特定の友達に連絡して、写させてもらえないか頼み込む"}]},
  {"id":27,"phase":"フェーズ3：バッテリーの消費と警告","text":"予定のない休日に一番「バッテリーが回復する」と感じる過ごし方は？","options":[{"key":"A","text":"誰にも気を遣わず、誰とも連絡をとらないで過ごす"},{"key":"B","text":"ややこしい思考を放棄し、ひたすら寝るか動画を眺める"},{"key":"C","text":"溜まっていた課題や自分の部屋の片付けを計画通りに終わらせる"},{"key":"D","text":"本当に気を許せるごく一部の親友とだけ遊ぶ"}]},
  {"id":28,"phase":"フェーズ3：バッテリーの消費と警告","text":"グループワークで意見を言わなければいけない時、一番疲れる状況はどれですか？","options":[{"key":"A","text":"自分の意見で「場の空気」が冷めるのではないかと不安な時"},{"key":"B","text":"頭の中のモヤモヤを「相手に伝わる言葉にして説明する」時"},{"key":"C","text":"自分の意見が論理的に間違っていると人から指摘された時"},{"key":"D","text":"話し合いのルールや前提が、誰も分からないまま進んでいる時"}]},
  {"id":29,"phase":"フェーズ3：バッテリーの消費と警告","text":"クラスで「リーダー」や「代表」を任されそうになった時、一番嫌な理由はなんですか？","options":[{"key":"A","text":"「あいつがリーダーかよ」と陰で評価されるのが怖いから"},{"key":"B","text":"みんなの意見をまとめたり、指示を出したりする作業が面倒だから"},{"key":"C","text":"自分にはその役割をこなすだけの能力や論理性がないと思うから"},{"key":"D","text":"先生や親など、大人からの期待を背負うのが重いから"}]},
  {"id":30,"phase":"フェーズ3：バッテリーの消費と警告","text":"自分のスマホや手帳を、親に勝手に見られたとわかった時、どう反応しますか？","options":[{"key":"A","text":"親の期待を裏切っていないか不安になり、顔色をうかがう"},{"key":"B","text":"何を見たか、なぜ見たかを追及するエネルギーすら湧かず無視する"},{"key":"C","text":"「プライバシーの侵害だ」と論理的に怒りをぶつけ、話し合う"},{"key":"D","text":"鍵をかけたりパスワードを変えたりして、物理的に完全にブロックする"}]}
]

type Step = "login" | "consent" | "question" | "loading" | "complete"
type Answer = { questionId: number; key: string }

export default function OSDiagnosticPage() {
  const [step, setStep] = useState<Step>("login")
  const [osId, setOsId] = useState("")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])

  const currentQuestion = QUESTIONS[currentQuestionIndex]
  const progress = ((currentQuestionIndex) / QUESTIONS.length) * 100

  const handleProceedToConsent = useCallback(() => {
    if (osId.trim()) {
      setStep("consent")
    }
  }, [osId])

  const handleStartDiagnosis = useCallback(() => {
    setStep("question")
  }, [])

  const handleSelectOption = useCallback((key: string) => {
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      key,
    }
    const updatedAnswers = [...answers, newAnswer]
    setAnswers(updatedAnswers)

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      // 次の質問へ
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1)
      }, 300)
    } else {
      // 全問回答完了 → ローディング画面へ
      setStep("loading")
      handleSubmit(updatedAnswers)
    }
  }, [currentQuestionIndex, answers, currentQuestion])

  const handleSubmit = useCallback(async (finalAnswers: Answer[]) => {
    // 擬似的な送信処理（1.5秒待機）
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    // コンソールにデータを出力
    console.log("OS仕様書診断データ:", { osId, answers: finalAnswers })
    
    // 完了画面へ遷移
    setStep("complete")
  }, [osId])

  return (
    <main className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {step === "login" && (
          <LoginScreen
            key="login"
            osId={osId}
            setOsId={setOsId}
            onStart={handleProceedToConsent}
          />
        )}
        {step === "consent" && (
          <ConsentScreen
            key="consent"
            onAgree={handleStartDiagnosis}
          />
        )}
        {step === "question" && (
          <QuestionScreen
            key="question"
            question={currentQuestion}
            questionIndex={currentQuestionIndex}
            totalQuestions={QUESTIONS.length}
            progress={progress}
            onSelectOption={handleSelectOption}
          />
        )}
        {step === "loading" && <LoadingScreen key="loading" />}
        {step === "complete" && <CompleteScreen key="complete" />}
      </AnimatePresence>
    </main>
  )
}

// ログイン画面
function LoginScreen({
  osId,
  setOsId,
  onStart,
}: {
  osId: string
  setOsId: (id: string) => void
  onStart: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex min-h-screen flex-col items-center justify-center px-4 py-8"
    >
      <div className="w-full max-w-md space-y-8">
        {/* ロゴ・タイトル */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyber-emerald to-cyber-blue shadow-lg shadow-cyber-emerald/30">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              OS仕様書診断
            </h1>
            <p className="mt-2 text-slate-soft text-sm leading-relaxed">
              あなたの「心のOS」を解析します
            </p>
          </div>
        </div>

        {/* カード */}
        <div className="bg-card rounded-2xl shadow-xl shadow-slate-200/50 border border-border p-6 space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="osId"
              className="block text-sm font-medium text-foreground"
            >
              OS認識ID
            </label>
            <input
              id="osId"
              type="text"
              value={osId}
              onChange={(e) => setOsId(e.target.value)}
              placeholder="IDを入力してください"
              className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyber-emerald focus:border-transparent transition-all duration-200"
            />
          </div>

          <button
            onClick={onStart}
            disabled={!osId.trim()}
            className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyber-emerald to-cyber-blue shadow-lg shadow-cyber-emerald/30 hover:shadow-cyber-emerald/50 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            診断開始
          </button>

          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            全30問 / 所要時間：約10分
          </p>
        </div>

        {/* フッター */}
        <p className="text-xs text-muted-foreground text-center">
          中学3年生 自己理解アセスメント
        </p>
      </div>
    </motion.div>
  )
}

// 同意画面
function ConsentScreen({
  onAgree,
}: {
  onAgree: () => void
}) {
  const [isAgreed, setIsAgreed] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex min-h-screen flex-col items-center justify-center px-4 py-8"
    >
      <div className="w-full max-w-lg space-y-6">
        {/* ヘッダー */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-cyber-emerald to-cyber-blue shadow-lg shadow-cyber-emerald/30">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            診断を始める前に
          </h1>
          <p className="text-sm text-muted-foreground">
            以下の内容をよく読んでください
          </p>
        </div>

        {/* カード */}
        <div className="bg-card rounded-2xl shadow-xl shadow-slate-200/50 border border-border overflow-hidden">
          {/* スクロール可能なテキストエリア */}
          <div className="h-64 overflow-y-auto p-5 space-y-5 text-sm leading-relaxed text-foreground">
            <section className="space-y-2">
              <h2 className="font-bold text-base text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-cyber-emerald/10 text-cyber-emerald flex items-center justify-center text-xs font-bold">1</span>
                診断の目的
              </h2>
              <p className="text-muted-foreground pl-8">
                この「OS仕様書診断」は、あなた自身の考え方や行動のパターン（心のOS）を理解するためのツールです。正解や不正解はありません。自分に一番近いと思う選択肢を直感で選んでください。診断結果は、あなたの強みや特性を知り、今後の学校生活やチーム活動に活かすことを目的としています。
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-bold text-base text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-cyber-emerald/10 text-cyber-emerald flex items-center justify-center text-xs font-bold">2</span>
                結果の利用範囲
              </h2>
              <p className="text-muted-foreground pl-8">
                診断結果は以下の目的で利用されます：
              </p>
              <ul className="text-muted-foreground pl-8 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-cyber-emerald mt-1">-</span>
                  <span>担任の先生からの個別フィードバック</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-emerald mt-1">-</span>
                  <span>クラスでのグループワークやチーム編成の参考</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-emerald mt-1">-</span>
                  <span>進路指導や面談での対話材料</span>
                </li>
              </ul>
              <p className="text-muted-foreground pl-8">
                結果がクラスメイトに公開されたり、成績評価に使われることはありません。
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-bold text-base text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-cyber-emerald/10 text-cyber-emerald flex items-center justify-center text-xs font-bold">3</span>
                個人情報の保護について
              </h2>
              <p className="text-muted-foreground pl-8">
                入力されたデータは、学校のセキュリティポリシーに基づき厳重に管理されます。データは教育目的以外には使用せず、第三者への提供は行いません。診断データは学年終了時に安全に削除されます。
              </p>
            </section>
          </div>

          {/* 区切り線 */}
          <div className="border-t border-border" />

          {/* 同意チェックボックス */}
          <div className="p-5 space-y-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 rounded-md border-2 border-border bg-input peer-checked:bg-cyber-emerald peer-checked:border-cyber-emerald transition-all duration-200 flex items-center justify-center">
                  {isAgreed && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-foreground leading-relaxed group-hover:text-cyber-emerald transition-colors duration-200">
                上記の内容を理解し、同意します
              </span>
            </label>

            <button
              onClick={onAgree}
              disabled={!isAgreed}
              className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyber-emerald to-cyber-blue shadow-lg shadow-cyber-emerald/30 hover:shadow-cyber-emerald/50 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              診断を開始する
            </button>
          </div>
        </div>

        {/* フッター */}
        <p className="text-xs text-muted-foreground text-center">
          質問についてわからないことがあれば先生に聞いてください
        </p>
      </div>
    </motion.div>
  )
}

// 質問画面
function QuestionScreen({
  question,
  questionIndex,
  totalQuestions,
  progress,
  onSelectOption,
}: {
  question: (typeof QUESTIONS)[0]
  questionIndex: number
  totalQuestions: number
  progress: number
  onSelectOption: (key: string) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-screen flex-col"
    >
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-3">
          {/* 進捗表示 */}
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">
              Q{questionIndex + 1}
              <span className="text-muted-foreground"> / {totalQuestions}</span>
            </span>
            <span className="text-cyber-emerald font-semibold">
              {Math.round(progress)}%
            </span>
          </div>
          {/* プログレスバー */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyber-emerald to-cyber-blue rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          {/* フェーズ表示 */}
          <p className="text-xs text-muted-foreground truncate">
            {question.phase}
          </p>
        </div>
      </header>

      {/* 質問コンテンツ */}
      <div className="flex-1 px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* 質問テキスト */}
              <div className="bg-card rounded-2xl shadow-lg shadow-slate-200/50 border border-border p-5">
                <p className="text-lg font-medium leading-relaxed text-foreground text-balance">
                  {question.text}
                </p>
              </div>

              {/* 選択肢 */}
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <motion.button
                    key={option.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.3 }}
                    onClick={() => onSelectOption(option.key)}
                    className="w-full text-left p-4 rounded-xl bg-card border border-border hover:border-cyber-emerald hover:shadow-md hover:shadow-cyber-emerald/10 active:scale-[0.98] transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-slate-soft group-hover:bg-cyber-emerald group-hover:text-white transition-colors duration-200">
                        {option.key}
                      </span>
                      <span className="text-foreground leading-relaxed text-sm pt-1">
                        {option.text}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

// ローディング画面
function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-screen flex-col items-center justify-center px-4"
    >
      <div className="text-center space-y-8">
        {/* スピナー */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-muted" />
          <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-cyber-emerald border-r-cyber-blue animate-spin" />
        </div>

        {/* テキスト */}
        <div className="space-y-2">
          <p className="text-lg font-semibold text-foreground">
            OSデータを解析・送信中...
          </p>
          <p className="text-sm text-muted-foreground">
            しばらくお待ちください
          </p>
        </div>

        {/* パルスアニメーション */}
        <div className="flex items-center justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-cyber-emerald"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// 完了画面
function CompleteScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex min-h-screen flex-col items-center justify-center px-4 py-8"
    >
      <div className="w-full max-w-md text-center space-y-8">
        {/* 成功アイコン */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-cyber-emerald to-cyber-blue shadow-xl shadow-cyber-emerald/30"
        >
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </motion.div>

        {/* メッセージ */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            診断完了
          </h2>
          <div className="bg-card rounded-2xl shadow-lg shadow-slate-200/50 border border-border p-6">
            <p className="text-foreground leading-relaxed text-balance">
              OSデータの解析と送信が完了しました。解析結果のアップデートファイル（PDF仕様書）は、後日先生から直接お渡しします。お疲れ様でした！
            </p>
          </div>
        </div>

        {/* 装飾 */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-12 h-1 rounded-full bg-cyber-emerald/30" />
          <div className="w-2 h-2 rounded-full bg-cyber-emerald" />
          <div className="w-12 h-1 rounded-full bg-cyber-blue/30" />
        </div>

        <p className="text-sm text-muted-foreground">
          このページは閉じて大丈夫です
        </p>
      </div>
    </motion.div>
  )
}
