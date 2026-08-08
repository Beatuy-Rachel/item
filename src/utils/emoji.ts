const emojiMap: Array<{ keywords: string[]; emoji: string }> = [
  { keywords: ['手机', 'iphone', 'phone', '苹果', '华为', '小米', '荣耀', '三星', 'oppo', 'vivo', '魅族'], emoji: '📱' },
  { keywords: ['电脑', '笔记本', 'macbook', 'mac', 'laptop', '联想', 'thinkpad', '游戏本'], emoji: '💻' },
  { keywords: ['平板', 'ipad', 'tablet'], emoji: '📟' },
  { keywords: ['耳机', 'airpods', '耳机', 'sony', '索尼', 'bose', '耳塞'], emoji: '🎧' },
  { keywords: ['手表', 'watch', 'iwatch', 'apple watch', '智能手表', '机械表', '腕表'], emoji: '⌚' },
  { keywords: ['相机', 'camera', '佳能', '尼康', '索尼', '富士', '徕卡', '单反', '微单'], emoji: '📷' },
  { keywords: ['键盘', 'keyboard', '机械键盘'], emoji: '⌨️' },
  { keywords: ['鼠标', 'mouse', '罗技'], emoji: '🖱️' },
  { keywords: ['显示器', '屏幕', 'monitor', '显示屏'], emoji: '🖥️' },
  { keywords: ['音响', '音箱', 'speaker', '音响', 'b&o', 'bose'], emoji: '🔊' },
  { keywords: ['游戏机', 'switch', 'ps5', 'playstation', 'xbox', '任天堂', '掌机'], emoji: '🎮' },
  { keywords: ['无人机', 'dji', '大疆', '航拍'], emoji: '🚁' },
  { keywords: ['u盘', '硬盘', '固态硬盘', 'ssd', '移动硬盘', '存储'], emoji: '💾' },
  { keywords: ['充电器', '充电头', '充电宝', '移动电源', '快充', 'anker'], emoji: '🔋' },
  { keywords: ['沙发', 'sofa', '沙发床'], emoji: '🛋️' },
  { keywords: ['桌子', '书桌', '办公桌', '餐桌', 'table', '茶几'], emoji: '🪑' },
  { keywords: ['椅子', '办公椅', '电竞椅', '人体工学', 'chair'], emoji: '💺' },
  { keywords: ['床', '床垫', '枕头', '被'], emoji: '🛏️' },
  { keywords: ['灯', '台灯', '落地灯', '吊灯', 'light', 'lamp', '氛围灯'], emoji: '💡' },
  { keywords: ['电视', 'tv', '电视机', '投影', '投影仪', '极米', '坚果'], emoji: '📺' },
  { keywords: ['冰箱', '冷藏', '冰柜'], emoji: '🧊' },
  { keywords: ['洗衣机', '洗烘', '烘干机', '洗衣'], emoji: '🧺' },
  { keywords: ['空调', 'air', '冷气', '暖气'], emoji: '❄️' },
  { keywords: ['咖啡机', '咖啡', '意式', '手冲', '磨豆机'], emoji: '☕' },
  { keywords: ['水壶', '烧水壶', '保温杯', '水杯', '杯子', 'bottle'], emoji: '🫖' },
  { keywords: ['衣服', '外套', '卫衣', 't恤', '衬衫', '毛衣', '裤子', '牛仔裤', '夹克'], emoji: '👕' },
  { keywords: ['鞋', '运动鞋', '球鞋', '跑鞋', '皮鞋', '靴子', 'nike', '耐克', 'adidas', '阿迪'], emoji: '👟' },
  { keywords: ['包', '背包', '书包', '双肩包', '手提包', '挎包', '钱包', '背包'], emoji: '🎒' },
  { keywords: ['帽子', '鸭舌帽', '棒球帽', '贝雷帽'], emoji: '🧢' },
  { keywords: ['眼镜', '墨镜', '太阳镜', 'rayban'], emoji: '🕶️' },
  { keywords: ['香水', '香氛', '香薰', '蜡烛'], emoji: '🕯️' },
  { keywords: ['护肤', '化妆品', '精华', '面霜', '洗面奶', '口红', '粉底'], emoji: '💄' },
  { keywords: ['书', '书籍', '小说', 'kindle', '电子书'], emoji: '📚' },
  { keywords: ['吉他', '钢琴', '乐器', '小提琴', '尤克里里'], emoji: '🎸' },
  { keywords: ['滑板', '轮滑', '滑板车'], emoji: '🛹' },
  { keywords: ['自行车', '单车', '公路车', '山地车'], emoji: '🚲' },
  { keywords: ['汽车', '车', '车载'], emoji: '🚗' },
  { keywords: ['花', '绿植', '植物', '盆栽', '多肉'], emoji: '🪴' },
  { keywords: ['画', '装饰画', '挂画'], emoji: '🖼️' },
  { keywords: ['宠物', '猫', '狗', '猫粮', '狗粮', '猫砂'], emoji: '🐱' },
  { keywords: ['运动', '健身', '瑜伽', '哑铃', '跑步机', '蛋白粉'], emoji: '🏋️' },
  { keywords: ['厨房', '锅', '刀具', '碗', '盘子', '餐具'], emoji: '🍳' },
];

export function getEmojiForItem(name: string): string {
  const lowerName = name.toLowerCase();
  
  for (const item of emojiMap) {
    for (const keyword of item.keywords) {
      if (lowerName.includes(keyword.toLowerCase())) {
        return item.emoji;
      }
    }
  }
  
  return '📦';
}
