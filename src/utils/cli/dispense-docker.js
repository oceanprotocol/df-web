const croner = require('croner')
var exec = require('child_process').exec;

async function dispense(cmd) {
    await new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
                reject();
            }

            resolve();
        })
    })
    .then(() => {
        console.log("Success!")
    })
    .catch((err) => {
        console.log("Exception!")
    })
}

async function dispenseAllRewards() {
    console.log(">>>>> Rewards Rinkeby");
    await dispense('./dfpy_docker dispense /app/data/rewards/ 4 0x4751774A124D02f1611dFe17f4d697dDdF932Fd5 0xe6239d757c064c237dF31e08EbdD582f0608aCE0 >> out.log')
    await dispense('./dfpy_docker dispense /app/data/rewards/ 4 0x4751774A124D02f1611dFe17f4d697dDdF932Fd5 0xc6913d3eCed79021a39E6955015313B22B72b76E >> out.log');

    console.log(">>>>> Rewards Ropsten");
    await dispense('./dfpy_docker dispense /app/data/rewards/ 3 0x8FD70a9E20DAcDff6ab5905E94742afE5AE40f16 0x400a17C7644fEF90EC5e85C59BA2034A6D4B1366 >> out.log');
    await dispense('./dfpy_docker dispense /app/data/rewards/ 3 0x8FD70a9E20DAcDff6ab5905E94742afE5AE40f16 0x0d92cadB0A0BC3693e985FB15E47BcF4d1Dc3792 >> out.log');
}

croner.Cron('* */12 * * *', () => {
    dispenseAllRewards();
})
