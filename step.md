#### 1、初始化包

    mpn init -y

#### 2、配置命令

    如 vue init 、 react create-app 这样的指令是需要配置的，并且是全局的

    node会把可执行的文件都放在一个目录下，这个目录是bin目录，并创建一个文件，文件名是命令头，这里是crk

##### 2.1 自定义命令

    ===============>     #! /usr/bin/env node

    上面这行代码表示的意义是使用当前系统的node环境来执行这段代码

##### 2.2 将 bin 命令配置到全局

    "bin": "./bin/crk"

    或者通过键值对的方式进行匹配：需要注意的是，如果不使用键值对的方式的话package的name需要和bin下的文件名相同，即这里需要是crk而不能是crk-cli

    "bin": {
        "crk": "./bin/crk",
        "crk-cli": "./bin/crk"
    },

    通过link的方式来将本地的bin文件的crk指令放到全局，这里是为了本地测试，所以需要这么做，如果是上传到npm上的话，安装下来就是全局安装了，但是这里需要测试，所以需要通过link的方式连接到全局，如果之前配置过这个名字，那么可能会报错，如果想还是用这个名字的话，可以强制执行，执行之后，就可以跑crk这样的指令了

    这里有点需要注意的，用vscode编辑器的，如果是在编辑器上的控制台执行这些方法的话，可能会有问题，所以还是单独开个控制台进行这些指令的执行会比较好

    npm link 、 npm link --force

##### 获取 github 上的项目信息

    https://api.github.com/orgs/zhu-cli/repos： 如果是组织的话是orgs + 组织名 + repos

    https://api.github.com/users/crk123kk/repos：如果是用户的话是 users + 用户名 + repos
