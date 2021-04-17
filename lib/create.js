const path = require('path');

// const fs = require('fs');
// fs局限性太大，又不能用promise，所以采用fs-extra
const fs = require('fs-extra');

// 实现提供用户选项的功能
const Inquirer = require('inquirer');
const Creator = require('./Creator');

module.exports = async function (projectName, options) {
  console.log(projectName, options);

  // 创建项目

  // node指令：获取当前命令执行时的工作目录
  const cwd = process.cwd();
  // 通过cwd 和 projectName可以获取当前目录下的项目路径
  //   console.log(cwd);

  const targetDir = path.join(cwd, projectName);
  console.log('targetDir :>> ', targetDir);

  if (fs.existsSync(targetDir)) {
    if (options.force) {
      // 如果是强制创建，删除已经存在的
      console.log('11111');
      await fs.remove(targetDir);
    } else {
      // 如果没有带强制创建，则提供用户选项，通过 Inquirer 实现
      let { action } = await Inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: `Target directory already exsist pick an action`,
          choices: [
            { name: 'Overwrite', value: 'overwrite' },
            { name: 'Cancle', value: false },
          ],
        },
      ]);
      if (!action) {
        return;
      } else if (action === 'overwrite') {
        console.log('remove....');
        await fs.remove(targetDir);
        console.log('finally...');
      }
    }
  }

  // 如果项目已经存在，则删除原有项目
  // 删除项目之后就可以开始创建项目了
  const creator = new Creator(projectName, targetDir);
  // 开始创建项目
  creator.create();
};
