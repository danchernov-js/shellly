function registerHandlers() {
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
  }