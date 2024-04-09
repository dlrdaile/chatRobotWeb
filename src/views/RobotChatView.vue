<template>
  <div id="chat-robot">
    <div class="scroll-top" @click="scrollToTop">🚀</div>
    <div class="imui-center">
      <lemon-imui :user="user" ref="IMUI" :contextmenu="contextmenu" :contact-contextmenu="contactContextmenu"
                  :theme="theme" :hide-menu="hideMenu" :hide-menu-avatar="hideMenuAvatar"
                  :hide-message-name="hideMessageName"
                  :hide-message-time="hideMessageTime" @change-menu="handleChangeMenu"
                  @change-contact="handleChangeContact"
                  @pull-messages="handlePullMessages" @message-click="handleMessageClick"
                  @menu-avatar-click="handleMenuAvatarClick" @send="handleSend">
        <!--        :sendKey="sendKey"-->
        <template #editor-footer>
          使用 ctrl enter 快捷发送消息
        </template>
        <template #cover>
          <div class="cover">
            <i class="lemon-icon-message"></i>
            <p><b>自定义封面 Lemon</b> IMUI</p>
          </div>
        </template>
        <!--        <template #message-title="contact">-->
        <!--          <span>{{ contact.displayName }}</span>-->
        <!--          <small class="more" @click="changeDrawer(contact, $refs.IMUI)">{{-->
        <!--              ($refs.IMUI ? $refs.IMUI.drawerVisible : false) ? "关闭" : "打开"-->
        <!--            }}抽屉</small>-->
        <!--          <br/>-->
        <!--        </template>-->
      </lemon-imui>
    </div>
  </div>

</template>
<script>
import utilFunction from '@/utils/index'
import EmojiData from "@/data/database/emoji";
import {Message} from 'element-ui'

const ContactStatus = {
  NoStart: "noStart",
  InProgress: 'inProgress',
  Succeed: 'succeed',
  Failed: 'failed',
};
const generateMessage = (toContactId = "", content = "", fromUser) => {
  if (!fromUser) {
    fromUser = {
      id: "system",
      displayName: "系统测试",
      avatar: "http://upload.qqbodys.com/allimg/1710/1035512943-0.jpg",
    };
  }
  return {
    id: utilFunction.generateRandId(),
    status: "succeed",
    type: "text",
    sendTime: utilFunction.getTime(),
    content: content,
    //fileSize: 1231,
    //fileName: "asdasd.doc",
    toContactId,
    fromUser,
  };
};
export default {
  name: "robotChat",
  data() {
    return {
      theme: "blue",
      isGameOver: false,
      // 初始时间设置为当天的八点
      defaultCurrentTime: new Date(new Date().setHours(8, 0, 0, 0)).getTime(),
      // currentTime: new Date(new Date().setHours(8, 0, 0, 0)).getTime(),
      currentContactTimes: 0,
      contactSet: {},
      // sendKey: (e) => {
      //   return e.keyCode === 13;
      // },
      contactContextmenu: [
        {
          text: "开启新一轮聊天",
          click: (contact, instance, hide) => {
            this.getNewContact(contact.id)
            hide();
          },
        },
      ],
      contextmenu: [],
      hideMenuAvatar: false,
      hideMenu: true,
      hideMessageName: false,
      hideMessageTime: false,
      user: {
        id: utilFunction.generateRandId(),
        displayName: "顾文博",
        avatar: "https://dl-demo-test1.oss-cn-beijing.aliyuncs.com/myBlog/imgassets%2Fimg%2F2024%2F03%2F23%2F19-29-55-e1db4271da92d6d155ebe81512ddc1bc-df636ce9cc9f30ab8e03ad25686e3f9-c65f44.png",
      },
    }
  },
  created() {
    this.$store
        .dispatch('api_key_valid/defaultValidateApiKey', this.$store.getters.client_id)
        .then(() => {
          Message({
            message: '校验成功',
            type: 'success'
          })
          this.$socket.connect()
          this.$socket.registerCallBack("sendData", this.handleReceiveData)
          this.$socket.registerCallBack("backFail", this.handleBackFail)
        })

  },
  destroyed() {
    this.$socket.unRegisterCallBack('sendData')
    this.$socket.close()
  },
  mounted() {
    const {IMUI} = this.$refs;
    let contactList = [];
    IMUI.initContacts(contactList);
    const currentContact = this.getNewContact();
    IMUI.setLastContentRender("event", message => {
      return `[自定义通知内容]`;
    });

    IMUI.initMenus([
      {
        name: "messages",
      },
      {
        name: "contacts",
      },
    ]);

    IMUI.initEditorTools([
      {
        name: "uploadFile",
      },
      {
        name: "uploadImage",
      },
    ]);
    IMUI.initEmoji(EmojiData);

    IMUI.setLastContentRender("voice", message => {
      return <span>[语音]</span>;
    });
  },
  computed: {
    currentContactStr: function () {
      return `contact-${this.currentContactTimes}`;
    },
  },
  methods: {
    handleBackFail(data) {
      Message({
        message: `后端发生异常，错误原因为：${data}`,
        type: 'error',
        duration: 2 * 1000
      })
      // this.isGameOver = true;
      // const {IMUI} = this.$refs;
      // const messages = IMUI.getCurrentMessages();
      // const message = messages[messages.length - 1];
      // if (messages.length > 0 && message.fromUser.id === this.user.id) {
      //   const update = {
      //     id: message.id,
      //     status: "failed",
      //   };
      //   if (message.type === "event") {
      //     update.fromUser = this.user;
      //   }
      //   IMUI.updateMessage(update);
      //   IMUI.messageViewToBottom();
      // }

    },
    scrollToTop() {
      document.body.scrollIntoView();
    },
    getNewContact() {
      const {IMUI} = this.$refs;

      this.currentContactTimes += 1;
      const currentContact = {
        id: this.currentContactStr,
        displayName: `徐天行${this.currentContactTimes}`,
        avatar: "https://dl-demo-test1.oss-cn-beijing.aliyuncs.com/myBlog/imgassets%2Fimg%2F2024%2F03%2F23%2F19-30-00-3e3888ea071cad811454261db447c0fe-fbb7c5f5807747ddbe57a1d1a395860-b73d21.png",
        index: "T",
        unread: 0,
        lastContent: "准备开始游戏吧",
        status: ContactStatus.NoStart,
        currentTime: this.defaultCurrentTime,
        version: this.currentContactTimes
      };
      for (let key in this.contactSet) {
        let item = this.contactSet[key]
        if (item && (item.status === ContactStatus.NoStart || item.status === ContactStatus.InProgress)) {
          item.status = ContactStatus.Failed
        }
      }


      this.contactSet[currentContact.id] = currentContact;
      IMUI.appendContact(currentContact);
      setTimeout(() => {
        IMUI.changeContact(currentContact.id);
      }, 500);
      return currentContact;
    },
    handleReceiveData(data) {
      const {IMUI} = this.$refs;
      //将data.content使用。进行分割并遍历
      // 失败
      if (data.end === 2) {
        Message({
          message: '炸弹爆炸，当前游戏失败',
          type: 'error',
          duration: 2 * 1000
        })
        let content = (
            <span>
          <b>监测到爆炸冲击波，通讯中断</b>
        </span>
        );
        this.appendEventMessage(data, content);
        this.contactSet[data.toContactId].status = ContactStatus.Failed;
        this.getNewContact();
      } else if (data.end === 1) {
        this.handleSuccess()
      } else {

        if (this.contactSet[data.toContactId].status === ContactStatus.Failed
            || this.contactSet[data.toContactId].status === ContactStatus.Succeed) {
          return
        }
        this.contactSet[data.toContactId].status = ContactStatus.InProgress;
        let contentArr = data.content.split('。')
        for (let i = 0; i < contentArr.length; i++) {
          let item = contentArr[i]
          if (item === '') {
            continue
          }
          let message = generateMessage(data.toContactId, item, this.user);
          message.sendTime = utilFunction.timeStringToTimestamp(data.sendTime);
          message.fromUser = {
            ...this.contactSet[data.toContactId]
          };
          this.contactSet[data.toContactId].currentTime = message.sendTime;
          //如果item中有爆炸一词，对话结束
          IMUI.appendMessage(message, true);
        }
      }
    },
    handleSuccess(data) {
      Message({
        message: '游戏胜利！',
        type: 'success',
        duration: 2 * 1000
      })
      let content = (
          <span>
          <b>{`游戏胜利！恭喜你在第${this.currentContactTimes}轮循环中成功解决西九龙危机`}</b>
        </span>
      );
      this.appendEventMessage(data, content);
      this.contactSet[data.toContactId].status = ContactStatus.Succeed;
      this.isGameOver = true;
    },
    getInitMessage(contactId) {
      const message = {
        id: utilFunction.generateRandId(),
        type: "text",
        content: "让我们开始吧",
        time: 0,
        fromUser: this.user,
        status: "succeed",
        toContactId: contactId,
        sendTime: this.contactSet[contactId].currentTime,
      };
      let sendData = {
        data: message,
        socketType: 'userInfo'
      }
      this.$socket.send(sendData)
    },
    appendEventMessage(data, content) {
      const {IMUI} = this.$refs;
      let message = generateMessage(data.toContactId, "", this.user);
      message.sendTime = utilFunction.timeStringToTimestamp(data.sendTime);
      message.fromUser = {
        ...IMUI.contacts[data.toContactId]
      };
      message.content = content;
      message.type = "event";
      IMUI.appendMessage(message, true);
    },
    // 改变侧边栏的Menu
    handleChangeMenu() {
      console.log("Event:change-menu");
    },
    // 改变对话的人
    handleChangeContact(contact, instance) {
      console.log("Event:change-contact");
      instance.updateContact({
        id: contact.id,
        unread: 0,
      });
      instance.closeDrawer();
      if (
          this.contactSet[contact.id].status === ContactStatus.NoStart) {
        console.log('开始游戏')
        this.getInitMessage(contact.id)
      }
    },
    // 发送消息
    handleSend(message, next, file) {
      message.content = message.content.trim();
      if (this.isGameOver) {
        Message({
          message: '游戏已经结束，请重新开始',
          type: 'warning',
          duration: 2 * 1000
        })
        message.status = "failed";
      }
      if (this.contactSet[message.toContactId].status === ContactStatus.Failed
          || this.contactSet[message.toContactId].status === ContactStatus.Succeed) {
        Message({
          message: '该轮循环已经结束，请在下一轮循环中进行行动',
          type: 'warning',
          duration: 2 * 1000
        })
        message.status = "failed";
      } else {
        let sendData = {
          data: message,
          socketType: 'userInfo'
        }
        this.$socket.send(sendData)

        message.sendTime = this.contactSet[message.toContactId].currentTime;
        setTimeout(() => {
          next();
        }, 1000);
      }


    },
    // 查看历史记录
    handlePullMessages(contact, next, instance) {
      const otheruser = {
        id: contact.id,
        displayName: contact.displayName,
        avatar: contact.avatar,
      };
      // 拉取历史消息
      setTimeout(() => {
        const messages = [];
        let isEnd = true;
        // if (
        //     instance.getMessages(instance.currentContactId).length +
        //     messages.length >
        //     11
        // )
        //   isEnd = true;
        next(messages, isEnd);
      }, 500);
    },
    // 处理头像被点击
    handleMenuAvatarClick() {
      console.log("Event:menu-avatar-click");
    },
    handleMessageClick(e, key, message, instance) {
      console.log("点击了消息", e, key, message);
      if (key === "status") {
        instance.updateMessage({
          id: message.id,
          status: "going",
        });
        setTimeout(() => {
          instance.updateMessage({
            id: message.id,
            status: "succeed",
          });
        }, 1000);
        this.handleSend(message, () => {
        });
      }
    },
  },

}
</script>

<style lang="stylus">
::selection {
  background: #000;
  color: #fff;
}

body
  font-family "Microsoft YaHei"
  background #f6f6f6 !important

#chat-robot
  width 90%
  margin 0 auto
  padding-bottom 100px

  .scroll-top
    cursor pointer
    position fixed
    bottom 40px
    left 50%
    border-radius 50%
    background #fff
    font-size 18px
    overflow hidden
    width 40px
    height 40px
    line-height 40px
    user-select none
    text-align center
    transform rotate(-45deg) translateX(-50%)
    box-shadow 0 0 30px rgba(0, 0, 0, 0.1);

    &:hover
      font-size 22px

a
  color #0c5ed9
  text-decoration none
  font-size 12px

.action
  margin-top 20px

  .lemon-button
    margin-right 10px
    margin-bottom 10px

.link
  font-size 14px
  margin-top 15px

  a
    display inline-block
    margin 0 5px
    text-decoration none
    background #ffba00
    border-radius 4px
    padding 5px 10px
    color rgba(0, 0, 0, 0.8)

.logo
  position relative
  display inline-block
  margin 60px auto
  user-select none

.logo-text
  font-size 38px

.logo-sub
  font-size 18px
  color #999
  font-weight 300

.logo-badge
  position absolute
  top -10px
  left 230px
  background #000
  border-radius 16px
  color #f9f9f9
  font-size 12px
  padding 4px 8px

.title
  font-size 24px
  line-height 26px
  border-left 1px solid #ffba00
  padding-left 15px
  margin-bottom 15px
  margin-top 30px
  user-select none

.table
  width 100%
  border-radius 10px
  background #fff
  border-collapse collapse

  tr
    cursor pointer

  tr:not(.table-head):hover
    background #ffba00 !important

  tr:nth-of-type(even)
    background #f9f9f9

  th
    user-select none
    color #999

  td,
  th
    text-align left
    padding 10px 15px
    font-size 14px
    font-weight normal

.imui-center
  margin-bottom 60px

  .lemon-wrapper
    border: 1px solid #ddd;

  .lemon-drawer
    border: 1px solid #ddd;
    border-left: 0;

.drawer-content
  padding 15px

.more
  font-size 12px
  line-height 24px
  height 24px
  position absolute
  top 14px
  right 14px
  cursor pointer
  user-select none
  color #f1f1f1
  display inline-block
  border-radius 4px
  background #111
  padding 0 8px

  &:active
    background #999

.bar
  text-align center
  line-height 30px
  background #fff
  margin 15px
  color #666
  user-select none
  font-size 12px

.cover
  text-align center
  user-select none
  position absolute
  top 50%
  left 50%
  transform translate(-50%, -50%)

  i
    font-size 84px
    color #e6e6e6

  p
    font-size 18px
    color #ddd
    line-height 50px

.article-item
  line-height 34px
  cursor pointer

  &:hover
    text-decoration underline
    color #318efd

pre
  background #fff
  border-radius 8px
  padding 15px

.lemon-simple .lemon-container {
  z-index: 5
}

.lemon-simple .lemon-drawer {
  z-index: 4
}


input#switch[type=checkbox] {
  height: 0;
  width: 0;
  display: none;
}

label#switch-label {
  cursor: pointer;
  text-indent: -9999px;
  width: 34px;
  height: 20px;
  background: #aaa;
  display: block;
  border-radius: 100px;
  position: relative;
}

label#switch-label:after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 20px;
  transition: 0.3s;
}

input#switch:checked + label {
  background: #0fd547;
}

input#switch:checked + label:after {
  left: calc(100% - 2px);
  transform: translateX(-100%);
}

label#switch-label:active:after {
  width: 20px;
}
</style>