function $(elements) {
  return document.querySelector(elements);
}
function $add(elements) {
  return document.createElement(elements);
}

/**
 * @element 0:  墙
 * @element 1:  路
 * @element 2x: 门
 * @element 3:  英雄
 * @element 4x: 怪物
 * @element 5x: 楼梯
 * @element 6x: 增益道具
 */
class Game {
  level = [[
    [51, 1, 41, 42, 42, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [65, 1, 1, 21, 1, 0, 63, 67, 1, 0, 1],
    [1, 42, 1, 0, 1, 0, 65, 68, 1, 0, 1],
    [0, 22, 0, 0, 1, 0, 0, 0, 21, 0, 1],
    [66, 1, 1, 0, 1, 21, 62, 66, 65, 0, 1],
    [1, 45, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [0, 22, 0, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 22, 0, 0, 0, 22, 0],
    [65, 1, 67, 0, 63, 1, 64, 0, 1, 48, 1],
    [65, 68, 61, 0, 1, 3, 1, 0, 43, 65, 43]
  ], [
    [1, 67, 1, 0, 67, 61, 62, 0, 1, 1, 1],
    [66, 1, 68, 0, 66, 1, 66, 0, 67, 1, 65],
    [1, 1, 1, 0, 1, 45, 1, 0, 1, 41, 1],
    [0, 22, 0, 0, 0, 21, 0, 0, 0, 22, 0],
    [1, 42, 1, 21, 43, 1, 1, 44, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [45, 1, 46, 1, 1, 1, 1, 1, 1, 1, 1],
    [22, 0, 0, 21, 0, 0, 0, 22, 0, 0, 21],
    [1, 0, 1, 41, 1, 0, 1, 47, 1, 0, 1],
    [1, 0, 49, 1, 63, 0, 64, 1, 65, 0, 3],
    [51, 0, 61, 43, 62, 0, 1, 48, 1, 0, 52]
  ], [
    [52, 1, 21, 1, 1, 1, 1, 1, 1, 1, 1],
    [3, 1, 0, 0, 1, 48, 1, 48, 1, 0, 0],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [1, 0, 63, 63, 0, 1, 1, 1, 0, 1, 67],
    [1, 0, 61, 1, 22, 1, 1, 1, 21, 1, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [1, 0, 64, 1, 0, 1, 1, 1, 0, 1, 66],
    [1, 0, 1, 1, 21, 1, 1, 1, 22, 1, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [1, 0, 61, 62, 0, 1, 1, 1, 0, 1, 64],
    [51, 0, 61, 1, 22, 1, 1, 1, 22, 43, 1]
  ]];
  hero = {};
  flag = !1;
  floor = 0;
  goldenKey = 5; // 金钥匙
  silverKey = 6; // 银钥匙
  HP = 100; // 生命值
  damage = 10; // 攻击力
  defense = 10; // 防御力
  maps = this.level[this.floor];
  constructor() {
    this.draw();
    document.onkeydown = ({ keyCode }) => {
      switch (keyCode) {
        case 37:
          this.MobileForm(this.hero, { x1: this.hero.x - 1, y1: this.hero.y });
          break;
        case 38:
          this.hero.y > 0 && this.MobileForm(this.hero, { x1: this.hero.x, y1: this.hero.y - 1 });
          break;
        case 39:
          this.MobileForm(this.hero, { x1: this.hero.x + 1, y1: this.hero.y });
          break;
        case 40:
          this.hero.y >= 0 && this.hero.y <= 9 && this.MobileForm(this.hero, { x1: this.hero.x, y1: this.hero.y + 1 });
          break;
      }
    };
  }
  draw() {
    this.flag && $('.GameBox').remove();
    function getDiv(parent, className, html) {
      let div = $add("div");
      div.className = className;
      html && (div.innerHTML = html);
      parent.appendChild(div);
      return div;
    }
    let gameInterface = getDiv($(".center"), "GameBox");
    let informationBox = getDiv(gameInterface, "informationBox");
    getDiv(informationBox, "censhu", `第${this.floor + 1}层`);
    getDiv(informationBox, "keynumber", `金钥匙：<br>${this.goldenKey}把<br>银钥匙：<br>${this.silverKey}把`);
    getDiv(informationBox, "views", `生命：${this.HP}<br><br>攻击：${this.damage}<br><br>防御：${this.defense}`);
    getDiv(informationBox, "onceaggin", "重新开始").onclick = () => location.href += "?reload=true";
    this.maps.forEach((map, y) => map.forEach((grid, x) => {
      function getDiv(className, ischildren, html) {
        let div = $add("div");
        div.className = className;
        html && (div.innerHTML = html);
        ischildren && gameInterface.appendChild(div);
        return div;
      }
      switch (grid) {
        case 0:
          getDiv("grid wall", !0);
          break;
        case 1:
          getDiv("grid ground", !0);
          break;
        case 3:
          this.hero.y = y;
          this.hero.x = x;
          getDiv("grid hero", !0);
          break;
        case 99:
          getDiv("grid lu", !0);
          getDiv("die", !0, "你死了！");
          getDiv("agin", !0, "再来一次").onclick = () => location.href += "?reload=true";
          document.onkeydown = (event) => { };
          break;
        default:
          switch (parseInt(grid / 10)) {
            case 2:
              getDiv(`grid door${grid % 10}`, !0);
              break;
            case 4:
              getDiv(`grid emeny${grid % 10}`, !0);
              break;
            case 5:
              getDiv(`grid stairs${grid % 10}`, !0);
              break;
            case 6:
              getDiv(`grid props${grid % 10}`, !0);
              break;
          }
      }
    }));
    this.flag = !0;
  }
  MobileForm({ x, y }, { x1, y1 }) {
    switch (this.maps[y1][x1]) {
      case 1:
        this.maps[y1][x1] = 3;
        this.maps[y][x] = 1;
        break;
      case 21:
        if (this.goldenKey > 0) {
          this.maps[y1][x1] = 3;
          this.maps[y][x] = 1;
          this.goldenKey--;
        }
        break;
      case 22:
        if (this.silverKey > 0) {
          this.maps[y1][x1] = 3;
          this.maps[y][x] = 1;
          this.silverKey--;
        }
        break;
      case 51:
        this.floor >= 0 && this.floor < this.level.length - 1 && (this.maps = this.level[++this.floor]);
        break; // 上楼
      case 52:
        this.floor >= 1 && this.floor < this.level.length && (this.maps = this.level[--this.floor]);
        break; // 下楼
      default:
        if (this.maps[y1][x1] > 40 && this.maps[y1][x1] < 50 && this.HP > 0) {
          (this.HP -= this.maps[y1][x1] % 10 * 10) < 0 || (this.maps[y1][x1] = 3);
          this.maps[y][x] = this.HP < 0 ? 99 : 1;
        }
        else if (this.maps[y1][x1] > 60 && this.maps[y1][x1] < 70) {
          switch (this.maps[y1][x1] % 10) {
            case 0: break;
            case 1: break;
            case 2:
              this.defense += 10;
              break;
            case 3:
              this.damage += 10;
              break;
            case 4:
              this.damage += 15;
              this.defense += 15;
              break;
            case 5:
              this.HP += 100;
              break;
            case 6:
              this.HP += 50;
              break;
            case 7:
              this.goldenKey++;
              break;
            case 8:
              this.silverKey++;
              break;
            case 9: break;
          }
          this.maps[y1][x1] = 3;
          this.maps[y][x] = 1;
        }
    }
    this.draw();
  }
}

new Game();