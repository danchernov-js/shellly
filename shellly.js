      function include(url) {
        var script = document.createElement('script');
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    }
     
    include("jszip-utils-master/dist/jszip-utils.js");
    include("jszip-master/dist/jszip.min.js");
    include("jszip-master/vendor/FileSaver.js");
  
     
     
     // при наведении файлом на область - сбрасываем стандартные события браузера,
      // которые должны происходить при этом наведении, возможно лишнее
      // window.ondragover = function (e) {
      //   e.preventDefault();
      // };

      
      //при сбросе (отпускании клавиши мыши) снова сбрасываем стандартное поведение браузера
      //чекнуть
      window.ondrop = function (event) {
        event.preventDefault();
        prepareFiles(event.dataTransfer.files);
      };
      //обработчик для инпута, разобраться как их у меня два оказалось
      document.getElementById("inp").onchange = function (e) {
        prepareFiles(this.files);
      };
      //слушаю событие вставить и обработчик, фолс еще чекнуть - можно удалить
      window.addEventListener(
        "paste",
        function (e) {
          prepareFiles(e.clipboardData.files);
        },
        false
      );

      let dropArea = document.getElementById("drop-area");

      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        window.addEventListener(eventName, preventDefaults, false);
      });

      // Highlight drop area when item is dragged over it
      ["dragenter", "dragover"].forEach((eventName) => {
        window.addEventListener(eventName, highlight, false);
      });
      ["dragleave", "drop"].forEach((eventName) => {
        window.addEventListener(eventName, unhighlight, false);
      });

      function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
      }

      function highlight(e) {
        dropArea.classList.add("highlight");
      }

      function unhighlight(e) {
        dropArea.classList.remove("highlight");
      }

      const onlyimg = [];
      const imageArr = []; //собирается из тех же файлов, с исходными картинками, чтобы в дальнейшем
      //использовать в канвасе
      const imageDownArr = []; //собирается из файлов которые готовы к скачке (ссылка и имя)
      const sameName = []; //не используется по сути

      // чекнуть, должна складывать название и каунтер, вероятно можно удалить
      function collectSameNames(nameValue, matchCounter) {
        return {
          xname: nameValue,
          xnumber: matchCounter,
        };
      }
      //разобраться
      function prepareFiles(files) {
        files = [...files];
        console.log(files);
        files.forEach(drawe);
        imageArr.forEach(renderer);
        imageArr.length = 0;
      }

      function collectCanvasIdAndName(canvasId, fileLink, fileName) {
        return {
          cid: canvasId,
          flink: fileLink,
          fname: fileName,
        };
      }

      var i = 0; //уникальный айдишник для канвас для последующего взаимодействия
      var k = 1; //счетчик который приписывается для уникального названия

      //распихивает названия файла, айдишники, ссылки по массивам,
      //сравния по названию, можно перензавать
      function drawe(file) {
        var img = new Image();
        if (imageDownArr.length == 0) {
          console.log("zero");
          imageArr.push(
            collectCanvasIdAndName(
              "canvas-id-" + i,
              URL.createObjectURL(file),
              file.name
            )
          );
          imageDownArr.push(
            collectCanvasIdAndName("canvas-id-" + i, "", file.name)
          );
        } else {
          //проверяем название без расширений на повтор
          let trueCheck = imageDownArr.find(
            (item) =>
              item.fname
                .substring(0, item.fname.lastIndexOf("."))
                .toLowerCase() ==
              file.name.substring(0, file.name.lastIndexOf(".")).toLowerCase()
          );
          //если не повторяется, то все ок - добавляем
          if (trueCheck == undefined) {
            imageArr.push(
              collectCanvasIdAndName(
                "canvas-id-" + i,
                URL.createObjectURL(file),
                file.name
              )
            );
            imageDownArr.push(
              collectCanvasIdAndName("canvas-id-" + i, "", file.name)
            );
          } else {
            //сеймнейм пока не работает, можно удалить
            sameName.push(
              collectSameNames(
                file.name
                  .substring(0, file.name.lastIndexOf("."))
                  .toLowerCase(),
                1
              )
            );
            //добавляем в название каунтер к, переделать
            imageArr.push(
              collectCanvasIdAndName(
                "canvas-id-" + i,
                URL.createObjectURL(file),
                file.name.substring(0, file.name.lastIndexOf(".")) +
                  ` (${k})` +
                  file.name.substring(file.name.lastIndexOf("."))
              )
            );
            imageDownArr.push(
              collectCanvasIdAndName(
                "canvas-id-" + i,
                URL.createObjectURL(file),
                file.name.substring(0, file.name.lastIndexOf(".")) +
                  ` (${k})` +
                  file.name.substring(file.name.lastIndexOf("."))
              )
            );
            k++;
            console.log(sameName);
          }
        }

        console.log(imageArr);
        i++;
      }
      //рисует полученные картинки в канвасах в зоне пунктира (добавляет в разметку)
      renderer = function (item) {
        const gayDad = document.createElement("div"); //попробовать избавиться
        const gay = document.createElement("canvas");
        const boooy = document.createElement("p");
        gayDad.className = "card";
        boooy.className = "image-name";

        console.log(i, imageArr.length);
        gayDad.id = item.cid + "-wrap"; //обертка
        gay.id = item.cid;

         //див для всех канвасов, можно добавлять также и убрать из разметки
        document.getElementById("card-container").appendChild(gayDad); //поместить ребенка
        document.getElementById(gayDad.id).appendChild(boooy);
        boooy.innerHTML += item.fname;

        document.getElementById(gayDad.id).appendChild(gay);

        const gCanvas = document.getElementById(item.cid);
        const gCtx = gCanvas.getContext("2d");
        item.img = new Image();

        item.img.src = item.flink;

        console.log(item.img.src);

        item.img.onload = function () {
          console.log(i);

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
            this.width,
            this.height + barH,
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
            this.width,
            this.height + barH,
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
            this.width,
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
          gCtx.fillText("benzodoctor.ru", this.width / 2 - 42, barH - 6);

          //Image mask
          gCtx.beginPath(); 
          roundRect(
            gCtx,
            x,
            y + barH,
            this.width,
            this.height,
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
            this.width,
            this.height + 1,
            { bl: borderR, br: borderR },
            false,
            true
          );
        };

        const downBar = document.getElementById("download-bar");
        downBar.classList.add("download-bar-highlight"); //show
      };

      
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

        //не подключена
      function failed() {
        console.error("The provided file couldn't be loaded as an Image media");
      }

      function onSave() { //собирает ссылки отрендеренных картинок
        //скачивает картинку или архив с несколькими картинками
        var downloadProgress = document.getElementById("download");
        downloadProgress.disabled = true;
        downloadProgress.innerHTML = "Загрузка...";

        //в первый масссив ссылку на исходную картинку записывали, чтобы потом
        //из него брать эти картинки по одной и обрамлять в макОС, а во второй массив будем сейчас записывать 
        //новые ссылки с отрендерными картинками
        imageDownArr.forEach(function (item) { //пихаем в функцию элемент массива
          const gCanvas = document.getElementById(item.cid);
          const gCtx = gCanvas.getContext("2d"); //для работы с 2д результатом, а не 3д
          gCanvas.toBlob((blob) => { //для вывода конечной картинки (делает аля скриншот отрисованных элементов)
             
            const a = document.createElement("a");
            document.body.append(a); //добавляет тег а последним в бади
            a.download = //download - атрибут для того, чтобы не переходить по ссылке а сразу предложить 
            //скачать документ, содержащийся в ссылке
              "MacPic-" + item.fname.substring(0, item.fname.lastIndexOf(".")); //присвоить название итог.картинке
              //расширение присваивается автоматически
            console.log(a.download);
            a.href = URL.createObjectURL(blob); //создать ссылку на итоговую картинку
            console.log(a.href);
            item.flink = a.href; //кладем ссылку в массив
            onlyimg.push(item.flink); //добавляем эти же ссылки в пустой массив
            console.log(item.flink);

            if (imageDownArr.length > 1) { //если больше одной картинки, то создаем архив
              var zip = new JSZip();
              var count = 0; //счетчик перебора для изначального массива

              onlyimg.forEach(function (item) { //для каждого элемента массива ...
                JSZipUtils.getBinaryContent(item, function (err, data) {
                  zip.file(
                    "macshell-" +
                      imageDownArr[count].fname.substring(
                        0,
                        imageDownArr[count].fname.lastIndexOf(".")
                      ) +
                      ".png",
                    data,
                    { binary: true }
                  );
                  count++;
                  if (count == imageDownArr.length) {
                    zip.generateAsync({ type: "blob" }).then(function (content) {
                        const timestamp = Date.now().toString();
                        saveAs(content, `macshell-${timestamp}.zip`);
                        count = 0; // не нужен
                        onlyimg.length = 0;
                        downloadProgress.style.background = "#ff0000";
                        downloadProgress.innerHTML = "Загрузить ещё";
                        downloadProgress.disabled = false;
                      });
                  }
                });
              });

            } else {
              a.click();
              onlyimg.length = 0;
              downloadProgress.disabled = false;
              downloadProgress.innerHTML = "Загрузить ещё";
            }

            a.remove();
            //можно еще добавить удаление кнопкой при наведении
          });
        });
      }

      document.querySelector("#download").addEventListener("click", onSave);
