import {MessageBox} from 'element-ui';

const showRules = () => {
    MessageBox.alert('这是一段内容', '标题名称', {
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