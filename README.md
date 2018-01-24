# image_quality_evaluator

A web app made by GAS &amp; Javascript for evaluating image quality using human eye.

## 概要

生成した画像の品質を調べるために作成したWebアプリケーション。人間の目で見て良いと思った画像を選択することで、主観的な評価を得ることができる。JavascritpとGoogle Apps Scriptで作成。

## 使用法

1. `make_dataset.py`を実行
```
python make_dataset.py test/
```

2. `config.json`を作成
```
{
    "number": 2,
    "url": "https://script.google.com/macros/s/AKfycbxD8ydOcztjlva1LuO-86pN7N4mzAVhRqlAbG_va73Wmf7gEm4/exec"
}
```

3. `index.html`を実行
```
open -a Firefox index.html
```