---
lang: zh-CN
outline: [1,2,3,4]
---





> **我们在项目中允许用户进行API定制以满足不同场景需求，设置教程参考[这里](/Docs/help-docs#用户端配置)**

# 介绍

> 当API状态标记为`已弃用` 时，前端不再使用该API与后端进行通信，但该功能仍然保留，API仍可正常使用。
>
> 当API状态标记为`可用`时，该API正常工作

| API名称    | 功能                                   | 状态   |
| ---------- | -------------------------------------- | ------ |
| clear      | 指定用户清除上传的图片时使用的 API     | 可用   |
| getpicture | 指定用户查看上传的图片时使用的 API     | 已弃用 |
| start      | 指定前端请求服务器开始处理时使用的 API | 可用   |
| upload     | 指定用户上传图片时请求的 API           | 可用   |
| test       | 指定用于测试与后端的连接状态的 API     | 可用   |
| info       | 指定用于从服务器获取信息的 API         | 已弃用 |
| isHTTPS    | 当前端获取服务器是否启用HTTPS时使用    | 已弃用 |
| command    | 控制台API                              | 可用   |

# API 接入

> [!NOTE]
>
> 接入前请将`{API["your_server_api"]}`更换为服务器当前的API配置



## clear

### 功能

清空已上传图片

### 相关代码

```Python
@app.route(f'/{API["your_server_api"]}')
def clear_files():
  filename = request.args.get('filename')  # 从请求参数中获取文件名
  delete_files_in_folder(filename=filename)
  return jsonify('Delete'), 200
```

### 使用方式

方法：[GET,POST]

参数: 无

返回: Json , 200

## start

### 功能

开始处理已上传图片

### 相关代码

```Python
@app.route(f'/{API["your_server_api"]}', methods=['GET', 'POST'])
def start():
    text= auto_run(None)
    return jsonify([text]),200
```

### 使用方式

方法：[GET,POST]

参数: 无

返回: Json , 200

## upload

### 功能

上传图片

### 相关代码

```python
@app.route(f'/{API["your_server_api"]}', methods=['POST'])
def upload_file():
    try:
        files = request.files
        print(files, request.files)
        for file in files:
            if file and files[file].filename != '':
                filename = files[file].filename
                with open(os.path.join(UPLOAD_FOLDER, 'pic'), 'wb') as f:
                    for chunk in files[file].stream:
                        f.write(chunk)
        return jsonify({'message': 'Done'})
    except Exception as e:
        # Handle exception and return appropriate error response
        return jsonify({'error': str(e)}), 500  # 500 indicates internal server error
```

### 使用方式

方法：[POST]

参数: 图片数据

返回: Json,200/500

## test

### 功能

测试与后端的连接状态

### 相关代码

```python
@app.route(f'/{API["your_server_api"]}')
def test():
    return jsonify('You already connect the server now!')
```

### 使用方式

方法：[GET，POST]

参数: 无

返回: Json,200

## info

### 功能

获取服务器设置和已上传图片

### 相关代码

```python
@app.route(f'/{API["your_server_api"]}')
def test():
    return jsonify('You already connect the server now!')
```

### 使用方式

方法：[GET，POST]

参数: 无

返回: Json,200

## command

### 功能

通过附加的command参数来执行一些指令

### 相关代码

```python
@app.route('/command',methods=['GET','POST'])
def run_command():
    global mode
    command = request.args.get('command')
    ...
    return jsonify(message)
```

### 使用方式

方法：[GET，POST]

参数： command （必填） ： 要执行的命令

返回：json

### 附加

> [!NOTE]
>
> 为了确保服务器可正常运行，免收攻击导致的数据库崩溃，命令中的SQL功能将受到限制，可通过`blacklist`查看被限制的命令，附加--help 查看如何解除部分限制

| 命令      | 说明                         | 备注                  |
| --------- | ---------------------------- | --------------------- |
| sql       | 进入sql终端                  | 命令受到blacklist限制 |
| exit      | 返回到默认终端               |                       |
| help      | 在默认终端获取帮助           |                       |
| server    | -h显示帮助，-s尝试关闭服务器 |                       |
| blacklist | 无参数返回 黑名单命令列表    |                       |

> [!NOTE]
>
> `blacklist` 的添加，删除操作均为临时操作，在服务器重启后将重置操作
>
> 目前 `blacklist`  已包含 `drop table`, `truncate`, `delete from`, `update` 命令



| blacklist 参数 | 说明             | 备注 |
| -------------- | ---------------- | ---- |
| --help         | 查看帮助         |      |
| --add          | 添加命令到黑名单 |      |
| --remove       | 删除命令到黑名单 |      |