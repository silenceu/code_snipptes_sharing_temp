## 部署说明

###  1. 新建`ormconfig.json`文件，格式如下

```jsonc
{
    "type": "mysql", // 数据库类型
    "host": "192.168.1.200", // 数据库地址
    "port": 3307, // 数据库端口号
    "username": "root", // 数据库登录用户名
    "password": "123456", // 数据库登录密码
    "database": "uah5", // 数据库名称
    "entities": ["dist/**/*.entity{.ts,.js}"], // 无需修改
    "synchronize": true, // 无需修改
    "logging": false, // 是否打印数据库日志
}
```

### 2. 打包构建

```bash
$ npm run prebuild & npm run build
```

### 3. 使用pm2启动实例

```bashv
$ npm i -g pm2 // 如已经安装可以跳过此步
$ pm2 start pm2.config.js // 启动服务实例
```