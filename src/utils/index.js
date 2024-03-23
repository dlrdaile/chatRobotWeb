const getTime = () => {
    return new Date().getTime();
};

const generateRandId = () => {
    return Math.random()
        .toString(36)
        .substr(-8);
};
const generateRandWord = () => {
    return Math.random()
        .toString(36)
        .substr(2);
};
const timeStringToTimestamp = (timeStr) => {
    // 获取当前日期
    var currentDate = new Date();

    // 将时间字符串转换为时间对象
    var time = new Date(currentDate.toDateString() + ' ' + timeStr);

    // 转换为时间戳
    var timestamp = time.getTime(); // 时间戳通常是以秒为单位，除以1000转换为秒

    return timestamp;
}
export default {
    generateRandId,
    generateRandWord,
    getTime,
    timeStringToTimestamp,

}