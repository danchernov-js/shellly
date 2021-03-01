//рисует по координатам, заливка и обводка
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === "undefined") {
      stroke = true;
    }
    if (typeof radius === "undefined") {
      radius = 5;
    }
    if (typeof radius === "number") {
      radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
      var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(
      x + width,
      y + height,
      x + width - radius.br,
      y + height
    );
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  }

function drawImage(gCanvas, item) {    
    const gCtx = gCanvas.getContext("2d");

    //Variables
    var x = 20; //для ширины
    var y = 10; //для высоты
    var barH = 40; //для высоты хэдера
    var borderR = 10; //для скругления
    var circleOffsetX = 14; //для смещения круга по оси х
    var circleR = 5; //для радиус кружочка мака

    //Canvas size
    gCanvas.width = item.img.width + x * 2;
    gCanvas.height = item.img.height + y * 4 + barH;

    //Browser window shadow; 
    gCtx.globalAlpha = 0.2; //прозрачноть 20%
    gCtx.shadowColor = "black";
    gCtx.shadowOffsetY = 10; //отображение вниз на 10
    gCtx.shadowBlur = 15; //размытие тени
    gCtx.fillStyle = "rgb(201,201,201)"; //чекнуть, можно убрать
    roundRect(
      gCtx,
      x,
      y,
      item.img.width,
      item.img.height + barH,
      borderR,
      true,
      false
    ); //скругленные углы тени

    //Browser window; удалить
    gCtx.globalAlpha = 1;
    gCtx.shadowOffsetY = 0; //чекнуть, можно ли убрать
    gCtx.shadowBlur = 0;
    gCtx.fillStyle = "rgb(201,201,201)"; //чекнуть можно ли убрать
    roundRect( //чекнуть можно л убрать
      gCtx,
      x,
      y,
      item.img.width,
      item.img.height + barH,
      borderR,
      true,
      false
    );

    //Browser bar 
    gCtx.shadowOffsetY = 0;
    gCtx.shadowBlur = 0;
    gCtx.fillStyle = "rgb(255,255,255)";
    roundRect(
      gCtx,
      x,
      y,
      item.img.width,
      barH,
      { tl: borderR, tr: borderR },
      true,
      false
    );

    //Red circle ободок
    gCtx.fillStyle = "rgb(223,72,69)";
    roundRect(
      gCtx,
      x + circleOffsetX + 20 * 0,
      y + circleOffsetX,
      12,
      12,
      circleR + 1,
      true,
      false
    );
    //красное тело
    gCtx.fillStyle = "rgb(252,97,93)";
    roundRect(
      gCtx,
      x + circleOffsetX + 20 * 0 + 1,
      y + circleOffsetX + 1,
      12 - 2,
      12 - 2,
      circleR,
      true,
      false
    );

    //Yellow circle
    gCtx.fillStyle = "rgb(222,160,52)";
    roundRect(
      gCtx,
      x + circleOffsetX + 20 * 1,
      y + circleOffsetX,
      12,
      12,
      circleR + 1,
      true,
      false
    );

    gCtx.fillStyle = "rgb(253,189,65)";
    roundRect(
      gCtx,
      x + circleOffsetX + 20 * 1 + 1,
      y + circleOffsetX + 1,
      12 - 2,
      12 - 2,
      circleR,
      true,
      false
    );

    //Green circle
    gCtx.fillStyle = "rgb(40,171,53)";
    roundRect(
      gCtx,
      x + circleOffsetX + 20 * 2,
      y + circleOffsetX,
      12,
      12,
      circleR + 1,
      true,
      false
    );

    gCtx.fillStyle = "rgb(52,200,74)";
    roundRect(
      gCtx,
      x + circleOffsetX + 20 * 2 + 1,
      y + circleOffsetX + 1,
      12 - 2,
      12 - 2,
      circleR,
      true,
      false
    );

    //Browser search bar
    gCtx.fillStyle = "rgba(230,230,230,0.64)";
    roundRect(
      gCtx,
      x + 77,
      y + 7,
      gCanvas.width - x * 2 - 77 * 2,
      24,
      circleR + 1,
      true,
      false
    );

    //Browser address
    gCtx.fillStyle = "rgb(110,110,110)";
    gCtx.strokeStyle = "rgba(0,0,0,0)";
    gCtx.font = "14px Arial";
    gCtx.fillText("benzodoctor.ru", item.img.width / 2 - 42, barH - 6);

    //Image mask
    gCtx.beginPath(); 
    roundRect(
      gCtx,
      x,
      y + barH,
      item.img.width,
      item.img.height,
      { bl: borderR, br: borderR },
      true,
      false
    );
    gCtx.clip();
    gCtx.drawImage(item.img, x, y + barH);
    gCtx.strokeStyle = "rgb(201,201,201)"; //цвет обводки
    roundRect(
      gCtx,
      x,
      y + barH - 1,
      item.img.width,
      item.img.height + 1,
      { bl: borderR, br: borderR },
      false,
      true
    );
  };