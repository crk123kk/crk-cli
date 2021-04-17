const { fetchRepoList, fetchTagList } = require('./request');

const Inquirer = require('inquirer');
const { wrapLoading } = require('./util');

const downloadGitRepo = require('download-git-repo');

const util = require('util');

const path = require('path');

class Creator {
  constructor(projectName, targetDir) {
    this.projectName = projectName;
    this.targetDir = targetDir;
    // 原生的 downloadGitRepo 是不支持promise的，所以需要通过 util自带的方法将其转换成promise的方法
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  async fetchRepo() {
    // console.log('fetchRepo');
    // let repos = await fetchRepoList();
    // 失败重新拉取
    let repos = await wrapLoading(fetchRepoList, 'waiting fetch template');
    // console.log('repos :>> ', repos);
    if (!repos) return;
    repos = repos.map((item) => item.name);
    let { repo } = await Inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: 'please choose a template to create project',
    });

    return repo;
  }

  async fetchTag(repo) {
    let tags = await wrapLoading(fetchTagList, 'waiting fetch tag', repo);
    // console.log('tags :>> ', tags);

    if (!tags) return;
    tags = tags.map((item) => item.name);
    let { tag } = await Inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tags,
      message: 'please choose a tag to create project',
    });

    return tag;
  }

  async download(repo, tag) {
    // 1、需要拼接出下载路径
    // zhu-cli/vue-template#1.0
    let requestUrl = `zhu-cli/${repo}${tag ? '#' + tag : ''}`;
    // 2、把资源下载到某个路径上（后续可以增加缓存功能， 应该下载到系统目录中，稍后可以用ejs handlebar 去渲染模板 最后生成结果再写入）

    // 放到系统文件中 -> 模板和用户的其他选择 -> 生成结果放到当前目录
    // await this.downloadGitRepo(requestUrl, this.targetDir);
    // await this.downloadGitRepo(
    //   requestUrl,
    //   path.resolve(process.cwd(), `${repo}@${tag}`)
    // );
    await wrapLoading(
      this.downloadGitRepo,
      'waiting download',
      requestUrl,
      path.resolve(process.cwd(), `${repo}@${tag}`)
    );
    return this.targetDir;
  }

  async create() {
    // console.log('create');
    // 真实开始创建
    // 1、先去拉取当前组织下的模板
    let repo = await this.fetchRepo();
    // console.log('repo :>> ', repo);

    // 2、通过模板找到对应的版本号
    let tag = await this.fetchTag(repo);

    console.log(repo, tag);

    // 3、下载
    let downloadUrl = await this.download(repo, tag);

    // 4、根据下载好的模板进行编译
  }
}

module.exports = Creator;
