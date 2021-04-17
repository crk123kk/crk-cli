// 通过ora可以实现在命令窗口实现loading的效果
const ora = require('ora');

async function sleep(n) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, n);
  });
}

async function wrapLoading(fn, message, ...args) {
  const spinner = ora(message);
  // 开启加载
  spinner.start();

  try {
    // 执行传入的异步方法
    let repos = await fn(...args);
    spinner.succeed();
    return repos;
  } catch (e) {
    spinner.fail('request failed, refetch....');
    sleep(1000);
    return wrapLoading(fn, message, ...args);
  }
}

module.exports = {
  sleep,
  wrapLoading,
};
