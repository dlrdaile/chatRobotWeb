import {MessageBox} from 'element-ui';

const showRules = () => {
    MessageBox.alert('徐天行在乘坐火车前往香港西九龙的途中，' +
        '火车发生了神秘的爆炸，徐天行不幸遇难。' +
        '然而，他被卷入了一个代号为“悖论循环”的实验项目中，这个项目允许他的意识回到爆炸发生前的30分钟。' +
        '你作为实验项目的联络人，可以通过对话实时指挥徐天行的行动，' +
        '尝试找到爆炸源并揪出凶手，在一场场时间循环中阻止火车爆炸案的发生', '悖论循环之西九龙行动', {
        showConfirmButton: false,
        callback: action => {
            console.log(`action: ${action}`)
            // this.$message({
            //   type: 'info',
            //   message: `action: ${action}`
            // });
        }
    });
}

export default showRules