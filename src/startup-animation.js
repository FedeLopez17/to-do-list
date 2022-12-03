import "./startup-animation.css";
import "./colors.css";

export default function displayStartUpAnimation(){
    const container = document.querySelector("#content");

    const animationWrapper = document.createElement("section");
    animationWrapper.id = "animation-wrapper";
    container.appendChild(animationWrapper);

    const animationContainer = document.createElement("section");
    animationContainer.id = "animation-container";
    animationWrapper.appendChild(animationContainer);

    const title = document.createElement("h1");
    title.id = "title";
    title.innerText = "Tick It Off!";
    animationContainer.appendChild(title);

    const checkmark = document.createElement("section");
    checkmark.id = "checkmark";
    animationContainer.appendChild(checkmark);

    setTimeout(()=>{animationWrapper.remove()}, 3000);
}