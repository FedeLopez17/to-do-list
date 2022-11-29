import "./startup-animation.css";

export default function displayStartUpAnimation(){
    const container = document.querySelector("#content");

    const animationContainerTop = document.createElement("section");
    animationContainerTop.id = "animation-container-top";
    container.appendChild(animationContainerTop);

    const title = document.createElement("h1");
    title.id = "title";
    title.innerText = "Tick It Off!";
    animationContainerTop.appendChild(title);

    const checkmark = document.createElement("section");
    checkmark.id = "checkmark";
    animationContainerTop.appendChild(checkmark);

    const animationContainerBottom = document.createElement("section");
    animationContainerBottom.id = "animation-container-bottom";
    container.appendChild(animationContainerBottom);

    setTimeout(()=>{
        animationContainerTop.remove();
        animationContainerBottom.remove();
    }, 3000);
}