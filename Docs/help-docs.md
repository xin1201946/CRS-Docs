---
lang: zh-CN
outline: [1,2,3]
---
# 前言

## **铸造字识别系统的基本功能和用途**

铸造字识别系统是一种先进的技术解决方案（以下简称 铸造系统），旨在自动化地识别和处理铸造过程中产生的文字信息。该系统通过集成高精度的图像处理技术和字符识别算法，能够快速准确地从铸造件表面的标记中提取文字数据。



## **系统的硬件和软件要求**

铸造系统的设计和实施，要求具备一定的硬件和软件基础，以确保系统的高效运行和准确识别。在硬件方面，系统需要至少配备一个高性能的中央处理器（CPU），推荐使用多核处理器以支持复杂的图像处理和字符识别算法。例如，采用Intel Core i7或AMD Ryzen 7系列处理器，可以提供足够的计算能力来处理高分辨率的铸造字图像。此外，系统应至少配置4GB的RAM，以保证在处理大量数据时不会出现延迟或卡顿现象。存储方面，建议使用固态硬盘（SSD），其快速的读写速度对于频繁的数据访问和存储至关重要。在软件方面，操作系统推荐使用Windows 10或更高版本，以获得最佳的系统兼容性和稳定性。软件本身已经携带软件所需环境，无需再次安装。

# **安装指南**

## **系统安装前的准备工作**

在铸造系统安装前的准备工作阶段，确保所有硬件组件与软件需求相匹配是至关重要的。首先，必须对系统所依赖的硬件平台进行彻底检查，包括但不限于处理器速度、内存容量、存储空间以及图像采集设备的分辨率。例如，根据铸造系统的性能要求，处理器至少应为多核处理器，内存容量不应低于4GB，以确保系统能够流畅运行复杂的图像处理算法。存储空间则需要至少2GB的空余空间，以保证软件的正常运行。

在软件方面，操作系统的选择应使用Windows 10 及以上的操作系统。

## **安装步骤详解**

在铸造系统安装过程中，首先需要确保所有硬件组件符合系统要求，包括但不限于处理器速度、内存容量以及存储空间。例如，对于处理器，建议使用至少四核2.40GHz或更高频率的CPU，以保证图像处理和字符识别算法的流畅运行。内存方面，推荐至少4GB RAM，以支持多任务处理和高效的数据缓存。存储空间则需要至少2GB的空余空间，以确保足够的存储容量。

解压安装包，双击 `铸造字识别系统.exe`：

<img src="/help-docs-image/run-exe.png" />

在软件第一次启动时需要下载必备数据包，请确保网络能正常通信。后续无需保证联网环境。

启动后，程序界面会如图显示并打开浏览器访问前端。注意（https://localhost.1201946.xyz 指向 本地设备127.0.0.1:443端口）

<img src="/help-docs-image/start-server.png"  /><img src="/help-docs-image/main.png" alt="main"  />

## **界面构成**

<img src="/help-docs-image/main-jc.png" alt="main-jc"  />

# **系统配置**

## **服务端配置**

所有的服务器配置均在服务器根目录下的config.ini中配置

在铸造系统中，服务器端允许监听不同的IP和端口甚至是SSL证书实现更好的灵活性。

#### 文件概览

```ini
# This is the configuration file of the software.
# "Host" indicates the IP address of the software listening, the default value is 127.0.0.1
[Settings]
host = 127.0.0.1
# "port" is the port number of the software listener, the default value is 5000
port = 5000
# "debug" indicates whether the startup is in debug mode (no real effect, only for logging).
debug = false
[SSH_Service]
# use_https indicates whether to use the HTTPS service, the default value is False.
# Please note that when you enable use_https, make sure your domain has obtained an SSL certificate.
use_https = false
# "ssh_path" indicates the path of the certificate (absolute path is recommended)
# After starting the HTTPS service, you need to set the server IP in the front-end settings and specify your domain name.
# Please make sure you have an SSL certificate! The software tests the communication based on the domain name and automatically sets whether to use the HTTPS service.
ssh_path = /help-docs-image/CRT
[API_Service]
# The following are the API settings of the server, please modify them synchronously in the "Settings-Advanced Settings-API" card on the front-end after setting
# will only use the value set below if USE_OPTIONS is true
USE_OPTIONS = true
# isHTTPS option specifies whether the server uses the HTTPS service or not
isHTTPS = isHTTPSs
# clear option specifies the API used when a user clears uploaded images
clear = clears
# getpicture option specifies the API used when a user views uploaded images
getpicture = getpictures
# start option specifies the API used when the front-end requests the server to start processing
start = starts
# upload option specifies the API requested when a user uploads images
upload = uploads
# test option specifies the API used to test the connection status of the front-end
test = tests
# info option specifies the API used to get upload file information from the server
info = infos
```

**在上述配置文件中：**

- host：用于配置服务器监听的地址。
- port：用于配置服务器监听的端口。
- debug：此项原本用于设置服务器启用 Debug 模式，以便于调试，但在当前版本中该功能已被移除。
- use_https：用于配置服务器是否使用 HTTPS 服务。在此情况下，需将 'host' 设置为合法域名，而非 IP 地址。
- ssh_path：此配置用于解决服务器启用 https 服务后，前端页面因无证书而不信任服务器的问题。在申请域名证书后，可将证书（包括证书文件 cet 和 key 秘钥）放置于该路径下，程序会自动加载相关证书信息。
- USE_OPTIONS： 当为true时，下面的API设置将在下次启动时生效

  isHTTPS 选项指定服务器是否使用 HTTPS 服务
  clear 选项指定用户清除上传的图片时使用的 API
  getpicture 选项指定用户查看上传的图片时使用的 API
  start 选项指定前端请求服务器开始处理时使用的 API
  upload 选项指定用户上传图片时请求的 API
  test 选项指定用于测试前端连接状态的 API
  
  info 选项指定用于从服务器获取上传文件信息的 API

## **用户端配置**

### 配置服务器IP

<img src="/help-docs-image/jcpage-ip.png" alt="jcpage-ip"  />

在铸造系统中，软件允许用户根据不同的环境自定义服务器的IP，如IP更改，证书失效等，以能够适应未来软件后端服务器位置的变更，赋予前端更高的灵活性。用户可在`设置 `-> `基本设置`中更改 



### API设置



> [!CAUTION]
>
> 更改API设置属于危险操作，尽管可以在更改完成后恢复默认设置，但是仍会导致数据丢失，铸造系统运行出错的情况，严重会导致系统崩溃！

先在服务器设置API：

``` ini
'config.ini'
USE_OPTIONS：true //此项改为true，为false使用内置默认设置
isHTTPS 选项指定服务器是否使用 HTTPS 服务
clear 选项指定用户清除上传的图片时使用的 API
getpicture 选项指定用户查看上传的图片时使用的 API
start 选项指定前端请求服务器开始处理时使用的 API
upload 选项指定用户上传图片时请求的 API
test 选项指定用于测试前端连接状态的 API
info 选项指定用于从服务器获取信息的 API

```

软件同时为了适应不同的 铸造系统 所带来的变化，前端允许用户更改 API 设置。用户可在`设置 `-> `高级设置`中更改 

<img src="/help-docs-image/gjpage-api.png" alt="gjpage-api"  />

###   HTTPS支持 

> [!IMPORTANT]
>
> 铸造系统默认启动HTTPS支持，如果服务器 API 接口 无HTTPS前缀，请关闭HTTPS支持，否则会 **无法连接服务器**！

用户可前往 `设置 `-> `高级设置`中更改 ，同时在用户更改 服务器IP接口时，系统会自动识别并进行调整。

<img src="/help-docs-image/gjpage-https.png" alt="gjpage-https" style="zoom: 50%;" />

# **使用教程**

## **如何启动和关闭铸造系统**

启动铸造系统十分简单，只需要确保网络连接，双击程序启动即可。

> [!NOTE]
>
> 铸造系统为前后端分离系统，你可以在云端部署本系统，然后单独使用系统提供的前端更换服务器IP后进行使用。
>

关闭铸造系统时，请确保所有的数据已备份完毕，点击程序右上角的 X 即可，或者在窗口按下 ` Ctrl + C`

## **基本操作流程和界面介绍**

在铸造系统中，基本操作流程和界面设计是用户与系统交互的核心。首先，用户在启动系统后，会启动浏览器加载前端界面，该界面包含几个关键功能模块，分别是“界面主题色”、“设置”、“文件上传”、和“结果展示”。流程可分为以下部分:

1. 点击 `文件上传`按钮
2. 检查文件是否需要重新上传
3. 点击`开始处理`按钮
4. 反馈 数据

> [!WARNING]
>
> 在某些情况下（如API配置错误）会导致前端无法获取到服务器返回的信息，界面在超时4-10秒后会丢弃请求。

# **铸造系统功能详解**

## **铸造字图像的上传和预处理**

在铸造系统中，图像上传和预处理是至关重要的步骤，它直接影响到后续字符识别的准确性和效率。首先，用户需要将铸造字图像上传至系统。上传过程中，系统支持多种格式的图像文件，如JPEG、PNG等，确保了广泛的兼容性。为了保证识别质量，建议上传的图像分辨率不低于700 Pixel，以确保图像细节的清晰度。上传完成后，系统将自动进行预处理，包括裁剪、灰度转换、二值化、去噪和边缘增强等步骤。裁剪是为了提取数字区域，减少图像干扰，灰度转换是为了简化图像数据，减少计算量；二值化则是为了突出铸造字的轮廓，便于后续处理；去噪是为了消除图像中的非文字信息干扰；边缘增强则有助于提高文字的可读性。在预处理阶段，系统采用自适应算法动态调整参数，以适应不同铸造环境下的图像特征。对于铸造过程中产生的不规则纹理和阴影，系统通过分析图像的直方图分布，自动调整二值化阈值，从而有效分离文字与背景。

此外，预处理还包括对图像进行旋转校正和尺寸归一化，确保图像中的文字与系统内置的模板进行最佳匹配。在实际应用中，通过引入旋转不变性特征提取技术，系统能够处理任意角度的铸造字图像，极大地提高了系统的鲁棒性。

## **字符识别算法和识别过程**

在铸造系统中，字符识别算法是核心功能之一，它负责将铸造过程中产生的图像中的文字信息准确无误地转换为可编辑的文本数据。为了实现这一目标，系统采用了先进的图像处理技术和卷积神经网络（CNN），来提高识别的准确性和效率。例如，在处理带有复杂背景和不规则字体的铸造字图像时，CNN能够通过其深层结构提取图像的特征，并通过训练学习到的模式识别出文字。

在实际应用中，铸造字图像的上传和预处理是识别过程的第一步。系统会首先对上传的图像进行去噪、二值化和边缘检测等预处理操作，以减少图像中的干扰因素并突出文字特征。随后，字符识别算法开始工作，它将预处理后的图像分割成单个字符，并对每个字符进行识别。在这一过程中，算法会利用已有的训练数据集，通过比较和匹配来确定每个字符的身份。

为了进一步提升识别的准确性，系统还可能采用基于上下文的分析模型，通过分析字符周围的环境和相邻字符的特征来校正识别结果。铸造系统中的字符识别算法和识别过程是一个高度复杂且精细的过程，它结合了图像处理技术、机器学习模型，以确保在各种铸造环境下都能提供准确无误的识别结果。

## **事件查看器**

在铸造系统中，难免会因为各种原因导致无法正常运行，在后端我们可以通过程序滚动的日志来进行排错，那么前端也会有一个类似的功能： 事件查看器。位于 设置-> 关于 -> 日志查看器

<img src="/help-docs-image/about-log.png" alt="about-log"  />

它的主要功能就是进行 事件 的统计，记录。通过其注入到API（前端

核心接口，并非后端接口）的方式，监听所有的前端事件并记录结果。

事件查看器界面包含两个模块：信息总览（图表） 和 详细信息（表格）

**事件查看器有三个级别**：

-  **Success**（成功执行）
- **Warning**（存在不影响系统运行的错误）
- **Error**（重大错误，影响系统运行，通常是无法与服务器通信）

### **信息总览**

<img src="/help-docs-image/log.png" alt="log"  />

大致信息反映了截止到用户打开 事件查看器 为止这段时间发生的所有类型的日志，并用图表进行展示。

### **详细信息**

在了解到大致情况后，用户可通过 筛选，搜索指定事件名称 的方式找出 相应的事件，在表格尾端的备注列的 `查看`按钮可以弹出包含日志详细信息的对话框

<img src="/help-docs-image/log-table.png" alt="log-table"  />

> [!IMPORTANT]
>
> 请注意 Error 级别的错误，他们通常直接影响程序的运行！

# **自动主题色**

铸造系统的前端可以在 识别到用户计算机切换 黑暗模式/亮色模式  时切换界面 显示主题色，以统一显示效果。

用户可以在`设置` -> `基本设置`中更改主题色显示规则



<img src="/help-docs-image/jcpage-theme.png" alt="jcpage-theme"  />

# **故障排除**

## **常见问题及解决方法**

在铸造系统操作过程中，用户可能会遇到各种技术难题，例如图像上传失败、识别准确率低等问题。

## Q：图像上传失败

A：首先应检查网络连接是否稳定，因为网络不稳定是导致上传失败的常见原因。根据经验，90%的上传失败案例可以通过重启路由器或切换网络环境来解决。其次，需要确认上传的图像格式和大小是否符合系统要求，因为不兼容的格式或过大的文件尺寸都可能导致上传中断。在识别准确率低的情况下，可能需要调整预处理算法，以提高图像质量。例如，通过应用高斯模糊和边缘检测技术，可以有效去除铸造字图像中的噪声，从而提高识别准确率。

## Q：界面显示能正常使用，但是上传图片出错或者无法处理

A：请检查API和网络设置是否正常。你可以在`设置 `->` 关于` ->` 事件查看器` 下方表格，点击 结果 表头，筛选出报错的部分，并将其反馈给管理员。
