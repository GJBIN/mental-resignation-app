# 精神离职仪式

一个纯静态网页小应用，用来模拟“精神离职”的情绪释放流程。用户可以选择崩溃原因、调整怨气值、生成不同风格的辞职信、模拟老板回复，并生成分享卡片。

线上地址：<https://gjbin.github.io/mental-resignation-app/>

## 手机安装

这个项目已经支持 PWA，可以像轻量 App 一样添加到手机桌面。

- Android Chrome / Edge：打开线上地址后，点击地址栏或浏览器菜单里的“安装应用”或“添加到主屏幕”。
- iPhone Safari：打开线上地址后，点击分享按钮，再选择“添加到主屏幕”。
- 安装后仍然是同一个网站，后续更新 GitHub Pages 后，用户重新打开就会逐步拿到新版。

## 本地打开

直接双击 `index.html` 可以查看页面，但 PWA 安装和离线缓存需要通过 `http://localhost` 或线上 HTTPS 地址测试。

本地测试可在项目目录运行：

```powershell
python -m http.server 5173
```

然后打开：`http://127.0.0.1:5173/`

## 文件结构

```text
mental-resignation-app/
  index.html            # 页面结构
  styles.css            # 样式与响应式布局
  app.js                # 交互逻辑与 PWA 注册
  manifest.webmanifest  # PWA 安装信息
  service-worker.js     # 离线缓存
  icons/                # App 图标
  .nojekyll             # GitHub Pages 静态托管兼容文件
  README.md             # 项目说明
```

## 部署到 GitHub Pages

1. 把本目录的文件提交到 GitHub 仓库根目录。
2. 打开仓库 `Settings`。
3. 进入 `Pages`。
4. 在 `Build and deployment` 中选择：
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
5. 保存后等待 GitHub Pages 部署完成。

## 当前功能

- 选择崩溃原因
- 调整怨气值
- 生成体面、阴阳、疯感、文学四种辞职信
- 模拟老板回复
- 老板语录粉碎机
- 生成精神离职证书
- 复制信件和卡片文案
- 本地保存最近记录
- 明暗模式切换
- 桌面和手机自适应
- PWA 安装到手机桌面
- 基础离线访问
