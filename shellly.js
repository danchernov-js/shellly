     const imagesContainerId = "card-container";

      registerHandlers();

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
        files.forEach(organizeFile);
        const parent = document.getElementById(imagesContainerId);
        imageArr.forEach(x => renderImage(parent, x));

        if (imageArr.length > 0) {
          const downBar = document.getElementById("download-bar");
          downBar.classList.add("download-bar-highlight"); //show
        }

        imageArr.length = 0;
      }

      function getCanvasData(canvasId, fileLink, fileName) {
        return {
          cid: canvasId,
          flink: fileLink,
          fname: fileName,
        };
      }

      function pushCanvasData(canvasData, array) {
        array.push(canvasData);
      }

      //проверяем название без расширений на повтор
      function findDuplicate(imageDownArr, file) {
        return imageDownArr.find(
          (item) => {
            let fileName1 = item.fname
                              .substring(0, item.fname.lastIndexOf("."))
                              .toLowerCase();

            let fileName2 = file.name
                              .substring(0, file.name.lastIndexOf("."))
                              .toLowerCase();

            return fileName1 == fileName2;
          }
        );
      }

      var i = 0; //уникальный айдишник для канвас для последующего взаимодействия
      var k = 1; //счетчик который приписывается для уникального названия

      //распихивает названия файла, айдишники, ссылки по массивам,
      //сравния по названию, можно перензавать
      function organizeFile(file) {
        let fileName = file.name;

        if (imageDownArr.length != 0 && findDuplicate(imageDownArr, file) != undefined) {
          fileName = file.name.substring(0, file.name.lastIndexOf(".")) +
          ` (${k})` +
          file.name.substring(file.name.lastIndexOf("."))
          k++;
        }

        var canvasData = getCanvasData("canvas-id-" + i, URL.createObjectURL(file), fileName);
        pushCanvasData(canvasData, imageArr);

        var resultCanvasData = getCanvasData("canvas-id-" + i, "", fileName);
        pushCanvasData(resultCanvasData, imageDownArr);

        i++;
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
