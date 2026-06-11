---
name: 张新伟
title: 全栈工程师 · Full Stack Developer
---

::resume-contacts

```yaml [props]
items:
  - icon: i-lucide-map-pin
    label: 城市
    value: 中国 · 上海
  - icon: i-lucide-mail
    label: 邮箱
    value: me@shencang.blue
    href: "mailto:me@shencang.blue"
  - icon: i-lucide-phone
    label: 电话
    value: "+86 185 3501 2680"
```

::

::resume-layout

:::resume-main-col

::::resume-section{title="个人简介"}
:::::resume-prose
拥有三年研发经验的全栈应用工程师，专注于打造流畅、优雅的用户体验以及高效稳定的系统实现。

熟悉 LLM 底层机理，了解自回归和概率预测的底层机制、提示词工程和 RAG 架构，引导 AI 精准输出对应知识和模式，熟悉 Harness Engineering 原理。

擅长将前沿 AI 理论深度融入研发工作流，加速问题攻关与方案落地；凭借敏锐的技术直觉与工程经验，在架构选型、复杂状态治理等关键决策上充分结合全局视角，发挥 AI 和人类的共同能力。
:::::
::::

::::resume-section{title="项目能力"}

:::::resume-experience

```yaml [props]
title: 抖音来客
subtitle: 特色服务
```

- 提出并主导团队核心业务的架构升级，通过多端融合 (H5 & PC) 与业务逻辑彻底解耦，成功消解了项目中的严重的Hook地狱；
- 引入 Zustand + XState 重新构建了状态管理模型，使核心业务逻辑复用率大幅提升，降低了多端同构的维护成本；
- 将 V-VM 彻底解耦，组件只负责渲染及触发 Action，业务规则、网络请求和核心状态全部收拢到独立的逻辑层；
- - 全局和模块级别的静态数据，利用 Zustand 的轻量、响应式、无 Context 嵌套的特性，替代原本散落的 useState
- - 复杂业务流程（多步骤表单、业务及权限校验）使用状态机集中管理状态转移，使得代码逻辑清晰可测试，声明式配置取代了大量的 if-else 和 useEffect 等钩子函数

:::::

::::

::::resume-section{title="工作经历"}
:::::resume-stack

::::::resume-experience

```yaml [props]
start: "2025.10"
end: "2026.04"
title: 前端工程师 · 字节跳动
subtitle: 抖音生活服务·特色服务
location: 上海
```

- 优化 H5 加载耗时 34%，优化静态资源及业务数据加载，在端侧 FMP 优化 ~100ms
- 参与业务告警治理并设计看板，梳理抖音生活“安心系列”特色服务，建立商家-用户-活动多视角动线视角
- 上线了抖音团购-旅行团线路游 B+C端业务实现，提升特色服务-安心游 GMV x.xx %
- 落地抖音生活-安心系列商户侧安心积分活动，提高线上履约率 xx%，通过 SVG 插值实现全尺寸适配效果
- 重构安心试用活动PC/H5页面，采用动态化设计，并优化配置下发链路，实现可读性和性能的协调

::::::

::::::resume-experience

```yaml [props]
start: "2024.08"
end: "2025.10"
title: 全栈工程师 · 引望 IAS BU
subtitle: 可视化编辑器与语音交互方向
location: 上海
```

- 主导可视化编辑器与语音交互机器人解决方案的设计与落地。
- 半年内完成 20,000+ 行代码评审与提交，推动核心模块演进。
- 建立单元测试体系，使核心代码库覆盖率由 0 提升至 67%，新增 500+ 用例。
- 与跨职能团队协作，持续优化系统架构与运行性能。
- 推动代码规范与 CI 实践，带领团队完成 Spring Boot 3 迁移。

::::::

::::::resume-experience

```yaml [props]
start: "2024.04"
end: "2024.08"
title: 前端架构工程师 · 众阳健康科技集团
subtitle: 多产品线性能与架构治理
location: 济南
```

- 通过架构优化提升多条产品线的 Web 性能与可维护性。
- 组织深入的代码评审，输出可落地的改进建议，赋能团队成员。
- 将三条产品线的 FCP / LCP 由 10s+ 降至 2s 以内，体验显著改善。

::::::

::::::resume-experience

```yaml [props]
start: "2023.06"
end: "2024.01"
title: WebRTC 工程师 · 七牛云
subtitle: 实时音视频与直播解决方案
location: 上海
```

- 参与视频会议与直播业务方案的设计与实现。
- 集成定制化 AEC / ANC 模块，显著提升通话音质表现。
- 结合微信小程序与直播 SDK，打通端到端的用户体验链路。

::::::

:::::
::::

::::resume-section{title="教育背景"}
:::::resume-stack

::::::resume-experience

```yaml [props]
start: "2019.09"
end: "2023.06"
title: 山东大学
subtitle: 全日制本科 · 日语文学
```

- 在文科专业背景下广泛且系统地学习了计算机技术，持续投入技术实践与开源协作。
- 展现出对技术与问题求解的浓厚兴趣，跨学科融合能力突出。
- 善于多学科视角思考，阅读、思考和输出能力强。

::::::

:::::
::::

:::

:::resume-side-col

::::resume-section{title="基本信息" level="side"}
:::::resume-info-list

```yaml [props]
items:
  - label: 出生日期
    value: 2001 年 9 月
```

:::::
::::

::::resume-section{title="专业技能" level="side"}
:::::resume-gauge-list

```yaml [props]
items:
  - name: TypeScript
    level: 5
  - name: Web Infra
    level: 5
  - name: React / Vue / Qwik
    level: 5
  - name: Computer Network
    level: 5
  - name: Cyber Security
    level: 4
  - name: Java
    level: 4
```

:::::
::::

::::resume-section{title="语言能力" level="side"}
:::::resume-gauge-list

```yaml [props]
items:
  - name: 中文
    level: 5
  - name: 英语
    level: 4
  - name: 日语
    level: 4
  - name: 法语
    level: 2
```

:::::
::::

::::resume-section{title="兴趣爱好" level="side"}
:::::resume-tags

```yaml [props]
items:
  - 开源
  - Rust
  - 编译器
  - 服务端渲染
  - 原生应用
  - 数据可视化
  - 动画
  - 自动化
```

:::::
::::

:::

::
