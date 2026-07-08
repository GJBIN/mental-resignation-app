# 精神离职仪式

一个纯静态网页小应用，用来模拟“精神离职”的情绪释放流程。用户可以选择崩溃原因、调整怨气值、生成不同风格的辞职信、模拟老板回复，并生成分享卡片。
 
## 本地打开

直接双击 `index.html` 即可使用。

项目不需要安装依赖，也不需要启动服务器。

## 文件结构

```text
mental-resignation-app/
  index.html   # 页面结构
  styles.css   # 样式与响应式布局
  app.js       # 交互逻辑
  .nojekyll    # GitHub Pages 静态托管兼容文件
  README.md    # 项目说明
```

## 部署到 GitHub Pages

1. 在 GitHub 新建一个仓库，例如 `mental-resignation-app`。
2. 上传本目录里的所有文件到仓库根目录。
3. 打开仓库的 `Settings`。
4. 进入 `Pages`。
5. 在 `Build and deployment` 中选择：
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
6. 保存后等待 GitHub Pages 部署完成。
7. 部署完成后会得到一个公开网址，别人就可以访问。

## 更新网站

修改 `index.html`、`styles.css` 或 `app.js` 后，重新提交到 GitHub。GitHub Pages 会自动重新部署，原网址保持不变。

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
