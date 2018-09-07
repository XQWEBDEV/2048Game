//2048游戏对象
var game = {
  dataArr: [],
  score: 0,
  rn: 4,
  cn: 4,
  numberCon: document.getElementById('number-container'),
  init: function () { //游戏初始化
    //隐藏游戏结束的盒子
    var div = document.getElementById("gameover");
    div.style.display = "none";
    //初始化分数
    this.score = 0;
    var score = document.getElementById('score');
    score.inenrHTML = 0;
    //number数组的值,设置为一个二维数组,来存储相应位置的数字
    this.dataArr = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    //生成两个初始的数字
    this.productOneNumber();
    this.productOneNumber();

    //更新网格里的数字显示
    this.updateView();

    //事件监听
    window.document.onkeydown = function (event) {
      event = event || window.event;
      event.preventDefault();
      switch (event.keyCode) {
        case 37: //左移
          game.moveLeft();
          break;
        case 39: //右移
          game.moveRight();
          break;
        case 40: //下移
          game.moveDown();
          break;
        case 38: //上移
          game.moveUp();
          break;
      }
    }
  },
  productOneNumber: function () { //产生一个随机的数字
    if (!this.isFull()) {
      //产生两个随机的位置坐标
      while (true) {
        var ranX = Math.floor(Math.random() * this.rn);
        var ranY = Math.floor(Math.random() * this.cn);

        //判断该位置是否存在数字
        if (this.dataArr[ranX][ranY] == 0) {
          break;
        }
      }
      //设置初始值为2或4
      this.dataArr[ranX][ranY] = Math.random() > 0.5 ? 4 : 2;
    }
  },
  isFull: function () { //判断数组是否已满
    for (var row = 0; row < this.rn; row++) { //遍历二维数组
      for (var col = 0; col < this.cn; col++) {
        // 只要发现当前元素==0
        if (this.dataArr[row][col] == 0) {
          return false;
        }
      }
    }
    //(如果循环正常退出)
    return true;
  },
  isGameOver: function () { //判断游戏是否结束
    if (!this.isFull()) { //如果数据数组没有满
      return false;
    }
    if (this.isFull) { //如果数组已经满了
      for (var row = 0; row < this.rn; row++) {
        for (var col = 0; col < this.cn; col++) {

          //判断横向上是否存在相同的数字
          //判断是不是最右侧的元素
          if (col != this.cn - 1) {
            //判断当前位置和右侧的位置的数字是否相等
            if (this.dataArr[row][col] === this.dataArr[row][col + 1]) {
              return false;
            }
          }

          //判断纵向上是否存在相同的数字
          //判断是不是最下侧的元素
          if (row != this.rn - 1) {
            //判断当前位置的数字是否和下面的位置的数字是否相等
            if (this.dataArr[row][col] == this.dataArr[row + 1][col]) {
              return false;
            }
          }
        }
      }
    }
    return true;
  },
  updateView: function () { //更新网格里的数字显示
    for (var row = 0; row < this.rn; row++) {
      for (var col = 0; col < this.cn; col++) {
        //当前位置的值
        var number = this.dataArr[row][col];
        //当前位置的数字格子
        var theNumberCel = document.getElementById('number-cell-' + row + '-' + col);
        if (number != 0) { //如果对应位置存在数字
          //将对应的数字给数字格子
          theNumberCel.innerHTML = number;
          //设置数字格子的字体颜色和背景颜色
          theNumberCel.style.backgroundColor = this.getBgcolor(number);
          theNumberCel.style.color = this.getNumberColor(number);
          if(number>10000){
            theNumberCel.style.fontSize = '35px';
          }
        } else {
          theNumberCel.innerHTML = '';
          theNumberCel.style.backgroundColor = 'transparent';
        }
      }
    }
    //获取分数
    var span = document.getElementById('score');
    span.innerHTML = this.score;
    if (this.isGameOver()) {
      var div = document.getElementById("gameover");
      var endScore = document.getElementById('endScore');
      endScore.innerHTML = this.score;
      div.style.display = "block";
      document.onkeydown = function(event){
        if(event.keyCode == 13){
          game.newGame();
        }
      }
    }
  },
  getNumberColor: function (number) { //获取数字的颜色
    if (number <= 4) { //小于等于4数字的颜色
      return '#776e65'
    }
    return '#fff'
  },
  getBgcolor: function (number) { //获取对应数字的背景颜色
    switch (number) {
      case 2:
        return "#eee4da";
        break;
      case 4:
        return "#eee4da";
        break;
      case 8:
        return "#f26179";
        break;
      case 16:
        return "#f59563";
        break;
      case 32:
        return "#f67c5f";
        break;
      case 64:
        return "#f65e36";
        break;
      case 128:
        return "#edcf72";
        break;
      case 256:
        return "#edcc61";
        break;
      case 512:
        return "#9c0";
        break;
      case 1024:
        return "#3365a5";
        break;
      case 2048:
        return "#09c";
        break;
      case 4096:
        return "#a6bc";
        break;
      case 8192:
        return "#93c";
        break;
    }
    return "black";
  },

  //实现左移
  //查找右侧第一个不为0的位置
  getNextRight: function (row, col) {
    for (var nextc = col + 1; nextc < this.cn; nextc++) {
      if (this.dataArr[row][nextc] != 0) {
        return nextc;
      }
    }
    return -1 //如果不存在就返回-1
  },
  //水平移动更改格子数字
  moveInRow: function (row, col, nextc, method) {
    //如果当前的位置为0
    if (this.dataArr[row][col] == 0) {
      //调换两个位置的值
      this.dataArr[row][col] = this.dataArr[row][nextc];
      this.dataArr[row][nextc] = 0;
      return method == 'left'?-1:1;
    } else if (this.dataArr[row][col] == this.dataArr[row][nextc]) {
      //如果当前位置的值与右侧一个不为0位置的值相等
      //将当前位置的值翻倍,
      this.dataArr[row][col] *= 2;
      //下一个位置设置为0
      this.dataArr[row][nextc] = 0;
      //更改分数
      this.score += this.dataArr[row][col];
    }
  },
  //移动指定行
  moveLeftInRow: function (row) {
    for (var col = 0; col < this.cn - 1; col++) { //遍历前面的3列
      var nextc = this.getNextRight(row, col);
      if (nextc == -1) { //如果右侧不存在不为0的数字
        break;
      }else{
        var res = this.moveInRow(row,col,nextc,'left');
        res == -1&&col--;
      }
    }
  },
  //左移所有行
  moveLeft: function () {
    var oldStr = this.dataArr.toString();
    for (var row = 0; row < this.rn; row++) {
      this.moveLeftInRow(row);
    }
    var newStr = this.dataArr.toString();
    if (oldStr != newStr) {
      this.productOneNumber();
      this.updateView();
    }
  },
  //实现右移
  getLeftNext: function (row, col) { //查找左侧下一个不为0的位置
    //因为是找最左侧的第一个所以是从col-1开始查找
    for (var nextc = col - 1; nextc >= 0; nextc--) {
      if (this.dataArr[row][nextc] != 0) {
        return nextc;
      }
    }
    return -1 //如果不存在就返回-1
  },
  //移动指定行
  moveRightInRow: function (row) { //实现指定行的右移
    //col从cn-1开始，到>0结束
    for (var col = this.cn - 1; col > 0; col--) {
      var nextc = this.getLeftNext(row, col);
      if (nextc == -1) {
        break;
      }
      var res = this.moveInRow(row,col,nextc,'right');
      res == 1&&col++;
    }
  },
  //右移所有行
  moveRight: function () {
    var oldStr = this.dataArr.toString();
    for (var row = 0; row < this.rn; row++) {
      this.moveRightInRow(row);
    }
    var newStr = this.dataArr.toString();
    if (oldStr != newStr) { //数字是否有移动
      this.productOneNumber();
      this.updateView();
    }
  },

  //实现下移
  getNextUp: function (row, col) {
    for (var nextr = row - 1; nextr >= 0; nextr--) {
      if (this.dataArr[nextr][col] != 0) {
        return nextr
      }
    }
    return -1;
  },
  //水平移动
  moveInCol:function(row,col,nextr,method){
    if (this.dataArr[row][col] == 0) {
      this.dataArr[row][col] = this.dataArr[nextr][col];
      this.dataArr[nextr][col] = 0;
      return method == 'down'?-1:1;
    } else if (this.dataArr[row][col] == this.dataArr[nextr][col]) {
      this.dataArr[row][col] *= 2;
      this.dataArr[nextr][col] = 0;
      this.score += this.dataArr[row][col];
    }
  },
  moveDownInCol: function (col) { //移动指定的列
    for (var row = this.rn - 1; row > 0; row--) {
      var nextr = this.getNextUp(row, col);
      if (nextr == -1) {
        break;
      } 
      var res = this.moveInCol(row,col,nextr,'down');
      res == -1 && row--;
    }
  },
  //下移所有列
  moveDown: function () {
    var oldStr = this.dataArr.toString();
    for (var col = 0; col < this.cn; col++) {
      this.moveDownInCol(col);
    }
    var newStr = this.dataArr.toString();
    if (newStr != oldStr) {
      this.productOneNumber();
      this.updateView();
    }
  },
  //实现上移
  getNextDown: function (row, col) {
    for (var nextr = row + 1; nextr < this.rn; nextr++) {
      if (this.dataArr[nextr][col] != 0) {
        return nextr
      }
    }
    return -1;
  },
  moveUpInCol: function (col) { //移动指定的列
    for (var row = 0; row < this.rn; row++) {
      var nextr = this.getNextDown(row, col);
      if (nextr == -1) {
        break;
      } 
      var res = this.moveInCol(row,col,nextr,'down');
      res == 1 && row++;
    }
  },
  //上移所有列
  moveUp: function () {
    var oldStr = this.dataArr.toString();
    for (var col = 0; col < this.cn; col++) {
      this.moveUpInCol(col);
    }
    var newStr = this.dataArr.toString();
    if (newStr != oldStr) {
      this.productOneNumber();
      this.updateView();
    }
  },
  newGame: function () {
    this.init();
  }
}

window.onload = function () {
  //开始游戏
  game.newGame();
}