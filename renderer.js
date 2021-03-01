function renderImageName(parent, name) {
    const imageNameElement = document.createElement("p");
    imageNameElement.className = "image-name";
    imageNameElement.innerHTML += name;
    parent.appendChild(imageNameElement);
}

function renderCanvas(parent, item){
    const canvasElement = document.createElement("canvas");
    canvasElement.id = item.cid;
    parent.appendChild(canvasElement);
}

function renderContainer(item) {
    const container = document.createElement("div");    
    container.className = "card";
    container.id = item.cid + "-wrap"; //обертка

    renderImageName(container, item.fname);
    renderCanvas(container, item);

    return container;
}

function drawImageOnCanvas(item) {    
    const gCanvas = document.getElementById(item.cid);  
    item.img = new Image();
    item.img.src = item.flink;
    item.img.onload = () => drawImage(gCanvas, item);
}

const renderImage = function (parent, item) {
    const container = renderContainer(item);
    parent.appendChild(container);  
    drawImageOnCanvas(item);
  };